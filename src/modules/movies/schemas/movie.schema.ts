import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { QueueProducer } from "services/queue.producer";
import { RabbitMQService } from "services/rabbitmq.service";

@Schema()
export class Movie {

    @Prop()
    name: string

    @Prop()
    description: string

    @Prop()
    release_date: Date

    @Prop()
    ticket_price : Number

    @Prop({ type: Number, default: 0})
    ratingsum : Number

    @Prop({ type: Number, default: 0})
    ratingcount : Number

    @Prop({ type: Number, default: 0})
    commentcount: Number

    @Prop({ type: Number, default: 0})
    rating : Number

    @Prop()
    country: string

    @Prop()
    genre: string

}

export type MovieDocument = Movie & Document;

export const movieSchema = SchemaFactory.createForClass(Movie);
movieSchema.plugin(require('mongoose-autopopulate'));
movieSchema.set('timestamps', true);

const rabbitMQService = new RabbitMQService(); 
// Instantiate the QueueProducer
const queueProducer = new QueueProducer(rabbitMQService);

movieSchema.post('save', async function(data) {
    let result= {data};
    result['save'] = true;
    await queueProducer.sendMessageToQueue('my_queue','my_exchange', JSON.stringify(result));
    console.log('this gets printed fourth ===> : ',data);
});

movieSchema.post('findOneAndUpdate', async function(data) {
    let result= {data};
    result['update'] = true;
    await queueProducer.sendMessageToQueue('my_queue','my_exchange', JSON.stringify(result));
    console.log('this findOneAndUpdate gets printed fourth ===> : ',data);
});

movieSchema.post('findOneAndDelete', async function(data) {
    let result= {data};
    result['delete'] = true;
    await queueProducer.sendMessageToQueue('my_queue','my_exchange', JSON.stringify(result));
    console.log('this findOneAndDelete gets printed fourth ===> : ',data);
});

