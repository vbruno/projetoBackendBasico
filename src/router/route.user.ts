import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", (request, response) => {
  response.send("Acessando rota user");
});

export { userRoutes };
