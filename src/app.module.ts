import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './modules/movies/movies.module';
import { AuthModule } from './modules/auth/auth.module';
import { QueueListener } from 'services/queue.listener';
import { RabbitMQService } from 'services/rabbitmq.service';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticsearchConnectionService } from 'services/elasticsearch.service';

const elasticsearchServiceProvider = {
  provide: ElasticsearchConnectionService,
  useFactory: () => {
    // Provide the necessary configuration here
    const config = {
      node: 'http://localhost:9200',
    };

    // Create the ElasticsearchConnectionService instance with the configuration
    return new ElasticsearchService(config);
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MoviesModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,QueueListener,RabbitMQService,elasticsearchServiceProvider],
})
export class AppModule {}
