// js/game.js

(function() {
  const cfg = window.__GAME_CONFIG__ || { mode: 'pvp', p1: {type:'human',symbol:'X'}, p2:{type:'human',symbol:'O'}, music: true };

  // Elements
  const boardEl = document.getElementById('board');
  const historyEl = document.getElementById('history');
  const statusEl = document.getElementById('status');
  const turnIndicatorEl = document.getElementById('turn-indicator');
  const btnMainMenu = document.getElementById('btn-main-menu');
  const btnRestart = document.getElementById('btn-restart');
  const overlay = document.getElementById('winner-screen');
  const overlayTitle = document.getElementById('win-lose-title');
  const overlayTryAgain = document.getElementById('overlay-try-again');
  const overlayMainMenu = document.getElementById('overlay-main-menu');
  const audio = document.getElementById('bg-music');
  const toggleMusic = document.getElementById('toggle-music');

  // Music
  function initMusic() {
    if (cfg.music) {
      audio.volume = 0.45;
      audio.play().catch(()=>{});
      toggleMusic.checked = true;
    } else {
      audio.pause(); audio.currentTime = 0;
      toggleMusic.checked = false;
    }
    toggleMusic.addEventListener('change', () => {
      if (toggleMusic.checked) { audio.play().catch(()=>{}); }
      else { audio.pause(); audio.currentTime = 0; }
    });
  }

  // Board state
  let cells = Array(9).fill('');
  let current = 'X'; // X goes first
  let focusedIndex = 0;
  let gameOver = false;

  // AI difficulty map
  const difficulty = (cfg.p2 && cfg.p2.difficulty) || 'medium';

  const DIFF = {
    very_easy: { type: 'random', block: 0, depth: 0 },
    easy:      { type: 'random', block: 0.5, depth: 0 },
    medium:    { type: 'heuristic', block: 1, depth: 2 },
    hard:      { type: 'minimax', block: 1, depth: 4 },
    very_hard: { type: 'minimax', block: 1, depth: 9 } // full search
  };

  // Winning combos
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // Helpers
  function clone(arr) { return arr.slice(); }
  function emptyIndexes(b) { return b.map((v, i) => v === '' ? i : -1).filter(i => i !== -1); }
  function checkWinner(b) {
    for (const [a,b2,c] of wins) {
      if (cells[a] && cells[a] === cells[b2] && cells[a] === cells[c]) return cells[a];
    }
    return emptyIndexes(cells).length === 0 ? 'draw' : null;
  }

  // Render board
  function renderBoard() {
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'board-cell';
      cell.setAttribute('data-index', i);
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', `Cell ${i+1}`);
      cell.tabIndex = -1;

      if (cells[i] !== '') {
        cell.appendChild(makeMark(cells[i]));
      }

      if (i === focusedIndex) {
        cell.classList.add('focused');
      }

      cell.addEventListener('click', () => onCellClick(i));
      boardEl.appendChild(cell);
    }
    turnIndicatorEl.textContent = `Turn: ${current}`;
  }

  // Make futuristic SVG marks
  function makeMark(sym) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('mark-svg');
    svg.setAttribute('viewBox', '0 0 100 100');

    if (sym === 'X') {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const lg = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      lg.setAttribute('id', 'xGrad');
      lg.setAttribute('x1', '0'); lg.setAttribute('y1', '0'); lg.setAttribute('x2', '1'); lg.setAttribute('y2', '1');
      const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#00ffff');
      const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#ff00ff');
      lg.appendChild(s1); lg.appendChild(s2);
      defs.appendChild(lg);
      svg.appendChild(defs);

      const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p1.setAttribute('d', 'M20 20 L80 80');
      p1.setAttribute('stroke', 'url(#xGrad)');
      p1.setAttribute('stroke-width', '12');
      p1.setAttribute('stroke-linecap', 'round');

      const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p2.setAttribute('d', 'M80 20 L20 80');
      p2.setAttribute('stroke', 'url(#xGrad)');
      p2.setAttribute('stroke-width', '12');
      p2.setAttribute('stroke-linecap', 'round');

      svg.appendChild(p1); svg.appendChild(p2);
    } else {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const rg = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      rg.setAttribute('id', 'oGrad');
      rg.setAttribute('cx', '50%'); rg.setAttribute('cy', '50%'); rg.setAttribute('r', '50%');
      const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#00ffff');
      const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#ff00ff');
      rg.appendChild(s1); rg.appendChild(s2);
      defs.appendChild(rg);
      svg.appendChild(defs);

      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', '50'); c.setAttribute('cy', '50'); c.setAttribute('r', '30');
      c.setAttribute('stroke', 'url(#oGrad)');
      c.setAttribute('stroke-width', '12');
      c.setAttribute('fill', 'none');
      svg.appendChild(c);
    }
    return svg;
  }

  // History
  function addHistoryEntry(player, index) {
    const li = document.createElement('li');
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    li.textContent = `${player} → (${row}, ${col})`;
    historyEl.appendChild(li);
    historyEl.scrollTop = historyEl.scrollHeight;
  }

  // Place move
  function place(index, player) {
    if (gameOver || cells[index] !== '') return false;
    cells[index] = player;
    addHistoryEntry(player, index);
    renderBoard();
    const w = checkWinner(cells);
    if (w) endGame(w);
    else current = current === 'X' ? 'O' : 'X';
    turnIndicatorEl.textContent = `Turn: ${current}`;
    return true;
  }

  // End game handling
  function endGame(result) {
    gameOver = true;
    let text;
    if (result === 'draw') {
      text = 'Draw';
      statusEl.textContent = 'Draw game.';
      overlayTitle.textContent = 'Draw';
    } else {
      statusEl.textContent = `${result} wins!`;
      if (cfg.mode === 'cpu') {
        const playerWon = (result === cfg.p1.symbol);
        overlayTitle.textContent = playerWon ? 'You Win' : 'You Lose';
      } else {
        overlayTitle.textContent = `${result} Wins`;
      }
    }
    overlay.classList.remove('hidden');
  }

  // Cell click
  function onCellClick(i) {
    if (gameOver) return;

    const currentPlayerType = (current === cfg.p1.symbol) ? cfg.p1.type : cfg.p2.type;
    // Human move only if current player is human
    if (currentPlayerType === 'human') {
      const moved = place(i, current);
      if (moved && cfg.mode === 'cpu') {
        // CPU turn if not finished
        setTimeout(cpuMove, 250);
      }
    }
  }

  // Keyboard controls
  function initKeyboard() {
    boardEl.addEventListener('keydown', (e) => {
      if (gameOver) return;
      const key = e.key;
      const row = Math.floor(focusedIndex / 3);
      const col = focusedIndex % 3;

      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)) {
        e.preventDefault();
      }
      if (key === 'ArrowUp') {
        focusedIndex = (row > 0) ? focusedIndex - 3 : focusedIndex;
      } else if (key === 'ArrowDown') {
        focusedIndex = (row < 2) ? focusedIndex + 3 : focusedIndex;
      } else if (key === 'ArrowLeft') {
        focusedIndex = (col > 0) ? focusedIndex - 1 : focusedIndex;
      } else if (key === 'ArrowRight') {
        focusedIndex = (col < 2) ? focusedIndex + 1 : focusedIndex;
      } else if (key === 'Enter' || key === ' ') {
        onCellClick(focusedIndex);
      }
      renderBoard();
    });
    // Focus board initially for keyboard
    boardEl.focus({ preventScroll: true });
  }

  // CPU logic
  function cpuMove() {
    if (gameOver) return;
    const cpuSym = cfg.p2.symbol;
    const humanSym = cfg.p1.symbol;
    const d = DIFF[difficulty] || DIFF.medium;
    let idx;

    if (d.type === 'random') {
      const empties = emptyIndexes(cells);
      // optional blocking chance
      if (Math.random() < d.block) {
        const blockIdx = findImmediateThreat(humanSym);
        idx = (blockIdx !== -1) ? blockIdx : empties[Math.floor(Math.random()*empties.length)];
      } else {
        idx = empties[Math.floor(Math.random()*empties.length)];
      }
    } else if (d.type === 'heuristic') {
      idx = heuristicMove(cpuSym, humanSym);
    } else { // minimax
      idx = bestMoveMinimax(cpuSym, humanSym, d.depth);
    }

    if (typeof idx === 'number') place(idx, cpuSym);
  }

  function findImmediateThreat(targetSym) {
    // If human can win next, block
    for (const combo of wins) {
      const marks = combo.map(i => cells[i]);
      if (marks.filter(m => m === targetSym).length === 2 && marks.includes('')) {
        return combo[marks.indexOf('')];
      }
    }
    return -1;
  }

  function heuristicMove(cpuSym, humanSym) {
    const empties = emptyIndexes(cells);
    // 1. Win if possible
    for (const i of empties) {
      const tmp = clone(cells);
      tmp[i] = cpuSym;
      if (winnerAfter(tmp) === cpuSym) return i;
    }
    // 2. Block human
    const block = findImmediateThreat(humanSym);
    if (block !== -1) return block;

    // 3. Center preference
    if (cells[4] === '') return 4;

    // 4. Corners
    const corners = [0,2,6,8].filter(i => cells[i] === '');
    if (corners.length) return corners[Math.floor(Math.random()*corners.length)];

    // 5. Any
    return empties[Math.floor(Math.random()*empties.length)];
  }

  function winnerAfter(b) {
    for (const [a,b2,c] of wins) {
      if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a];
    }
    return emptyIndexes(b).length === 0 ? 'draw' : null;
  }

  // Minimax with depth limit
  function bestMoveMinimax(cpuSym, humanSym, depthLimit) {
    let bestScore = -Infinity;
    let move = null;
    for (const i of emptyIndexes(cells)) {
      cells[i] = cpuSym;
      const score = minimax(cells, false, cpuSym, humanSym, 0, depthLimit, -Infinity, Infinity);
      cells[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
    return move;
  }

  function minimax(b, isMaximizing, cpuSym, humanSym, depth, depthLimit, alpha, beta) {
    const result = winnerAfter(b);
    if (result !== null) {
      if (result === cpuSym) return 10 - depth;
      if (result === humanSym) return depth - 10;
      return 0; // draw
    }
    if (depth >= depthLimit) return 0; // cut-off

    if (isMaximizing) {
      let best = -Infinity;
      for (const i of emptyIndexes(b)) {
        b[i] = cpuSym;
        best = Math.max(best, minimax(b, false, cpuSym, humanSym, depth+1, depthLimit, alpha, beta));
        b[i] = '';
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const i of emptyIndexes(b)) {
        b[i] = humanSym;
        best = Math.min(best, minimax(b, true, cpuSym, humanSym, depth+1, depthLimit, alpha, beta));
        b[i] = '';
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  // Restart
  function restart() {
    cells = Array(9).fill('');
    current = 'X';
    focusedIndex = 0;
    gameOver = false;
    historyEl.innerHTML = '';
    statusEl.textContent = 'Game in progress…';
    overlay.classList.add('hidden');
    renderBoard();
    boardEl.focus({ preventScroll: true });
  }

  // Navigation buttons
  btnMainMenu.addEventListener('click', () => {
    audio.pause(); audio.currentTime = 0;
    window.location.href = 'index.php';
  });
  btnRestart.addEventListener('click', restart);
  overlayTryAgain.addEventListener('click', restart);
  overlayMainMenu.addEventListener('click', () => { window.location.href = 'index.php'; });

  // Init
  function init() {
    initMusic();
    renderBoard();
    initKeyboard();
    // If CPU is 'X' (not in this config, but safe), let CPU start
    const cpuIsX = (cfg.p1.type === 'cpu' && cfg.p1.symbol === 'X') || (cfg.p2.type === 'cpu' && cfg.p2.symbol === 'X');
    if (cpuIsX && current === 'X') setTimeout(cpuMove, 300);
  }

  init();
})();
