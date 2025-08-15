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

function handlePlayerMove(player, direction, gameState) {
    let { x, y, speed, size } = player;
    const { map } = gameState;
    const newPos = { x, y };
    if (direction.up) newPos.y -= speed;
    if (direction.down) newPos.y += speed;
    if (direction.left) newPos.x -= speed;
    if (direction.right) newPos.x += speed;
    if (newPos.x < 0) newPos.x = 0;
    if (newPos.y < 0) newPos.y = 0;
    if (newPos.x + size > MAP_WIDTH_PX) newPos.x = MAP_WIDTH_PX - size;
    if (newPos.y + size > MAP_HEIGHT_PX) newPos.y = MAP_HEIGHT_PX - size;
    const corners = [
        { x: newPos.x, y: newPos.y }, { x: newPos.x + size, y: newPos.y },
        { x: newPos.x, y: newPos.y + size }, { x: newPos.x + size, y: newPos.y + size },
    ];
    let collision = false;
    for (const corner of corners) {
        const cellX = Math.floor(corner.x / CELL_SIZE);
        const cellY = Math.floor(corner.y / CELL_SIZE);
        if (map[cellY] && map[cellY][cellX] && (map[cellY][cellX] === TILE.WALL || map[cellY][cellX] === TILE.BLOCK)) {
            collision = true;
            break;
        }
    }
    if (!collision) {
        player.x = newPos.x;
        player.y = newPos.y;
    }
}

module.exports = {
  createInitialGameState,
  handlePlayerMove,
  handlePlaceBomb,
  handleExplosions,
  TILE,
};
