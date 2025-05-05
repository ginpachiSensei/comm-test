import "dotenv/config";
import express, { Request, Response } from "express";
import { initializeRabbit, getPublisher, closeRabbit } from "./queues/handler";

const app = express();
const port = 3000;

app.use(express.json());

initializeRabbit(); // must happen before publishing
const publisher = getPublisher();

app.post("/publish", async (req: Request, res: Response) => {
  await publisher.publish(req.body.routingKey, req.body.payload);
  res.status(200).send({ message: "Message published successfully" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
