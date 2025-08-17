import FacileJS from './framework/index.js';

// --- WebSocket Connection ---
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => console.log('Connected to the server');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // console.log('Received:', message); // Too noisy for game updates
  store.dispatch({ type: message.type, payload: message.payload });
};
ws.onclose = () => console.log('Disconnected from the server');
ws.onerror = (error) => console.error('WebSocket Error:', error);

// --- Game Constants ---
const TILE = { EMPTY: 0, BLOCK: 1, WALL: 2 };

// --- State Management ---
const initialState = {
  screen: 'nickname',
  nickname: '',
  lobby: { players: [], countdown: null, status: 'waiting' },
  chatMessages: [],
  gameState: { map: [], players: [], powerUps: [] },
  winner: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_NICKNAME':
      return { ...state, nickname: action.payload };
    case 'UPDATE_LOBBY_STATE':
      return { ...state, lobby: action.payload, screen: 'lobby' };
    case 'UPDATE_COUNTDOWN':
      return { ...state, lobby: { ...state.lobby, countdown: action.payload } };
    case 'START_GAME':
      return { ...state, screen: 'game', gameState: action.payload, winner: null };
    case 'NEW_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'GAME_STATE_UPDATE': // Server sends the whole state
        return { ...state, gameState: action.payload };
    case 'GAME_OVER':
        return { ...state, screen: 'gameover', winner: action.payload.winner };
    default:
      return state;
  }
}

const store = FacileJS.createStore(reducer);

// --- Event Handlers (Framework-Compliant) ---
const handleKeyDown = (e) => {
    if (keyboardState.hasOwnProperty(e.code)) {
        e.preventDefault();
        keyboardState[e.code] = true;
    }
};

const handleKeyUp = (e) => {
    if (keyboardState.hasOwnProperty(e.code)) {
        e.preventDefault();
        keyboardState[e.code] = false;
    }
};

const handleKeyPress = (e) => {
    if (e.code === 'Space') {
        if (store.getState().screen === 'game') {
            e.preventDefault();
            ws.send(JSON.stringify({ type: 'PLACE_BOMB' }));
        }
    }
};

// --- Components ---

function App() {
    const state = store.getState();
    let screenComponent;
    switch (state.screen) {
        case 'lobby': screenComponent = LobbyScreen(); break;
        case 'game': screenComponent = GameScreen(); break;
        case 'gameover': screenComponent = GameOverScreen(); break;
        default: screenComponent = NicknameScreen(); break;
    }

    // This wrapper div will handle all keyboard events.
    // It needs a tabindex to be focusable.
    return FacileJS.createElement('div',
        {
            class: 'app-container',
            tabindex: '0',
            autofocus: true, // Automatically focus on render
            onkeydown: handleKeyDown,
            onkeyup: handleKeyUp,
            onkeypress: handleKeyPress,
        },
        screenComponent
    );
}

// --- Game Loop and Input Handling ---
const keyboardState = {
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
    KeyW: false, KeyA: false, KeyS: false, KeyD: false,
};


function gameLoop() {
    if (store.getState().screen === 'game') {
        const direction = {
            up: keyboardState.ArrowUp || keyboardState.KeyW,
            down: keyboardState.ArrowDown || keyboardState.KeyS,
            left: keyboardState.ArrowLeft || keyboardState.KeyA,
            right: keyboardState.ArrowRight || keyboardState.KeyD,
        };
        // Only send if a key is pressed
        if (Object.values(direction).some(v => v)) {
            ws.send(JSON.stringify({ type: 'MOVE_PLAYER', payload: direction }));
        }
    }
    requestAnimationFrame(gameLoop);
}

// --- App Initialization ---
const rootElement = document.getElementById('root');
const update = FacileJS.createApp(App, rootElement);
store.subscribe(update);
requestAnimationFrame(gameLoop); // Start the game loop

// --- Re-add omitted components for completeness ---
function ChatComponent() {
    const state = store.getState();
    let currentMessage = '';
    const handleInput = (e) => { currentMessage = e.target.value; };
    const handleSendMessage = () => {
        if (currentMessage.trim().length > 0) {
            ws.send(JSON.stringify({ type: 'SEND_CHAT_MESSAGE', payload: { message: currentMessage } }));
            // This is a bit of a hack to clear the input. A better way would be to control the input value via state.
        }
    };
    return FacileJS.createElement('div', { class: 'chat-container' },
        FacileJS.createElement('div', { class: 'messages' },
            ...state.chatMessages.map(msg => FacileJS.createElement('p', { class: 'message' }, FacileJS.createElement('strong', {}, `${msg.nickname}: `), msg.message))
        ),
        FacileJS.createElement('input', { type: 'text', placeholder: 'Type a message...', oninput: handleInput, onkeyup: (e) => { if (e.keyCode === 13) { handleSendMessage(); e.target.value = ''; } } })
    );
}

