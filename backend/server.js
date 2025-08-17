const WebSocket = require('ws');
const { createInitialGameState, handlePlayerMove, handlePlaceBomb, handleExplosions } = require('./game.js');

const wss = new WebSocket.Server({ port: 8080 });
console.log('Server started on port 8080');

// --- State ---
let lobbyState = {
  status: 'waiting',
  players: [],
  lobbyTimer: null,
  countdownTimer: null,
};
let mainGameState = null;
let gameLoopInterval = null;

const LOBBY_WAIT_TIME = 20000;
const COUNTDOWN_TIME = 10;
const GAME_TICK_RATE = 1000 / 60;

// --- Helper Functions ---
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(message);
  });
}

function broadcastLobbyState() {
  broadcast({
    type: 'UPDATE_LOBBY_STATE',
    payload: {
      status: lobbyState.status,
      players: lobbyState.players.map(p => ({ id: p.id, nickname: p.nickname })),
      countdown: lobbyState.countdownTimer ? lobbyState.countdownTimer.remaining : null,
    }
  });
}

function startGame() {
  console.log('Game starting!');
  lobbyState.status = 'inprogress';
  mainGameState = createInitialGameState(lobbyState.players);
  gameLoopInterval = setInterval(gameTick, GAME_TICK_RATE);
  broadcast({ type: 'START_GAME', payload: mainGameState });
}

function gameTick() {
    if (!mainGameState) return;

    // 1. Decrement bomb timers
    mainGameState.bombs.forEach(bomb => bomb.timer -= GAME_TICK_RATE / 1000);

    // 2. Handle explosions
    handleExplosions(mainGameState);

    // 3. Decrement explosion effect timers
    mainGameState.explosions.forEach(exp => exp.timer -= GAME_TICK_RATE / 1000);
    mainGameState.explosions = mainGameState.explosions.filter(exp => exp.timer > 0);

    // 4. Broadcast the new state
    broadcast({ type: 'GAME_STATE_UPDATE', payload: mainGameState });

    // 5. Check for win condition
    const alivePlayers = mainGameState.players.filter(p => p.isAlive);
    if (alivePlayers.length <= 1) {
        clearInterval(gameLoopInterval);
        const winner = alivePlayers.length === 1 ? alivePlayers[0] : null;
        console.log('Game Over! Winner:', winner ? winner.nickname : 'Draw');
        broadcast({
            type: 'GAME_OVER',
            payload: {
                winner: winner ? { id: winner.id, nickname: winner.nickname } : null
            }
        });
        mainGameState = null;
    }
}

function startGameCountdown() {
  if (lobbyState.status === 'countdown') return;
  clearTimeout(lobbyState.lobbyTimer);
  lobbyState.lobbyTimer = null;
  lobbyState.status = 'countdown';
  let remaining = COUNTDOWN_TIME;
  lobbyState.countdownTimer = {
    interval: setInterval(() => {
      remaining--;
      broadcast({ type: 'UPDATE_COUNTDOWN', payload: remaining });
      if (remaining <= 0) {
        clearInterval(lobbyState.countdownTimer.interval);
        startGame();
      }
    }, 1000),
    remaining: remaining
  };
  broadcastLobbyState();
  console.log('Starting 10-second countdown...');
}

// --- WebSocket Server Logic ---
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (rawMessage) => {
    const data = JSON.parse(rawMessage);
    const player = lobbyState.players.find(p => p.ws === ws);

    switch (data.type) {
      case 'JOIN_GAME':
        if (lobbyState.players.length < 2 && lobbyState.status === 'waiting') {
          const newPlayer = { id: lobbyState.players.length + 1, ws: ws, nickname: data.payload.nickname };
          lobbyState.players.push(newPlayer);
          ws.playerId = newPlayer.id;
          broadcastLobbyState();
          if (lobbyState.players.length === 4) startGameCountdown();
          else if (lobbyState.players.length >= 2 && !lobbyState.lobbyTimer) {
            lobbyState.lobbyTimer = setTimeout(startGameCountdown, LOBBY_WAIT_TIME);
          }
        }
        break;
      case 'SEND_CHAT_MESSAGE':
        if (player) broadcast({ type: 'NEW_CHAT_MESSAGE', payload: { nickname: player.nickname, message: data.payload.message } });
        break;
      case 'MOVE_PLAYER':
        if (mainGameState && player) {
            const gamePlayer = mainGameState.players.find(p => p.id === player.id);
            if (gamePlayer) handlePlayerMove(gamePlayer, data.payload, mainGameState);
        }
        break;
      case 'PLACE_BOMB':
        if (mainGameState && player) handlePlaceBomb(player, mainGameState);
        break;
    }
  });

  ws.on('close', () => {
    const player = lobbyState.players.find(p => p.ws === ws);
    if (player) {
        console.log(`Player ${player.nickname} disconnected`);
        lobbyState.players = lobbyState.players.filter(p => p.id !== player.id);
        if (lobbyState.status !== 'inprogress') {
            if (lobbyState.players.length < 2) {
                clearTimeout(lobbyState.lobbyTimer);
                lobbyState.lobbyTimer = null;
            }
            if (lobbyState.status === 'countdown') {
                clearInterval(lobbyState.countdownTimer.interval);
                lobbyState.status = 'waiting';
            }
            broadcastLobbyState();
        } else {
            mainGameState.players = mainGameState.players.filter(p => p.id !== player.id);
        }
    }
  });

  ws.on('error', (error) => console.error('WebSocket error:', error));
});
