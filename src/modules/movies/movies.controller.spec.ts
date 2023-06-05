import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { PassportModule } from '@nestjs/passport';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service : MoviesService;

  let mockMovie = {"name":"Terminator3", "description":"Action movie",
  "release_date":new Date(),"ticket_price":15,"country":"America","genre":"Action","ratingsum":15, 
  "ratingcount":4, "rating":3,"commentcount":5};

  let updateMovie = {"name":"Terminator4", "description":"Action movie",
  "release_date":new Date(),"ticket_price":15,"country":"America","genre":"Action","ratingsum":16,
  "ratingcount":4, "rating":3,"commentcount":5}

  beforeAll(async() => {
    const ApiserviceProvider = {
      provide : MoviesService,
      useFactory: () => ({
        create : jest.fn(() => {}),
        findAll : jest.fn(() => []),
        findById : jest.fn((id) => {return {"_id":id}}),
        updateById : jest.fn((id,movie) => movie),
        deleteById : jest.fn((id) => { return {"message":"Movie Deleted Successfully"}}),
      })
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      imports:[PassportModule.register({ defaultStrategy : 'jwt' })],
      providers: [MoviesService, ApiserviceProvider],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);

  })

  it('MoviesController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('MoviesController should be created', () => {
    const movie = mockMovie;
    expect(controller.create(movie)).not.toEqual(null);
  });

  it('Should fetch all movies', async () => {
    const movies = await controller.findAll();
    expect(service.findAll()).toBeInstanceOf(Array);
  });

  it('Should fetch movie of id', async () => {
    const movie = await controller.findOne('647c1ddc7dbad66f1764736d');
    let serviceRes = await service.findById("647c1ddc7dbad66f1764736d");
    expect(serviceRes['_id']).toEqual(movie['_id']);
  });

  it('Should update movie of id', async () => {
    const upmovie = await controller.update('647bb1749ea7804a842164f0',updateMovie);
    let serviceRes = await service.updateById("647bb1749ea7804a842164f0",updateMovie);
    expect(serviceRes['name']).toEqual(upmovie['name']);
  });

  it('Should delete movie of id', async () => {
    const movie = await controller.remove("647bb1749ea7804a842164f0");
    let serviceRes = await service.deleteById("647bb1749ea7804a842164f0");
    expect(serviceRes['message']).toEqual(movie['message']);
  });

});
