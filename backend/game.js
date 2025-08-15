const MAP_WIDTH_CELLS = 15;
const MAP_HEIGHT_CELLS = 13;
const CELL_SIZE = 50; // The size of one cell in pixels

const MAP_WIDTH_PX = MAP_WIDTH_CELLS * CELL_SIZE;
const MAP_HEIGHT_PX = MAP_HEIGHT_CELLS * CELL_SIZE;

// Tile types
const TILE = {
  EMPTY: 0,
  BLOCK: 1,
  WALL: 2,
};

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
    const playerSize = 40; // Player's hitbox size in pixels
    const initialPositions = [
        { x: 0, y: 0 },
        { x: MAP_WIDTH_PX - playerSize, y: 0 },
        { x: 0, y: MAP_HEIGHT_PX - playerSize },
        { x: MAP_WIDTH_PX - playerSize, y: MAP_HEIGHT_PX - playerSize },
    ];

    const gamePlayers = players.map((p, i) => ({
        id: p.id,
        nickname: p.nickname,
        ...initialPositions[i],
        size: playerSize,
        lives: 3,
        speed: 2, // Player speed in pixels per frame
        bombs: 1,
        flame: 1,
    }));

    return {
        map,
        players: gamePlayers,
        bombs: [],
    };
}

function handlePlaceBomb(player, gameState) {
    const { players, bombs, map } = gameState;
    const playerState = players.find(p => p.id === player.id);

    // Prevent placing bombs on top of each other
    const cellX = Math.floor(playerState.x / 50);
    const cellY = Math.floor(playerState.y / 50);
    const alreadyHasBomb = bombs.some(b => b.x === cellX && b.y === cellY);

    if (playerState.bombs > bombs.filter(b => b.ownerId === player.id).length && !alreadyHasBomb) {
        const newBomb = {
            ownerId: player.id,
            x: cellX,
            y: cellY,
            timer: 3, // Bomb explodes after 3 seconds
            flame: playerState.flame,
        };
        gameState.bombs.push(newBomb);
    }
}

function handlePlayerMove(player, direction, gameState) {
    let { x, y, speed, size } = player;
    const { map } = gameState;

    const newPos = { x, y };

    if (direction.up) newPos.y -= speed;
    if (direction.down) newPos.y += speed;
    if (direction.left) newPos.x -= speed;
    if (direction.right) newPos.x += speed;

    // Map boundary collision
    if (newPos.x < 0) newPos.x = 0;
    if (newPos.y < 0) newPos.y = 0;
    if (newPos.x + size > MAP_WIDTH_PX) newPos.x = MAP_WIDTH_PX - size;
    if (newPos.y + size > MAP_HEIGHT_PX) newPos.y = MAP_HEIGHT_PX - size;

    // World collision (walls and blocks)
    // Check all 4 corners of the player's bounding box
    const corners = [
        { x: newPos.x, y: newPos.y },
        { x: newPos.x + size, y: newPos.y },
        { x: newPos.x, y: newPos.y + size },
        { x: newPos.x + size, y: newPos.y + size },
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
  TILE,
};
