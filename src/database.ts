import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database: any = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  select(table: string): object {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert(table: string, data: object): object {
    if (Array.isArray(this.#database[table])) {
      // Se sim entra aqui
      this.#database[table].push(data);
      this.#persist();
    } else {
      // Se não entra aqui
      this.#database[table] = [data];
    }

    return data;
  }

  delete(table: string, id: string) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
