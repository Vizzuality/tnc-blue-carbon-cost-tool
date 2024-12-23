import { Link, NotebookPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Footer = () => {
  return (
    <div className="sticky bottom-0 flex w-full flex-wrap justify-between gap-4 border-t border-t-sky-900 bg-background px-6 py-2">
      <div className="text-xs">
        <div>
          Values considered for a{" "}
          <span className="font-bold">small project (40 ha).</span>
        </div>
        <div>For more detailed analysis, create a custom project.</div>
      </div>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <NotebookPen className="h-4 w-4" />
              Create Custom Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-row items-center gap-2">
              <NotebookPen className="h-6 w-6 text-sky-blue-300" />
              <DialogTitle className="!m-0">
                Create a Custom Project
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              By creating a custom project you will generate a customizable
              version where you can edit all parameters to fit your specific
              needs.
            </DialogDescription>
            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>
                <Link href={"/projects/new"}>Create</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Footer;