function NicknameScreen() {
    let nickname = '';
    const handleInput = (e) => { nickname = e.target.value; };
    const handleJoin = () => {
        if (nickname.trim().length > 0) {
            store.dispatch({ type: 'SET_NICKNAME', payload: nickname });
            ws.send(JSON.stringify({ type: 'JOIN_GAME', payload: { nickname } }));
        }
    };
    return FacileJS.createElement('div', { class: 'container nickname-screen' },
        FacileJS.createElement('h1', {}, 'Bomberman-DOM'),
        FacileJS.createElement('input', { type: 'text', placeholder: 'Enter your nickname', oninput: handleInput, onkeyup: (e) => e.keyCode === 13 && handleJoin() }),
        FacileJS.createElement('button', { onclick: handleJoin }, 'Join Game')
    );
}

function LobbyScreen() {
    const { players, countdown, status } = store.getState().lobby;
    const timerText = countdown !== null ? `Game starts in: ${countdown}s` : 'Waiting...';
    return FacileJS.createElement('div', { class: 'container lobby-screen' },
        FacileJS.createElement('h1', {}, 'Lobby'),
        FacileJS.createElement('p', {}, `Players: ${players.length}/4`),
        FacileJS.createElement('ul', {}, ...players.map(p => FacileJS.createElement('li', {}, p.nickname))),
        FacileJS.createElement('p', { class: 'timer' }, status === 'countdown' ? timerText : 'Waiting for more players...'),
        ChatComponent()
    );
}

function BoardComponent({ map, players, bombs, explosions, powerUps }) {
    const CELL_SIZE = 50;
    const getTileClass = (tile) => {
        if (tile === TILE.WALL) return 'cell wall';
        if (tile === TILE.BLOCK) return 'cell block';
        return 'cell';
    };

    // Create the base grid cells. These are just for the background.
    const cells = map.flat().map((tile, i) => {
        const x = i % map[0].length;
        const y = Math.floor(i / map[0].length);
        return FacileJS.createElement('div', { class: getTileClass(tile), 'data-x': x, 'data-y': y });
    });

    // Create player elements. They are positioned absolutely.
    const playerElements = players
        .filter(p => p.isAlive)
        .map(p => {
            return FacileJS.createElement('div', {
                class: `player player-${p.id}`,
                style: `transform: translate(${p.x}px, ${p.y}px);`
            });
        });

    // Create bomb elements. They are positioned absolutely.
    const bombElements = (bombs || []).map(b => {
        const x = b.x * CELL_SIZE;
        const y = b.y * CELL_SIZE;
        return FacileJS.createElement('div', {
            class: 'bomb',
            style: `transform: translate(${x}px, ${y}px);`
        });
    });

    // Create explosion elements. They are positioned absolutely.
    const explosionElements = (explosions || []).flatMap(exp =>
        exp.cells.map(cell => {
            const x = cell.x * CELL_SIZE;
            const y = cell.y * CELL_SIZE;
            return FacileJS.createElement('div', {
                class: 'explosion',
                style: `transform: translate(${x}px, ${y}px);`
            });
        })
    );

    // Create power-up elements.
    const powerUpElements = (powerUps || []).map(p => {
        const x = p.x * CELL_SIZE;
        const y = p.y * CELL_SIZE;
        return FacileJS.createElement('div', {
            class: `power-up ${p.type}`,
            style: `transform: translate(${x}px, ${y}px);`
        });
    });

    // The board is a grid container for the cells, but also a relative
    // container for the absolutely positioned players, bombs, and explosions.
    return FacileJS.createElement('div', {
        class: 'board',
        style: `grid-template-columns: repeat(${map[0].length}, ${CELL_SIZE}px); grid-template-rows: repeat(${map.length}, ${CELL_SIZE}px);`
    }, ...cells, ...powerUpElements, ...playerElements, ...bombElements, ...explosionElements);
}

function PlayerStatus({ players }) {
    return FacileJS.createElement('div', { class: 'player-status-container' },
        ...players.map(p => {
            return FacileJS.createElement('div', { class: `player-status player-${p.id} ${p.isAlive ? '' : 'dead'}` },
                FacileJS.createElement('span', { class: 'nickname' }, p.nickname),
                FacileJS.createElement('span', { class: 'lives' }, `Lives: ${p.lives}`)
            );
        })
    );
}

function GameOverScreen() {
    const { winner } = store.getState();
    const handlePlayAgain = () => {
        window.location.reload();
    };

    const message = winner ? `${winner.nickname} Wins!` : "It's a Draw!";

    return FacileJS.createElement('div', { class: 'container game-over-screen' },
        FacileJS.createElement('h1', {}, 'Game Over'),
        FacileJS.createElement('h2', {}, message),
        FacileJS.createElement('button', { onclick: handlePlayAgain }, 'Play Again')
    );
}

function GameScreen() {
    const { map, players, bombs, explosions, powerUps } = store.getState().gameState;
    if (!map || map.length === 0) {
        return FacileJS.createElement('div', {}, 'Loading game...');
    }
    return FacileJS.createElement('div', { class: 'game-container' },
        PlayerStatus({ players }),
        BoardComponent({ map, players, bombs: bombs || [], explosions: explosions || [], powerUps: powerUps || [] }),
        ChatComponent()
    );
}
