import { InfoCircledIcon } from "@radix-ui/react-icons";
import { DownloadIcon, ExpandIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function InfoDownloadProjectsTable() {
  const onDownloadTableData = () => {
    //   todo
  };

  const onClickInfo = () => {
    //   todo
  };

  const onToggleExpand = () => {
    //   todo
  };

  return (
    <div className="flex items-center space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={onClickInfo} variant="ghost" className="space-x-2">
            <>
              <InfoCircledIcon className="h-5 w-5" />
              <span>Info</span>
            </>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lorem ipsum more info</DialogTitle>
            <DialogDescription>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                vehicula, nunc nec vehicula fermentum, nunc libero bibendum
                purus, nec tincidunt libero nunc nec libero. Integer nec libero
                nec libero tincidunt tincidunt. Sed vehicula, nunc nec vehicula
                fermentum, nunc libero bibendum purus, nec tincidunt libero nunc
                nec libero. Integer nec libero nec libero tincidunt tincidunt.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                vehicula, nunc nec vehicula fermentum, nunc libero bibendum
                purus, nec tincidunt libero nunc nec libero. Integer nec libero
                nec libero tincidunt tincidunt. Sed vehicula, nunc nec vehicula
                fermentum, nunc libero bibendum purus, nec tincidunt libero nunc
                nec libero. Integer nec libero nec libero tincidunt tincidunt.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                vehicula, nunc nec vehicula fermentum, nunc libero bibendum
                purus, nec tincidunt libero nunc nec libero. Integer nec libero
                nec libero tincidunt tincidunt. Sed vehicula, nunc nec vehicula
                fermentum, nunc libero bibendum purus, nec tincidunt libero nunc
                nec libero. Integer nec libero nec libero tincidunt tincidunt.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Button onClick={onDownloadTableData} asChild>
        <>
          <DownloadIcon />
          <span>Download</span>
        </>
      </Button>
      <Button onClick={onToggleExpand}>
        <ExpandIcon />
      </Button>
    </div>
  );
}
