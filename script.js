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
        return this.name;
      },
      setSymbol: function (newSymbol) {
        this.symbol = newSymbol;
      },
      getSymbol: function () {
        return this.symbol;
      },
      getNameAndSymbol: function () {
        return `${this.name} (${this.symbol})`;
      },
    };
  };

  let player1 = createPlayer("Player 1", "❌");
  let player2 = createPlayer("Player 2", "⭕");

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
      getNameAndSymbol: () => activePlayer.getNameAndSymbol(),
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
        } else if (mode === "disableAll") {
          tileElement.style.pointerEvents = "none";
        } else if (mode === "disablePlayed") {
          GameBoard.tileArray.forEach((tile, index) => {
            if (tile !== null) {
              document.querySelector(`#tile-${index}`).style.pointerEvents =
                "none";
            }
          });
        }
      });
  };

  const infoFeed = (() => {
    const matchStart = function () {
      document.querySelector("#infoDisplay h2").innerHTML =
        PlayersModule.player1.getNameAndSymbol() + ", click a tile to begin!";
    };
    const whosTurn = function () {
      if (PlayersModule.activePlayer.getName() === "CPU") {
        document.querySelector("#infoDisplay h2").innerHTML =
          PlayersModule.activePlayer.getNameAndSymbol() +
          "'s turn (thinking...)";
      } else
        document.querySelector("#infoDisplay h2").innerHTML =
          PlayersModule.activePlayer.getNameAndSymbol() + ", your move";
    };
    const winMsg = function (player) {
      document.querySelector("#infoDisplay h2").innerHTML = player + " wins!";
    };
    return { matchStart, winMsg, whosTurn };
  })();

  const results = (playerSymbol) => {
    switch (playerSymbol) {
      case PlayersModule.player1.getSymbol():
        infoFeed.winMsg(PlayersModule.player1.getNameAndSymbol());
        break;
      case PlayersModule.player2.getSymbol():
        infoFeed.winMsg(PlayersModule.player2.getNameAndSymbol());
        break;
      case null:
        document.querySelector("#infoDisplay h2").innerHTML =
          "Draw! Nobody wins";
        break;
    }
    document.querySelector("#infoDisplay button").style.visibility = "visible";
    //reveals 'Restart?' button upon win condition

    pointerEvents("disableAll");
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
      console.log("---A tile has been clicked!--(tileClickEvents)--");
      //for debugging clarity :P

      document.querySelector(`#tile-${tile}`).innerHTML =
        PlayersModule.activePlayer.getSymbol();
      // Updates tile DIV with player symbol

      tileArray[tile] = PlayersModule.activePlayer.getSymbol();
      // Updates tileArray with player's symbol

      DisplayControl.pointerEvents(tile);
      // Disables hover effects on already-clicked tile

      if (winChecker() === true) {
        return;
      }
      //Checks wins/stalemates, displays results if so & ends game

      //////////////
      //Game needs to END upon successful Win Check
      //////////////

      //And if no win....... :
      PlayersModule.activePlayer.switchActive();
      // Switches to the other player

      if (PlayersModule.activePlayer.getName() === "CPU") {
        AI.move();
      }
      //checks if activePlayer is a CPU and runs their function.
      //Perhaps a better method exists such as a 'CPU flag'
      //rather than naming P2 "CPU" directly

      DisplayControl.infoFeed.whosTurn();
      //Displays who's turn it is - only if there was no win condition
    } else console.log("Can't apply playerSymbol - tile is not NULL!");
  };

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

    Startflow.disableOtherSymbols(1, "reset");
    Startflow.disableOtherSymbols(2, "reset");
    //resets(removes) greyed-out state for symbols on startpage
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
        return true;
      } else {
        //No win - continuing to loop through win conditions;
        continue;
      }
    }

    //Checking STALEMATE state
    if (tileArray.every((tile) => tile !== null)) {
      DisplayControl.results(null);
      //send 'null' to Results function, interpreted as a Draw
      return true;
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
  const nameInputToggle = (trueOrFalse) => {
    const player2NameInput = document.getElementById("player2Name");
    player2NameInput.disabled = trueOrFalse;

    document
      .getElementById("symbolBox2")
      .querySelectorAll("input")
      .forEach((input) => {
        input.disabled = trueOrFalse;
        
        input.dataset.disabled = trueOrFalse;
        //this is for my own lazy CSS style doubleup

        if(input.parentElement.classList.contains("symbolBoxes")) {
          input.parentElement.classList.remove("symbolBoxes");
        } else input.parentElement.classList.add("symbolBoxes");
        //adds or removes classlist due to fucky pseudo-disable and hover/active states not working

        //false means 'human' was clicked, inputs become enabled
      });
  };
  //uses the HTML attrib "onchange" to trigger

  ///////////////////////
  const disableOtherSymbols = (symbolBoxId, clickedSymbol) => {
    document.querySelectorAll(`#symbolBox${symbolBoxId} input`)
      .forEach((element) => {
        if (element !== clickedSymbol) {
          element.dataset.disabled = true;
        } else element.dataset.disabled = false;
    //toggles disabling (actually 'data-disabling') of other 3 symbols per player-box.
    //disabling properly would render them un-clickable.

        if(clickedSymbol === "reset"){
        element.dataset.disabled = false;
        }
        //resets both symbol boxes' 'greyed-out' state
        //usage: (1, "reset") AND (2, "reset")
      });
  };

  const cpuCheck = () => {
    if (document.querySelector("#cpu").checked) {
      PlayersModule.player2.setName("CPU");
      PlayersModule.player2.setSymbol("🗿");
    }
  };

  const confirmNames = () => {
    let p1Symbol = document.querySelector('input[name="symbols1"]:checked');
    let p2Symbol = document.querySelector('input[name="symbols2"]:checked');

    if(p1Symbol != null) {   
      PlayersModule.player1.setSymbol(p1Symbol.value)
    }
    if(p2Symbol != null) {   
      PlayersModule.player2.setSymbol(p2Symbol.value)
    }

    PlayersModule.player1.setName(document.querySelector("#player1Name").value);
    PlayersModule.player2.setName(document.querySelector("#player2Name").value);
    //Dialog closes automatically by submitting form on Dialog
    
    cpuCheck();
    //sets P2's name as "CPU" (which enables the CPU) if CPU radio is checked
    showBoard();
    //DOM board reveal - but also calls the tileArrayInit
  };
  //takes the values present in text boxes and makes them player names
  //value reset is handled by the Reset function from PlayersModule

  const showBoard = () => {
    cpuCheck();

    document.querySelector("dialog").close();
    //ultimately, this is needed unfortunately despite using method=dialog
    document.querySelector("#gameBoard").style.display = "grid";
    document.querySelector("#infoDisplay").style.display = "flex";

    DisplayControl.infoFeed.matchStart();
    //puts P1's name in InfoDisplay and tells them to go first

    GameBoard.tileArrayInit();
  };

  return { confirmNames, showBoard, nameInputToggle, disableOtherSymbols };
})();

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const AI = (() => {
  const move = () => {
    console.log("--- AI.move() has triggered ---");
    DisplayControl.pointerEvents("disableAll");
    //disallows human from clicking while not their turn

    let tileArrayNulls = [];
    GameBoard.tileArray.forEach((tile, index) => {
      if (tile === null) {
        tileArrayNulls.push(index);
      }
    });
    // creates array of NULL index positions - i.e. possible move options

    let randomSpot =
      tileArrayNulls[Math.floor(Math.random() * tileArrayNulls.length)];
    // picks a random index# to move on

    console.log(
      "tileArrayNulls is " + tileArrayNulls + " and randomSpot is " + randomSpot
    );

    setTimeout(function () {
      GameBoard.tileClickEvents(randomSpot);

      DisplayControl.pointerEvents("reset");
      //re-allows human clicking on all
      DisplayControl.pointerEvents("disablePlayed");
      //re-disables only the played tiles
    }, 1500);
    //emulates cpu "thinking" for 1.5 second
  };
  return { move };
})();
