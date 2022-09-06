import express, { Request, Response } from "express";
import expressWs, { Application } from "express-ws";
import chalk from "chalk";
import path from "path";

const PORT: number = parseInt(process.env.PORT ?? "") || 2525;
const LOG: Console["log"] = console.log
const DIRNAME = path.resolve();

const app: Application = express() as unknown as Application;
expressWs(app);

app.get("/", (req: Request, res: Response): void => {
  res.sendFile(path.join(DIRNAME, "src/testing.html"));
});

app.ws("/data", (ws, req) => {
  ws.on("message", (msg) => {
    ws.send(msg);
  });
});

app.listen(PORT, (): void => {
  LOG(chalk.bgRed.white(`Analytics listening on port ${PORT}`));
});
