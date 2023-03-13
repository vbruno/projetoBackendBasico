import express from "express";
import { randomUUID } from "node:crypto";
import { Database } from "./database";

const server = express();

const port = 3333;

server.use(express.json());

const database = new Database();

const tableUser = "user";

server.get("/", (request, response) => {
  const user = database.select(tableUser);
  response.json(user);
});

server.get("/:id", (request, response) => {
  const { id } = request.params;

  const user = database.select(tableUser, id);
  response.json(user);
});

// Parâmetro que esta vindo do CLIENTE - REQUEST
// Parâmetro que esta indo para o CLIENTE - RESPONSE

server.post("/", (request, response) => {
  const { name, email } = request.body;

  const user = {
    id: randomUUID(),
    name: name,
    email,
  };

  database.insert(tableUser, user);

  response.status(201).json({ msg: "sucesso!" });
});

server.delete("/:id", (request, response) => {
  const { id } = request.params;

  if (id.length === 36) {
    const userExist = database.select(tableUser, id);

    if (JSON.stringify(userExist) === "[]") {
      return response.send("Usuário não encontrado");
    }
    return response.json(userExist);
  }
  response.send("Erro de requisição");
});

server.listen(port, () => {
  console.log(`Server Running - end: http://localhost:${port}`);
});
