import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class QueueProducer {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendMessageToQueue(queueName: string,exchange: string, message: string): Promise<void> {
    await this.rabbitMQService.sendMessage(queueName,exchange, message);
  }
}
