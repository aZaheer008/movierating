import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './schemas/movie.schema';
import { Rating } from './schemas/ratings.schema';
import { Comment } from './schemas/comment.schema';
import { User } from '../auth/schemas/user.schema';
import { ElasticsearchConnectionService } from 'services/elasticsearch.service';

@Injectable()
export class MoviesService {

  constructor(
    private readonly elasticsearchService: ElasticsearchConnectionService,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>
    ){}

  async create(movie: Movie) : Promise<Movie> {

    try {
      const res = await this.movieModel.create(movie);
      return res; 
    } catch (error) {
      throw error;
    }
  }

  async ratemovie(id:string,ratingBody: Rating,user:User) : Promise<Movie> {

    try {
      const movie = await this.findById(id);
      let query = {"movie": new Types.ObjectId(id),"user":new Types.ObjectId(user['_id'])};
      let previousrating = await this.ratingModel.findOne(query);
      if (previousrating){
        let prevRating : any = previousrating.rating;
        let prevSum : any = movie.ratingsum;
        let currentSum = prevSum - prevRating;
        let ratingInput : any = ratingBody.rating;
        let updatedSum = currentSum + ratingInput;
        let average : Number = Number((Number(updatedSum) / Number(movie.ratingcount)).toFixed(2));
        movie['ratingsum'] = updatedSum;
        movie['rating']  = average;
        previousrating.rating = ratingInput;
        previousrating.save();
        return await this.updateById(id,movie);
      } else {
        ratingBody['movie'] = new Types.ObjectId(id);
        ratingBody['user'] = new Types.ObjectId(user['_id']);
        let newrating = await this.ratingModel.create(ratingBody);
        let ratingsum  = Number(movie.ratingsum) + Number(newrating.rating);
        let ratingcount = Number(movie.ratingcount) + 1;
        let ratingnew = Number(Number(ratingsum/ratingcount).toFixed(2)); 
        movie.rating = ratingnew;
        movie['ratingsum'] = ratingsum;
        movie['ratingcount'] = ratingcount;
        return await this.updateById(id,movie);
      }
    } catch (error) {
      throw error;
    }
  }

  async commentmovie(id:string,commentBody: Comment,user:User) : Promise<Movie> {

    try {
        const movie = await this.findById(id);
        commentBody['movie'] = new Types.ObjectId(id);
        commentBody['user'] = new Types.ObjectId(user['_id']);
        await this.commentModel.create(commentBody);
        movie['commentcount'] = Number(movie['commentcount']) + 1;
        return await this.updateById(id,movie);
    } catch (error) {
      throw error;
    }
  }

  async findAll() : Promise<Movie[]> {

    try {
      const movies = await this.movieModel.find();
      return movies; 
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) : Promise<Movie> {

    try {
      
      const isValidId = mongoose.isValidObjectId(id);

      if (!isValidId) {
        throw new BadRequestException("Please enter correct id");
      }

      const movie = await this.movieModel.findById(id).lean();
      if (!movie){
        throw new NotFoundException("Movie not found.");
      }
      return movie;

    } catch (error) {
      throw error;
    }

  }

  async updateById(id: string, movie: Movie) : Promise<Movie> {

    try {

      const isValidId = mongoose.isValidObjectId(id);

      if (!isValidId) {
        throw new BadRequestException("Please enter correct id");
      }

      let query = {"_id":id};
      
      let res = await this.movieModel.findOneAndUpdate(query, movie,{
        new : true,
        runValidators:true
      });

      console.log("------res-----",JSON.stringify(res))

      if (!res) {
        throw new NotFoundException("Movie not found.");
      }

      return res;

    } catch (error) {
      throw error;
    }

  }

  async deleteById(id: string)  : Promise<Object>  {
    try {

      const isValidId = mongoose.isValidObjectId(id);

      if (!isValidId) {
        throw new BadRequestException("Please enter correct id");
      }
      
      let query = {"_id":id};
      
      let res = await this.movieModel.findOneAndDelete(query);

      if (!res) {
        throw new NotFoundException("Movie not found.");
      }

      return {"message":"Movie Deleted Successfully"};

    } catch (error) {
      throw error;
    }
  }

  // Elastic quries
  async findAllMovies() : Promise<Movie[]> {

    try {
      let query = {
          index: 'movies',
          body: {
            query: {
              match_all: {} // Fetch all documents
            }
          }
      };

      const movies = await this.elasticsearchService.executeSearchQuery(query);
      return movies; 
    } catch (error) {
      throw error;
    }
  }

  async findMoviesbyfiltering(search : any) : Promise<Movie[]> {

    try {
      let field = search.field;
      let text = search.value;
      let query = {
          index: 'movies',
          body: {
            query: {
              match: {
                [field]: text,
              },
            }
          }
      };

      const movies = await this.elasticsearchService.executeSearchQuery(query);
      return movies; 
    } catch (error) {
      throw error;
    }
  }
}
