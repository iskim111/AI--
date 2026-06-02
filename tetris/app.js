(function () {
  'use strict';

  const board = document.getElementById('board');
  const nextBoard = document.getElementById('next');
  const overlay = document.getElementById('overlay');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const scoreEl = document.getElementById('score');
  const linesEl = document.getElementById('lines');
  const levelEl = document.getElementById('level');

  const ctx = board.getContext('2d');
  const nextCtx = nextBoard.getContext('2d');
  ctx.scale(30, 30);
  nextCtx.scale(30, 30);

  const colors = [
    null,
    '#ff595e',
    '#ffca3a',
    '#8ac926',
    '#1982c4',
    '#6a4c93',
    '#ff924c',
    '#00c2a8'
  ];

  const state = {
    arena: createMatrix(10, 20),
    player: {
      pos: { x: 0, y: 0 },
      matrix: null,
      next: createPiece(randomType()),
      score: 0,
      lines: 0,
      level: 1
    },
    paused: true,
    started: false,
    gameOver: false,
    dropCounter: 0,
    dropInterval: 800,
    lastTime: 0,
    animationId: 0
  };

  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);

  window.addEventListener('keydown', event => {
    if (!state.started && event.code === 'Space') {
      event.preventDefault();
      startGame();
      return;
    }

    if (!state.started || state.paused || state.gameOver) return;

    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.code === 'ArrowRight') {
      event.preventDefault();
      move(1);
    } else if (event.code === 'ArrowDown') {
      event.preventDefault();
      drop();
    } else if (event.code === 'ArrowUp') {
      event.preventDefault();
      rotatePlayer(1);
    } else if (event.code === 'Space') {
      event.preventDefault();
      hardDrop();
    }
  });

  updateStats();
  draw();

  function startGame() {
    resetArena();
    state.player.score = 0;
    state.player.lines = 0;
    state.player.level = 1;
    state.player.next = createPiece(randomType());
    state.dropInterval = 800;
    state.dropCounter = 0;
    state.lastTime = 0;
    state.started = true;
    state.paused = false;
    state.gameOver = false;
    playerReset();
    updateStats();
    setOverlay('');
    cancelAnimationFrame(state.animationId);
    state.animationId = requestAnimationFrame(update);
  }

  function togglePause() {
    if (!state.started || state.gameOver) return;
    state.paused = !state.paused;
    if (state.paused) {
      setOverlay('일시정지');
    } else {
      setOverlay('');
      state.lastTime = 0;
      state.animationId = requestAnimationFrame(update);
    }
  }

  function update(time) {
    if (state.paused || state.gameOver) {
      draw();
      return;
    }

    const delta = time - state.lastTime;
    state.lastTime = time;
    state.dropCounter += delta;

    if (state.dropCounter > state.dropInterval) {
      drop();
    }

    draw();
    state.animationId = requestAnimationFrame(update);
  }

  function drop() {
    state.player.pos.y++;
    if (collide(state.arena, state.player)) {
      state.player.pos.y--;
      merge(state.arena, state.player);
      sweepRows();
      playerReset();
      updateStats();
    }
    state.dropCounter = 0;
  }

  function hardDrop() {
    while (!collide(state.arena, state.player)) {
      state.player.pos.y++;
    }
    state.player.pos.y--;
    merge(state.arena, state.player);
    sweepRows();
    playerReset();
    updateStats();
    state.dropCounter = 0;
  }

  function move(dir) {
    state.player.pos.x += dir;
    if (collide(state.arena, state.player)) {
      state.player.pos.x -= dir;
    }
  }

  function playerReset() {
    state.player.matrix = state.player.next;
    state.player.next = createPiece(randomType());
    state.player.pos.y = 0;
    state.player.pos.x = Math.floor(state.arena[0].length / 2) - Math.floor(state.player.matrix[0].length / 2);

    if (collide(state.arena, state.player)) {
      state.gameOver = true;
      state.paused = true;
      setOverlay('게임 오버\n시작 / 재시작 버튼으로 다시 플레이');
    }
  }

  function rotatePlayer(dir) {
    const pos = state.player.pos.x;
    let offset = 1;
    rotate(state.player.matrix, dir);

    while (collide(state.arena, state.player)) {
      state.player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > state.player.matrix[0].length) {
        rotate(state.player.matrix, -dir);
        state.player.pos.x = pos;
        return;
      }
    }
  }

  function sweepRows() {
    let rowCount = 0;

    outer: for (let y = state.arena.length - 1; y >= 0; --y) {
      for (let x = 0; x < state.arena[y].length; ++x) {
        if (state.arena[y][x] === 0) {
          continue outer;
        }
      }

      const row = state.arena.splice(y, 1)[0].fill(0);
      state.arena.unshift(row);
      ++y;
      rowCount++;
    }

    if (!rowCount) return;

    state.player.lines += rowCount;
    state.player.score += [0, 100, 300, 500, 800][rowCount] * state.player.level;
    state.player.level = Math.floor(state.player.lines / 10) + 1;
    state.dropInterval = Math.max(120, 800 - (state.player.level - 1) * 60);
  }

  function draw() {
    ctx.fillStyle = '#11141b';
    ctx.fillRect(0, 0, board.width, board.height);
    drawMatrix(ctx, state.arena, { x: 0, y: 0 });
    if (state.player.matrix) {
      drawMatrix(ctx, state.player.matrix, state.player.pos);
    }

    nextCtx.fillStyle = '#11141b';
    nextCtx.fillRect(0, 0, nextBoard.width, nextBoard.height);
    drawMatrix(nextCtx, state.player.next, {
      x: Math.floor((4 - state.player.next[0].length) / 2),
      y: Math.floor((4 - state.player.next.length) / 2)
    });
  }

  function drawMatrix(target, matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 0) return;
        target.fillStyle = colors[value];
        target.fillRect(x + offset.x, y + offset.y, 1, 1);
        target.strokeStyle = 'rgba(255,255,255,0.15)';
        target.lineWidth = 0.05;
        target.strokeRect(x + offset.x, y + offset.y, 1, 1);
      });
    });
  }

  function updateStats() {
    scoreEl.textContent = String(state.player.score);
    linesEl.textContent = String(state.player.lines);
    levelEl.textContent = String(state.player.level);
  }

  function setOverlay(message) {
    overlay.textContent = message;
    overlay.classList.toggle('hidden', !message);
  }

  function resetArena() {
    state.arena.forEach(row => row.fill(0));
  }

  function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
      matrix.push(new Array(width).fill(0));
    }
    return matrix;
  }

  function collide(arena, player) {
    const matrix = player.matrix;
    const pos = player.pos;
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[y].length; ++x) {
        if (matrix[y][x] !== 0 && (arena[y + pos.y] && arena[y + pos.y][x + pos.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  function merge(arena, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }

  function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        const swap = matrix[x][y];
        matrix[x][y] = matrix[y][x];
        matrix[y][x] = swap;
      }
    }

    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  function randomType() {
    return 'TJLOSZI'[(Math.random() * 7) | 0];
  }

  function createPiece(type) {
    if (type === 'T') return [[0, 1, 0], [1, 1, 1], [0, 0, 0]];
    if (type === 'O') return [[2, 2], [2, 2]];
    if (type === 'L') return [[0, 0, 3], [3, 3, 3], [0, 0, 0]];
    if (type === 'J') return [[4, 0, 0], [4, 4, 4], [0, 0, 0]];
    if (type === 'I') return [[0, 0, 0, 0], [5, 5, 5, 5], [0, 0, 0, 0], [0, 0, 0, 0]];
    if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
  }
})();
