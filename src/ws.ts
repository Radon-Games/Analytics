import { Request } from "express";
import { Instance } from "express-ws";
import ws from "ws";
import * as uuid from "uuid";
import Data from "./Data";

interface WebSocket extends ws {
  id: string;
  startTime: number;
  data: Data;
}



export default function (wsInstance: Instance) {
  return async function (ws: WebSocket, req: Request): Promise<void> {
    
    ws.on("message", (msg: any) => {
      switch (msg[0]) {
        case "view":
          ws.data = new Data(req);
          // handle data
          break;
      }
    });

    ws.on("close" , () => {
      ws.data.close();
    });
  };
}
