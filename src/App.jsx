import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import Winning_Combinations from "./winning-combinations";

const currentYear = new Date().getFullYear();
const PLAYERS = { X: "Player 1", O: "Player 2" };
const Initial_GameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, players) {
  for (const combination of Winning_Combinations) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      return players[firstSquareSymbol];
    }
  }
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...Initial_GameBoard.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

export default function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const [players, setPlayers] = useState(PLAYERS);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);

  const hasDraw = gameTurns.length === 9 && !winner;

  function HandleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function HandlePlayerNameChange(symbol, newName) {
    setPlayers((preVal) => ({ ...preVal, [symbol]: newName }));
  }

  function HandleRestart() {
    setGameTurns([]);
  }

  return (
    <>
      <header>
        <h1>TIC-TAC-TOE</h1>
      </header>
      <main>
        <div id="game-container">
          <ol id="players" className="highlight-player">
            <Player
              isActive={activePlayer === "X"}
              initialName="Player 1"
              symbol="X"
              onChangeName={HandlePlayerNameChange}
            />
            <Player
              isActive={activePlayer === "O"}
              initialName="Player 2"
              symbol="O"
              onChangeName={HandlePlayerNameChange}
            />
          </ol>
          {(winner || hasDraw) && (
            <GameOver onRestart={HandleRestart} winner={winner} />
          )}
          <GameBoard board={gameBoard} onSelectSquare={HandleSelectSquare} />
        </div>
        <Log turns={gameTurns} />
      </main>
      <footer>
        <p id="copyright">Copyright &copy; {currentYear}</p>
      </footer>
    </>
  );
}
