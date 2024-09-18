import { initContract } from "@ts-rest/core";
import { authContract } from "./auth/auth.contract";

const contract = initContract();

export const router = contract.router({
  auth: authContract,
});
