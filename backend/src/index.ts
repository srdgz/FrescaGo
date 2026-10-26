import "dotenv/config";
import { createApp } from "./infrastructure/http/app.js";

const app = createApp();

if (!process.env.VERCEL) {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
}

export default app;
