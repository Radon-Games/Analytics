import { Request } from "express";
import { v4 } from "uuid";

export default class Data {
  userId: string;                // User specific UUID used to identify a new user
  sessionId: string;             // Session specific UUID used to identify a new session
  urlPath: string = "/";         // URL path of the page the user is on (e.g. /about)
  host: string = "";             // Host domain of the page (e.g. example.com)
  referer: string = "";          // Referer URL of the page (if any)
  language: string = "";         // Language of the page (e.g. en-US)
  startTime: number;             // Websocket open time used for calculating time on page
  closeTime?: number;            // Websocket closed time used for calculating time on page
  ip: string;                    // IP address of the client used for geolocation
  ua: string = "";               // User Agent used for browser/platform detection
  loadingTime: number = 0;       // Page loading time in ms used for performance analysis
  dataTransfer: number = 0;      // Data transfer in bytes used for rough bandwidth calculation

  constructor (req: Request) {
    this.userId = v4();          // TODO: Update later with proper info from client side
    this.sessionId = v4();       // TODO: Update later with proper info from client side

    this.startTime = Date.now();
    const ip = (req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || "").split(",")[0].trim();
    this.ip = ip ?? "";
    this.ua = req.headers["user-agent"] ?? "";

  }

  close () {
    this.closeTime = Date.now();
    // add view to the database
  }

  get data () {
    return JSON.stringify(this);
  }
}
