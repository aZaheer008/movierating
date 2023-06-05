import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Comment {

    @Prop({required: true, type: Types.ObjectId, ref: 'Movie' })
    movie: Types.ObjectId

    text: string

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId
}

export type CommentDocument = Comment & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.plugin(require('mongoose-autopopulate'));
CommentSchema.set('timestamps', true);