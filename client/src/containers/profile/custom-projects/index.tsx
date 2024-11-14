import { FC } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CustomProjects: FC = () => {
  // TODO: Should fetch custom-projects from API when available
  return (
    <Table>
      <TableHeader>
        <TableRow className="divide-x-0">
          <TableHead className="w-[260px] bg-transparent font-normal">
            Project type
          </TableHead>
          <TableHead className="bg-transparent font-normal">
            Number of projects
          </TableHead>
          <TableHead className="bg-transparent font-normal">
            Methodology version
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }, (_, index) => ({
          id: index + 1,
          projectName: `Project ${index + 1}`,
          numberOfProjects: Math.floor(Math.random() * 100) + 1,
          version: "V1.0",
        })).map((row) => (
          <TableRow key={row.id} className="divide-x-0">
            <TableCell className="font-medium">{row.projectName}</TableCell>
            <TableCell className="text-center">
              {row.numberOfProjects}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{row.version}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomProjects;
