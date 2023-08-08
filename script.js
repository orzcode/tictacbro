//----------------------------------------------------//
//Some of these will be global to begin with, just move them into main objects later//
const PlayersModule = (() => {
  const createPlayer = (name, symbol) => {
    return {
      name,
      symbol,
      setName: function (newName) {
        this.name = newName;
      },
      getName: function () {
        return `${this.name} (${this.symbol})`;
      },
      setSymbol: function (newSymbol) {
        this.symbol = newSymbol;
      },
      getSymbol: function () {
        return this.symbol;
      },
    };
  };

  let player1 = createPlayer("Player 1", "X");
  let player2 = createPlayer("Player 2", "O");

  let activePlayer = player1;

  const resetPlayers = () => {
    player1.setName("Player 1");
    player1.setSymbol("X");
    player2.setName("Player 2");
    player2.setSymbol("O");
  };
  //Some WHACK behavior with this. It resets activePlayer too...somehow.

  // const reset = () => {
  //   activePlayer = player1;
  // };

  const switchActive = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  return {
    player1,
    player2,
    activePlayer: {
      getName: () => activePlayer.getName(),
      getSymbol: () => activePlayer.getSymbol(),
      switchActive,
      //reset,
    },
    resetPlayers,
  };
})();

/////////////////////////////////////////////////
const GameBoard = (() => {
  const tileArray = new Array(9).fill(null);
  //creates an empty array with empty (null) values

  const reset = () => {
    tileArray.fill(null);
    //resets tileArray
    for (const tileElement of document.querySelectorAll(".tile")) {
      tileElement.innerHTML = "";
    }
    //resets visual gameboard HTML
    PlayersModule.resetPlayers();
    //resets player names, and Active Player...somehow
  };

  const tileArrayInit = () => {
    //ONCLICK APPLICATION//
    for (let tile = 0; tile <= 8; tile++) {
      document
        .querySelector(`#tile-${tile}`)
        .addEventListener("click", function () {
          if (tileArray[tile] === null) {
            document.querySelector(`#tile-${tile}`).innerHTML =
              PlayersModule.activePlayer.getSymbol();
            tileArray[tile] = PlayersModule.activePlayer.getSymbol(); // Update tileArray with player's symbol
            PlayersModule.activePlayer.switchActive();
            // Switch to the other player
            winChecker();
          } else console.log("Can't apply playerSymbol - tile is not NULL!");
        });
    }
    //through 0 to 8 (1 to 9), appends onclick to respective html tile ID#,
    //if respective tileArray[tile] value is null
  };
  const winChecker = () => {
    //Checks win state ELSE stalemate state

    //Checking WIN state
    for (const subArr of winStates) {
      if (
        (tileArray[subArr[0]] == PlayersModule.player1.getSymbol() &&
          tileArray[subArr[1]] == PlayersModule.player1.getSymbol() &&
          tileArray[subArr[2]] == PlayersModule.player1.getSymbol()) ||
        (tileArray[subArr[0]] == PlayersModule.player2.getSymbol() &&
          tileArray[subArr[1]] == PlayersModule.player2.getSymbol() &&
          tileArray[subArr[2]] == PlayersModule.player2.getSymbol())
        //checks if all 3 index positions of each set of win states
        //has 'the same' player symbol in it.
      ) {
        DisplayControl.results(tileArray[subArr[0]]);
        //send the symbol of the winner to Results function

        //-----------------//
        PlayersModule.resetPlayers();
        //-----------------//
        //replace all this^ with (1) stalemate info display, (2) disable clicks

        return;
      } else {
        //No win - continuing to loop through win conditions;
        continue;
      }
    }
    //Checking STALEMATE state
    if (tileArray.every((tile) => tile !== null)) {
      DisplayControl.results(null);
      //send 'null' to Results function, interpreted as a Draw

      //-----------------//
      PlayersModule.resetPlayers();
      //-----------------//
      //replace all this^ with (1) stalemate info display, (2) disable clicks
    }
  };

  /////////////////////////////////////////////////
  const winStates = [
    // Horizontal win states
    [0, 1, 2], // 1st row
    [3, 4, 5], // 2nd row
    [6, 7, 8], // 3rd row

    // Vertical win states
    [0, 3, 6], // 1st column
    [1, 4, 7], // 2nd column
    [2, 5, 8], // 3rd column

    // Diagonal win states
    [0, 4, 8], // Top-left to bottom-right diagonal
    [2, 4, 6], // Top-right to bottom-left diagonal
  ];
  /////////////////////////////////////////////////
  return { tileArrayInit, reset };
  //current thinking: don't return winstates - create a function within gameboard that checks them.
  //pass this the player.getSymbol() method (maybe), but in either case, keep the checker function in
  //here and also keep the winstates in here, so they dont leak but can still be checked.
})();
GameBoard.tileArrayInit();
/////////////////////////////////////////////////
DisplayControl = (() => {
  const results = (playerSymbol) => {
    switch (playerSymbol) {
      case PlayersModule.player1.getSymbol():
        console.log("Player 1 wins, cool function works, smd");
        break;
      case PlayersModule.player2.getSymbol():
        console.log("Player 2 wins, cool function works, smd");
        break;
      case null:
        console.log("Straight stalemate son, TF u gon do");
        break;
    }
    //remove eventlistener here - need to use named 'function' for it
  };
  return { results };
})();
