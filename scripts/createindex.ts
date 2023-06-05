import { Client } from 'elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

async function createMovieMapping() {
  try {
    await client.indices.create({
      index: 'movies',
      body: {
        settings: {
          analysis: {
            analyzer: {
              search_analyzer: {
                tokenizer: 'standard',
                filter: ['lowercase', 'custom_stopwords', 'custom_stemmer', 'custom_edge_ngram'],
              },
            },
            filter: {
              custom_stopwords: {
                type: 'stop',
                stopwords: ['the', 'a', 'of'], // Specify your custom stop words here
              },
              custom_stemmer: {
                type: 'stemmer',
                name: 'english',
              },
              custom_edge_ngram: {
                type: 'edge_ngram',
                min_gram: 1,
                max_gram: 20,
              },
            },
          },
        },
        mappings: {
          properties: {
            name: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                },
              },
              analyzer: 'search_analyzer',
            },
            description: { type: 'text', analyzer: 'search_analyzer' },
            release_date: { type: 'date' },
            ticket_price: { type: 'float' },
            ratingsum: { type: 'float', index: false },
            ratingcount: { type: 'integer', index: false },
            commentcount: { type: 'integer', index: false },
            rating: { type: 'float', index: false},
            country: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                },
              },
              analyzer: 'search_analyzer',
            },
            genre: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                },
              },
              analyzer: 'search_analyzer',
            },
            mongodbId: { type: 'text' },
          },
        },
      },
    });
    
    console.log('Movie mapping created successfully');
  } catch (error) {
    console.error('An error occurred while creating the movie mapping:', error);
  }
}

async function deleteIndex(indexName: string) {
    try {
      await client.indices.delete({ index: indexName });
      console.log(`Index '${indexName}' deleted successfully`);
    } catch (error) {
      console.error(`An error occurred while deleting index '${indexName}':`, error);
    }
  }
  
// Usage example
// deleteIndex('movies');

createMovieMapping();
