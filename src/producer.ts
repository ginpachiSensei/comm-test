// producer.ts
import { QueueManager } from "./Manager/queueManager";
import { Publisher } from "./requestProcessor/publisher";

async function runProducer() {
  // 1) Create & init the queue manager
  const qm = new QueueManager("amqp://localhost");
  await qm.init();

  // 2) Wrap it with our publisher abstraction
  const publisher = new Publisher(qm);

  // 3) Fire off some messages
  await publisher.publish("email-queue", {
    to: "receiver@example.com",
    from: "sender@example.com",
    subject: "Sample Email",
    body: "This is a sample email notification",
  });

  await publisher.publish("sms-queue", {
    phoneNumber: "1234567890",
    message: "This is a sample SMS notification",
  });

  // 4) Tidy up
  await qm.close();
}

runProducer()
  .then(() => console.log("Producer finished sending messages."))
  .catch((err) => console.error("Failed to run producer", err));
