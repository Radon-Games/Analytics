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

  checkAuth (token: string): boolean {
    const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS users (
      email TEXT,
      password TEXT,
      token TEXT,
      applications TEXT
    )`);
    const checkAuth = db.prepare(`SELECT * FROM users WHERE token = ?`);
    const row = checkAuth.get(token);
    return !!row;
  }

  getApplications (token: string): any {
    this.#createUserTable();

    const getApplications = db.prepare(`SELECT applications FROM users WHERE token = ?`);
    const row = getApplications.get(token);
    try {
      return JSON.parse(row.applications);
    } catch {
      return [];
    }
  }

  getViews (timeStart: number, timeEnd: number): any {
    this.#createApplicationTable();

    const getViews = db.prepare(`SELECT * FROM _${this.#id} WHERE startTime >= ? AND startTime <= ?`);
    const rows = getViews.all(timeStart, timeEnd);
    return rows ?? [];
  }

  addView (data: any): void {
    this.#createApplicationTable();
    
    const addData = db.prepare(`INSERT INTO _${this.#id} (userId, sessionId, url, referer, pageTitle, language, startTime, closeTime, ip, ua, loadingTime, dataTransfer, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    addData.run(data.userId, data.sessionId, data.url, data.referer, data.pageTitle, data.language, data.startTime, data.closeTime, data.ip, data.ua, data.loadingTime, data.dataTransfer, data.memory);
  }

  #createUserTable (): void {
    const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS users (
      email TEXT,
      password TEXT,
      token TEXT,
      applications TEXT
    )`);
    createTable.run();
  }

  #createApplicationTable (): void {
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
      dataTransfer INTEGER,
      memory INTEGER
    )`);
    createTable.run();
  }
}
