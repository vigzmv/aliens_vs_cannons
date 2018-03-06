import { LEADERBOARD_LOADED, LOGGED_IN, MOVE_OBJECTS, START_GAME } from '../actions';
import moveObjects from './moveObjects';
import startGame from './startGame';

const initialGameState = {
  started: false,
  kills: 0,
  lives: 3,
  flyingObjects: [],
  lastObjectCreatedAt: new Date(),
};

const initialState = {
  angle: 45,
  gameState: initialGameState,
  currentPlayer: null,
  players: null,
};

// Redux:3 The dispachted action.type is matched and a
// NEW State is directly returned by a function

function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        currentPlayer: action.player,
      };
    case LEADERBOARD_LOADED:
      return {
        ...state,
        players: action.players,
      };
    case MOVE_OBJECTS:
      return moveObjects(state, action);
    case START_GAME:
      return startGame(state, initialGameState);
    default:
      return state;
  }
}

export default reducer;
