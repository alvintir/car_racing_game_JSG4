

const canvas = document.querySelector('canvas');
const scoreElement = document.querySelector('#score span');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

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
roadlayout.onload = () => {
    const drawRoad = () => {
        ctx.drawImage(roadlayout, 0, roadlayoutPosY - canvas.height, canvas.width, canvas.height * 2);
        //ctx.drawImage(roadlayout, 0, roadlayoutPosY, canvas.width, canvas.height);
        roadlayoutPosY += 10 + speed + score;
        //Reset road position
        if (roadlayoutPosY >= canvas.height) {
            roadlayoutPosY = 0;
        }
        if (pause) return;
        window.requestAnimationFrame(drawRoad);
    }
    drawRoad();
};


const spawnIncommingVehicles = (positionY) => {
    let incommingVehicle = new Image();
    incommingVehicle.src = randomVehicle();
    let incommingVehiclePosX = [12, 145, 285][Math.floor(Math.random() * 3)];
    let incommingVehiclePosY = positionY;
    
    incommingVehicle.onload = () => {
        const drawIncommingVehicle = () => {
            ctx.drawImage(incommingVehicle, incommingVehiclePosX, incommingVehiclePosY);
           
            if (pause) return;
            incommingVehiclePosY += 2 + speed + score;
            if (incommingVehiclePosY >= canvas.height) {
                scoreElement.innerHTML = ++score;
                //incommingVehicle.src = randomVehicle();
                incommingVehiclePosX = [12, 145, 285][Math.floor(Math.random() * 3)];
                incommingVehiclePosY = -incommingVehicle.height;
            } else if (incommingVehiclePosY + incommingVehicle.height > playerVehiclePositionY) {
                if (playerVehiclePositionX > incommingVehiclePosX && playerVehiclePositionX < incommingVehiclePosX + incommingVehicle.width || playerVehiclePositionX + playerVehicle.width > incommingVehiclePosX && playerVehiclePositionX + playerVehicle.width < incommingVehiclePosX + incommingVehicle.width) {
                    gameOver();
                } else if (incommingVehiclePosX > playerVehiclePositionX && incommingVehiclePosX < playerVehiclePositionX + playerVehicle.width || incommingVehiclePosX + incommingVehicle.width > playerVehiclePositionX && incommingVehiclePosX + incommingVehicle.width < playerVehiclePositionX + playerVehicle.width) {
                    gameOver();
                }
            }
            window.requestAnimationFrame(drawIncommingVehicle);
        }
        drawIncommingVehicle();
    };
} 

spawnIncommingVehicles(-285);
spawnIncommingVehicles(-750);

const playerVehicle = new Image();
playerVehicle.src = randomVehicle();

let playerVehiclePositionX, playerVehiclePositionY;
let playerVehicleSpeed = 0;

playerVehicle.onload = () => {
    playerVehiclePositionX = (canvas.width - playerVehicle.width) / 2;
    playerVehiclePositionY = canvas.height - playerVehicle.height -10;
    const drawplayerVehicle = () => {
        ctx.drawImage(playerVehicle, playerVehiclePositionX, playerVehiclePositionY);
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
        playerVehicleSpeed = -12;
    } else if (e.code === 'ArrowRight' && playerVehiclePositionX < canvas.width-playerVehicle.width) {
        playerVehicleSpeed = 12;
    } else if (e.code === 'Space') {
        speed = 10;
        music.play();
    }
});


document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        speed = 0;
        music.play();
    } else if (e.code === 'ArrowRight' || 'ArrowLeft') {
        playerVehicleSpeed = 0;
    }
});

