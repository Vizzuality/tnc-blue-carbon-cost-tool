import { ActionContext, ActionRequest, ActionResponse } from "adminjs";
import { CreateUserDto } from "@shared/dtos/users/create-user.dto.js";

const API_URL = process.env.API_URL || "http://localhost:4000";

export const createUserAction = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  if (request.method === "post") {
    const { resource, currentAdmin, records } = context;
    const { email, role, name, partnerName } = request.payload as CreateUserDto;
    const record = resource.build({ email, role, name });
    const accessToken = currentAdmin?.accessToken;
    try {
      const apiResponse = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Origin: response.req.headers.origin,
        },
        body: JSON.stringify(request.payload),
      });

      if (!apiResponse.ok) {
        const res = await apiResponse.json();
        return {
          record,
          redirectUrl: "/admin/resources/User",
          notice: {
            message: JSON.stringify(res.errors),
            type: "error",
          },
        };
      }

      return {
        redirectUrl: "/admin/resources/User",
        notice: {
          message: "User created successfully",
          type: "success",
        },
        record,
      };
    } catch (error) {
      console.error("Error creating user", error);
      return {
        record,
        notice: {
          message: "Error creating user: Contact administrator",
          type: "error",
        },
        redirectUrl: "/admin/resources/User",
      };
    }
  }
};
