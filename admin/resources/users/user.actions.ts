import { ActionContext, ActionRequest } from "adminjs";

export const createUserAction = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  if (request.method === "post") {
    //console.log("PAYLOAD", request.payload);

    //console.log("context", context);

    //console.log("context.currentAdmin", context.currentAdmin);
    // TOKEN IS HERE!!
    console.log("ADMIN", context.req.session.adminUser);
    // console.log("CONTEXT", context);
    return {
      record: {},
    };
    //console.log("context", context);
    // console.table("SESSION", session);
  }

  //   try {
  //     // Enviar la solicitud a tu API
  //     const apiResponse = await fetch("https://tu-api.com/auth/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // Añadir el token si es necesario
  //       },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //         ...otherParams,
  //       }),
  //     });
  //
  //     if (!apiResponse.ok) {
  //       throw new Error("Error en la API al crear el usuario");
  //     }
  //
  //     // Prefetchear los datos actualizados de la base de datos
  //     const updatedRecords = await context.resource.findMany({
  //       limit: 10, // Limita la cantidad de resultados si es necesario
  //       sort: {
  //         direction: "desc",
  //         sortBy: "createdAt", // Ajusta según tu modelo de datos
  //       },
  //     });
  //
  //     // Mostrar mensaje de éxito y devolver los registros actualizados
  //     context.notice({
  //       message: "Usuario creado exitosamente y registros actualizados",
  //       type: "success",
  //     });
  //
  //     return {
  //       records: updatedRecords, // Devolver los registros actualizados
  //       redirectUrl: context.h.recordActionUrl({
  //         resourceId: context.resource.id(),
  //         actionName: "list",
  //       }),
  //     };
  //   } catch (error) {
  //     context.notice({
  //       message: `Error: ${error.message}`,
  //       type: "error",
  //     });
  //     return {
  //       record: {},
  //     };
  //   }
  // }
  //
  // return {
  //   record: {},
  // };
};
