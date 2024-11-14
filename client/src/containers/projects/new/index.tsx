import ProjectForm from "@/containers/projects/form";
import Header from "@/containers/projects/new/header";
import ProjectSidebar from "@/containers/projects/new/sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function CreateCustomProject() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <div className="flex flex-1 gap-3 overflow-hidden">
        <ProjectSidebar />
        <div className="mb-4 flex-1">
          <ScrollArea className="flex h-full gap-3 pr-6">
            <ProjectForm />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
