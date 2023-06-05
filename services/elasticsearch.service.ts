import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchConnectionService {
  private readonly esClient: Client;

  constructor() {
    this.esClient = new Client({ node: 'http://localhost:9200' });
  }

  async connect(): Promise<void> {
    try {
      const response = await this.esClient.ping();
      console.log('Connected to Elasticsearch : -----> : ');
    } catch (error) {
      console.error('Error connecting to Elasticsearch:', error);
    }
  }

  getClient(): Client {
    return this.esClient;
  }

  async insertDocument(indexName: string, document: any) {
    try {
      const response = await this.esClient.index({
        index: indexName,
        body: document,
      });

      return response;
    } catch (error) {
      console.error('An error occurred while inserting the document:', error);
    }
  }

  async updateDocument(query:any,indexName: string, document: any){
    try {
      const body = await this.esClient.updateByQuery({
        index:indexName, // Replace with your Elasticsearch index name
        body: {
          query: query,
          script: {
            lang: 'painless',
            source: `if (ctx._source.customKey == params.customKey) {
              ${Object.keys(document).map((field) => `ctx._source.${field} = params.${field};`).join(' ')}
            }`,
            params: document,
          },
        },
      });
  
      return body.updated; // Number of documents updated
    } catch (error) {
      console.error('An error occurred while inserting the document:', error);
    }
  }

  async executeSearchQuery(query:any) : Promise<any> {
    try {
      const result = await this.esClient.search(query);
      return result;
  
    //   const documents = body.hits.hits.map((hit: any) => hit._source);
    //   console.log(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }
}
