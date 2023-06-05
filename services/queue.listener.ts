import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ElasticsearchConnectionService } from './elasticsearch.service';
import axios from 'axios';

@Injectable()
export class QueueListener {
    
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly elasticsearchService: ElasticsearchConnectionService
    ) {}
    

  async listenToQueue(queueName: string,exchangeName: string): Promise<void> {
    await this.rabbitMQService.consumeMessage(queueName,exchangeName, async (message) => {
      // console.log("----message---", message);
      // console.log("----message---",typeof message);
      let result = JSON.parse(message);
      // console.log("----result---", result);
      let res = result.data;
      if (result.save) {
        let movieDocument = {
          name: res.name,
          description: res.description,
          release_date: res.release_date,
          ticket_price: res.ticket_price,
          ratingsum: res.ratingsum,
          ratingcount: res.ratingcount,
          commentcount: res.commentcount,
          rating: res.rating,
          country: res.country,
          genre: res.genre,
          mongodbId : res._id
        };

        const response = await axios.post(`http://localhost:9200/movies/_doc`,movieDocument );
          console.log("-----response------",response.data);

        // let resultElastic = await this.elasticsearchService.insertDocument('movies', movieDocument);
        // console.log("--------resultElastic----",resultElastic);
      } else if (result.update) {
        let movieDocument = {
          name: res.name,
          description: res.description,
          release_date: res.release_date,
          ticket_price: res.ticket_price,
          ratingsum: res.ratingsum,
          ratingcount: res.ratingcount,
          commentcount: res.commentcount,
          rating: res.rating,
          country: res.country,
          genre: res.genre,
          mongodbId : res._id
        };
        let query = {
          term: {
            'mongodbId': res._id,
          },
        }

        const response = await axios.post(`http://localhost:9200/movies/_update_by_query`, {
        script: {
          lang: 'painless',
          source: `if (ctx._source.customKey == params.customKey) {
            ${Object.keys(movieDocument).map((field) => `ctx._source.${field} = params.${field};`).join(' ')}
          }`,
          params: movieDocument,
        },
          query: query,
        });
        console.log("-----response------",response.data);
        // let resultElastic = await this.elasticsearchService.updateDocument(query,'movies', movieDocument);
        // console.log("--------resultElastic----",resultElastic);
      } else if (result.delete) {
        try {
          let query = {
            term: {
              'mongodbId': res._id,
            },
          }
          const response = await axios.post(`http://localhost:9200/movies/_delete_by_query`, {
            query: query,
          });
      
          if (response.data.deleted > 0) {
            console.log('Document deleted successfully.');
          } else {
            console.log('No matching document found for deletion.');
          }
        } catch (error) {
          console.error('Error deleting Elasticsearch document:', error);
          throw error;
        }
      } else {
        console.log("Not--designeted case");
      }
      return true;
    });
  }
}