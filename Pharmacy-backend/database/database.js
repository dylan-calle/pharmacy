import { createPool } from "mysql2/promise";

export const getConnection = createPool({
  host: "192.168.0.116",
  user: "dylan",
  password: "080376Crp!",
  port: 3306,
  database: "pharmacy",
});
