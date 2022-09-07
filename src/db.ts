import Data from "./Data";
import Database from "better-sqlite3";
import * as uuid from "uuid";

const db = new Database("db.sqlite", {});

export default class DB {
  #id: string;

  constructor (private id: string) {
    if (/\s/.test(id)) {
      throw new TypeError("id cannot contain whitespace");
    }
    if (!uuid.validate(id)) {
      throw new TypeError("id is not a valid UUID");
    }
    this.#id = id.replace(/-/g, "");
  }

  async addView (data: Data) {
    if (!(data instanceof Data)) {
      throw new TypeError("data is not a valid instance of Data");
    }

    const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS _${this.#id} (
      data TEXT NOT NULL
    )`);
    createTable.run();
    
    const addData = db.prepare(`INSERT INTO _${this.#id} (data) VALUES (?)`);
    addData.run(JSON.stringify(data));
  }
}
