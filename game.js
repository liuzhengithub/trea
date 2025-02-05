// 游戏配置
const config = {
    gridSize: 20,
    initialSpeed: 200,
    speedIncrease: 5
};

// 游戏状态
let snake = [];
let food = null;
let direction = 'right';
let nextDirection = 'right';
let gameLoop = null;
let score = 0;
let currentSpeed = config.initialSpeed;

// 获取Canvas上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridWidth = canvas.width / config.gridSize;
const gridHeight = canvas.height / config.gridSize;

// 初始化游戏
function initGame() {
    snake = [
        {x: 5, y: 5},
        {x: 4, y: 5},
        {x: 3, y: 5}
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    currentSpeed = config.initialSpeed;
    generateFood();
    updateScore();
}

// 生成食物
function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        // 确保食物不会生成在蛇身上
        if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            break;
        }
    }
}

// 更新分数
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('finalScore').textContent = score;
}

// 游戏主循环
function gameStep() {
    // 更新蛇的方向
    direction = nextDirection;

    // 计算新的头部位置
    const head = {...snake[0]};
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // 检查碰撞
    if (isCollision(head)) {
        gameOver();
        return;
    }

    // 移动蛇
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        currentSpeed = Math.max(50, currentSpeed - config.speedIncrease);
        generateFood();
        updateScore();
    } else {
        snake.pop();
    }

    // 绘制游戏画面
    drawGame();
}

// 碰撞检测
function isCollision(head) {
    // 检查是否撞墙
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
    }

    // 检查是否撞到自己
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 绘制游戏画面
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // 绘制垂直线
    for (let x = 0; x <= canvas.width; x += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // 绘制水平线
    for (let y = 0; y <= canvas.height; y += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        ctx.fillRect(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            config.gridSize - 1,
            config.gridSize - 1
        );
    });

    // 绘制食物
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(
        food.x * config.gridSize,
        food.y * config.gridSize,
        config.gridSize - 1,
        config.gridSize - 1
    );
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('gameOver').style.display = 'block';
}

// 开始游戏
function startGame() {
    document.getElementById('gameOver').style.display = 'none';
    initGame();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(() => gameStep(), currentSpeed);
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// 初始化游戏
startGame();