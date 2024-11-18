import { FC } from "react";

import AccountDetails from "@/containers/profile/account-details";
import EditPassword from "@/containers/profile/edit-password";
import UpdateEmailForm from "@/containers/profile/update-email";

import { Card } from "@/components/ui/card";

const UserDetails: FC = () => {
  return (
    <div className="mt-4 space-y-4">
      <Card variant="secondary" className="border-dashed p-4">
        <AccountDetails />
      </Card>
      <Card variant="secondary" className="border-dashed p-4">
        <UpdateEmailForm />
      </Card>
      <Card variant="secondary" className="border-dashed p-4">
        <EditPassword />
      </Card>
    </div>
  );
};

export default UserDetails;
