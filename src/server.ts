import express from "express";
import { Database } from "./database";

const server = express();

const port = 3333;

server.use(express.json());

const database = new Database();

server.get("/", (request, response) => {
  const user = database.select("user");
  response.json(user);
});

// Parâmetro que esta vindo do CLIENTE - REQUEST
// Parâmetro que esta indo para o CLIENTE - RESPONSE

server.post("/", (request, response) => {
  const { name, email } = request.body;

  const user = {
    id: "1",
    name: name,
    email,
  };

  database.insert("user", user);

  response.status(201).send();
});

server.listen(port, () => {
  console.log(`Server Running - end: http://localhost:${port}`);
});
