import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let mockUserModel: Model<Movie>;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { 
          provide: getModelToken(Movie.name), 
          useValue: Model  // <-- Use the Model Class from Mongoose
        },
        ,MoviesService],
    }).compile();
    mockUserModel = module.get<Model<MovieDocument>>(getModelToken(Movie.name));
    service = module.get<MoviesService>(MoviesService);

  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
