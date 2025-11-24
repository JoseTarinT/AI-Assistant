import express from "express";
import cors from "cors";
import { router } from "./routes/routes";

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "Warning: OPENAI_API_KEY is not set. Streaming requests will fail."
  );
}

const app = express();
const port = Number.parseInt(process.env.PORT ?? "5000", 10);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/", router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
