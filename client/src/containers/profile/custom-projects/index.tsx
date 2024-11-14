import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { FC } from "react";

const CustomProjects: FC<{ id: string }> = ({ id }) => {
  return (
    <Card variant="secondary">
      <CardHeader className="space-y-4">
        <CardTitle id={id} className="text-xl font-semibold">
          My custom projects
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          You can see more detail and modify your custom projects in{" "}
          <Link
            href="/projects/custom"
            className="text-primary hover:underline"
          >
            My Custom Projects
          </Link>{" "}
          page.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <TableRow className="divide-x-0">
              <TableCell className="font-medium">Conservation</TableCell>
              <TableCell className="text-center">16</TableCell>
              <TableCell>
                <Badge variant="outline">V 1.0</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomProjects;
