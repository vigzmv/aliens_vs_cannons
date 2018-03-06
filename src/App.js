import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Auth0 from 'auth0-web';
import io from 'socket.io-client';

import { getCanvasPosition } from './utils/formulas';
import Canvas from './components/Canvas';

Auth0.configure({
  domain: 'vigzmv.auth0.com',
  clientID: 'Q32NKDCOQ9FZP-ACFkXZRj4TZL2W2F8E',
  redirectUri: 'http://localhost:3000/',
  responseType: 'token id_token',
  scope: 'openid profile manage:points',
  audience: 'https://vigneshm.com/aliens_vs_cannons',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.shoot = this.shoot.bind(this);
    this.socket = null;
    this.currentPlayer = null;
  }

  componentDidMount() {
    const self = this;

    Auth0.handleAuthCallback();

    Auth0.subscribe(auth => {
      if (!auth) return;

      self.playerProfile = Auth0.getProfile();
      self.currentPlayer = {
        id: self.playerProfile.sub,
        maxScore: 0,
        name: self.playerProfile.name,
        picture: self.playerProfile.picture,
      };

      this.props.loggedIn(self.currentPlayer);

      self.socket = io('http://localhost:3001', {
        query: `token=${Auth0.getAccessToken()}`,
      });

      self.socket.on('players', players => {
        this.props.leaderboardLoaded(players);
        players.forEach(player => {
          if (player.id === self.currentPlayer.id) {
            self.currentPlayer.maxScore = player.maxScore;
          }
        });
      });
    });

    setInterval(() => {
      self.props.moveObjects(self.canvasMousePosition);
    }, 10);

    window.onresize = () => {
      const cnv = document.getElementById('aliens-go-home-canvas');
      cnv.style.width = `${window.innerWidth}px`;
      cnv.style.height = `${window.innerHeight}px`;
    };
    window.onresize();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.gameState.started && this.props.gameState.started) {
      if (this.currentPlayer.maxScore < this.props.gameState.kills) {
        this.socket.emit('new-max-score', {
          ...this.currentPlayer,
          maxScore: this.props.gameState.kills,
        });
      }
    }
  }

  trackMouse(event) {
    this.canvasMousePosition = getCanvasPosition(event);
  }

  shoot() {
    this.props.shoot(this.canvasMousePosition);
  }

  render() {
    return (
      <Canvas
        angle={this.props.angle}
        currentPlayer={this.props.currentPlayer}
        gameState={this.props.gameState}
        players={this.props.players}
        startGame={this.props.startGame}
        trackMouse={event => this.trackMouse(event)}
        shoot={this.shoot}
      />
    );
  }
}

App.propTypes = {
  angle: PropTypes.number.isRequired,
  gameState: PropTypes.shape({
    started: PropTypes.bool.isRequired,
    kills: PropTypes.number.isRequired,
    lives: PropTypes.number.isRequired,
  }).isRequired,
  flyingObjects: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }).isRequired,
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  moveObjects: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  currentPlayer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }),
  leaderboardLoaded: PropTypes.func.isRequired,
  loggedIn: PropTypes.func.isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      maxScore: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
    }),
  ),
  shoot: PropTypes.func.isRequired,
};

App.defaultProps = {
  currentPlayer: null,
  players: null,
};

export default App;
