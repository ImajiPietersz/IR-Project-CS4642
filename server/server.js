const { Client } = require('@elastic/elasticsearch');
const client = require('./elasticsearch/client');
const express = require('express');
const cors = require('cors');

const app = express();

console.log("getting data")
const data = require('./data_management/retrieve_and_ingest_data');

app.use('/ingest_data', data);

app.use(cors());

app.get('/results', (req, res) => {
  const passedMetaphor = req.query.metaphor;

  async function sendESRequest() {
    const body = await client.search({
      index: 'songs',
      body: {
      
    query: {
           bool: {
            
                should: [
                      { match: { source: passedMetaphor }},
                      { match: { target: passedMetaphor }} 
              ]}     
    }

     /* query: {
         multi_match : {
          query: passedMetaphor,
           fields: [ source, target]
}}*/
  
  }});
    res.json(body.hits.hits);
  }
  sendESRequest();
  console.log("sent request")
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.group(`Server started on ${PORT}`));
//in server/server.js'

  