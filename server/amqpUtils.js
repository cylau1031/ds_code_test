'use strict';

const amqp = require('amqplib');

// start the amqp connection to CloudAMQP instance. Tries to reconnect when errors occur.
function start() {
  return amqp.connect(process.env.CLOUDAMQP_URL)
    .then(conn => {
      conn.on('error', err => {
        if (err.message !== 'Connection closing') {
          console.error('AMQP connection error', err.message);
        }
      });
      conn.on('close', () => {
        console.error('AMQP reconnecting');
        return setTimeout(start, 1000);
      });
      console.log('AMQP connected');
      return conn;
    })
    .catch(err => {
      console.error('AMQP', err.message);
      return setTimeout(start, 1000);
    })
}

// starts publisher which is setting up channel and exchange
function startPublisher(conn) {
  return conn.createChannel()
    .then(channel => {
      channel.on('error', err => {
        console.log('AMQP channel error', err.message);
      })
      channel.on('close', () => console.log('channel closed'))
      channel.assertExchange('emails', 'direct');
      return channel;
    })
    .catch(err => console.log(err))
}

module.exports = {
  start,
  startPublisher
}
