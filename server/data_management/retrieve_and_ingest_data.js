const { default: axios } = require("axios");
const express = require('express');
const router = express.Router();
const client = require('../elasticsearch/client');

const URL = `http://localhost:3000/songMetaphor`;

router.get('/songs', async function (req, res) {
  console.log('Loading Application...');
  res.json('Running Application...');

  indexData = async () => {
    try {
      console.log('Retrieving data from the corpus');

      const SONGS = await axios.get(`${URL}`, {
        headers: {
          'Content-Type': ['application/json', 'charset=utf-8'],
        },
      });

      console.log('Data retrieved!');

      results = SONGS.data;

      console.log('Indexing data...');

      results.map(
        async (results) => (
          (songObject = {
            id:results.id,
            name: results.name,
            lyricist: results.lyricist,
            singer: results.singer,
            composer: results.composer,
            album: results.album,
            year: results.year,
            metaphor: results.metaphor,
            source: results.source,
            target: results.target,
            interpretation: results.interpretation,

          }),
          await client.index({
            index: 'songs',
            id: results.id,
            body: songObject,
            //pipeline: 'songs',
          })
        )
      );

      if (SONGS.data.length) {
        indexData();
      } else {
        console.log('Data has been indexed successfully!');
      }
    } catch (err) {
      console.log(err);
    }

    console.log('Preparing for the next round of indexing...');
  };
  indexData();
});

module.exports = router;
