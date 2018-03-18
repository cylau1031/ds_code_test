function start(amqp) {
  return amqp.connect(process.env.CLOUDAMQP_URL)
    .then(conn => {
      conn.on('error', err => {
        if (err.message !== 'Connection closing') {
          console.error('[AMQP] conn error', err.message);
        }
      });
      conn.on('close', () => {
        console.error('[AMQP] reconnecting');
        return setTimeout(start, 1000);
      });
      console.log('[AMQP] connected');
      return conn;
    })
    .catch(err => {
      console.error('[AMQP]', err.message);
      return setTimeout(start, 1000);
    })
}

function startChannel(conn) {
  return conn.createChannel()
    .then(channel => {
      channel.on('error', err => {
        console.log('[AMQP] channel error', err.message);
      })
      channel.on('close', () => console.log('channel closed'))
      channel.assertExchange('emails', 'direct');
      return channel;
    })
    .catch(err => console.log(err))
}

module.exports = {
  start,
  startChannel
}
