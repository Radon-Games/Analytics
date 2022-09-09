import express, { Request, Response } from "express";
import expressWs, { Application } from "express-ws";
import chalk from "chalk";
import path from "path";
import wsHandler from "./ws";
import api from "./API";

const PORT: number = parseInt(process.env.PORT ?? "") || 2525;
const DIRNAME: string = path.resolve();
const log: Console["log"] = console.log

const app: Application = express() as unknown as Application;
const wsInstance = expressWs(app);

app.use(express.static(path.join(DIRNAME, "static")));

app.use(api);

app.ws("/ws", wsHandler(wsInstance) as any);

app.listen(PORT, (): void => {
  log(chalk.bgRed.white(`Analytics listening on port ${PORT}`));
});
