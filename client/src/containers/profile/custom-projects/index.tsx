import { FC, useMemo } from "react";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { cn, getAuthHeader } from "@/lib/utils";

import { DEFAULT_CUSTOM_PROJECTS_QUERY_KEY } from "@/app/my-projects/url-store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GRADIENT_STYLES =
  "absolute inset-0 bg-gradient-to-t from-big-stone-1000 to-transparent opacity-100" as const;

const CustomTableHead: FC<{
  title: string;
  className?: HTMLDivElement["className"];
}> = ({ title, className }) => (
  <TableHead
    className={cn("relative w-[260px] bg-transparent font-normal", className)}
  >
    <div className="relative">
      {title}
      <div className={GRADIENT_STYLES}></div>
    </div>
    <div className={GRADIENT_STYLES}></div>
  </TableHead>
);

const CustomProjects: FC = () => {
  const { data: session } = useSession();
  const queryKey = DEFAULT_CUSTOM_PROJECTS_QUERY_KEY;
  const { data: projects } = client.customProjects.getCustomProjects.useQuery(
    queryKey,
    {
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    },
    {
      select: (d) => d.body.data,
      queryKey,
    },
  );
  const activities = useMemo(() => {
    return Object.values(ACTIVITY).map((activity) => ({
      activity,
      count: projects?.filter((p) => p.activity === activity).length || 0,
    }));
  }, [projects]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="divide-x-0">
          <CustomTableHead title="Project type" />
          <CustomTableHead title="Number of projects" className="text-center" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((row) => (
          <TableRow
            key={row.activity}
            className="divide-background border-b-background"
          >
            <TableCell className="font-medium">{row.activity}</TableCell>
            <TableCell className="text-center">{row.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomProjects;
