const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const redis = require('redis');

const redisClient = redis.createClient();
let players = [];

redisClient.on('connect', () => {
  console.log('Redis connected');

  redisClient.exists('players', (err, reply) => {
    if (reply === 1) {
      console.log('Players Found');

      redisClient.lrange('players', 0, -1, (err, data) => {
        players = data.map(player => JSON.parse(player));
      });
    } else {
      console.log('No players found');
    }
  });
});

const client = jwksClient({
  jwksUri: 'https://vigzmv.auth0.com/.well-known/jwks.json',
});

const verifyPlayer = (token, cb) => {
  const uncheckedToken = jwt.decode(token, { complete: true });
  const kid = uncheckedToken.header.kid;

  client.getSigningKey(kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;

    jwt.verify(token, signingKey, cb);
  });
};

const newMaxScoreHandler = payload => {
  let foundPlayer = false;
  players.forEach(player => {
    if (player.id === payload.id) {
      foundPlayer = true;
      player.maxScore = Math.max(player.maxScore, payload.maxScore);
    }
  });

  if (!foundPlayer) {
    players.push(payload);

    redisClient.rpush(['players', ...players.map(player => JSON.stringify(player))], (err, reply) => {
      console.log(reply);
    });
  }

  io.emit('players', players);
};

io.on('connection', socket => {
  const { token } = socket.handshake.query;

  verifyPlayer(token, err => {
    if (err) socket.disconnect();
    io.emit('players', players);
  });

  socket.on('new-max-score', newMaxScoreHandler);
});

http.listen(3001, () => {
  console.log('listening on port 3001');
});
