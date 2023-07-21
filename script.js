// // let GameBoard = (() => {
// // 	let tiles = new Array(9).fill(null);
// // 	let click = (Player, tile) => tiles[tile] = Player.symbol
// // 	return {tiles , click};
// // })();
// // console.log(GameBoard.tiles);
// // //IIFE-wrapped, AKA a module

// // let player = (name, symbol) => {
// // 		return { name, symbol };
// // }
// // //Factory function, since it 'returns' the needed
// // //doesn't use "new", which is how it's a 'factory function'
// // const player1 = player('Player 1 (X)', 'X');
// // const player2 = player('Player 2 (O)', 'O');
// // //

// // player2.name = "joe";
// // console.log(player2.name)
// // //

// ////////////////////////////
// // THIS HAPPENS (1) ON FIRST RUN  (2) WHEN RESETTING GAME - e.g., gameBoard.init
// // ------------------------------------------------------

// // let tileArray = [null, null, null...]

// // add eventlistener to each tileDiv#id, ONCLICK, ()=>
// // 	if (tileArray[tileDiv#id] === null){
// // 	tileArray[tileDiv#id] = player.Symbol
// // 	}
// // 	else
// // 	do nothing (or maybe a visual 'no' clue in case of existing symbol)
// // }
// ////////////////////////////
// // let GameBoard = (() => {
// // 	let init = (() => {
// // 		let tileArray = new Array(9).fill(null);
// // 		tileArray.forEach(tile => {
// // 			console.log("test");

// // 			addEventListener(click, applySymbol);
// // 			function applySymbol(player){
// // 			if (tile === null){
// // 				tile = player.symbol
// // 		}
// // 	}
// // 	});
// // 	})();
// // 	return {init};
// // })();
// // GameBoard.init();

// ///-----------///
// const Person = (name, age) => {
//     const getname = () => name;
//     const getage = () => age;
//     return { name, age, getname, getage };
// }

// const jeff = Person('jeff', 21);
// console.log(jeff.getname());
// jeff.name = "fuck"
// console.log(jeff.name);

//----------------------------------------------------//
//Some of these will be global to begin with, just move them into main objects later//

let GameBoard = (() => {
  let init = () => {
    let tileArray = new Array(9).fill(null);
    tileArray.forEach((tile) => {
      console.log("test");

      //   addEventListener(click, applySymbol);
      //   function applySymbol(player) {
      //     if (tile === null) {
      //       tile = player.symbol;
      //     }
      //   }
    });
  };

  const winStates = [
    ["X", "X", "X", null, null, null, null, null, null],
    [null, null, null, "X", "X", "X", null, null, null],
    [null, null, null, null, null, null, "X", "X", "X"],

    ["O", "O", "O", null, null, null, null, null, null],
    [null, null, null, "O", "O", "O", null, null, null],
    [null, null, null, null, null, null, "O", "O", "O"],
    //horizontal

    ["X", null, null, "X", null, null, "X", null, null],
    [null, "X", null, null, "X", null, null, "X", null],
    [null, null, "X", null, null, "X", null, null, "X"],

    ["O", null, null, "O", null, null, "O", null, null],
    [null, "O", null, null, "O", null, null, "O", null],
    [null, null, "O", null, null, "O", null, null, "O"],
    //vertical

    ["X", null, null, null, "X", null, null, null, "X"],
    [null, null, "X", null, "X", null, "X", null, null],

    ["O", null, null, null, "O", null, null, null, "O"],
    [null, null, "O", null, "O", null, "O", null, null],
  ];
  //diagonal

  const simpleWinStates = [
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

  return { init };
})();
GameBoard.init();
