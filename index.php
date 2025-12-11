<?php

abstract class BaseConfig {

    private string $mode;           
    private string $difficulty;     
    private bool $musicEnabled;

    public function __construct(string $mode = 'pvp', string $difficulty = 'medium', bool $musicEnabled = true) {
        $this->mode = $mode;
        $this->difficulty = $difficulty;
        $this->musicEnabled = $musicEnabled;
    }


    public function setMode(string $mode): void { $this->mode = $mode; }
    public function getMode(): string { return $this->mode; }

    public function setDifficulty(string $difficulty): void { $this->difficulty = $difficulty; }
    public function getDifficulty(): string { return $this->difficulty; }

    public function setMusicEnabled(bool $enabled): void { $this->musicEnabled = $enabled; }
    public function isMusicEnabled(): bool { return $this->musicEnabled; }


    abstract public function validate(): bool;
}


class GameConfig extends BaseConfig {
    private array $allowedModes = ['pvp', 'cpu'];
    private array $allowedDifficulties = ['very_easy', 'easy', 'medium', 'hard', 'very_hard'];

    public function validate(): bool {
        return in_array($this->getMode(), $this->allowedModes, true)
            && in_array($this->getDifficulty(), $this->allowedDifficulties, true);
    }
}


$config = new GameConfig('pvp', 'medium', true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Tic-Tac-Toe — Futuristic Main Menu</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="css/style.css" rel="stylesheet" />
</head>
<body class="menu-body">
  <div class="bg-overlay"></div>

  <main class="menu-container glass">
    <h1 class="title neon">Tic‑Tac‑Toe</h1>
    <p class="subtitle">Choose your mode and options</p>

    <div class="menu-sections">
      <section class="menu-card">
        <h2 class="section-title">Mode</h2>
        <form id="menu-form" action="game.php" method="get" class="menu-form">
          <div class="mode-select">
            <label class="radio neon-small">
              <input type="radio" name="mode" value="pvp" checked /> Player vs Player
            </label>
            <label class="radio neon-small">
              <input type="radio" name="mode" value="cpu" /> Player vs CPU
            </label>
          </div>

          <div class="options-grid">
            <div class="option">
              <label for="difficulty" class="neon-small">Difficulty</label>
              <select id="difficulty" name="difficulty" class="select">
                <option value="very_easy">Very Easy</option>
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
                <option value="very_hard">Very Hard</option>
              </select>
              <small class="hint">CPU only; ignored in PvP</small>
            </div>

            <div class="option">
              <label class="switch neon-small">
                <input type="checkbox" name="music" value="on" checked />
                <span class="slider"></span>
                <span class="switch-label">Music On</span>
              </label>
            </div>
          </div>

          <div class="actions">
            <button type="submit" class="btn primary neon">Play</button>
          </div>
        </form>
      </section>

      <section class="menu-card">
        <h2 class="section-title">Design preview</h2>
        <div class="preview-grid">
          <div class="cell preview">
            <svg viewBox="0 0 100 100" class="mark-x">
              <defs>
                <linearGradient id="xGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#00ffff"/>
                  <stop offset="100%" stop-color="#ff00ff"/>
                </linearGradient>
              </defs>
              <path d="M20 20 L80 80 M80 20 L20 80" stroke="url(#xGlow)" stroke-width="12" stroke-linecap="round" filter="url(#xBlur)"/>
            </svg>
          </div>
          <div class="cell preview">
            <svg viewBox="0 0 100 100" class="mark-o">
              <defs>
                <radialGradient id="oGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#00ffff"/>
                  <stop offset="100%" stop-color="#ff00ff"/>
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="30" stroke="url(#oGlow)" stroke-width="12" fill="none" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  </main>

  <audio id="bg-music" src="assets/music.mp3" preload="auto" loop></audio>
  <script>

    const musicEl = document.querySelector('input[name="music"]');
    const audio = document.getElementById('bg-music');
    const playBtn = document.querySelector('.btn.primary');

    function updateMusic() {
      if (musicEl.checked) {
        audio.volume = 0.5;
        audio.play().catch(()=>{});
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
    updateMusic();
    musicEl.addEventListener('change', updateMusic);


    playBtn.addEventListener('click', () => { audio.pause(); });
  </script>
</body>
</html>