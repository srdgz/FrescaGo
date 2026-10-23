import "dotenv/config";
import { createApp } from "./app.mjs";

const app = createApp();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
