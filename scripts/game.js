import { Player } from "./player.js";
import { LEVEL } from "./levels.js";
import { Input } from "./input.js";
import { Camera } from "./camera.js";
import { ParticleSystem } from "./particles.js";


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


let width = 0;
let height = 0;

let lastTime = 0;

let gameOver = false;

let coins = 0;


const input = new Input();

const particles = new ParticleSystem();

const camera = new Camera();

const player = new Player(
    LEVEL.playerStart.x,
    LEVEL.playerStart.y
);


const orlandoImage = new Image();

orlandoImage.src = "../assets/images/orlando.png";

orlandoImage.onload = () => {
    player.setSprite(orlandoImage);
};


function resize() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    ctx.imageSmoothingEnabled = false;
}


window.addEventListener("resize", resize);

resize();


function update(dt) {

    if (gameOver) {
        return;
    }


    player.update(
        dt,
        input,
        LEVEL.platforms,
        particles
    );


    particles.update(dt);


    camera.update(
        player,
        LEVEL.width,
        width
    );


    if (player.y > LEVEL.height + 500) {

        die();

        return;
    }


    for (const coin of LEVEL.coins) {

        if (coin.collected) {
            continue;
        }


        const dx =
            player.x + player.width / 2 -
            coin.x;

        const dy =
            player.y + player.height / 2 -
            coin.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);


        if (distance < 28) {

            coin.collected = true;

            coins++;

            document.getElementById("coinCount").textContent = coins;

            particles.burst(
                coin.x,
                coin.y,
                12
            );
        }
    }
}


function draw() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    drawBackground();

    drawWorld();

    particles.draw(
        ctx,
        camera.x
    );

    player.draw(
        ctx,
        camera.x
    );
}


function drawBackground() {

    const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        height
    );

    gradient.addColorStop(
        0,
        "#181010"
    );

    gradient.addColorStop(
        1,
        "#38201b"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // Luna

    const moonX =
        width * 0.78;

    const moonY =
        height * 0.22;

    ctx.fillStyle = "#e5d7b9";

    ctx.beginPath();

    ctx.arc(
        moonX,
        moonY,
        48,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Manchas de la luna

    ctx.fillStyle = "rgba(80,60,50,0.25)";

    ctx.beginPath();

    ctx.arc(
        moonX - 15,
        moonY - 8,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        moonX + 17,
        moonY + 12,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Montañas

    ctx.fillStyle = "#160d0d";

    const mountainOffset =
        -(camera.x * 0.18);

    ctx.beginPath();

    ctx.moveTo(
        mountainOffset,
        height
    );

    for (
        let x = mountainOffset;
        x < width + 500;
        x += 140
    ) {

        const peak =
            height - 130 -
            Math.sin(x * 0.02) * 45;

        ctx.lineTo(
            x + 70,
            peak
        );

        ctx.lineTo(
            x + 140,
            height
        );
    }

    ctx.closePath();

    ctx.fill();
}


function drawWorld() {

    const groundY = LEVEL.ground.y;

    // Suelo

    const groundScreenX =
        LEVEL.ground.x - camera.x;


    ctx.fillStyle = "#261411";

    ctx.fillRect(
        groundScreenX,
        groundY,
        LEVEL.ground.width,
        LEVEL.ground.height
    );


    // Tierra

    ctx.fillStyle = "#48231b";

    ctx.fillRect(
        groundScreenX,
        groundY,
        LEVEL.ground.width,
        14
    );


    // Bloques de suelo

    ctx.strokeStyle =
        "rgba(0,0,0,0.35)";

    ctx.lineWidth = 2;


    for (
        let x = LEVEL.ground.x;
        x < LEVEL.ground.x + LEVEL.ground.width;
        x += 40
    ) {

        const screenX =
            x - camera.x;

        ctx.strokeRect(
            screenX,
            groundY + 14,
            40,
            40
        );
    }


    // Plataformas

    for (const platform of LEVEL.platforms) {

        const x =
            platform.x - camera.x;


        if (
            x + platform.width < 0 ||
            x > width
        ) {
            continue;
        }


        ctx.fillStyle = "#6b3023";

        ctx.fillRect(
            x,
            platform.y,
            platform.width,
            platform.height
        );


        ctx.fillStyle = "#9a4932";

        ctx.fillRect(
            x,
            platform.y,
            platform.width,
            7
        );


        ctx.strokeStyle =
            "rgba(0,0,0,0.55)";

        ctx.strokeRect(
            x,
            platform.y,
            platform.width,
            platform.height
        );
    }


    // Monedas

    for (const coin of LEVEL.coins) {

        if (coin.collected) {
            continue;
        }


        const x =
            coin.x - camera.x;


        ctx.fillStyle = "#e0a82e";

        ctx.beginPath();

        ctx.arc(
            x,
            coin.y,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle = "#5d3d0e";

        ctx.lineWidth = 3;

        ctx.stroke();
    }


    // Bandera final

    const flagX =
        LEVEL.goal.x - camera.x;


    ctx.fillStyle = "#d8c4a0";

    ctx.fillRect(
        flagX,
        LEVEL.goal.y,
        5,
        90
    );


    ctx.fillStyle = "#b53027";

    ctx.beginPath();

    ctx.moveTo(
        flagX + 5,
        LEVEL.goal.y
    );

    ctx.lineTo(
        flagX + 65,
        LEVEL.goal.y + 18
    );

    ctx.lineTo(
        flagX + 5,
        LEVEL.goal.y + 36
    );

    ctx.closePath();

    ctx.fill();
}


function die() {

    if (gameOver) {
        return;
    }

    gameOver = true;

    document
        .getElementById("deathScreen")
        .classList
        .add("visible");
}


function restart() {

    location.reload();
}


document
    .getElementById("restartButton")
    .addEventListener(
        "click",
        restart
    );


document
    .getElementById("menuButton")
    .addEventListener(
        "click",
        () => {
            location.href = "../index.html";
        }
    );


function loop(timestamp) {

    if (!lastTime) {
        lastTime = timestamp;
    }


    let dt =
        (timestamp - lastTime) / 1000;


    lastTime = timestamp;


    dt = Math.min(
        dt,
        0.033
    );


    update(dt);

    draw();


    requestAnimationFrame(loop);
}


requestAnimationFrame(loop);
