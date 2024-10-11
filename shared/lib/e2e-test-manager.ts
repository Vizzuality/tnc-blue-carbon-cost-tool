import { DataSource } from "typeorm";
import { User } from "@shared/entities/users/user.entity";
import { createUser } from "@shared/lib/entity-mocks";
import { clearTestDataFromDatabase } from "@shared/lib/db-helpers";
import { DB_ENTITIES } from "@shared/lib/db-entities";
import { sign } from "jsonwebtoken";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: DB_ENTITIES,
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

  getDataSource() {
    return this.dataSource;
  }

  async close() {
    if (this.page) {
      await this.page.close();
    }
    await this.dataSource.destroy();
  }

  async createUser(additionalData?: Partial<User>) {
    return createUser(this.dataSource, additionalData);
  }

  mocks() {
    return {
      createUser: (additionalData?: Partial<User>) =>
        createUser(this.getDataSource(), additionalData),
    };
  }

  getPage() {
    if (!this.page) throw new Error("Playwright Page is not initialized");
    return this.page;
  }

  async login(user?: User) {
    if (!user) {
      user = await this.mocks().createUser();
    }
    await this.page.goto("/auth/signin");
    await this.page.getByLabel("Email").fill(user.email);
    await this.page.locator('input[type="password"]').fill(user.password);
    await this.page.getByRole("button", { name: /log in/i }).click();
    await this.page.waitForURL("/profile");
    return user;
  }

  async logout() {
    await this.page.goto("/auth/api/signout");
    await this.page.getByRole("button", { name: "Sign out" }).click();
  }

  async generateToken(user: User) {
    return sign({ id: user.id }, process.env.EMAIL_CONFIRMATION_TOKEN_SECRET as string);
  }
}
