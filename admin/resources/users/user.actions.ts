import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  populator,
} from "adminjs";
import { getAuthUserFromContext } from "../../utils/get-auth-user-from-context.js";
import { CreateUserDto } from "@shared/dtos/users/create-user.dto.js";

const API_URL = process.env.API_URL || "http://localhost:4000";

export const createUserAction = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  if (request.method === "post") {
    const { resource, currentAdmin, records } = context;
    const { email, password, role, name } = request.payload as CreateUserDto;
    let record = resource.build({ email, password, role, name });
    const test2 = await record.create(context);

    const test = 111;
    // const [populatedRecord] = await populator([record], context);

    try {
      //   const apiResponse = await fetch(`${API_URL}/admin/users`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${accessToken}`,
      //       Origin: context.req.headers.origin,
      //     },
      //     body: JSON.stringify(request.payload),
      //   });
      //
      //   if (!apiResponse.ok) {
      //     throw new Error("Failed to create user");
      //   }

      // const resources = await context.resource.findMany({});
      console.log("RECORDS", context.records);
      console.log("SINGLE RECORD", context.record);
      const json = test2.toJSON();

      return {
        redirectUrl: "/admin/resources/User",
        notice: {
          message: "User created successfully",
          type: "success",
        },
        record: json,
      };
    } catch (error) {
      const testerror = error;
      console.error(error);
      throw error;
    }
  }
};
