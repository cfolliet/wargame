function drawInfos(board) {
    board._context.fillStyle = '#fff';
    board._context.fillText('FPS: ' + board.fps, 20, 20);
    board._context.fillText('Ping: ' + (board.ping | 0), 20, 35);
}

function drawHealth(board) {
    if (board.currentPlayer()) {
        board._context.fillStyle = '#fff';
        board._context.fillText('\u2764 ' + board.currentPlayer().health, 20, board._canvas.height / board.scale - 20);

        if (board.currentHealth > board.currentPlayer().health) {
            board._context.fillStyle = 'red';
            board._context.fillRect(0, 0, board._canvas.width / board.scale, board._canvas.height / board.scale);
            setTimeout(() => board.currentHealth = board.currentPlayer().health, 68);
        } else {
            board.currentHealth = board.currentPlayer().health;
        }
    }
}

function drawWeapon(board) {
    if (board.currentPlayer()) {
        board._context.fillStyle = '#fff';
        const player = board.currentPlayer();
        const weapon = player.weapons[player.currentWeaponIndex];
        var image = board.ressources.get('/img/' + weapon.name + '.png');
        const loadingDone = board.time - weapon.loadTimestamp;
        let loadingPercentage = 0;

        board._context.drawImage(image, 100, board._canvas.height / board.scale - 40, 30, 30);

        if (weapon.isReloading) {
            board._context.fillText(`RELOADING`, 140, board._canvas.height / board.scale - 20);
            loadingPercentage = loadingDone * 100 / weapon.reloadDuration;
        } else {
            board._context.fillText(`${weapon.bulletCount}/${weapon.maxBulletCount}`, 140, board._canvas.height / board.scale - 20);
            loadingPercentage = loadingDone * 100 / weapon.loadDuration;
        }

        let width = Math.max(0, 100 - loadingPercentage);
        board._context.fillRect(140, board._canvas.height / board.scale - 15, width, 5);
    }
}

function drawTime(board) {
    board._context.fillStyle = '#fff';
    if (board.roundStartTimestamp + board.roundDuration > board.time) {
        board._context.textAlign = 'right';
        const roundDuration = new Date(1000 * Math.round((board.roundStartTimestamp + board.roundDuration - board.time) / 1000)); // round to nearest second
        const text = 'Time left: ' + roundDuration.getUTCMinutes() + ':' + roundDuration.getUTCSeconds().toString().padStart(2, '0');
        board._context.fillText(text, board._canvas.width / board.scale, 20);
    } else {
        board._context.font = '30px monospace';
        board._context.textAlign = 'center';
        const waitDuration = new Date(1000 * Math.round((board.roundStartTimestamp + board.roundDuration + board.roundResultDuration - board.time) / 1000)); // round to nearest second
        const text = 'NEXT ROUND IN ' + waitDuration.getUTCMinutes() + ':' + waitDuration.getUTCSeconds().toString().padStart(2, '0');
        board._context.fillText(text, board._canvas.width / board.scale / 2, board._canvas.height / board.scale / 2);
    }
}

function drawScore(board) {
    board._context.fillStyle = '#fff';
    [...board.players.values()].sort((a, b) => b.kills - a.kills).forEach((player, index) => {
        board._context.fillStyle = player.color;
        board._context.fillRect(board._canvas.width / board.scale - 115, 32 + index * 20, 10, 10);
        board._context.strokeStyle = '#fff';
        board._context.strokeRect(board._canvas.width / board.scale - 115, 32 + index * 20, 10, 10);
        board._context.fillText(`${player.name}: ${player.kills}/${player.deaths}`, board._canvas.width / board.scale - 100, 40 + index * 20, 100);
    });
}
function drawplayerSpawns(board) {
    board.playerSpawns.forEach(respawn => {
        board._context.fillStyle = 'violet';
        board._context.fillRect(respawn.pos.x, respawn.pos.y, respawn.size.x, respawn.size.y);
    });
}

function drawWalls(board){
    board.walls.forEach(wall => {        
        board._context.fillStyle = '#fff';
        board._context.fillRect(wall.left, wall.top, wall.size.x, wall.size.y);
    });
}

export default function draw(board) {
    //drawWalls(board);
    //drawplayerSpawns(board);
    //drawInfos(board);
    drawScore(board);
    drawHealth(board);
    drawWeapon(board);
    drawTime(board);
}