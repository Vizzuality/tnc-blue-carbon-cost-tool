import { Project } from "@shared/entities/projects.entity";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<
  Partial<Project> & {
    // ! these types should be part of the Project entity eventually, we are adding them here to silent TS for now
    implementationLabor: number;
    communityBenefitSharingFund: number;
    monitoringAndMaintenance: number;
    communityRepresentationLiaison: number;
    conservationPlanningAndAdmin: number;
    carbonStandardFees: number;
  }
>();

export const TABLE_COLUMNS = [
  columnHelper.accessor("projectName", {
    enableSorting: true,
    header: () => <span>Project Name</span>,
  }),
  // columnHelper.accessor("implementationLabor", {
  //   enableSorting: true,
  //   header: () => <span>Implementation labor</span>,
  // }),
  columnHelper.accessor("communityBenefitSharingFund", {
    enableSorting: true,
    header: () => <span>Community benefit sharing fund</span>,
  }),
  columnHelper.accessor("monitoringAndMaintenance", {
    enableSorting: true,
    header: () => <span>Monitoring and maintenance</span>,
  }),
  columnHelper.accessor("communityRepresentationLiaison", {
    enableSorting: true,
    header: () => <span>Community representation/liaison</span>,
  }),
  columnHelper.accessor("conservationPlanningAndAdmin", {
    enableSorting: true,
    header: () => <span>Conservation planning and admin</span>,
  }),
  columnHelper.accessor("carbonStandardFees", {
    enableSorting: true,
    header: () => <span>Carbon standard fees</span>,
  }),
];
