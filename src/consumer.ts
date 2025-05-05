import { QueueManager } from "./Manager/queueManager";
import { Subscriber } from "./responseHandler/subscriber";

async function runConsumer() {
  const qm = new QueueManager("amqp://localhost");
  await qm.init();

  const subscriber = new Subscriber(qm);

  await subscriber.subscribe("email-queue", (msg) => {
    console.log("Handling email notification:", msg);
  });

  await subscriber.subscribe("sms-queue", (msg) => {
    console.log("Handling SMS notification:", msg);
  });

  console.log("Consumer is running and listening...");
}

runConsumer()
  .then(() => console.log("RabbitMQ consumer initialized"))
  .catch((err) => console.error("Failed to run consumer", err));
