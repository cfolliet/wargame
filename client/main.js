

const canvas = document.getElementById('canvas');
const board = new Board(canvas);
const currentPlayer = board.createPlayer('player 1');
board.createPlayer('player 2');

document.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const bullet = new Bullet(currentPlayer);
    bullet.pos.x = currentPlayer.pos.x;
    bullet.pos.y = currentPlayer.pos.y;
    bullet.vel.x = event.clientX - rect.left - currentPlayer.pos.x;
    bullet.vel.y = event.clientY - rect.top - currentPlayer.pos.y;
    board.bullets.push(bullet);
});

document.addEventListener("keydown", event => {
    if (event.keyCode == 37) {
        currentPlayer.vel.x = -1;
    } else if (event.keyCode == 38) {
        currentPlayer.vel.y = -1;
    } else if (event.keyCode == 39) {
        currentPlayer.vel.x = 1;
    } else if (event.keyCode == 40) {
        currentPlayer.vel.y = 1;
    }
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 37) {
        currentPlayer.vel.x = 0;
    } else if (event.keyCode == 38) {
        currentPlayer.vel.y = 0;
    } else if (event.keyCode == 39) {
        currentPlayer.vel.x = 0;
    } else if (event.keyCode == 40) {
        currentPlayer.vel.y = 0;
    }
});