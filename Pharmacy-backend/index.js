import app from "./app.js";
import cors from "cors";
app.use(cors());
const main = () => {
  app.listen(app.get("port"));
  console.log(`Server on port ${app.get("port")}`);
};

main();
