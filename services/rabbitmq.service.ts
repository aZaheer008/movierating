import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  constructor() {
    this.connect();
  }

  async connect(): Promise<void> {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async sendMessage(queueName: string,exchange: string, message: string): Promise<void> {
    // Declare the exchange
    await this.channel.assertExchange(exchange, 'direct', { durable: false });

    // Declare the queue
    await this.channel.assertQueue(queueName, { durable: false });

    // Bind the queue to the exchange
    await this.channel.bindQueue(queueName, exchange, 'routing_key');
    this.channel.publish(exchange, 'routing_key', Buffer.from(message));
  }

  async consumeMessage(queueName: string,exchangeName:string, callback: (message: string) => void): Promise<void> {
    // Declare the exchange
    await this.channel.assertExchange(exchangeName, 'direct', { durable: false });

    // Declare the queue
    await this.channel.assertQueue(queueName, { durable: false });

    // Bind the queue to the exchange
    await this.channel.bindQueue(queueName, exchangeName, 'routing_key');
    this.channel.consume(queueName, async (message) => {
      if (message) {
        const result = await callback(message.content.toString());
        // console.log("-------result---42--- : ",result == true)
        // this.channel.ack(message);
        if (typeof result === 'boolean') {
          console.log("-------result---41--- : ",result === true);
          if (result){
            this.channel.ack(message);
          }
          // Process the result if needed
          // ...
        } else {
          // Handle the case when the result is not a boolean
          // ...
          console.log("-------result---42--- : ",result)
        }
      }
    });
  }

  async closeConnection(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
