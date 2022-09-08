import Data from "./Data";
import Database from "better-sqlite3";
import * as uuid from "uuid";

const db = new Database("db.sqlite", {});

export default class DB {
  #id: string;

  constructor (private applicationId: string) {
    if (/\s/.test(applicationId)) {
      throw new TypeError("id cannot contain whitespace");
    }
    if (!uuid.validate(applicationId)) {
      throw new TypeError("id is not a valid UUID");
    }
    this.#id = applicationId.replace(/-/g, "");
  }

  addView (data: Data): void {
    if (!(data instanceof Data)) {
      throw new TypeError("data is not a valid instance of Data");
    }

    const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS _${this.#id} (
      userId TEXT,
      sessionId TEXT,
      url TEXT,
      referer TEXT,
      pageTitle TEXT,
      language TEXT,
      startTime INTEGER,
      closeTime INTEGER,
      ip TEXT,
      ua TEXT,
      loadingTime INTEGER,
      dataTransfer INTEGER
    )`);
    createTable.run();
    
    const addData = db.prepare(`INSERT INTO _${this.#id} (userId, sessionId, url, referer, pageTitle, language, startTime, closeTime, ip, ua, loadingTime, dataTransfer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    addData.run(data.userId, data.sessionId, data.url, data.referer, data.pageTitle, data.language, data.startTime, data.closeTime, data.ip, data.ua, data.loadingTime, data.dataTransfer);
  }
}
