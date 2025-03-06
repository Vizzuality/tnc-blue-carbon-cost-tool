import { ProjectScoreCardField } from "@shared/entities/project-score-card/value-object/project-score-card-field.value-object";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

export class LegalFeasibility extends ProjectScoreCardField {
  private static NUMBER_TO_STRING_MAP: Record<number, PROJECT_SCORE> = {
    1: PROJECT_SCORE.HIGH,
    2: PROJECT_SCORE.MEDIUM,
    3: PROJECT_SCORE.LOW,
  };
  private static STRING_TO_NUMBER_MAP: Record<PROJECT_SCORE, number> = {
    [PROJECT_SCORE.HIGH]: 1,
    [PROJECT_SCORE.MEDIUM]: 2,
    [PROJECT_SCORE.LOW]: 3,
  };

  public static fromString(value: string): LegalFeasibility {
    return new LegalFeasibility(value as PROJECT_SCORE);
  }

  public static fromNumber(value: number): LegalFeasibility {
    return new LegalFeasibility(LegalFeasibility.NUMBER_TO_STRING_MAP[value]);
  }

  public toProjectScore(): PROJECT_SCORE {
    return this.value;
  }

  public toNumber(): number {
    return LegalFeasibility.STRING_TO_NUMBER_MAP[this.value] ?? 0;
  }
}
