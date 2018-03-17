const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res, next) => res.sendFile(path.join(__dirname, '../public/index.html')))

app.use((err, req, res, next) => {
  res.send(err);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
