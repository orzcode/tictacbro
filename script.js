//----------------------------------------------------//
//Some of these will be global to begin with, just move them into main objects later//

// const Player = (name, symbol, p1, p2) => {
//   const getName = () => {
//     return `${name} (${symbol})`;
//     //appends symbol in brackets to end of name - for user ease
//   };
//   const getSymbol = () => {
//     return symbol;
//   };
//   //set directly, initially, by default below, but
//   //if I want to change or 'set' to something else (eg named players)
//   //then i'll need to make setName() too

//   ///////////////////////////////////////////
//   const switchActive = () => {
//     symbol === p1.getSymbol()
//       ? (symbol = p2.getSymbol())
//       : (symbol = p1.getSymbol());
//     //called later - this is how turns are taken
//   };
//   const reset = () => {
//     symbol === p1.getSymbol();
//     //resets active player to Player 1
//   };
//   ///////////////////////////////////////////
//   //make as prototype? only of/for activeplayer?
//   //rewrite entirely?

//   return { getName, getSymbol, switchActive, reset };
// };
//////////////////////////////////////////////////////////
const Player = (name, symbol) => {
  const getName = () => {
    return `${name} (${symbol})`;
  };

  const getSymbol = () => {
    return symbol;
  };

  const switchActive = (p1, p2) => {
    symbol === p1.getSymbol()
      ? setSymbol(p2.getSymbol())
      : setSymbol(p1.getSymbol());
  };

  const reset = (p1) => {
    setSymbol(p1.getSymbol());
  };

  const setSymbol = (newSymbol) => {
    symbol = newSymbol;
  };

  const createActivePlayer = (p1, p2) => {
    // Create a new object based on the Player object
    const activePlayer = {
      getName,
      getSymbol,
      switchActive: () => switchActive(p1, p2), // Bind p1 and p2 to switchActive
      reset: () => reset(p1), // Bind p1 to reset
    };

    return activePlayer;
  };

  return { getName, getSymbol, createActivePlayer };
};

//--PROBLEM - switchActive seems to only work once! And reset wont work!

/////////////////////////////////////////////////
const GameBoard = (() => {
  // const player1 = Player("Player 1", "X");
  // const player2 = Player("Player 2", "O");
  // const activePlayer = player1.createActivePlayer(player1, player2);

  // console.log(activePlayer.getSymbol());
  // //activePlayer.switchActive()
  // //activePlayer.reset()
  // console.log(activePlayer.getSymbol());
  // console.log(activePlayer.getSymbol());

  // //const activePlayer = Player(null, "X", player1, player2);
  // //Player 1 takes the first turn -- change this if later implementing a diceroll

  const tileArrayInit = () => {
    const activePlayer = GameControl.activePlayer;
    const tileArray = new Array(9).fill(null);
    //creates an empty array with empty (null) values

    for (let tile = 0; tile <= 8; tile++) {
      document
        .querySelector(`#tile-${tile}`)
        .addEventListener("click", function () {
          if (tileArray[tile] === null) {
            document.querySelector(`#tile-${tile}`).innerHTML =
              activePlayer.getSymbol();
            tileArray[tile] = activePlayer.getSymbol(); // Update tileArray with player's symbol
            activePlayer.switchActive();
            // Switch to the other player
            GameControl.winChecker();
          } else console.log("Can't apply playerSymbol - tile is not NULL!");
        });
    }
    //through 0 to 8 (1 to 9), appends onclick to respective html tile ID#,
    //if respective tileArray[tile] value is null
return tileArray
    // const winChecker = () => {
    //   for (const subArr of winStates) {
    //     if (
    //       (tileArray[subArr[0]] == player1.getSymbol() &&
    //         tileArray[subArr[1]] == player1.getSymbol() &&
    //         tileArray[subArr[2]] == player1.getSymbol()) ||
    //       (tileArray[subArr[0]] == player2.getSymbol() &&
    //         tileArray[subArr[1]] == player2.getSymbol() &&
    //         tileArray[subArr[2]] == player2.getSymbol())
    //     ) {
    //       activePlayer.reset();
    //       //make this^part of overall reset function which includes restting array
    //       //and board. Also see below during draw.
    //       console.log("Win state confirmed for " + tileArray[subArr[0]]);
    //       //Very rudimentary method, but so long as the ABOVE checks pass,
    //       //then surely any of the 3 tiles can be used here to determine the winner
    //       return;
    //     } else {
    //       //No win - continuing to loop through win conditions;
    //       continue;
    //     }
    //   }

    //   //check if board is full:
    //   if (tileArray.every((tile) => tile !== null)) {
    //     activePlayer.reset();
    //     console.log("Board is full - stalemate");
    //   }
    // };
  };

  const winStates = () => {
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
    return [...winStates];
  };
  return { tileArrayInit, winStates };
  //current thinking: don't return winstates - create a function within gameboard that checks them.
  //pass this the player.getSymbol() method (maybe), but in either case, keep the checker function in
  //here and also keep the winstates in here, so they dont leak but can still be checked.
})();
GameBoard.tileArrayInit();



const GameControl = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  const activePlayer = player1.createActivePlayer(player1, player2);
//need to move this stuff into Player?
  console.log(activePlayer.getSymbol());
  //activePlayer.switchActive()
  //activePlayer.reset()
  console.log(activePlayer.getSymbol());
  console.log(activePlayer.getSymbol());

  //const activePlayer = Player(null, "X", player1, player2);
  //Player 1 takes the first turn -- change this if later implementing a diceroll


  const winStates = GameBoard.winStates();
  const tileArray = GameBoard.tileArrayInit();

  const winChecker = () => {
    for (const subArr of winStates) {
      if (
        (tileArray[subArr[0]] == player1.getSymbol() &&
          tileArray[subArr[1]] == player1.getSymbol() &&
          tileArray[subArr[2]] == player1.getSymbol()) ||
        (tileArray[subArr[0]] == player2.getSymbol() &&
          tileArray[subArr[1]] == player2.getSymbol() &&
          tileArray[subArr[2]] == player2.getSymbol())
      ) {
        activePlayer.reset();
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
      activePlayer.reset();
      console.log("Board is full - stalemate");
    }
  };
  return { winChecker, activePlayer };
})();