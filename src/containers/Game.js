import { connect } from 'react-redux';
import App from '../App';
import { leaderboardLoaded, loggedIn, moveObjects, startGame } from '../actions/index';

const mapStateToProps = state => ({
  angle: state.angle,
  gameState: state.gameState,
  currentPlayer: state.currentPlayer,
  players: state.players,
});

const mapDispatchToProps = dispatch => ({
  leaderboardLoaded: players => {
    dispatch(leaderboardLoaded(players));
  },
  loggedIn: player => {
    dispatch(loggedIn(player));
  },
  moveObjects: mousePosition => {
    dispatch(moveObjects(mousePosition));
  },

  // Redux: 1 this function is passed to component as a Prop.
  // This is called by the component, then it calls the action.
  startGame: () => {
    dispatch(startGame());
  },
});

const Game = connect(mapStateToProps, mapDispatchToProps)(App);

export default Game;
