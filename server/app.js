'use strict';

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
require('../secrets.js');
const {
  start,
  startChannel
} = require('./amqpUtils');
const startConsumer = require('./consumer');

const amqp = require('amqplib');
let amqpConn = null;
let amqpChannel = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '../', 'public')));

app.post('/newMessage', (req, res, next) => {
  const message = req.body.message;
  amqpChannel.then(channel => {
    channel.assertExchange('emails', 'direct');
    channel.publish('emails', 'email', Buffer.from(JSON.stringify(message)))
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
  start(amqp)
    .then(conn => {
      amqpConn = conn;
      amqpChannel = startChannel(conn);
    })
    .then(() => {
      startConsumer(amqpConn);
    })
});
