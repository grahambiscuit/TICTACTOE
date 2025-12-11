<?php

abstract class Player {
    protected string $symbol; 
    
    public function __construct(string $symbol) {
        $this->symbol = $symbol;
    }

    public function getSymbol(): string {
        return $this->symbol;
    }

    
    abstract public function getType(): string; 
}


class HumanPlayer extends Player {
    public function getType(): string { return 'human'; }
}

class CpuPlayer extends Player {
    private string $difficulty; 

    public function __construct(string $symbol, string $difficulty) {
        parent::__construct($symbol);
        $this->difficulty = $difficulty;
    }

    public function getType(): string { return 'cpu'; }
    public function getDifficulty(): string { return $this->difficulty; }
}


class Board {
    private array $cells; 

    public function __construct() {
        $this->cells = array_fill(0, 9, '');
    }

    public function getCells(): array { return $this->cells; }

    public function isCellEmpty(int $index): bool {
        return isset($this->cells[$index]) && $this->cells[$index] === '';
    }

    public function place(int $index, string $symbol): bool {
        if ($this->isCellEmpty($index)) {
            $this->cells[$index] = $symbol;
            return true;
        }
        return false;
    }
}


class Game {
    private Player $p1;
    private Player $p2;
    private Board $board;
    private string $mode; 

    public function __construct(Player $p1, Player $p2, string $mode) {
        $this->p1 = $p1;
        $this->p2 = $p2;
        $this->mode = $mode;
        $this->board = new Board();
    }

    public function getMode(): string { return $this->mode; }
    public function getP1(): Player { return $this->p1; }
    public function getP2(): Player { return $this->p2; }
    public function getBoard(): Board { return $this->board; }
}


$mode = isset($_GET['mode']) ? $_GET['mode'] : 'pvp';
$difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : 'medium';
$musicEnabled = isset($_GET['music']) && $_GET['music'] === 'on';


if ($mode === 'cpu') {
    $p1 = new HumanPlayer('X');
    $p2 = new CpuPlayer('O', $difficulty);
} else {
    $p1 = new HumanPlayer('X');
    $p2 = new HumanPlayer('O');
}
$game = new Game($p1, $p2, $mode);


$initialConfig = [
    'mode' => $game->getMode(),
    'p1' => ['type' => $game->getP1()->getType(), 'symbol' => $game->getP1()->getSymbol()],
    'p2' => [
        'type' => $game->getP2()->getType(),
        'symbol' => $game->getP2()->getSymbol(),
        'difficulty' => ($game->getP2()->getType() === 'cpu') ? $game->getP2()->getDifficulty() : null
    ],
    'music' => $musicEnabled
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Tic‑Tac‑Toe — Game</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="css/style.css" rel="stylesheet" />
</head>
<body class="game-body">
  <div class="bg-overlay"></div>

  <header class="hud glass">
    <div class="hud-left">
      <span class="hud-title neon">Tic‑Tac‑Toe</span>
      <span class="hud-mode badge"><?php echo strtoupper(htmlspecialchars($mode)); ?></span>
      <span class="hud-turn neon" id="turn-indicator">Turn: X</span>
    </div>
    <div class="hud-right">
      <button id="btn-main-menu" class="btn outline neon">Return to Main Menu</button>
      <button id="btn-restart" class="btn neon">Try Again</button>
      <label class="switch small">
        <input type="checkbox" id="toggle-music" <?php echo $musicEnabled ? 'checked' : ''; ?> />
        <span class="slider"></span>
        <span class="switch-label">Music</span>
      </label>
    </div>
  </header>

  <main class="board-container glass">
    <section class="left-panel">
      <div class="board-grid" id="board" tabindex="0" aria-label="Tic-Tac-Toe Board">

      </div>
      <div class="controls">
        <h3 class="section-title">Controls</h3>
        <ul class="control-list">
          <li><strong class="label">Mouse:</strong> Click a cell to place your mark</li>
          <li><strong class="label">Keyboard:</strong> Arrow keys to navigate, Enter/Space to place</li>
        </ul>
      </div>
    </section>

    <section class="right-panel">
      <div class="panel-card">
        <h3 class="section-title">Move history</h3>
        <ol id="history" class="history-list"></ol>
      </div>

      <div class="panel-card">
        <h3 class="section-title">Status</h3>
        <div id="status" class="status neon-small">Game in progress…</div>
        <div id="winner-screen" class="overlay hidden">
          <div class="overlay-content">
            <h2 id="win-lose-title" class="neon">You Win</h2>
            <div class="overlay-actions">
              <button id="overlay-try-again" class="btn neon">Try Again</button>
              <button id="overlay-main-menu" class="btn outline neon">Return to Main Menu</button>
            </div>
          </div>
        </div>
      </div>

      <?php if ($mode === 'cpu'): ?>
      <div class="panel-card">
        <h3 class="section-title">CPU difficulty</h3>
        <div class="chip neon-small"><?php echo htmlspecialchars(str_replace('_', ' ', $difficulty)); ?></div>
      </div>
      <?php endif; ?>
    </section>
  </main>

  <audio id="bg-music" src="assets/music.mp3" preload="auto" loop></audio>

  <script>
    window.__GAME_CONFIG__ = <?php echo json_encode($initialConfig, JSON_UNESCAPED_SLASHES); ?>;
  </script>
  <script src="js/game.js"></script>
</body>
</html>
