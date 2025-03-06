import { ProjectScoreCardField } from "@shared/entities/project-score-card/value-object/project-score-card-field.value-object";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

export class FinantialFeasibility extends ProjectScoreCardField {
  private static NUMBER_TO_STRING_MAP: Record<number, PROJECT_SCORE> = {
    1: PROJECT_SCORE.LOW,
    2: PROJECT_SCORE.MEDIUM,
    3: PROJECT_SCORE.HIGH,
  };
  private static STRING_TO_NUMBER_MAP: Record<PROJECT_SCORE, number> = {
    [PROJECT_SCORE.LOW]: 1,
    [PROJECT_SCORE.MEDIUM]: 2,
    [PROJECT_SCORE.HIGH]: 3,
  };

  public static fromString(value: string): FinantialFeasibility {
    return new FinantialFeasibility(value as PROJECT_SCORE);
  }

  public static fromNumber(value: number): FinantialFeasibility {
    return new FinantialFeasibility(
      FinantialFeasibility.NUMBER_TO_STRING_MAP[value],
    );
  }

  public toStringOrUndefined(): string | undefined {
    return this.value;
  }

  public toNumber(): number {
    return FinantialFeasibility.STRING_TO_NUMBER_MAP[this.value] ?? 0;
  }
}
