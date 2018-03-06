export const LEADERBOARD_LOADED = 'LEADERBOARD_LOADED';
export const LOGGED_IN = 'LOGGED_IN';
export const MOVE_OBJECTS = 'MOVE_OBJECTS';
export const START_GAME = 'START_GAME';
export const SHOOT = 'SHOOT';

export const leaderboardLoaded = players => ({
  type: LEADERBOARD_LOADED,
  players,
});

export const loggedIn = player => ({
  type: LOGGED_IN,
  player,
});

export const moveObjects = mousePosition => ({
  type: MOVE_OBJECTS,
  mousePosition,
});

export const startGame = () => ({
  type: START_GAME,
});

// Redux:2 This is called and passed the params
// This dispaches the action to the reducer
// reducer gets the action[params]
export const shoot = mousePosition => ({
  type: SHOOT,
  mousePosition,
});
