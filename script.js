// let GameBoard = (() => {
// 	let tiles = new Array(9).fill(null);
// 	let click = (Player, tile) => tiles[tile] = Player.symbol
// 	return {tiles , click};
// })();
// console.log(GameBoard.tiles);
// //IIFE-wrapped, AKA a module



// let Player = (name, symbol) => {
// 	let outcome = (outcome) => console.log(name + " " + outcome);
// 	return { name, symbol, outcome };
// }
// //Factory function, since it 'returns' the needed
// const Orz = Player('orz', 'X');
// Orz.outcome('win');



////////////////////////////
// THIS HAPPENS (1) ON FIRST RUN  (2) WHEN RESETTING GAME - e.g., gameBoard.init
// ------------------------------------------------------

// let tileArray = [null, null, null...]

// add eventlistener to each tileDiv#id, ONCLICK, ()=>
// 	if (tileArray[tileDiv#id] === null){
// 	tileArray[tileDiv#id] = player.Symbol
// 	}
// 	else
// 	do nothing (or maybe a visual 'no' clue)
// }
////////////////////////////
let GameBoard = (() => {
	let init = (() => {
		let tileArray = new Array(9).fill(null);
		tileArray.forEach(func => {
			console.log("test");
		});
	})();
	return {init};
})();
GameBoard.init();