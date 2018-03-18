'use strict';

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'development') {
  require('../secrets.js');
}

// AMQP
const {
  start,
  startPublisher
} = require('./amqpUtils');
const startConsumer = require('./consumer');
let amqpChannel = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../', 'public')));

// Form submission middleware to publish to exchange
app.post('/formSubmission', (req, res, next) => {
  const formData = req.body.formData;
  amqpChannel.then(channel => {
    channel.assertExchange('emails', 'direct');
    channel.publish('emails', 'email', Buffer.from(JSON.stringify(formData)))
  })
  .then(() => {
    res.status(200).send('Sending Email Now');
  })
  .catch(err => console.log(err))
})

app.get('*', (req, res, next) => res.sendFile(path.join(__dirname, '../public/index.html')))

app.use((err, req, res, next) => {
  res.send(err);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
  start()
    .then(conn => {
      // startPublisher to open channel and assert exchange
      amqpChannel = startPublisher(conn);
      // start consumer to run worker to send email from task from email queue
      startConsumer(conn);
    })
});
