function drawInfos(board) {
    board._context.fillStyle = '#fff';
    board._context.fillText('FPS: ' + board.fps, 100, 20);
    board._context.fillText('Ping: ' + (board.ping | 0), 100, 35);
}

function drawHealth(board) {
    if (board.currentPlayer()) {
        board._context.fillStyle = '#fff';
        board._context.textAlign = 'left';
        board._context.fillText('\u2764 ' + board.currentPlayer().health, 20, board._canvas.height / board.scale - 20);

        if (board.currentHealth > board.currentPlayer().health) {
            board._context.fillStyle = 'red';
            board._context.fillRect(0, 0, board._canvas.width / board.scale, board._canvas.height / board.scale);
            setTimeout(() => board.currentHealth = board.currentPlayer().health, 68);
        } else {
            board.currentHealth = board.currentPlayer().health;
        }

        if (board.currentPlayer().health <= 0) {
            board._context.font = '30px monospace';
            board._context.textAlign = 'center';
            const text = 'Your are dead \u2620';
            board._context.fillText(text, board._canvas.width / board.scale / 2, board._canvas.height / board.scale / 2);
        }
    }
}

function drawWeapon(board) {
    if (board.currentPlayer()) {
        board._context.fillStyle = '#fff';
        board._context.textAlign = 'left';
        const player = board.currentPlayer();
        const weapon = player.weapons[player.currentWeaponIndex];
        var image = board.spriteManager.get('/img/' + weapon.name + '.png');
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

    if (board.roundStartTimestamp <= board.time) {
        board._context.textAlign = 'right';
        const roundDuration = new Date(1000 * Math.round((board.duration) / 1000));
        const text = 'Time: ' + roundDuration.getUTCMinutes() + ':' + roundDuration.getUTCSeconds().toString().padStart(2, '0') + ' ';
        board._context.fillText(text, board._canvas.width / board.scale, 20);
        board._context.fillText(`kills: ${board.score} `, board._canvas.width / board.scale, 40);
    } else {
        board._context.font = '30px monospace';
        board._context.textAlign = 'center';
        const waitDuration = new Date(1000 * Math.round((board.roundStartTimestamp - board.time) / 1000)); // round to nearest second
        const text = 'NEXT ROUND IN ' + waitDuration.getUTCMinutes() + ':' + waitDuration.getUTCSeconds().toString().padStart(2, '0');
        board._context.fillText(text, board._canvas.width / board.scale / 2, board._canvas.height / board.scale / 2);
    }
}

function drawScore(board) {
    if (board.roundStartTimestamp > board.time) {
        board._context.fillStyle = '#fff';
        board._context.textAlign = 'center';
        let roundDuration = new Date(1000 * Math.round((board.duration) / 1000));
        let textDuration = roundDuration.getUTCMinutes() + ':' + roundDuration.getUTCSeconds().toString().padStart(2, '0');
        board._context.fillText('Last round', board._canvas.width / 2 / board.scale, 100);
        board._context.fillText(`Time: ${textDuration}`, board._canvas.width / 2 / board.scale, 120);
        board._context.fillText(`kills: ${board.score}`, board._canvas.width / 2 / board.scale, 140);

        if (board.highscores) {
            let hightscore = board.highscores[0];
            roundDuration = new Date(1000 * Math.round((hightscore.time) / 1000));
            textDuration = roundDuration.getUTCMinutes() + ':' + roundDuration.getUTCSeconds().toString().padStart(2, '0');
            board._context.fillText(`Best Time: ${textDuration} ${hightscore.players}`, board._canvas.width / 2 / board.scale, 440);
            hightscore = board.highscores[1];
            board._context.fillText(`Best kills: ${hightscore.score} ${hightscore.players}`, board._canvas.width / 2 / board.scale, 460);
        }
    }
}
function drawplayerSpawns(board) {
    board.playerSpawns.forEach(respawn => {
        board._context.fillStyle = 'violet';
        board._context.fillRect(respawn.pos.x - board.camera.left, respawn.pos.y - board.camera.top, respawn.size.x, respawn.size.y);
    });
}

function drawWalls(board) {
    board.walls.forEach(wall => {
        board._context.fillStyle = '#fff';
        board._context.fillRect(wall.left - board.camera.left, wall.top - board.camera.top, wall.size.x, wall.size.y);
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