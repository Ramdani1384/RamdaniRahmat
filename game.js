const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const rows = 20;
const cols = 10;
let grid = [];
let currentShape = [];
let currentPosition = 4;
let currentRotation = 0;
let score = 0;

// Create the board
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.push(cell);
    board.appendChild(cell);
  }
}

// Define Tetris shapes
const shapes = [
  { shape: [[1, cols + 1, cols * 2 + 1, cols * 3 + 1]], color: "cyan" }, // I
  { shape: [[0, 1, cols + 1, cols * 2 + 1]], color: "blue" }, // L
  { shape: [[0, 1, cols, cols + 1]], color: "yellow" }, // O
  { shape: [[1, cols, cols + 1, cols + 2]], color: "purple" }, // T
  { shape: [[0, 1, cols + 1, cols + 2]], color: "red" } // Z
];

let currentTetromino = { ...shapes[Math.floor(Math.random() * shapes.length)] };

// Draw the shape
function draw() {
  currentTetromino.shape[currentRotation].forEach(index => {
    const cell = grid[currentPosition + index];
    cell.classList.add("active");
    cell.style.backgroundColor = currentTetromino.color;
  });
}

// Remove the shape
function undraw() {
  currentTetromino.shape[currentRotation].forEach(index => {
    const cell = grid[currentPosition + index];
    cell.classList.remove("active");
    cell.style.backgroundColor = "";
  });
}

// Move the shape down
function moveDown() {
  undraw();
  currentPosition += cols;
  if (isAtBottom() || isColliding()) {
    currentPosition -= cols;
    stopShape();
    return;
  }
  draw();
}

// Move the shape left
function moveLeft() {
  undraw();
  const isAtLeftEdge = currentTetromino.shape[currentRotation].some(
    index => (currentPosition + index) % cols === 0
  );
  if (!isAtLeftEdge) currentPosition--;
  if (isColliding()) currentPosition++;
  draw();
}

// Move the shape right
function moveRight() {
  undraw();
  const isAtRightEdge = currentTetromino.shape[currentRotation].some(
    index => (currentPosition + index + 1) % cols === 0
  );
  if (!isAtRightEdge) currentPosition++;
  if (isColliding()) currentPosition--;
  draw();
}

// Rotate the shape
// Tambahkan variabel untuk melacak status permainan
let gameOver = false;

// Perbarui fungsi stopShape untuk memeriksa kondisi game over
function stopShape() {
  currentTetromino.shape[currentRotation].forEach(index => {
    const cell = grid[currentPosition + index];
    cell.classList.add("stopped");
    cell.style.backgroundColor = currentTetromino.color; // Retain color when stopped
  });

  // Cek apakah ada blok di baris pertama
  if (currentTetromino.shape[currentRotation].some(index => currentPosition + index < cols)) {
    endGame();
    return;
  }

  checkRows();
  spawnNewShape();
}

// Fungsi untuk mengakhiri permainan
function endGame() {
  gameOver = true;
  clearInterval(gameInterval); // Hentikan pergerakan otomatis
  alert("Game Over!"); // Tampilkan pesan Game Over
  showRestartOption(); // Tampilkan tombol restart
}

// Fungsi untuk menampilkan tombol restart
function showRestartOption() {
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.style.position = "absolute";
    restartButton.style.top = "50%";
    restartButton.style.left = "50%";
    restartButton.style.transform = "translate(-50%, -50%)";
    restartButton.style.padding = "10px 20px";
    restartButton.style.fontSize = "18px";
    restartButton.style.backgroundColor = "#4CAF50";
    restartButton.style.color = "white";
    restartButton.style.border = "none";
    restartButton.style.cursor = "pointer";
    document.body.appendChild(restartButton);
  
    restartButton.addEventListener("click", () => {
      document.body.removeChild(restartButton); // Hapus tombol restart
      resetGame(); // Mulai ulang permainan
    });
  }
  
  // Fungsi untuk mereset permainan
  function resetGame() {
    // Bersihkan grid
    grid.forEach(cell => {
      cell.classList.remove("stopped", "active");
      cell.style.backgroundColor = "";
    });
  
    // Reset variabel
    currentPosition = 4;
    currentRotation = 0;
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = "Score: 0";
  
    // Mulai permainan lagi
    spawnNewShape();
    gameInterval = setInterval(moveDown, 1000);
  }
  

// Check if the shape is at the bottom
function isAtBottom() {
  return currentTetromino.shape[currentRotation].some(
    index => currentPosition + index + cols >= rows * cols
  );
}

// Check for collisions with other shapes
function isColliding() {
  return currentTetromino.shape[currentRotation].some(
    index => grid[currentPosition + index].classList.contains("stopped")
  );
}

// Check for and remove full rows
function checkRows() {
  for (let r = 0; r < rows; r++) {
    const row = Array.from({ length: cols }, (_, i) => r * cols + i);
    if (row.every(index => grid[index].classList.contains("stopped"))) {
      row.forEach(index => {
        grid[index].classList.remove("stopped");
        grid[index].style.backgroundColor = "";
      });
      const removed = grid.splice(r * cols, cols);
      grid = removed.concat(grid);
      grid.forEach(cell => board.appendChild(cell));
      score += 10;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  }
}

// Spawn a new shape
function spawnNewShape() {
  currentTetromino = { ...shapes[Math.floor(Math.random() * shapes.length)] };
  currentPosition = 4;
  currentRotation = 0;
  draw();
}

// Start the game
function startGame() {
  spawnNewShape();
  draw();
  setInterval(moveDown, 1000);
}

// Listen for keyboard input
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") moveLeft();
  if (event.key === "ArrowRight") moveRight();
  if (event.key === "ArrowDown") moveDown();
  if (event.key === "ArrowUp") rotate();
});

// Start the game
startGame();
