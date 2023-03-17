import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export interface IDatabase {
  id: string;
  name: string;
  email: string;
}

interface IDatabases extends Array<IDatabase> {}
// interface EnumServiceItems extends Array<EnumServiceItem>{}

export class Database {
  #database: IDatabase[][] = [];

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

  select(table: any, search?: any): IDatabase[] {
    let data = this.#database[table] ?? [];

    console.log(data);

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
      console.log("localizou");

      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
