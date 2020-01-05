var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var gameOver = false;

var gravity = 9;
var score = 0;

var pX = canvas.width / 2 - 25; // initial player x
var pY = canvas.height - 100;   // initial player y
var pHeight = 50;
var pWidth = 50;
var jumping = false;
var grounded = true;
var jumpHeight = 200;
var jumpSpeed = 19;
var leftPressed = false;
var rightPressed = false;

var enemies = []
var enemyWidth = 40;
var enemyHeight = 40;
var enemySpeed = 3;
var enemyInterval = 1000;

var speedInterval = 5000;

window.setInterval(drawEnemy, enemyInterval);
window.setInterval(increaseSpeed, speedInterval);

// space bar pressed
document.addEventListener('keydown', function(event) {
	if(event.keyCode == 32) {
		if(grounded) {
			jumpHeight = 200;
			jumping = true;
			grounded = false;
		}
	}
	if(event.keyCode == 65) {
		leftPressed = true;
	}
	if(event.keyCode == 68) {
		rightPressed = true;
	}
});

document.addEventListener('keyup', function(event) {
	if(event.keyCode == 65) {
		leftPressed = false;
	}
	else if(event.keyCode == 68) {
		rightPressed = false;
	}
});

function drawPlayer() {
	ctx.beginPath();
	ctx.rect(pX, pY, pHeight, pWidth);
	ctx.fillStyle = "blue";
	ctx.fill();
}

function drawEnemy() {
	var num = Math.floor(Math.random() * 2);
	var startX = 0 - enemyWidth;
	var direction = 0; // 0 means enemy is moving right, 1 is left

	if(num == 1) {
		startX = canvas.width;
		direction = 1;
	}

	var height = canvas.height - enemyHeight;
	num = Math.floor(Math.random() * 4);

	if(num == 3) {
		height = canvas.height - (enemyHeight * 3) - 10;
	}

	var enemy = {
		x: startX,
		y: height,
		dir: direction
	};

	enemies.push(enemy);
}

function increaseSpeed() {
	enemySpeed += 1;
}

function updateEnemy() {
	for(var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];

		// if(!enemy.dead) {
		ctx.beginPath();
		ctx.rect(enemy.x, enemy.y, enemyWidth, enemyHeight);
		ctx.fillStyle = "red";
		ctx.fill();
	}
}

function showScore() {
	ctx.font = "18px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Score: " + score, 10, 30);
}

function gameOverScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("Game Over", 10, 50);
	
	ctx.fillStyle = "black";
	ctx.fillText("Final Score: " + (score - 1), 10, 100);
}

function removeDeadEnemies(deadEnemies) {
	for(var i = 0; i < deadEnemies.length; i++) {
		enemy = deadEnemies[i];
		index = enemies.indexOf(enemy);

		if (index > -1) {
			enemies.splice(index, 1);
		}
	}
}

function checkGroundCollision() {
	// jumping and ground collision
	if(jumping) {
		if(pY >= jumpHeight) {
			pY -= jumpSpeed;
			jumpSpeed = jumpSpeed - (jumpSpeed * 0.07)
		}
		else {
			jumping = false;
			jumpSpeed = 19;
		}
	}
	else {
		if(pY + pHeight < canvas.height - 5) {
			pY += gravity;
		}
		else {
			grounded = true;
		}
	}
}

function checkPlayerEnemyCollision() {
	var deadEnemies = [];

	for(var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];

		// check if player hit enemy from the side
		if(pX <= enemy.x + enemyWidth - 8 && pX + pWidth >= enemy.x + 8) {
			if(pY + pHeight >= enemy.y + 10 && pY <= enemy.y + enemyHeight - 10) {
				gameOver = true;
			}
		}

		// check if player jumped on enemy
		if(pX < enemy.x + enemyWidth - 8 && pX + pWidth > enemy.x + 8) {
			if(pY + pHeight >= enemy.y && pY < enemy.y) {
				deadEnemies.push(enemy);
				jumpHeight = pY - 150;
				jumping = true;
				score++;
			}
		}
	}

	return deadEnemies;
}

function updatePlayerPos() {
	// movement
	if(leftPressed) {
		if(pX >= 0) {
			pX -= 7;
		}
	}
	else if(rightPressed) {
		if(pX + pWidth <= canvas.width) {
			pX += 7;
		}
	}
}

function updateEnemyPos() {
	// update enemy position
	for(var i = 0; i < enemies.length; i++) {
		if(enemies[i].dir == 0) {
			enemies[i].x += enemySpeed;
		}
		else {
			enemies[i].x -= enemySpeed;
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	showScore();
	drawPlayer();
	updateEnemy();

	checkGroundCollision();
	var deadEnemies = checkPlayerEnemyCollision();
	updatePlayerPos();
	updateEnemyPos();

	if(gameOver) {
		gameOverScreen();
	}
	else {
		removeDeadEnemies(deadEnemies);
		requestAnimationFrame(draw);
	}
}

draw();
