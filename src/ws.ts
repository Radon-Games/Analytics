import { Request } from "express";
import { Instance } from "express-ws";
import ws from "ws";
import Data from "./Data";

interface WebSocket extends ws {
  id: string;
  startTime: number;
  data: Data;
}



export default function (wsInstance: Instance) {
  return async function (ws: WebSocket, req: Request): Promise<void> {
    ws.data = new Data(req);

    ws.on("message", (msg: string) => {
      // handle data
    });

    ws.on("close" , () => {
      ws.data.close();
    });
  };
}
