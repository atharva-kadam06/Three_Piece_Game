(function() {
    // Game configuration
    const GRID_SIZE = 3;
    
    // Game state
    let board = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    let playerTurn = 1;
    let player1Pieces = [];
    let player2Pieces = [];
    let gameStatus = "Player X's turn";
    let winner = 0;
    let winningLine = [];
    let showFireworks = false;
    let gameStarted = false;
    let player1Name = "Player X";
    let player2Name = "Player O";
    let removedPiece = null;
    
    // DOM element references
    const gameContainer = document.getElementById('game-container');
    
    // Initialize the game
    function init() {
      renderScreen();
    }
    
    // Render the appropriate screen based on game state
    function renderScreen() {
      if (!gameStarted) {
        renderNameInputScreen();
      } else {
        renderGameScreen();
      }
    }
    
    // Render name input screen
    function renderNameInputScreen() {
      const screen = `
        <div class="game-center">
          <div class="game-logo">
            <div class="title-main">3 PIECE</div>
            <div class="title-sub">STRATEGY GAME</div>
            <div class="logo-icons">
              <div class="logo-x">X</div>
              <div class="logo-o">O</div>
            </div>
          </div>
          
          <div class="name-inputs">
            <div class="input-group">
              <label class="input-label">Player X Name:</label>
              <input 
                type="text" 
                id="player1-name-input" 
                class="input-field" 
                value="${player1Name}"
                placeholder="Enter name for Player X"
              >
            </div>
            
            <div class="input-group">
              <label class="input-label">Player O Name:</label>
              <input 
                type="text" 
                id="player2-name-input" 
                class="input-field" 
                value="${player2Name}"
                placeholder="Enter name for Player O"
              >
            </div>
          </div>
          
          <button id="start-game-btn" class="btn btn-start-game">
            <span class="btn-pulse"></span>
            <span class="btn-text">START GAME</span>
          </button>
        </div>
      `;
      
      gameContainer.innerHTML = screen;
      
      // Add event listeners
      document.getElementById('player1-name-input').addEventListener('input', function(e) {
        player1Name = e.target.value || "Player X";
      });
      
      document.getElementById('player2-name-input').addEventListener('input', function(e) {
        player2Name = e.target.value || "Player O";
      });
      
      document.getElementById('start-game-btn').addEventListener('click', startGame);
    }
    
    // Render game screen
    function renderGameScreen() {
      // Create fireworks if winner
      let fireworksHTML = '';
      if (showFireworks) {
        fireworksHTML = `<div class="fireworks" id="fireworks"></div>`;
      }
      
      const screen = `
        ${fireworksHTML}
        <div class="game-center">
          <div class="game-logo">
            <div class="title-main">3 PIECE</div>
            <div class="title-sub">STRATEGY GAME</div>
            <div class="logo-icons">
              <div class="logo-x">X</div>
              <div class="logo-o">O</div>
            </div>
          </div>
          
          <div class="game-status">
            <div class="status-container">
              <span class="status-text ${winner !== 0 ? (winner === 1 ? 'text-player1' : 'text-player2') : playerTurn === 1 ? 'text-player1' : 'text-player2'}">
                ${gameStatus}
              </span>
            </div>
          </div>
          
          <div class="players-container">
            <div class="player">
              <div class="player-icon player1-icon">X</div>
              <span class="player-name">${player1Name} (${player1Pieces.length}/3)</span>
            </div>
            <div class="player">
              <div class="player-icon player2-icon">O</div>
              <span class="player-name">${player2Name} (${player2Pieces.length}/3)</span>
            </div>
          </div>
          
          <div class="game-board" id="game-board">
            ${renderBoard()}
          </div>
          
          <div class="buttons-container">
            <button id="new-game-btn" class="btn btn-new-game">
              <span class="btn-pulse"></span>
              <span class="btn-text">NEW GAME</span>
            </button>
            
            <button id="change-names-btn" class="btn btn-change-names">
              <span class="btn-pulse"></span>
              <span class="btn-text">CHANGE NAMES</span>
            </button>
          </div>
          
          <div class="rules-container">
            <p class="rules-title"><strong>Rules:</strong></p>
            <ul class="rules-list">
              <li>Each player can place up to 3 pieces on the board</li>
              <li>After placing 3 pieces, the oldest piece is removed when placing a new one</li>
              <li>Get three in a row (horizontally, vertically, or diagonally) to win</li>
            </ul>
          </div>
        </div>
      `;
      
      gameContainer.innerHTML = screen;
      
      // Add fireworks if winner
      if (showFireworks) {
        createFireworks();
      }
      
      // Add event listeners
      document.getElementById('new-game-btn').addEventListener('click', resetGame);
      document.getElementById('change-names-btn').addEventListener('click', changeNames);
      
      // Add event listeners to each cell
      const cells = document.querySelectorAll('.game-cell');
      cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.addEventListener('click', () => handleCellClick(row, col));
      });
    }
    
    // Render the game board
    function renderBoard() {
      let boardHTML = '';
      
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const cellValue = board[row][col];
          const isWinning = isWinningCell(row, col);
          const isRemoved = isRemovedCell(row, col);
          const cellClass = (row + col) % 2 === 0 ? 'cell-even' : 'cell-odd';
          
          boardHTML += `
            <div 
              class="game-cell ${cellClass} ${isWinning ? 'cell-winning' : ''}"
              data-row="${row}"
              data-col="${col}"
            >
          `;
          
          if (cellValue === 1) {
            boardHTML += `
              <div class="cell-piece piece-x ${isWinning ? 'piece-winning' : ''} ${isRemoved ? 'piece-removed' : ''}">
                X
              </div>
            `;
          } else if (cellValue === 2) {
            boardHTML += `
              <div class="cell-piece piece-o ${isWinning ? 'piece-winning' : ''} ${isRemoved ? 'piece-removed' : ''}">
                O
              </div>
            `;
          }
          
          boardHTML += `</div>`;
        }
      }
      
      return boardHTML;
    }
    
    // Check if a cell is part of the winning line
    function isWinningCell(row, col) {
      return winningLine.some(([r, c]) => r === row && c === col);
    }
    
    // Check if a cell is about to be removed
    function isRemovedCell(row, col) {
      return removedPiece && removedPiece[0] === row && removedPiece[1] === col;
    }
    
    // Start game with player names
    function startGame() {
      resetGame();
      gameStarted = true;
      gameStatus = `${player1Name}'s turn`;
      renderScreen();
    }
    
    // Reset game
    function resetGame() {
      board = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
      playerTurn = 1;
      player1Pieces = [];
      player2Pieces = [];
      gameStatus = `${player1Name}'s turn`;
      winner = 0;
      winningLine = [];
      showFireworks = false;
      removedPiece = null;
      renderScreen();
    }
    
    // Change player names
    function changeNames() {
      gameStarted = false;
      renderScreen();
    }
    
    // Handle cell click
    function handleCellClick(row, col) {
      if (winner !== 0 || board[row][col] !== 0) return;
      
      const newBoard = board.map(row => [...row]);
      
      if (playerTurn === 1) {
        if (player1Pieces.length === 3) {
          const [oldRow, oldCol] = player1Pieces[0];
          removedPiece = [oldRow, oldCol];
          renderScreen(); // Show removal animation
          
          setTimeout(() => {
            newBoard[oldRow][oldCol] = 0;
            board = newBoard;
            player1Pieces = [...player1Pieces.slice(1), [row, col]];
            newBoard[row][col] = 1;
            
            checkWinAndUpdateState(newBoard, 1);
          }, 500);
        } else {
          player1Pieces.push([row, col]);
          newBoard[row][col] = 1;
          
          checkWinAndUpdateState(newBoard, 1);
        }
      } else {
        if (player2Pieces.length === 3) {
          const [oldRow, oldCol] = player2Pieces[0];
          removedPiece = [oldRow, oldCol];
          renderScreen(); // Show removal animation
          
          setTimeout(() => {
            newBoard[oldRow][oldCol] = 0;
            board = newBoard;
            player2Pieces = [...player2Pieces.slice(1), [row, col]];
            newBoard[row][col] = 2;
            
            checkWinAndUpdateState(newBoard, 2);
          }, 500);
        } else {
          player2Pieces.push([row, col]);
          newBoard[row][col] = 2;
          
          checkWinAndUpdateState(newBoard, 2);
        }
      }
    }
    
    // Check for win and update game state
    function checkWinAndUpdateState(newBoard, player) {
      board = newBoard;
      const winResult = checkWinner(newBoard, player);
      
      if (winResult.hasWon) {
        winner = player;
        winningLine = winResult.line;
        gameStatus = player === 1 ? `${player1Name} wins!` : `${player2Name} wins!`;
        triggerWinCelebration();
      } else {
        playerTurn = playerTurn === 1 ? 2 : 1;
        gameStatus = playerTurn === 1 ? `${player1Name}'s turn` : `${player2Name}'s turn`;
      }
      
      removedPiece = null;
      renderScreen();
    }
    
    // Check for a win (three in a row) and return winning line coordinates
    function checkWinner(board, player) {
      // Check rows
      for (let row = 0; row < GRID_SIZE; row++) {
        if (board[row].every(cell => cell === player)) {
          return {
            hasWon: true,
            line: [[row, 0], [row, 1], [row, 2]]
          };
        }
      }
      
      // Check columns
      for (let col = 0; col < GRID_SIZE; col++) {
        if (board.every(row => row[col] === player)) {
          return {
            hasWon: true,
            line: [[0, col], [1, col], [2, col]]
          };
        }
      }
      
      // Check diagonals
      if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return {
          hasWon: true,
          line: [[0, 0], [1, 1], [2, 2]]
        };
      }
      
      if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return {
          hasWon: true,
          line: [[0, 2], [1, 1], [2, 0]]
        };
      }
      
      return { hasWon: false, line: [] };
    }
    
    // Trigger win celebration
    function triggerWinCelebration() {
      showFireworks = true;
      
      // Auto-hide fireworks after 5 seconds
      setTimeout(() => {
        showFireworks = false;
        renderScreen();
      }, 5000);
    }
    
    // Create fireworks effect
    function createFireworks() {
      const fireworksContainer = document.getElementById('fireworks');
      
      // Create firework explosions
      for (let i = 0; i < 15; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        const size = Math.random() * 8 + 4;
        const hue = Math.random() * 360;
        
        firework.style.top = `${Math.random() * 100}%`;
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.width = `${size}px`;
        firework.style.height = `${size}px`;
        firework.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
        firework.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px ${Math.random() * 10 + 5}px hsl(${hue}, 100%, 50%)`;
        firework.style.opacity = Math.random() * 0.5 + 0.5;
        firework.style.animationDuration = `${Math.random() * 2 + 1}s`;
        firework.style.animationDelay = `${Math.random() * 0.5}s`;
        
        fireworksContainer.appendChild(firework);
      }
      
      // Create sparks
      for (let i = 0; i < 25; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        
        const hue = Math.random() * 360;
        
        spark.style.top = `${Math.random() * 100}%`;
        spark.style.left = `${Math.random() * 100}%`;
        spark.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
        spark.style.boxShadow = `0 0 ${Math.random() * 20}px 2px hsl(${hue}, 100%, 50%)`;
        spark.style.animationDuration = `${Math.random() * 2 + 1}s`;
        spark.style.animationDelay = `${Math.random() * 2}s`;
        
        fireworksContainer.appendChild(spark);
      }
    }
    
    // Initialize game
    init();
  })();