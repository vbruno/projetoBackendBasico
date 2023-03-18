import express from "express";
import { randomUUID } from "node:crypto";
import { Database } from "./database";

const server = express();

const port = 3333;

server.use(express.json());

const database = new Database();

const table = "user";

server.get("/", (request, response) => {
  const user = database.select(table);
  response.json(user);
});

server.get("/:id", (request, response) => {
  const { id } = request.params;

  const result = database.select(table, id);

  // console.log(result, " - ", typeof result);

  if (result === undefined)
    response.status(400).json({ msg: "Usuário não encontrado!" });

  response.json(result);
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

  database.insert(table, user);

  response.status(201).json({ msg: "sucesso!" });
});

server.delete("/:id", (request, response) => {
  const { id } = request.params;

  const userExist: any = database.select(table, id);

  // console.log(result, " - ", typeof result);

  if (userExist === undefined)
    return response.status(400).json({ msg: "Usuário não encontrado!" });

  database.delete(table, id);

  response
    .status(202)
    .json({ msg: `Usuário ${userExist.name} foi deletado do banco` });
});

server.put("/:id", (request, response) => {
  const { id } = request.params;
  const { name, email } = request.body;

  const userExist: any = database.select(table, id);
  if (userExist === undefined)
    return response.status(400).json({ msg: "Usuário não encontrado!" });

  database.update(table, id, { name, email });

  response.status(201).json({ msg: `O ID: {${id}} foi alterado banco` });
});

server.listen(port, () => {
  console.log(`Server Running - end: http://localhost:${port}`);
});
