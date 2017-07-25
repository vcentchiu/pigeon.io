var Canvas;
var socket;
var loaded = false;

$(function() {
    socket = io();
    window.socket = socket;

    // start canvas controller
    Canvas = new Canvas();

    // sign in
    $('form').submit(function() {
        socket.emit('player join', $("#form").val());
        Canvas.load();
        removeForm();
        return false;
    });

    // initial load
    socket.on('load world', function(data) {
        Canvas.loadWorld(data);
        requestAnimationFrame(gameLoop);
        Canvas.enableControls();
        socket.emit('world loaded');
        loaded = true;
    });


    // update world data
    socket.on('run', function(data) {
        if (loaded) {
            Canvas.updateData(data);
        }
    });


    // handle chat
    socket.on('chat message', function(msg) {
        $("#messages").append($('<li>').text(msg));
    });
});


function removeForm() {
    // exit animation
    $("form").remove();
}


function closeGame() {

}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    Canvas.render();
}