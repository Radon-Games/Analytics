import { Request } from "express";
import { Instance } from "express-ws";
import ws from "ws";
import chalk from "chalk";
import DB from "./db";

interface WebSocket extends ws {
  id: string;
  startTime: number;
  data: any;
  views: Map<string, any>;
}

export default function (wsInstance: Instance) {
  return async function (ws: WebSocket, req: Request): Promise<void> {

    ws.views = new Map<string, any>();

    console.log(chalk.bgGreen.white("New connection"));
    
    ws.on("message", (msg: any) => {
      const json = JSON.parse(msg);
      switch (json[0]) {
        case "view":
          ws.views.forEach((view) => {
            closeView(view);
          });
          ws.views.clear();
          if (json[1].applicationId && json[1].viewId && json[1].sessionId && json[1].userId) {
            json[1].startTime = Date.now();
            ws.views.set(json[1].viewId, json[1]);
          }
          break;
      }
    });

    ws.on("close" , () => {
      console.log(chalk.bgRed.white("Connection closed"));
      ws.views.forEach((view) => {
        closeView(view);
      });
      ws.views.clear();
    });

    function closeView (view: any): void {
      const db = new DB(view.applicationId);

      view.closeTime = Date.now();
      const viewData = {
        userId: view.userId,
        sessionId: view.sessionId,
        url: view.url,
        referer: view.referer,
        pageTitle: view.pageTitle,
        language: view.language,
        startTime: view.startTime,
        closeTime: view.closeTime,
        ip: (req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || "").split(",")[0].trim(),
        ua: req.headers["user-agent"],
        loadingTime: view.loadingTime,
        DataTransfer: NaN,
        memory: view.memory
      };

      db.addView(viewData);
    }
  }
}
