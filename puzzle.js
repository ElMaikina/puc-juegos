// Area donde ocurre el movimiento del personaje
const gameCanvas = document.getElementById("game");
const gameContext = gameCanvas.getContext("2d");

// El tamano de las celdas del juego
const gridSize = 15;
const cellSize = gameCanvas.width / gridSize;
let level = 1;

// El jugador empieza desde el centro del mapa
let x = Math.floor(gridSize / 2);
let y = Math.floor(gridSize / 2);

// El rastro celeste que deja el jugador
const path = [{ x, y }];

// El nivel 15 tiene controles aleatorios
let randomControlMap = null;

// Muestra el nivel actual en la vista superior
document.getElementById("info").textContent = `Nivel ${level} - ${getControlType(level)}`;
draw();

document.addEventListener("keydown", (e) => {
  const move = getMovement(e.key, level);
  if (move) {
    x = Math.max(0, Math.min(gridSize - 1, x + move.dx));
    y = Math.max(0, Math.min(gridSize - 1, y + move.dy));
    path.push({ x, y });
    draw();
  }

  // Avanza al siguiente nivel con Enter
  if (e.key === "Enter") {
    if (level < 15) {
      level++;
      x = y = Math.floor(gridSize / 2);
      path.length = 0;
      path.push({ x, y });

      // Resetear controles aleatorios al entrar al nivel 15
      if (level === 15) {
        randomControlMap = null;
      }

      document.getElementById("info").textContent = `Nivel ${level} - ${getControlType(level)}`;
      draw();
    } else {
      alert("¡Has completado todos los niveles!");
    }
  }
});



function getMovement(key, lvl) {
  const normal = {
    ArrowUp: { dx: 0, dy: -1 },
    ArrowDown: { dx: 0, dy: 1 },
    ArrowLeft: { dx: -1, dy: 0 },
    ArrowRight: { dx: 1, dy: 0 },
  };

  switch (true) {
    case lvl <= 7:
      return normal[key];
    case lvl <= 10:
      return invertDirection(normal[key]);
    case lvl <= 12:
      return rotateDirection(normal[key], "clockwise");
    case lvl <= 14:
      return rotateDirection(normal[key], "counter");
    case lvl === 15:
      if (!randomControlMap) {
        randomControlMap = {};
        const directions = Object.values(normal);
        const keys = Object.keys(normal);
        // Mezcla aleatoria
        const shuffled = directions.sort(() => 0.5 - Math.random());
        keys.forEach((key, i) => {
          randomControlMap[key] = shuffled[i];
        });
      }
      return randomControlMap[key];
    default:
      return null;
  }
}


function invertDirection(move) {
  if (!move) return null;
  return { dx: -move.dx, dy: -move.dy };
}

function rotateDirection(move, direction) {
  if (!move) return null;
  if (direction === "clockwise") return { dx: -move.dy, dy: move.dx };
  if (direction === "counter") return { dx: move.dy, dy: -move.dx };
  return move;
}

function randomDirection() {
  const options = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];
  return options[Math.floor(Math.random() * options.length)];
}

function getControlType(lvl) {
  if (lvl <= 7) return "Controles normales";
  if (lvl <= 10) return "Controles invertidos";
  if (lvl <= 12) return "Controles rotados en sentido horario";
  if (lvl <= 14) return "Controles rotados en sentido antihorario";
  if (lvl === 15) return "Controles aleatorios";
  return "Fin del juego";
}

function draw() {
  gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  // Dibujar grid
  gameContext.strokeStyle = "#ccc";
  for (let i = 0; i <= gridSize; i++) {
    gameContext.beginPath();
    gameContext.moveTo(i * cellSize, 0);
    gameContext.lineTo(i * cellSize, gameCanvas.height);
    gameContext.stroke();

    gameContext.beginPath();
    gameContext.moveTo(0, i * cellSize);
    gameContext.lineTo(gameCanvas.width, i * cellSize);
    gameContext.stroke();
  }

  // Dibujar trayectoria
  gameContext.fillStyle = "#3498db";
  path.forEach(pos => {
    gameContext.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
  });

  // Punto inicial
  gameContext.fillStyle = "#e74c3c";
  gameContext.fillRect(Math.floor(gridSize / 2) * cellSize, Math.floor(gridSize / 2) * cellSize, cellSize, cellSize);
}

document.getElementById("reset").addEventListener("click", () => {
  x = y = Math.floor(gridSize / 2);
  path.length = 0;
  path.push({ x, y });
  draw();
});
