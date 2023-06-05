import * as amqp from 'amqplib';

async function consumeMessage() {
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

    // Consume messages from the queue
    channel.consume(queueName, (message) => {
      console.log('Received message:', message.content.toString());
      channel.ack(message);
    });

    console.log('Waiting for messages...');

  } catch (error) {
    console.error('Error:', error);
  }
}

consumeMessage();
