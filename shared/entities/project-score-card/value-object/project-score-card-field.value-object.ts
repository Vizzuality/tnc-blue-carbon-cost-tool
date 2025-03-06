import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

export abstract class ProjectScoreCardField {
  protected readonly value: PROJECT_SCORE;

  protected constructor(value: PROJECT_SCORE) {
    this.value = value;
  }

  public static fromString(value: string): ProjectScoreCardField {
    throw new Error("Method not implemented.");
  }

  public static fromNumber(value: number): ProjectScoreCardField {
    throw new Error("Method not implemented.");
  }

  public toProjectScore(): PROJECT_SCORE {
    throw new Error("Method not implemented.");
  }

  public toNumber(): number {
    throw new Error("Method not implemented.");
  }
}
