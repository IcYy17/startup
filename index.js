const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// // GetScores
// apiRouter.get('/scores', (_req, res) => {
//   res.send(scores);
// });

// gets shoe price and sends to front end
app.get('/api/shoe-prices', async (_req, res) => {
  try {
    
    const pricesData = await fs.readFile('shoe-prices.json', 'utf-8');
    const prices = JSON.parse(pricesData);

    res.json(prices);
  } catch (error) {
    console.error('Error reading shoe prices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// // SubmitScore
// apiRouter.post('/score', (req, res) => {
//   scores = updateScores(req.body, scores);
//   res.send(scores);
// });

// Return the application's default page if the path is unknown
// app.use((_req, res) => {
//   res.sendFile('index.html', { root: 'startup' });
// });

app.use((_req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log(`Trying to send file: ${indexPath}`);
    res.sendFile('index.html', { root: 'public' });
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
