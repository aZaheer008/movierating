
## Description
For using it create .env file in root diretory and create three variables 

DB_URI= "Database connection url"
JWT_SECRET="JWT_SECRET"
JWT_EXPIRES="JWT_EXPIRES"

postmancollections has api file , please import it in postman for testing purpose.

Pre requsite 

Install Rabbitmq Locally on PC
Install Elasticsearch Locally on PC



## Installation

```bash
$ npm install
```

## Running the app

```bash
#mongodb seed data
$ ts-node scripts/createsampleMovies

#Elastic Search Index and Mapping
$ ts-node scripts/createindex

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
