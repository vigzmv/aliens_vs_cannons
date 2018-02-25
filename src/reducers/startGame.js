export default (state, initialGameState) => ({
  ...state,
  gameState: {
    ...initialGameState,
    started: true,
  },
});
