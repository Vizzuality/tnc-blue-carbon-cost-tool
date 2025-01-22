import {DataSource} from "typeorm";
import {User} from "@shared/entities/users/user.entity";
import {createProject, createUser} from "@shared/lib/entity-mocks";
import {clearTablesByEntities, clearTestDataFromDatabase,} from "@shared/lib/db-helpers";
import {JwtPayload, sign} from "jsonwebtoken";
import {TOKEN_TYPE_ENUM} from "@shared/schemas/auth/token-type.schema";
import {COMMON_DATABASE_ENTITIES} from "@shared/lib/db-entities";
import {ProjectType} from "@shared/contracts/projects.contract";
import * as fs from "fs";
import * as path from "path";
import {adminContract} from "@shared/contracts/admin.contract";
import {API_URL} from "e2e/playwright.config";
import {ROLES} from "@shared/entities/users/roles.enum";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: COMMON_DATABASE_ENTITIES,
});

export class E2eTestManager {
  dataSource: DataSource;
  page: any;

  constructor(dataSource: DataSource, page?: any) {
    this.dataSource = dataSource;
    this.page = page;
  }

  static async load(page?: any) {
    await AppDataSource.initialize();

    return new E2eTestManager(AppDataSource, page);
  }

  async clearDatabase() {
    await clearTestDataFromDatabase(this.dataSource);
  }

  async clearTablesByEntities(entities: any[]) {
    await clearTablesByEntities(this.dataSource, entities);
  }

  getDataSource() {
    return this.dataSource;
  }

  async close() {
    if (this.page) {
      await this.page.close();
    }
    await this.dataSource.destroy();
  }


  async ingestCountries() {
    const geoCountriesFilePath = path.join(
      path.resolve(process.cwd(), "../"),
      "api/src/insert_countries.sql",
    );
    const geoCountriesSql = fs.readFileSync(geoCountriesFilePath, "utf8");
    await this.dataSource.query(geoCountriesSql);
  }




  mocks() {
    return {
      createUser: (additionalData?: Partial<User>) =>
        createUser(this.getDataSource(), additionalData),
      createProject: (additionalData?: Partial<ProjectType>) =>
        createProject(this.getDataSource(), additionalData),
    };
  }

  getPage() {
    if (!this.page) throw new Error("Playwright Page is not initialized");
    return this.page;
  }

  async login(user?: User) {
    console.log("login user", user)
    if (!user) {
      user = await this.mocks().createUser();
    }
    await this.page.goto("/auth/signin");
    await this.page
      .getByPlaceholder("Enter your email address")
      .fill(user.email);
    await this.page.locator('input[type="password"]').fill(user.password);
    await this.page.getByRole("button", { name: /log in/i }).click();
    await this.page.waitForURL("/profile");
    return user;
  }

  async logout() {
    await this.page.goto("/auth/api/signout");
    await this.page.getByRole("button", { name: "Sign out" }).click();
  }

  async generateTokenByType(user: User, tokenType: TOKEN_TYPE_ENUM) {
    const payload: JwtPayload = { id: user.id };
    switch (tokenType) {
      case TOKEN_TYPE_ENUM.ACCESS:
        return sign(payload, process.env.ACCESS_TOKEN_SECRET as string);
      case TOKEN_TYPE_ENUM.RESET_PASSWORD:
        return sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET as string);
      case TOKEN_TYPE_ENUM.ACCOUNT_CONFIRMATION:
        return sign(
          payload,
          process.env.ACCOUNT_CONFIRMATION_TOKEN_SECRET as string,
        );

      case TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION:
        return sign(
          payload,
          process.env.EMAIL_CONFIRMATION_TOKEN_SECRET as string,
        );
      default:
        break;
    }
  }

  async ingestBaseData() {
    await this.ingestCountries()
    const user = await this.mocks().createUser({role: ROLES.ADMIN, email: 'test@test.com'});
    const token = await this.generateTokenByType(
      user,
      TOKEN_TYPE_ENUM.ACCESS,
    );
    const excelFilePath = path.join(
        path.resolve(process.cwd(), "../"),
        "data/excel/data_ingestion_WIP.xlsm",
    );
    const scorecardExcelFilePath = path.join(
        path.resolve(process.cwd(), "../"),
        "data/excel/data_ingestion_project_scorecard.xlsm",
    );
    const scorecardFileBuffer = fs.readFileSync(scorecardExcelFilePath);
    const scorecardFileBlob = new Blob([scorecardFileBuffer], {
      type: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    });
    const fileBuffer = fs.readFileSync(excelFilePath);
    const fileBlob = new Blob([fileBuffer], {
      type: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    });
    const scorecardFormData = new FormData();
    scorecardFormData.append('file', scorecardFileBlob, 'data_ingestion_project_scorecard.xlsm');

    const formData = new FormData();
    formData.append('file', fileBlob, 'data_ingestion_WIP.xlsm');

    const scorecardUrl = API_URL + adminContract.uploadProjectScorecard.path;
    const url = API_URL + adminContract.uploadFile.path;

    try {
      await fetch(scorecardUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: scorecardFormData,
      });

    }catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    try {
       await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

  }

}

