eventManager.on('PlayingGame', function fixEndTurn() {
  eventManager.on(':load', () => {
    const oEndTurn = endTurn;
    let endedTurn = false;
    endTurn = function restrictedEndTurn() {
      if (endedTurn || $('#endTurnBtn').prop('disabled')) return;
      endedTurn = true;
      oEndTurn();
    };

    eventManager.on('getTurnStart', function turnStarted() {
      if (userTurn !== userId) return;
      endedTurn = false;
    });
  });
});
