const MAP_WIDTH_CELLS = 15;
const MAP_HEIGHT_CELLS = 13;
const CELL_SIZE = 50;

const MAP_WIDTH_PX = MAP_WIDTH_CELLS * CELL_SIZE;
const MAP_HEIGHT_PX = MAP_HEIGHT_CELLS * CELL_SIZE;

const TILE = { EMPTY: 0, BLOCK: 1, WALL: 2 };

function generateMap() {
  const map = Array(MAP_HEIGHT_CELLS).fill(null).map(() => Array(MAP_WIDTH_CELLS).fill(TILE.EMPTY));
  for (let y = 1; y < MAP_HEIGHT_CELLS; y += 2) {
    for (let x = 1; x < MAP_WIDTH_CELLS; x += 2) {
      map[y][x] = TILE.WALL;
    }
  }
  for (let y = 0; y < MAP_HEIGHT_CELLS; y++) {
    for (let x = 0; x < MAP_WIDTH_CELLS; x++) {
      if (map[y][x] === TILE.EMPTY) {
        const isCorner = (y < 2 && x < 2) || (y < 2 && x > MAP_WIDTH_CELLS - 3) ||
                         (y > MAP_HEIGHT_CELLS - 3 && x < 2) || (y > MAP_HEIGHT_CELLS - 3 && x > MAP_WIDTH_CELLS - 3);
        if (!isCorner) {
          map[y][x] = Math.random() < 0.75 ? TILE.BLOCK : TILE.EMPTY;
        }
      }
    }
  }
  return map;
}

function createInitialGameState(players) {
    const map = generateMap();
    const playerSize = 40;
    const initialPositions = [
        { x: 0, y: 0 },
        { x: MAP_WIDTH_PX - playerSize, y: 0 },
        { x: 0, y: MAP_HEIGHT_PX - playerSize },
        { x: MAP_WIDTH_PX - playerSize, y: MAP_HEIGHT_PX - playerSize },
    ];
    const gamePlayers = players.map((p, i) => ({
        id: p.id, nickname: p.nickname, ...initialPositions[i],
        size: playerSize, lives: 3, speed: 2, bombs: 1, flame: 1,
    }));
    return { map, players: gamePlayers, bombs: [], explosions: [] };
}

function handlePlaceBomb(player, gameState) {
    const { players, bombs } = gameState;
    const playerState = players.find(p => p.id === player.id);
    const cellX = Math.floor((playerState.x + playerState.size / 2) / CELL_SIZE);
    const cellY = Math.floor((playerState.y + playerState.size / 2) / CELL_SIZE);
    const alreadyHasBomb = bombs.some(b => b.x === cellX && b.y === cellY);
    if (playerState.bombs > bombs.filter(b => b.ownerId === player.id).length && !alreadyHasBomb) {
        gameState.bombs.push({
            ownerId: player.id, x: cellX, y: cellY,
            timer: 3, flame: playerState.flame,
        });
    }
}

function handleExplosions(gameState) {
    const { bombs, map, players, explosions } = gameState;
    const explodingBombs = bombs.filter(b => b.timer <= 0);
    if (explodingBombs.length === 0) return;
    const newExplosionCells = new Set();
    explodingBombs.forEach(bomb => {
        newExplosionCells.add(`${bomb.x},${bomb.y}`);
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        directions.forEach(([dx, dy]) => {
            for (let i = 1; i <= bomb.flame; i++) {
                const x = bomb.x + dx * i;
                const y = bomb.y + dy * i;
                if (x < 0 || x >= MAP_WIDTH_CELLS || y < 0 || y >= MAP_HEIGHT_CELLS) break;
                const tile = map[y][x];
                if (tile === TILE.WALL) break;
                newExplosionCells.add(`${x},${y}`);
                if (tile === TILE.BLOCK) {
                    map[y][x] = TILE.EMPTY;
                    break;
                }
            }
        });
    });
    if (newExplosionCells.size > 0) {
        const explosionData = { cells: Array.from(newExplosionCells).map(s => ({x: parseInt(s.split(',')[0]), y: parseInt(s.split(',')[1])})), timer: 0.5 };
        explosions.push(explosionData);
        players.forEach(player => {
            const playerCellX = Math.floor((player.x + player.size / 2) / CELL_SIZE);
            const playerCellY = Math.floor((player.y + player.size / 2) / CELL_SIZE);
            if (newExplosionCells.has(`${playerCellX},${playerCellY}`)) {
                player.lives--;
            }
        });
    }
    gameState.bombs = bombs.filter(b => b.timer > 0);
}

function isColliding(x, y, size, map) {
    const points = [
        { x: x, y: y },                         // Top-left
        { x: x + size - 1, y: y },                  // Top-right
        { x: x, y: y + size - 1 },                  // Bottom-left
        { x: x + size - 1, y: y + size - 1 },          // Bottom-right
        { x: x + size / 2, y: y },                  // Top-middle
        { x: x + size / 2, y: y + size - 1 },          // Bottom-middle
        { x: x, y: y + size / 2 },                  // Left-middle
        { x: x + size - 1, y: y + size / 2 },          // Right-middle
    ];

    for (const point of points) {
        const cellX = Math.floor(point.x / CELL_SIZE);
        const cellY = Math.floor(point.y / CELL_SIZE);

        if (cellX < 0 || cellX >= MAP_WIDTH_CELLS || cellY < 0 || cellY >= MAP_HEIGHT_CELLS) {
            return true;
        }

        const tile = map[cellY][cellX];
        if (tile === TILE.WALL || tile === TILE.BLOCK) {
            return true;
        }
    }
    return false;
}

function handlePlayerMove(player, direction, gameState) {
    const { speed, size } = player;
    const { map } = gameState;

    let newX = player.x;
    let newY = player.y;

    if (direction.up) newY -= speed;
    if (direction.down) newY += speed;
    if (direction.left) newX -= speed;
    if (direction.right) newX += speed;

    const tempPlayer = { ...player, x: newX, y: player.y };
    if (!isColliding(tempPlayer.x, tempPlayer.y, size, map)) {
        player.x = newX;
    }

    const tempPlayer2 = { ...player, y: newY };
    if (!isColliding(tempPlayer2.x, tempPlayer2.y, size, map)) {
        player.y = newY;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + size > MAP_WIDTH_PX) player.x = MAP_WIDTH_PX - size;
    if (player.y < 0) player.y = 0;
    if (player.y + size > MAP_HEIGHT_PX) player.y = MAP_HEIGHT_PX - size;
}

module.exports = {
  createInitialGameState,
  handlePlayerMove,
  handlePlaceBomb,
  handleExplosions,
  TILE,
};
