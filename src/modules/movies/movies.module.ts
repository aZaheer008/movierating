import { Module } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, movieSchema } from './schemas/movie.schema';
import { AuthModule } from '../auth/auth.module';
import { Rating, RatingSchema } from './schemas/ratings.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { ElasticsearchConnectionService } from 'services/elasticsearch.service';


// function createElasticsearchService(): ElasticsearchService {
//   // Provide the necessary configuration here
//   const config = { node: 'http://localhost:9200' }

//   // Create the ElasticsearchService instance with the configuration
//   return new ElasticsearchService(config);
// };

const elasticsearchServiceProvider = {
  provide: ElasticsearchConnectionService,
  useFactory: () => {
    // Provide the necessary configuration here
    const config = {
      node: 'http://localhost:9200',
    };

    // Create the ElasticsearchConnectionService instance with the configuration
    return new ElasticsearchConnectionService();
  },
};

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([
      { name: Movie.name, schema: movieSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [MoviesController],
  // providers: [MoviesService,{
  //   provide: ElasticsearchConnectionService,
  //   useFactory: createElasticsearchService,
  // }]
  providers: [MoviesService,elasticsearchServiceProvider]
})
export class MoviesModule {}
