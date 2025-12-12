# Tic-Tac-Toe, But It Is A Futuristic Two-Player Web-Based Game

## Project Overview
This project is a two-player web-based game that brings the classic strategy game, often played with a paper and a pencil, to life with a modern, engaging, and interactive digital experience. Players (X and O) compete in **Player vs Player (PvP)** or **Player vs CPU (PvC)** matches where they strategically take turns on marking a 3x3 grid to get three of their marks in a row (vertically, horizontally, or diagonally), and players can choose a difficulty ranging from **Very Easy** to **Very Hard**. The game also includes move history tracking with a futuristic neon/glass UI design, animated GIF background, and immersive background music.

## Game Objectives
- Place your mark/symbol (X or O) to get three cells/boxes in a row (vertical, horizontal, or diagonal).
- Strategically anticipate your opponent's moves at your chosen difficulty (Very Easy, Easy, Medium, Hard, or Very Hard).

## Win/Lose Conditions
- **Win:** You (your mark/symbol) complete any of the 8 winning lines.
- **Lose:** Your opponent completes a line first.
- **Draw:** All 9 cells/boxes are filled with no winning line.
  
## Technology Stack
- **Backend:** PHP 8.1 or higher
- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Assets:** Animated GIF Background and Looping Background Music

## How to Play
1. **Launch the Game:**
   - Open "index.php" in your browser (Google Chrome or Microsoft Edge) via a local PHP Server (NOTE: Your PHP Server must be at version 8.1 or higher in order for the game to work perfectly).
2. **Choose your Mode:**
   - **Player vs Player (PvP):**
       - Both players take turn on placing X and O by clicking a cell with a mouse or using a keyboard.
   - **Player vs CPU (PvC):**
       - You play as X, while the CPU play as O. Choose a difficulty (Very Easy, Easy, Medium, Hard, Very Hard) on the main menu. CPU responds after your turn.

3. **Controls:**
   - **Mouse:** Select a cell/box to place your mark/symbol.
   - **Keyboard:**
       - **Up Arrow Key:** Move Up
       - **Down Arrow Key:** Move Down
       - **Left Arrow Key:** Move to the Left
       - **Right Arrow Key:** Move to the Right
       - **Enter/Space:** Place your mark/symbol
         
4. **HUD Options:**
   - **Toggle Music:** Players can turn the background music on/off.
   - **Try Again:** When the player wins/loses the game, it will restart the current match instantly.
   - **Return to Main Menu:** Goes back to the main menu (index.php)
     
5. **Game Flow:**
   - The HUD (Head-Up Display) shows whose turn it is.
   - Each move is recorded in the "Move History" section.
   - When the game ends, a "Win/Lose/Draw" Screen appears with options to restart or return to the main menu.

## Prerequisites
- Visual Studio Code
    - **Extensions:**
        - HTML/CSS Support (by ecmel)
        - IntelliSense for Css class names in HTML (by Zignd)
        - StandardJS - JavaScript Standard Style (by Standard)
        - PHP Intelephense (by Intelephense)
        - PHP Server (by brapifra)
            - Go to Settings
            - Set Phpserver: Ip to '0.0.0.0'
            - Set Phpserver: PHP Path to 'C:\xampp\php\php.exe'
            - Set Phpserver: Port to '8000'
        - Live Server (by Ritwick Dey)
- PHP 7.4+ (or higher) installed locally, or a web server that is capable of running PHP.
- A modern browser (Google Chrome or Microsoft Edge)
    - **Extensions:**
        - Live Server Web Extensions

## Installation Steps
- Go to the "Releases" section and download the v1.0.0-beta ZIP File.
- Create a folder and name it "tictactoe".
- Copy all the files that you downloaded inside the folder and follow this structure:
    - tictactoe/
        - index.php
        - game.php
    - assets/
        - bg.gif
        - music.mp3
    - css/
        - style.css
    - js/
        - game.js
- Ensure that 'assets/bg.gif' and 'assets/music/mp3' exist and loadable.
- Open Visual Studio Code.
- In the Menu Bar, go to 'File', and go to 'Open Folder'
- Select 'tictactoe' folder.
- Start a local PHP server:
    - http://125.0.0.1:5500
- Open your browser at 'http://localhost:8000/index.php'.
- Choose your mode, and difficulty, then press **Play**.
- Enjoy!

## OOP Implementations
- **Encapsulation:**
    - Private properties in 'BaseConfig', 'CpuPlayer', and 'Board' keep internal state safe. Accessed via getters/setters (e.g., 'isMusicEnabled()', 'getCells()').
- **Inheritance:**
    - 'HumanPlayer' and 'CpuPlayer' extend the 'Player' base class; 'GameConfig' extends 'BaseConfig'.
- **Abstraction:**
    - Abstract classes/methods define contracts:
        - 'Player' declares 'getType()' for polymorphic behavior.
        - 'BaseConfig::validate()' requires concrete validation logic.
- **Polymorphism:**
    - 'HumanPlayer' and 'CpuPlayer' implement 'getType()' differently. 'Game' accepts any 'Player' subtype, enabling mode flexibility without changing the game's aggregation logic.

## Video Demonstrations
- **Charles Cristian Salting:**
    - [Watch Video](https://drive.google.com/drive/folders/1Qh0SvfxyJHBsXh-7MfzdIg8-92W6_nXy?usp=sharing)
- **Chezko Jomrey Tupas:**
    - [Watch Video](https://drive.google.com/drive/folders/145RuGGEWnEhBEQf0yyI15KfFVjDNoSUj?usp=sharing)
- **Marc Anthony Bunan:**
    - [Watch Video](https://drive.google.com/drive/folders/1yyKCgETnc50FgppQ3CqSQtz5XJ3jgPOk?usp=sharing)
- **Alorich Dayrit:**
    - [Watch Video](https://drive.google.com/drive/folders/1XGONI31a7JRB9jVhCaLolQvwHrF_hzcL?usp=sharing)

## Notes to Remember
- CPU Difficulty Levels:
    - **Very Easy:** Random
    - **Easy:** Random with occasional blocking
    - **Medium:** Heuristic (Win/Block/Center/Corners)
    - **Hard:** Minimax (limited depth)
    - **Very Hard:** Minimax (deep/full search)
- Each PHP Classes initialize and validate the game configuration player/board models. The interactive loop and AI run in JavaScript for responsiveness.
- Use your domain account to watch our individual video demonstration (For Gordon College Students).
