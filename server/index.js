import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';

import schema from './schema';

const app = express();
app.use(cors());

app.use('/', (req, res) => {
 graphqlHTTP({
   schema: schema,
   pretty: true,
   graphiql: true,
 })(req, res);
});

const port = 3010;

app.listen(port, () => {
 console.log(`app started on port ${port}`);
});
