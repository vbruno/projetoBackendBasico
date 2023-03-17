import { Router } from "express";
import { randomUUID } from "node:crypto";
import { Database } from "../database";

interface IDatabase {
  msg?: string;
}

const userRoutes = Router();

const database = new Database();

const tableUser = "user";

userRoutes.get("/", (request, response) => {
  const user = database.select(tableUser);
  response.json(user);
});

userRoutes.get("/:id", (request, response) => {
  const { id } = request.params;

  const user = database.select(tableUser, id);
  response.json(user);
});

// Parâmetro que esta vindo do CLIENTE - REQUEST
// Parâmetro que esta indo para o CLIENTE - RESPONSE

userRoutes.post("/", (request, response) => {
  const { name, email } = request.body;

  const user = {
    id: randomUUID(),
    name: name,
    email,
  };

  database.insert(tableUser, user);

  response.status(201).json({ msg: "sucesso!" });
});

userRoutes.delete("/:id", (request, response) => {
  const { id } = request.params;

  if (id.length === 36) {
    let userExist = database.select(tableUser, id);

    if (JSON.stringify(userExist) === "[]") {
      return response.send("Usuário não encontrado");
    }

    database.delete(tableUser, id);

    return response.json({
      msg: `${userExist[0].name} foi deletado`,
      userExist,
    });
  }
  response.send("Erro de requisição");
});

export { userRoutes };
