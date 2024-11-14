import { FC } from "react";

import AccountDetails from "@/containers/profile/account-details";
import EditPassword from "@/containers/profile/edit-password";
import UpdateEmailForm from "@/containers/profile/update-email";

const UserDetails: FC = () => {
  return (
    <>
      <AccountDetails />
      <UpdateEmailForm />
      <EditPassword />
    </>
  );
};

export default UserDetails;
