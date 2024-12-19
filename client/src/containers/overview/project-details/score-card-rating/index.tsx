import { FC } from "react";

import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

import { PROJECT_DETAILS } from "@/constants/tooltip";

import { Label } from "@/components/ui/label";

interface ScoreCardRatingProps {
  value?: PROJECT_SCORE;
}

const ScoreCardRating: FC<ScoreCardRatingProps> = ({ value }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label
            className="text-md font-medium"
            tooltip={{
              title: "Overall score",
              content: PROJECT_DETAILS.OVERALL_SCORE,
            }}
          >
            <h3 className="text-base font-semibold">Overall score</h3>
          </Label>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <span className="text-xl font-normal capitalize text-wheat-200">
          {value}
        </span>
      </div>
    </>
  );
};

export default ScoreCardRating;
