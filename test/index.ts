import DB from "../src/db";
import Data from "../src/Data";

const v4 = "0590076b-8de2-47ab-90b8-61d348442177";
const db = new DB(v4);
const data = new Data({ headers: { "user-agent": "test" }, connection: {} } as any);

db.addView(data);
