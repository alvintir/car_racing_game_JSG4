

const canvas = document.querySelector('canvas');
const scoreElement = document.querySelector('#score span');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');

let pause = false;
let score = 0;
let speed = 0;

const roadlayout = new Image();
roadlayout.src = 'street.png';

const vehicles = [
    'assets/Ambulance.png',
    'assets/Audi.png',
    'assets/Black_viper.png',
    'assets/Car.png',
    'assets/Mini_truck.png',
    'assets/Mini_van.png',
    'assets/Police.png',
    'assets/truck.png',
    'assets/taxi.png'
];

const randomVehicle = () => vehicles[Math.floor(Math.random() * vehicles.length)];
var music = new Audio('VEHCar_Acceleration aston martin (ID 0600)_BSB.wav');


const gameOver = () => {
    pause = true;
    let response = prompt("Game Over!\nPlay Again?\nClick Ok");
    if(response != null){
        location.reload();
    }
}



let roadlayoutPosY = 0;
const drawRoad = () => {
    context.drawImage(roadlayout, 0, roadlayoutPosY - canvas.height, canvas.width, canvas.height * 2);
    //context.drawImage(roadlayout, 0, roadlayoutPosY, canvas.width, canvas.height);
    roadlayoutPosY += 10 + speed ;
    //Reset road position
    if (roadlayoutPosY >= canvas.height) {
        roadlayoutPosY = 0;
    }
    if (pause) return; 
    window.requestAnimationFrame(drawRoad);
}
roadlayout.onload = () => {
     drawRoad();
};


const spawnObstacless = (positionY) => {
    let Obstacles = new Image();
    Obstacles.src = randomVehicle();
    let ObstaclesPosX = [300,400, 500,600,700,800,900,1000][Math.floor(Math.random()*8)];
    let ObstaclesPosY = positionY;
    
    Obstacles.onload = () => {
        const drawObstacles = () => {
            context.drawImage(Obstacles, ObstaclesPosX, ObstaclesPosY);
           
            if (pause) return;
            ObstaclesPosY += 1 + speed;
            if (ObstaclesPosY >= canvas.height) {
                scoreElement.innerHTML = ++score;
                //Obstacles.src = randomVehicle();
                ObstaclesPosX = [300,400, 500,600,700,800,900,1000][Math.floor(Math.random()*8)];
                ObstaclesPosY = -Obstacles.height;
            } else if (ObstaclesPosY + Obstacles.height > playerVehiclePositionY) {
                if (playerVehiclePositionX > ObstaclesPosX && playerVehiclePositionX < ObstaclesPosX + Obstacles.width || playerVehiclePositionX + playerVehicle.width > ObstaclesPosX && playerVehiclePositionX + playerVehicle.width < ObstaclesPosX + Obstacles.width) {
                    gameOver();
                } else if (ObstaclesPosX > playerVehiclePositionX && ObstaclesPosX < playerVehiclePositionX + playerVehicle.width || ObstaclesPosX + Obstacles.width > playerVehiclePositionX && ObstaclesPosX + Obstacles.width < playerVehiclePositionX + playerVehicle.width) {
                    gameOver();
                }
            }
            window.requestAnimationFrame(drawObstacles);
        }
        drawObstacles();
    };
} 

spawnObstacless(-285);
spawnObstacless(-750);

const playerVehicle = new Image();
playerVehicle.src = randomVehicle();

let playerVehiclePositionX, playerVehiclePositionY;
let playerVehicleSpeed = 0;

playerVehicle.onload = () => {
    playerVehiclePositionX = (canvas.width - playerVehicle.width) / 2;
    playerVehiclePositionY = canvas.height - playerVehicle.height -10;
    const drawplayerVehicle = () => {
        context.drawImage(playerVehicle, playerVehiclePositionX, playerVehiclePositionY);
        if (playerVehiclePositionX + playerVehicleSpeed > canvas.width - playerVehicle.width) {
            playerVehiclePositionX = canvas.width - playerVehicle.width;    
        } else if (playerVehiclePositionX + playerVehicleSpeed < 0) {
            playerVehiclePositionX = 0;
        } else {
            playerVehiclePositionX += playerVehicleSpeed;
        } 
        if (pause) return;
        window.requestAnimationFrame(drawplayerVehicle);
    }
    drawplayerVehicle();
};

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' && playerVehiclePositionX >= 0) {
        playerVehicleSpeed = -5;
    } else if (e.code === 'ArrowRight' && playerVehiclePositionX < canvas.width-playerVehicle.width) {
        playerVehicleSpeed = 5;
    } else if (e.code === 'Space') {
        speed = 10;
        music.play();
    }
});


document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        speed = 2;
        music.play();
    } else if (e.code === 'ArrowRight' || 'ArrowLeft') {
        playerVehicleSpeed = 0;
    }
});

