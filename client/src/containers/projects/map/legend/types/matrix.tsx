import React from "react";

export interface LegendMatrixIntersectionsProps {
  intersections: Array<{
    id: number;
    color: string;
  }>;
}

export interface LegendTypeProps {
  className?: HTMLDivElement["className"];
}

export default function MatrixLegend({
  intersections = [],
  colorNumber = 4,
}: LegendTypeProps &
  LegendMatrixIntersectionsProps & { colorNumber?: number }) {
  return (
    <div className="flex max-w-[250px] gap-3">
      <div>
        <span>Abatement potential and cost $/tc02</span>
      </div>
      <div className="flex items-center space-x-14">
        <div className="relative w-20 flex-shrink-0 py-6 pl-5">
          <p
            className="font-heading orien ro absolute left-0 rotate-180 transform text-xs font-medium text-white"
            style={{ writingMode: "vertical-rl" }}
          >
            Cost
          </p>
          <p className="font-heading absolute bottom-1 left-1/2 -translate-x-1/2 transform text-xs font-medium text-white">
            Abatement
          </p>
          <div className="preserve-3d w-full transform">
            <div className="w-full" style={{ paddingBottom: "100%" }}>
              <div className="absolute left-0 top-0 flex h-full w-full flex-wrap">
                {intersections.map((i) => (
                  <div
                    key={i.id}
                    className="relative block"
                    style={{
                      background: `${i.color}`,
                      width: `${100 / colorNumber}%`,
                      height: `${100 / colorNumber}%`,
                    }}
                  />
                ))}
              </div>

              {/*<div className="font-heading text-xxs absolute bottom-0 left-full z-10 h-full w-2 transform justify-between text-white">*/}
              {/*  <div*/}
              {/*    className="absolute flex h-px items-center space-x-1 leading-none"*/}
              {/*    style={{ bottom: `${(100 / colorNumber) * 2}%` }}*/}
              {/*  >*/}
              {/*    <span className="relative top-px block h-px w-1 bg-gray-300" />*/}
              {/*    <span className="relative block -rotate-45 transform">*/}
              {/*      <span>10</span>*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*  <div*/}
              {/*    className="absolute flex h-px items-center space-x-1 leading-none"*/}
              {/*    style={{ bottom: `${(100 / colorNumber) * 6}%` }}*/}
              {/*  >*/}
              {/*    <span className="relative top-px block h-px w-1 bg-gray-300" />*/}
              {/*    <span className="relative block -rotate-45 transform">*/}
              {/*      <span>50</span>*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*  <div*/}
              {/*    className="absolute flex h-px items-center space-x-1 leading-none"*/}
              {/*    style={{ bottom: "100%" }}*/}
              {/*  >*/}
              {/*    <span className="relative top-px block h-px w-1 bg-gray-300" />*/}
              {/*    <span className="relative block -rotate-45 transform">*/}
              {/*      <span>100</span>*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*<div className="font-heading text-xxs absolute -bottom-1 -left-1 z-10 h-full w-2 origin-bottom rotate-90 transform justify-between text-white">*/}
              {/*  <div*/}
              {/*    className="absolute flex h-px transform items-center space-x-1 leading-none"*/}
              {/*    style={{ bottom: `${100 - (100 / colorNumber) * 2}%` }}*/}
              {/*  >*/}
              {/*    <span className="relative top-px block h-px w-1 bg-gray-300" />*/}
              {/*    <span className="relative block -rotate-180 transform">*/}
              {/*      <span className="relative block rotate-45 transform">*/}
              {/*        10*/}
              {/*      </span>*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*  <div*/}
              {/*    className="absolute flex h-px transform items-center space-x-1 leading-none"*/}
              {/*    style={{ bottom: `${100 - (100 / colorNumber) * 6}%` }}*/}
              {/*  >*/}
              {/*    <span className="relative top-px block h-px w-1 bg-gray-300" />*/}
              {/*    <span className="relative block -rotate-180 transform">*/}
              {/*      <span className="relative block rotate-45 transform">*/}
              {/*        50*/}
              {/*      </span>*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*  <div*/}
              {/*    className="absolute flex h-px transform items-center space-x-1 leading-none"*/}
              {/*    style={{ bottom: "0%" }}*/}
              {/*  >*/}
              {/*    <span className="relative top-px block h-px w-1 bg-gray-300" />*/}
              {/*    <span className="relative block -rotate-180 transform">*/}
              {/*      <span className="relative block rotate-45 transform">*/}
              {/*        100*/}
              {/*      </span>*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>

        {/*<div*/}
        {/*  className={cn({*/}
        {/*    [className]: !!className,*/}
        {/*  })}*/}
        {/*>*/}
        {/*  <ul className="flex w-full flex-col space-y-2">*/}
        {/*    {items.map(({ value, color }) => (*/}
        {/*      <li*/}
        {/*        key={`${value}`}*/}
        {/*        className="font-heading flex items-center space-x-2 text-xs"*/}
        {/*      >*/}
        {/*        <div*/}
        {/*          className="h-2 w-2 flex-shrink-0 rounded-sm"*/}
        {/*          style={{*/}
        {/*            backgroundColor: color,*/}
        {/*          }}*/}
        {/*        />*/}
        {/*        <div className="clamp-2">{value}</div>*/}
        {/*      </li>*/}
        {/*    ))}*/}
        {/*  </ul>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
