// let GameBoard = (() => {
// 	let tiles = new Array(9).fill(null);
// 	let click = (Player, tile) => tiles[tile] = Player.symbol
// 	return {tiles , click};
// })();
// console.log(GameBoard.tiles);
// //IIFE-wrapped, AKA a module



let player = (name, symbol) => {
		return { name, symbol };
}
//Factory function, since it 'returns' the needed
//doesn't use "new", which is how it's a 'factory function'
const player1 = player('Player 1 (X)', 'X');
const player2 = player('Player 2 (O)', 'O');
console.log(player2.symbol);
document.getElementById("2").innerText = player2.symbol //



////////////////////////////
// THIS HAPPENS (1) ON FIRST RUN  (2) WHEN RESETTING GAME - e.g., gameBoard.init
// ------------------------------------------------------

// let tileArray = [null, null, null...]

// add eventlistener to each tileDiv#id, ONCLICK, ()=>
// 	if (tileArray[tileDiv#id] === null){
// 	tileArray[tileDiv#id] = player.Symbol
// 	}
// 	else
// 	do nothing (or maybe a visual 'no' clue in case of existing symbol)
// }
////////////////////////////
let GameBoard = (() => {
	let init = (() => {
		let tileArray = new Array(9).fill(null);
		tileArray.forEach(tile => {
			console.log("test");
			
			addEventListener(click, applySymbol);
			function applySymbol(player){
			if (tile === null){
				tile = player.symbol
		}
	}
	});
	})();
	return {init};
})();
GameBoard.init();