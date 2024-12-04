import { FC, useState } from "react";

import SignInForm from "@/containers/auth/signin/form";
import SignUpForm from "@/containers/auth/signup/form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface AuthDialogProps {
  dialogTrigger: React.ReactNode;
  onSignIn: () => void;
}

const AuthDialog: FC<AuthDialogProps> = ({ dialogTrigger, onSignIn }) => {
  const [showSignin, setShowSignin] = useState<boolean>(true);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open && !showSignin) setShowSignin(true);
      }}
    >
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        {showSignin ? <SignInForm onSignIn={onSignIn} /> : <SignUpForm />}
        <Separator />
        <p className="text-center text-sm">
          <span className="pr-2 text-muted-foreground">
            {showSignin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <Button
            type="button"
            variant="link"
            className="p-0 text-primary"
            onClick={() => setShowSignin(!showSignin)}
          >
            {showSignin ? "Sign up" : "Sign in"}
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
