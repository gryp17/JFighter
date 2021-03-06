# JFighter
Javacript/Canvas remake of one of my first Java games.
The game is a mix between HTML/CSS (used for the menus and the level editor) and Javascript/Canvas code for the actual game mechanics.
It uses [SASS](http://sass-lang.com) as css preprocessor, the dependencies are managed using [npm](https://www.npmjs.com) and the build process is done with [webpack](https://webpack.js.org/).

The game consists in fighting against enemy bombers, fighters, tanks and infantry while trying to save as many civilians as possible.

Some of the game's features include:
- 3 controllable planes with different stats.
- 3 built in levels with different weather.
- Level editor that supports all game weather types, level themes and drag and drop for placing enemies or civilians.
- Customizable game controls.
- HUD that tracks the plane's health, speed, direction, machinegun and bombs status.
- Ingame menu for pausing/restarting the game.

## Installation

1. Install all npm dependencies:

  ```
  npm install
  ```
 
2. Start the development server

  ```
  npm run start-dev-server
  ```

3. Or build the javascript and css files for production:

  ```
  npm run build
  ```

4. Open [/index.html](https://github.com/gryp17/JFighter/blob/master/index.html)

## Live version

Currently hosted at: [JFighter](https://jfighter.gryp.dev/)
