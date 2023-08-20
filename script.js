//----------------------------------------------------//
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
    activePlayer = player1;
  };
  //resets all players AND activePlayer

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
    },
    resetPlayers,
  };
})();

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const DisplayControl = (() => {
  document.querySelector("input").blur();
  const pointerEvents = (mode) => {
    if (typeof mode === "number") {
      document.querySelector(`#tile-${mode}`).style.pointerEvents = "none";
    } //Used in-game, upon clicking - represents tile number
    else
      document.querySelectorAll(".tile").forEach((tileElement) => {
        if (mode === "reset") {
          tileElement.style.pointerEvents = "auto";
        } else if (mode === "disable") {
          tileElement.style.pointerEvents = "none";
        }
      });
  };

  const infoFeed = (() => {
    const matchStart = function () {
      document.querySelector("#infoDisplay h2").innerHTML =
        PlayersModule.player1.getName() + ", click a tile to begin!";
    };
    const whosTurn = function () {
      document.querySelector("#infoDisplay h2").innerHTML =
        PlayersModule.activePlayer.getName() + ", your go bro";
    };
    const winMsg = function (player) {
      document.querySelector("#infoDisplay h2").innerHTML = player + " wins!";
    };
    return { matchStart, winMsg, whosTurn };
  })();

  const results = (playerSymbol) => {
    switch (playerSymbol) {
      case PlayersModule.player1.getSymbol():
        infoFeed.winMsg(PlayersModule.player1.getName());
        break;
      case PlayersModule.player2.getSymbol():
        infoFeed.winMsg(PlayersModule.player2.getName());
        break;
      case null:
        document.querySelector("#infoDisplay h2").innerHTML =
          "Draw! Nobody wins";
        break;
    }
    document.querySelector("#infoDisplay button").style.visibility = "visible";
    //reveals 'Restart?' button upon win condition

    pointerEvents("disable");
    //removes pointerEvent (click)ability

    GameBoard.tileArray.forEach((tile, index) => {
      if (tile === null) {
        GameBoard.tileArray[index] = "crap";
      }
    });
    //fills remaining array with crap, which the AI wont recognize as valid
    //EG: this prevents AI from placing tiles after a winstate
  };
  return { results, pointerEvents, infoFeed };
})();

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const GameBoard = (() => {
  const tileArray = new Array(9).fill(null);
  //creates an empty array with empty (null) values

  const tileClickEvents = (tile) => {
    if (tileArray[tile] === null) {
      document.querySelector(`#tile-${tile}`).innerHTML =
        PlayersModule.activePlayer.getSymbol();
      // Updates tile DIV with player symbol

      tileArray[tile] = PlayersModule.activePlayer.getSymbol();
      // Updates tileArray with player's symbol

      DisplayControl.pointerEvents(tile);
      // Disables hover effects on already-clicked tile

      PlayersModule.activePlayer.switchActive();
      // Switches to the other player
      //NOTE: this was swapped with winChecker due to activeplayer
      //order problem. With this solution, it doesn't matter if the activeplayer
      //is swapped prematurely - as it will be reset IF A WIN happens below

      winChecker();
      //Checks wins, stalemates, also displays next player's turn

      //IF (ACTIVE PLAYER === COMPUTER) THEN DO COMP STUFF
      //IF NOT, SWITCH NORMALLY?
    } else console.log("Can't apply playerSymbol - tile is not NULL!");
  };
  // const tileClicker = (tile) => {
  //   return function () {
  //     tileClickEvents(tile)
  //   };
  // }

  const tileArrayInit = () => {
    //ONCLICK APPLICATION//
    for (let tile = 0; tile <= 8; tile++) {
      //through 0 to 8 (#1 to #9), appends click listener to respective html tile ID#,
      //if respective tileArray[tile] value is null.
      //needs individual tile precision which is why we can't use forEach.
      document
        .querySelector(`#tile-${tile}`)
        .addEventListener("click", function () {
          tileClickEvents(tile);
        });
    }
  };

  const reset = () => {
    tileArray.fill(null);
    //resets tileArray
    for (const tileElement of document.querySelectorAll(".tile")) {
      tileElement.innerHTML = "";
    }
    //resets visual gameboard HTML
    PlayersModule.resetPlayers();
    //resets player names, and Active Player

    DisplayControl.pointerEvents("reset");
    //restores pointerEvent (click)ability

    DisplayControl.infoFeed.matchStart();
    //resets info Display prompt to Player 1's turn (i.e: match start)

    document.querySelector("dialog").show();
    document.querySelector("#gameBoard").style.display = "none";
    document.querySelector("#infoDisplay").style.display = "none";
    document.querySelector("#infoDisplay button").style.visibility = "hidden";
    //hides Gameboard and re-opens Start Screen modal/dialog

    document.querySelector("#player1Name").value = "";
    document.querySelector("#player2Name").value = "";
    //resets Dialog box names
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
    } else {
      DisplayControl.infoFeed.whosTurn();
      //Displays who's turn it is - only if there was no win condition
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
  return { tileArrayInit, tileArray, reset, tileClickEvents };
  //current thinking: don't return winstates - create a function within gameboard that checks them.
  //pass this the player.getSymbol() method (maybe), but in either case, keep the checker function in
  //here and also keep the winstates in here, so they dont leak but can still be checked.
})();

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const Startflow = (() => {
  const confirmNames = () => {
    PlayersModule.player1.setName(document.querySelector("#player1Name").value);
    PlayersModule.player2.setName(document.querySelector("#player2Name").value);
    //Dialog closes automatically by submitting form on Dialog

    showBoard();
    //DOM board reveal - but also calls the tileArrayInit
  };
  //takes the values present in text boxes and makes them player names
  //value reset is handled by the Reset function from PlayersModule

  const showBoard = () => {
    document.querySelector("dialog").close();
    //ultimately, this is needed unfortunately despite using method=dialog
    document.querySelector("#gameBoard").style.display = "grid";
    document.querySelector("#infoDisplay").style.display = "flex";

    DisplayControl.infoFeed.matchStart();
    //puts P1's name in InfoDisplay and tells them to go first

    GameBoard.tileArrayInit();
  };

  return { confirmNames, showBoard };
})();

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const AI = (() => {
  const move = () => {
    let tileArrayNulls = [];
    GameBoard.tileArray.forEach((tile, index) => {
      if (tile === null) {
        tileArrayNulls.push(index);
      }
    });
    // creates array of NULL index positions - i.e. possible move options

    let randomSpot = tileArrayNulls[Math.floor(Math.random() * tileArrayNulls.length)];
    // picks a random index# to move on

    console.log(
      "tileArrayNulls is " + tileArrayNulls + " and randomSpot is " + randomSpot
    );

    GameBoard.tileClickEvents(randomSpot);
  };
  return { move };
})();
