import express, { Express, Request, Response, IRouter } from "express";
import DB from "./db";

const router: IRouter = express.Router();

const ENDPOINT = "/api";

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



// authentication middleware
router.use(ENDPOINT, (req: Request, res: Response) => {
  res.header("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.status(405).send(stringify({ error: "Method not allowed" }));
    return;
  }
  if (!req.headers.authorization) {
    res.status(401).send(stringify({ error: "Unauthorized" }));
    return;
  }
  if (!req.body.applicationId) {
    res.status(400).send(stringify({ error: "Bad Request" }));
    return;
  } else {
    const db = new DB(req.body.applicationId as string);
    const isAllowed = db.checkAuth(req.headers.authorization);
    if (!isAllowed) {
      res.status(401).send(stringify({ error: "Unauthorized" }));
      return;
    }
  }
  
});

// get application list
router.use(`${ENDPOINT}/applications`, (req: Request, res: Response) => {
  const db = new DB(req.body.applicationId as string);
  // Ignore because we already checked req.headers.authorization in middleware
  // @ts-ignore
  const apps = db.getApplications(req.headers.authorization.split(" ")[1]);
  res.status(200).send(stringify(apps));
});

// get application views
router.use(`${ENDPOINT}/application/:id`, (req: Request, res: Response) => {
  const db = new DB(req.query.id as string);
  const views = db.getViews(req.body.start, req.body.end);
  res.status(200).send(stringify(views));
});

export default router;

function stringify (obj: any): string {
  return JSON.stringify(obj, null, 2);
}
