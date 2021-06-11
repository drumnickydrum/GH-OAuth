const express = require('express');
const path = require('path');

const app = express();

// Serve React App
const buildFolder = path.join(__dirname, '../client/build');
app.use(express.static(buildFolder));
app.get('/', (_, res) => {
  res.sendFile(path.join(buildFolder, 'index.html'));
});

app.get('/test', (_, res) => res.send('success!'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
