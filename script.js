let GameBoard = (() => {
	let tiles = new Array(9).fill(null);
	let click = (Player, tile) => tiles[tile] = Player.symbol
	return {tiles , click};
})();
console.log(GameBoard.tiles);
//IIFE-wrapped, AKA a module



let Player = (name, symbol) => {
	let outcome = (outcome) => console.log(name + " " + outcome);
	return { name, symbol, outcome };
}
//Factory function, since it 'returns' the needed
const Orz = Player('orz', 'X');
Orz.outcome('win');