import { Controller, Get, Post, Body,Req, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './schemas/movie.schema';
import { Rating } from './schemas/ratings.schema';
import { AuthGuard } from '@nestjs/passport';
import { Comment } from './schemas/comment.schema';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Elastic quries
  @Get("moviesfromelastic")
  async findAllMovies() : Promise<Movie[]> {
    return this.moviesService.findAllMovies();
  }

  // Elastic quries
  @Post("moviesfromelasticbyfiltering")
  async findMoviesbyfiltering(@Body() search: any) : Promise<Movie[]> {
    return this.moviesService.findMoviesbyfiltering(search);
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() movie: Movie) : Promise<Movie> {
    return this.moviesService.create(movie);
  }

  @Post("/ratemovie/:id")
  @UseGuards(AuthGuard())
  async ratemovie(@Param('id') id: string,@Req() req, @Body() rating: Rating) : Promise<Movie> {
    return this.moviesService.ratemovie(id,rating,req.user);
  }

  @Post("/commentmovie/:id")
  @UseGuards(AuthGuard())
  async commentmovie(@Param('id') id: string,@Req() req,@Body() comment: Comment) : Promise<Movie> {
    return this.moviesService.commentmovie(id,comment,req.user);
  }

  @Get()
  async findAll() : Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<Movie> {
    return this.moviesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMovieDto: Movie): Promise<Movie> {
    return this.moviesService.updateById(id, updateMovieDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Object> {
    return this.moviesService.deleteById(id);
  }


}
