import * as amqp from 'amqplib';

async function sendMessage() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'my_exchange';
    const queueName = 'my_queue';

    // Declare the exchange
    await channel.assertExchange(exchangeName, 'direct', { durable: false });

    // Declare the queue
    await channel.assertQueue(queueName, { durable: false });

    // Bind the queue to the exchange
    await channel.bindQueue(queueName, exchangeName, 'routing_key');

    // Send a message to the exchange
    const message = 'Hello, RabbitMQ!';
    channel.publish(exchangeName, 'routing_key', Buffer.from(message));

    console.log('Message sent:', message);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('Error:', error);
  }
}

sendMessage();
