const score = document.getElementById('score');
const highScore = document.getElementById('highScore');
const gameArea = document.querySelector('.game-area');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const finalScore = document.getElementById('finalScore');

let player = { speed: 5, score: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, s: false, a: false, d: false };

// Load high score
let savedHighScore = localStorage.getItem('nitroRacerHighScore') || 0;
highScore.innerText = savedHighScore.toString().padStart(4, '0');

startBtn.addEventListener('click', start);
restartBtn.addEventListener('click', restart);

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    );
}

function moveLines() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(item => {
        if (item.y >= 700) {
            item.y -= 750;
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

function endGame() {
    player.start = false;
    gameOverScreen.classList.remove('hidden');
    finalScore.innerText = player.score;
    
    if (player.score > savedHighScore) {
        savedHighScore = player.score;
        localStorage.setItem('nitroRacerHighScore', savedHighScore);
        highScore.innerText = savedHighScore.toString().padStart(4, '0');
    }
}

function moveEnemy(car) {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(item => {
        if (isCollide(car, item)) {
            endGame();
        }

        if (item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 340) + 'px';
        }
        
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

function playGame() {
    let car = document.querySelector('.player');
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemy(car);

        if ((keys.ArrowUp || keys.w) && player.y > (road.top + 70)) player.y -= player.speed;
        if ((keys.ArrowDown || keys.s) && player.y < (road.bottom - 110)) player.y += player.speed;
        if ((keys.ArrowLeft || keys.a) && player.x > 0) player.x -= player.speed;
        if ((keys.ArrowRight || keys.d) && player.x < (road.width - 60)) player.x += player.speed;

        car.style.top = player.y + 'px';
        car.style.left = player.x + 'px';

        window.requestAnimationFrame(playGame);
        
        player.score++;
        if (player.score % 500 === 0) player.speed += 0.5; // Increase speed over time
        
        score.innerText = player.score.toString().padStart(4, '0');
    }
}

function start() {
    startScreen.classList.add('hidden');
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    player.speed = 5;

    // Create road lines
    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'line');
        roadLine.y = (x * 150);
        roadLine.style.top = roadLine.y + 'px';
        gameArea.appendChild(roadLine);
    }

    // Create player car
    let car = document.createElement('div');
    car.setAttribute('class', 'car player');
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // Create enemy cars
    for (let x = 0; x < 3; x++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'car enemy');
        enemyCar.y = ((x + 1) * 350) * -1;
        enemyCar.style.top = enemyCar.y + 'px';
        enemyCar.style.left = Math.floor(Math.random() * 340) + 'px';
        gameArea.appendChild(enemyCar);
    }

    window.requestAnimationFrame(playGame);
}

function restart() {
    gameOverScreen.classList.add('hidden');
    start();
}
