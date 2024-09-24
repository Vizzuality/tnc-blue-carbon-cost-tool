import { initContract } from "@ts-rest/core";
import { adminContract } from "@shared/contracts/admin.contract";
import { authContract } from "@shared/contracts/auth.contract";

const contract = initContract();

export const router = contract.router({
  auth: authContract,
  admin: adminContract,
});
