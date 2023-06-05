import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Rating {

    @Prop({required: true, type: Types.ObjectId, ref: 'Movie' })
    movie: Types.ObjectId

    @Prop()
    rating: Number

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId
}

export type RatingDocument = Rating & Document;

export const RatingSchema = SchemaFactory.createForClass(Rating);
RatingSchema.plugin(require('mongoose-autopopulate'));
RatingSchema.set('timestamps', true);