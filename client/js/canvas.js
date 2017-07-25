function Canvas() {}

Canvas.prototype.load = function() {
    this.Container = PIXI.Container,
    this.autoDetectRenderer = PIXI.autoDetectRenderer,
    this.loader = PIXI.loader,
    this.TextureCache = PIXI.utils.TextureCache,
    this.resources = PIXI.loader.resources,
    this.Sprite = PIXI.Sprite;
    this.stage = new this.Container();
    this.renderer = this.autoDetectRenderer(
        window.innerWidth - 100, window.innerHeight - 100,
        {antialias: false, transparent: true, resolution: 1}
    );

    this.controls = {
        left: _createKeyHandler(37),
        right: _createKeyHandler(39)
    };

    this.renderer.view.id = "canvas";
    document.body.appendChild(this.renderer.view);
    this.cv = document.getElementById("canvas");

    this.player = window.socket.id;
    this.playerData = {};
    this.playerSprites = {};
    this.loader
        .add("/img/pigeon-assets.json")
        .load(function() {
            window.socket.emit('assets loaded');
        });
}

function _createKeyHandler(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = false;
    key.press = undefined;
    key.release = undefined;
    return key;
}

////////////////////////////////////////////////////////////////
// load world
////////////////////////////////////////////////////////////////

Canvas.prototype.loadWorld = function(data) {
    console.log("loading world");

    this.playerData = data.players;
    for (var id in this.playerData) {
        this._loadSprites(this.playerData[id]);
    }
}

Canvas.prototype._loadSprites = function(player) {
    console.log("adding players");

    this.playerSprites[player.id] = new this.Sprite(
        this.resources["/img/pigeon-assets.json"].textures["pigeon.png"]
    );

    console.log(this.playerSprites);

    this.stage.addChild(this.playerSprites[player.id]);
}

////////////////////////////////////////////////////////////////
// handle user input
////////////////////////////////////////////////////////////////

Canvas.prototype.enableControls = function() {
    console.log("enabling controls");


    document.addEventListener('keydown', this._keyDown);
    document.addEventListener('keyup', this._keyUp);

}

Canvas.prototype._keyDown = function(event) {
    console.log("pressed: " + event.keyCode);
    console.log(this.playerData);
    var key = event.keyCode;
    if (key == 37) {
        window.socket.emit('left down');
    }
    else if (key == 39) {
        window.socket.emit('right down');
    }
}

Canvas.prototype._keyUp = function(event) {
    console.log("release: " + event.keyCode);

    var key = event.keyCode;
    if (key == 37) {
        window.socket.emit('left up');
    }
    else if (key == 39) {
        window.socket.emit('right up');
    }
}

////////////////////////////////////////////////////////////////
// update / render
////////////////////////////////////////////////////////////////

Canvas.prototype.updateData = function(data) {
    var test = this.playerSprites;
    if (Object.keys(test).length == 0) {
        return;
    }
    // update player positions after window.socket.on(world update)
    var players = this.playerData = data.players;
}


Canvas.prototype.movePlayers = function() {
    for (var id in this.playerData) {
        this.playerSprites[id].x = this.playerData[id].x;
        this.playerSprites[id].y = this.playerData[id].y;
    }
}

Canvas.prototype.render = function() {
    this.movePlayers();
    this.renderer.render(this.stage);
}

