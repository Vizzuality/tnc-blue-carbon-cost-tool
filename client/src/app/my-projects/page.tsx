import MyProjectsView from "../../containers/my-projects";
import { CustomProject } from "../../containers/my-projects/types";

const MOCK_DATA: CustomProject[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  projectName: "My custom project",
  location: "Location",
  totalNPVCost: Math.floor(1000000 + Math.random() * 9000000),
  abatementPotential: Math.floor(1000000 + Math.random() * 9000000),
  type: i % 3 === 1 ? "Conservation" : "Restoration",
}));

const filters = [
  { label: "All", count: 15 },
  { label: "Conservation", count: 5 },
  { label: "Restoration", count: 10 },
];

export default function MyProjects() {
  return <MyProjectsView data={MOCK_DATA} filters={filters} />;
}
