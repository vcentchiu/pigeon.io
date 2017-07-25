function global() {}

global.prototype.loadDefault = function() {
    this.gameStart = false;
    this.parameters = {
        screenWidth: 500,
        screenHeight: 500,
        gameWidth: 0,
        gameHeight: 0,
        controls: {
            KEY_UP: 38,
            KEY_LEFT: 37,
            KEY_RIGHT: 39,
            KEY_DOWN: 40,
        }
    };
    return parameters;
}

// module.exports = {
//     // Keys and other mathematical constants
//     KEY_ESC: 27,
//     KEY_ENTER: 13,
//     KEY_CHAT: 13,
//     KEY_FIREFOOD: 119,
//     KEY_SPLIT: 32,
//     KEY_LEFT: 37,
//     KEY_UP: 38,
//     KEY_RIGHT: 39,
//     KEY_DOWN: 40,
//     borderDraw: false,
//     spin: -Math.PI,
//     enemySpin: -Math.PI,
//     mobile: false,
//     foodSides: 10,
//     virusSides: 20,

//     // Canvas
    
// };