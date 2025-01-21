import { initContract } from "@ts-rest/core";
import {
    ApiResponse,
} from "@shared/dtos/global/api-response.dto";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";

const contract = initContract();
export const methodologyContract = contract.router({
    getAllModelAssumptions: {
        method: "GET",
        path: "/methodology/model-assumptions",
        responses: {
            200: contract.type<ApiResponse<ModelAssumptions[]>>(),
        },
        summary:
            "Get all model assumptions",
    },
});

