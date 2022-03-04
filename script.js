const game = document.getElementById('game');
const btnReset = document.getElementById('btnReset');
const w = 400;
const h = 600;
const bw = 10;
let direction = 'r';
let interval = 100;
let food;
let snake = [];
let snake_head;
let score = 0;
let timer = setInterval(game_loop, interval);

function create_snake(left, top) {
    for (let i = 0; i < 4; ++i) {
        let div = document.createElement('div');
        div.style.top = `${top}px`;
        div.style.left = `${left}px`;
        left = left - bw;
        if (i === 0)
            div.style.backgroundColor = '#6e1919'
        snake.push(div);
        game.appendChild(div);
    }
    snake_head = snake[0];
}

document.addEventListener('DOMContentLoaded', on_load);
function on_load() {
    create_snake(200, 50);
    create_food();
}

document.addEventListener('keydown', on_key_down);
function on_key_down(e) {
    switch (e.key) {
        case 'ArrowRight':
            direction = direction !== 'l' ? 'r' : direction;
            break;
        case 'ArrowLeft':
            direction = direction !== 'r' ? 'l' : direction;
            break;
        case 'ArrowUp':
            direction = direction !== 'd' ? 'u' : direction;
            break;
        case 'ArrowDown':
            direction = direction !== 'u' ? 'd' : direction;
            break;
    }
}

btnReset.addEventListener('click', on_reset);
function on_reset() {
    game.innerHTML = '';
    snake.length = 0;
    btnReset.disabled = true;
    interval = 100;
    direction = 'r';
    score = 0;
    create_snake(200, 50);
    create_food();
    timer = setInterval(game_loop, interval);
    document.getElementById('score').textContent = `Score ${score}`
}

function game_loop() {

    let x = parseInt(snake_head.style.left);
    let y = parseInt(snake_head.style.top);

    if (isGameOver(x, y)) {
        clearInterval(timer);
        btnReset.disabled = false;
        alert('Game Over!');
        return;
    }


    if (snake_head.offsetLeft === food.offsetLeft &&
        snake_head.offsetTop === food.offsetTop) {
        snake.splice(1, 0, food);
        create_food();
        ++score;
        document.getElementById("score").textContent = `Score: ${score}`;
    }

    snake_head.old_y = y;
    snake_head.old_x = x;
    switch (direction) {
        case 'r':
            x += bw;
            break;
        case 'l':
            x -= bw;
            break;
        case 'u':
            y -= bw;
            break;
        case 'd':
            y += bw;
            break;
    }
    snake_head.style.left = `${x}px`;
    snake_head.style.top = `${y}px`;
    for (let i = 1; i < snake.length; ++i) {
        let prev = snake[i - 1];
        x = parseInt(snake[i].style.left);
        y = parseInt(snake[i].style.top);
        snake[i].old_x = x;
        snake[i].old_y = y;
        snake[i].style.left = `${prev.old_x}px`;
        snake[i].style.top = `${prev.old_y}px`;
    }
}

function create_food() {
    let div_food = document.createElement('div');
    let x = 10 * Math.ceil(Math.random() * (w / 10)-1);
    let y = 10 * Math.ceil(Math.random() * (h / 10)-1);
    div_food.style.left = `${x}px`;
    div_food.style.top = `${y}px`;
    food = div_food;
    game.appendChild(div_food);
}

function isGameOver(x, y) {
    for (let i = 1; i < snake.length; ++i) {
        if (snake[i].offsetLeft === x && snake[i].offsetTop === y) {
            return true;
        }
    }
    return x < 0 || x >= w || y >= h || y < 0;
}