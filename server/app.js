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
  console.log('message:', req.body.message)
  const messsage = req.body.messsage;
  //console.log('connection:', amqpConn);
  //res.status(200).send('Morse Code');
  amqpChannel.then(channel => {
    channel.assertQueue('emails', {durable: true})
    .then(() => {
      channel.sendToQueue('emails', new Buffer(messsage));
    })
    .then(() => {
      res.status(200).send('Good Stuff');
    })
  })
  .catch(err => console.log(err))
  // open.then(function(conn) {
  //   return conn.createChannel();
  // }).then(function(ch) {
  //   return ch.assertQueue(q).then(function(ok) {
  //     return ch.sendToQueue(q, new Buffer('something to do'));
  //   });
  // }).catch(console.warn);
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
      return startChannel(conn);
    })
    .then(channel => {
      amqpChannel = channel;
    })
    .then(() => {
      startConsumer(amqpConn);
    })
});
