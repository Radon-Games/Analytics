import express, { Request, Response } from "express";
import expressWs, { Application } from "express-ws";
import chalk from "chalk";
import path from "path";
import wsHandler from "./ws";

const PORT: number = parseInt(process.env.PORT ?? "") || 2525;
const DIRNAME = path.resolve();
const log: Console["log"] = console.log

const app: Application = express() as unknown as Application;
const wsInstance = expressWs(app);


app.get("/", (req: Request, res: Response): void => {
  res.sendFile(path.join(DIRNAME, "src/testing.html"));
});

app.ws("/data", wsHandler(wsInstance) as any);

app.listen(PORT, (): void => {
  log(chalk.bgRed.white(`Analytics listening on port ${PORT}`));
});
