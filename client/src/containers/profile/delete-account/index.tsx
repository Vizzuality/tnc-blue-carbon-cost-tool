"use client";

import { FC, useCallback } from "react";

import { signOut, useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { signOutFromBackoffice } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

const DeleteAccount: FC = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const onDeleteAccount = useCallback(async () => {
    try {
      const { status, body } = await client.user.deleteMe.mutation({
        extraHeaders: {
          authorization: `Bearer ${session?.accessToken as string}`,
        },
      });

      if (status === 200) {
        signOut({ callbackUrl: "/auth/signin", redirect: true });
        await signOutFromBackoffice();
      } else if (status === 400 || status === 401) {
        toast({
          variant: "destructive",
          description: body.errors?.[0].title,
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        description: "Something went wrong deleting the account.",
      });
    }
  }, [session?.accessToken, toast]);

  return (
    <AlertDialog>
      <div className="flex justify-end">
        <AlertDialogTrigger asChild>
          <Button type="button" variant="destructive">
            Delete account
          </Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete my account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteAccount}
              className="bg-destructive text-foreground hover:bg-red-600 hover:text-white"
            >
              Delete account
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccount;
