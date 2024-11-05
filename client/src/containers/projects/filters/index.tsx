import { CheckedState } from "@radix-ui/react-checkbox";
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { useSetAtom } from "jotai/index";
import { XIcon } from "lucide-react";
import { useDebounce } from "rooks";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { projectsUIState } from "@/app/(projects)/store";
import {
  INITIAL_FILTERS_STATE,
  useGlobalFilters,
} from "@/app/(projects)/url-store";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeSlider } from "@/components/ui/slider";

const COST_RANGE = [1200, 2300];
const ABATEMENT_POTENTIAL_RANGE = [0, 100];

export const FILTERS_SIDEBAR_WIDTH = 320;

export default function ProjectsFilters() {
  const [filters, setFilters] = useGlobalFilters();
  const setFiltersOpen = useSetAtom(projectsUIState);

  const resetFilters = async () => {
    await setFilters((prev) => ({
      ...prev,
      countryCode: INITIAL_FILTERS_STATE.countryCode,
      ecosystem: INITIAL_FILTERS_STATE.ecosystem,
      activities: INITIAL_FILTERS_STATE.activity,
      activitySubtype: INITIAL_FILTERS_STATE.activitySubtype,
      abatementPotential: INITIAL_FILTERS_STATE.abatementPotential,
      cost: INITIAL_FILTERS_STATE.cost,
    }));
  };
  const closeFilters = () => {
    setFiltersOpen((prev) => ({ ...prev, filtersOpen: false }));
  };

  const { queryKey } = queryKeys.projects.countries;
  const { data: countryOptions } = client.projects.getProjectCountries.useQuery(
    queryKey,
    {},
    {
      queryKey,
      select: (data) =>
        data.body.data.map(({ name, code }) => ({ label: name, value: code })),
    },
  );

  const handleEcosystemChange = async (
    isChecked: CheckedState,
    ecosystem: ECOSYSTEM,
  ) => {
    await setFilters((prev) => ({
      ...prev,
      ecosystem: isChecked
        ? [...prev.ecosystem, ecosystem]
        : prev.ecosystem.filter((e) => e !== ecosystem),
    }));
  };

  const handleActivityChange = async (
    isChecked: CheckedState,
    activity: ACTIVITY,
  ) => {
    await setFilters((prev) => ({
      ...prev,
      activity: isChecked
        ? [...prev.activity, activity]
        : prev.activity.filter((e) => e !== activity),
    }));
  };

  const handleSubActivityChange = async (
    isChecked: CheckedState,
    subActivity: (typeof filters.activitySubtype)[number],
  ) => {
    await setFilters((prev) => ({
      ...prev,
      activitySubtype: isChecked
        ? [...prev.activitySubtype, subActivity]
        : prev.activitySubtype.filter((e) => e !== subActivity),
    }));
  };

  const debouncedCostChange = useDebounce(async (cost: [number, number]) => {
    await setFilters((prev) => ({
      ...prev,
      cost,
    }));
  }, 250);

  const debouncedAbatementPotentialChange = useDebounce(
    async (abatementPotential: [number, number]) => {
      await setFilters((prev) => ({
        ...prev,
        abatementPotential,
      }));
    },
    250,
  );

  return (
    <section
      className="space-y-10 px-4 py-6"
      style={{
        width: FILTERS_SIDEBAR_WIDTH,
      }}
    >
      <header>
        <h3>Filters</h3>
        <Button onClick={resetFilters}>Reset</Button>
        <Button onClick={closeFilters} variant="ghost">
          <XIcon />
        </Button>
      </header>
      <div>
        <Label htmlFor="countryCode">Country</Label>
        <Select
          name="countryCode"
          defaultValue={filters.countryCode || "all"}
          onValueChange={async (v) => {
            await setFilters((prev) => ({
              ...prev,
              countryCode: v === "all" ? "" : v,
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countryOptions?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p>Ecosystems</p>
        <ul>
          <li>
            <Label htmlFor={ECOSYSTEM.MANGROVE}>
              <Checkbox
                id={ECOSYSTEM.MANGROVE}
                checked={filters.ecosystem.includes(ECOSYSTEM.MANGROVE)}
                onCheckedChange={async (isChecked) => {
                  await handleEcosystemChange(isChecked, ECOSYSTEM.MANGROVE);
                }}
              />
              {ECOSYSTEM.MANGROVE}
            </Label>
          </li>
          <li>
            <Label htmlFor={ECOSYSTEM.SALT_MARSH}>
              <Checkbox
                id={ECOSYSTEM.SALT_MARSH}
                checked={filters.ecosystem.includes(ECOSYSTEM.SALT_MARSH)}
                onCheckedChange={async (isChecked) => {
                  await handleEcosystemChange(isChecked, ECOSYSTEM.SALT_MARSH);
                }}
              />
              {ECOSYSTEM.SALT_MARSH}
            </Label>
          </li>
          <li>
            <Label htmlFor={ECOSYSTEM.SEAGRASS}>
              <Checkbox
                id={ECOSYSTEM.SEAGRASS}
                checked={filters.ecosystem.includes(ECOSYSTEM.SEAGRASS)}
                onCheckedChange={async (isChecked) => {
                  await handleEcosystemChange(isChecked, ECOSYSTEM.SEAGRASS);
                }}
              />
              {ECOSYSTEM.SEAGRASS}
            </Label>
          </li>
        </ul>
      </div>
      <div>
        <p>Activity type</p>
        <ul>
          <li>
            <Label htmlFor={ACTIVITY.CONSERVATION}>
              <Checkbox
                id={ACTIVITY.CONSERVATION}
                checked={filters.activity.includes(ACTIVITY.CONSERVATION)}
                onCheckedChange={async (isChecked) => {
                  await handleActivityChange(isChecked, ACTIVITY.CONSERVATION);
                }}
              />
              {ACTIVITY.CONSERVATION}
            </Label>
          </li>
          <li>
            <Label htmlFor={ACTIVITY.RESTORATION}>
              <Checkbox
                id={ACTIVITY.RESTORATION}
                checked={filters.activity.includes(ACTIVITY.RESTORATION)}
                onCheckedChange={async (isChecked) => {
                  await handleActivityChange(isChecked, ACTIVITY.RESTORATION);
                  await setFilters((prev) => ({
                    ...prev,
                    subActivities: [
                      RESTORATION_ACTIVITY_SUBTYPE.HYBRID,
                      RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
                      RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
                    ],
                  }));
                }}
              />
              {ACTIVITY.RESTORATION}
            </Label>

            <ul className="ml-3">
              <li>
                <Label htmlFor={RESTORATION_ACTIVITY_SUBTYPE.HYBRID}>
                  <Checkbox
                    id={RESTORATION_ACTIVITY_SUBTYPE.HYBRID}
                    checked={filters.activitySubtype.includes(
                      RESTORATION_ACTIVITY_SUBTYPE.HYBRID,
                    )}
                    onCheckedChange={async (isChecked) => {
                      await handleSubActivityChange(
                        isChecked,
                        RESTORATION_ACTIVITY_SUBTYPE.HYBRID,
                      );
                    }}
                  />
                  {RESTORATION_ACTIVITY_SUBTYPE.HYBRID}
                </Label>
              </li>
              <li>
                <Label htmlFor={RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY}>
                  <Checkbox
                    id={RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY}
                    checked={filters.activitySubtype.includes(
                      RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
                    )}
                    onCheckedChange={async (isChecked) => {
                      await handleSubActivityChange(
                        isChecked,
                        RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
                      );
                    }}
                  />
                  {RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY}
                </Label>
              </li>
              <li>
                <Label htmlFor={RESTORATION_ACTIVITY_SUBTYPE.PLANTING}>
                  <Checkbox
                    id={RESTORATION_ACTIVITY_SUBTYPE.PLANTING}
                    checked={filters.activitySubtype.includes(
                      RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
                    )}
                    onCheckedChange={async (isChecked) => {
                      await handleSubActivityChange(
                        isChecked,
                        RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
                      );
                    }}
                  />
                  {RESTORATION_ACTIVITY_SUBTYPE.PLANTING}
                </Label>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div>
        <Label htmlFor="costs">Cost ($)</Label>
        <RangeSlider
          defaultValue={[
            filters.cost[0] || COST_RANGE[0],
            filters.cost[1] || COST_RANGE[1],
          ]}
          min={COST_RANGE[0]}
          max={COST_RANGE[1]}
          step={1}
          minStepsBetweenThumbs={1}
          onValueChange={debouncedCostChange}
        />
        <div className="flex justify-between">
          <span>{COST_RANGE[0]}</span>
          <span>{COST_RANGE[1]}</span>
        </div>
      </div>

      <div>
        <Label htmlFor="abatement_potential">Abatement Potential ($)</Label>
        <RangeSlider
          defaultValue={[
            filters.abatementPotential[0] || ABATEMENT_POTENTIAL_RANGE[0],
            filters.abatementPotential[1] || ABATEMENT_POTENTIAL_RANGE[1],
          ]}
          min={ABATEMENT_POTENTIAL_RANGE[0]}
          max={ABATEMENT_POTENTIAL_RANGE[1]}
          step={1}
          minStepsBetweenThumbs={1}
          onValueChange={debouncedAbatementPotentialChange}
        />
        <div className="flex justify-between">
          <span>{ABATEMENT_POTENTIAL_RANGE[0]}</span>
          <span>{ABATEMENT_POTENTIAL_RANGE[1]}</span>
        </div>
      </div>
    </section>
  );
}
