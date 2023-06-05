import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { QueueListener } from 'services/queue.listener';
import { RabbitMQService } from 'services/rabbitmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(RabbitMQService);  
  // await rabbitMQService.connect();
  const queueListener = app.get(QueueListener);
  await queueListener.listenToQueue('my_queue','my_exchange');

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
