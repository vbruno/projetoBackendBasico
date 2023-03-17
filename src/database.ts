import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export interface IDatabase {
  id: string;
  name: string;
  email: string;
}

export class Database {
  #database: IDatabase[][] = [];

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist("{}");
      });
  }

  #persist(data?: string) {
    console.log(this.#database);

    if (data == "{}") {
      fs.writeFile(databasePath, JSON.stringify({}, null, 2));
      this.#database = JSON.parse(data);
    } else {
      fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
    }

    console.log("---> ", typeof this.#database);
    console.log("---> ", this.#database.toString());
  }

  select(table: any, search?: string): IDatabase[] {
    let data = this.#database[table] ?? {};

    console.log("select data: ", data);

    if (search) {
      data = data.filter((row: any) => {
        // return row.id == id;
        return Object.entries(row).some(([key, value]) => {
          return row[key].includes(search);
        });
      });
    }

    return data;
  }

  insert(table: any, data: IDatabase): IDatabase {
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

  delete(table: any, id: string) {
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table: any, id: string, data: IDatabase) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { ...data };
      this.#persist();
    }
  }
}
