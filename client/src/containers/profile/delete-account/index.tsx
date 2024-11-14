"use client";

import { FC, useCallback } from "react";

import { signOut, useSession } from "next-auth/react";

import { client } from "@/lib/query-client";

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const DeleteAccount: FC<{ id: string }> = ({ id }) => {
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
        signOut({ callbackUrl: "/auth/signin" });
      }

      if (status === 400 || status === 401) {
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
    <Card variant="secondary" className="p-6">
      <CardHeader className="space-y-4">
        <CardTitle id={id} className="text-xl font-semibold">
          Delete account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          This action will permanently delete your account. By doing this you
          will loose access to all your custom scenarios.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default DeleteAccount;
