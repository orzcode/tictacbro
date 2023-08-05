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

  const setActivePlayer = (player) => {
    activePlayer = player;
  };

  const switchActive = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const reset = () => {
    activePlayer = player1;
  };

  return {
    player1,
    player2,
    activePlayer: {
      getName: () => activePlayer.getName(),
      getSymbol: () => activePlayer.getSymbol(),
      switchActive,
      reset,
    },
  };
})();

/////////////////////////////////////////////////
const GameBoard = (() => {
  const tileArrayInit = () => {
    const tileArray = new Array(9).fill(null);
    //creates an empty array with empty (null) values

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
    //return tileArray
    const winChecker = () => {
      for (const subArr of winStates) {
        if (
          (tileArray[subArr[0]] == PlayersModule.player1.getSymbol() &&
            tileArray[subArr[1]] == PlayersModule.player1.getSymbol() &&
            tileArray[subArr[2]] == PlayersModule.player1.getSymbol()) ||
          (tileArray[subArr[0]] == PlayersModule.player2.getSymbol() &&
            tileArray[subArr[1]] == PlayersModule.player2.getSymbol() &&
            tileArray[subArr[2]] == PlayersModule.player2.getSymbol())
        ) {
          PlayersModule.activePlayer.reset();
          //make this^part of overall reset function which includes restting array
          //and board. Also see below during draw.
          console.log("Win state confirmed for " + tileArray[subArr[0]]);
          //Very rudimentary method, but so long as the ABOVE checks pass,
          //then surely any of the 3 tiles can be used here to determine the winner
          return;
        } else {
          //No win - continuing to loop through win conditions;
          continue;
        }
      }

      //check if board is full:
      if (tileArray.every((tile) => tile !== null)) {
        PlayersModule.activePlayer.reset();
        console.log("Board is full - stalemate");
      }
    };
  };

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
  return { tileArrayInit};
  //current thinking: don't return winstates - create a function within gameboard that checks them.
  //pass this the player.getSymbol() method (maybe), but in either case, keep the checker function in
  //here and also keep the winstates in here, so they dont leak but can still be checked.
})();
GameBoard.tileArrayInit();

// const GameControl = (() => {
//   const player1 = Player("Player 1", "X");
//   const player2 = Player("Player 2", "O");
//   const activePlayer = player1.createActivePlayer(player1, player2);
// //need to move this stuff into Player?
//   console.log(activePlayer.getSymbol());
//   //activePlayer.switchActive()
//   //activePlayer.reset()
//   console.log(activePlayer.getSymbol());
//   console.log(activePlayer.getSymbol());

//   //const activePlayer = Player(null, "X", player1, player2);
//   //Player 1 takes the first turn -- change this if later implementing a diceroll

//   const winStates = GameBoard.winStates();
//   const tileArray = GameBoard.tileArrayInit();

//   const winChecker = () => {
//     for (const subArr of winStates) {
//       if (
//         (tileArray[subArr[0]] == player1.getSymbol() &&
//           tileArray[subArr[1]] == player1.getSymbol() &&
//           tileArray[subArr[2]] == player1.getSymbol()) ||
//         (tileArray[subArr[0]] == player2.getSymbol() &&
//           tileArray[subArr[1]] == player2.getSymbol() &&
//           tileArray[subArr[2]] == player2.getSymbol())
//       ) {
//         activePlayer.reset();
//         //make this^part of overall reset function which includes restting array
//         //and board. Also see below during draw.
//         console.log("Win state confirmed for " + tileArray[subArr[0]]);
//         //Very rudimentary method, but so long as the ABOVE checks pass,
//         //then surely any of the 3 tiles can be used here to determine the winner
//         return;
//       } else {
//         //No win - continuing to loop through win conditions;
//         continue;
//       }
//     }

//     //check if board is full:
//     if (tileArray.every((tile) => tile !== null)) {
//       activePlayer.reset();
//       console.log("Board is full - stalemate");
//     }
//   };
//   return { winChecker, activePlayer };
// })();
