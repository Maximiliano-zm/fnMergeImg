import fnMergeImgV3 from "./services/fnMergeimgV3.js";
import { app } from "@azure/functions";
app.http("mergeImgV3", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const json = request.query.get("json") || (await request.json());
      const respuesta = await fnMergeImgV3(json);
      if (!respuesta) {
        return {
          status: 400,
          jsonBody: { error: "Error al fusionar imagenes" },
        };
      } else {
        return { body: respuesta };
      }
    } catch (error) {
      console.error("Error en mergeImg endpoint:", error);
      return { status: 400, jsonBody: { error: "Error interno del servidor" } };
    }
  },
});
export default app;
