import { createPool } from "mysql2/promise";

export const getConnection = createPool({
  host: "localhost",
  user: "dylan",
  password: "080376Crp!",
  port: 3306,
  database: "pharmacy",
});
