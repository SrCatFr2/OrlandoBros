import {
    resolveHorizontalCollision,
    resolveVerticalCollision
} from "./physics.js";


export class Player {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.width = 48;
        this.height = 64;


        this.velocityX = 0;
        this.velocityY = 0;


        this.speed = 360;

        this.acceleration = 2400;

        this.friction = 2200;


        this.jumpForce = 720;

        this.gravity = 1900;


        this.onGround = false;

        this.direction = 1;


        this.sprite = null;


        this.spawnX = x;
        this.spawnY = y;


        this.animTime = 0;
    }


    setSprite(image) {

        this.sprite = image;
    }


    update(
        dt,
        input,
        platforms,
        particles
    ) {

        this.animTime += dt;


        let direction = 0;


        if (input.left) {
            direction -= 1;
        }


        if (input.right) {
            direction += 1;
        }


        if (direction !== 0) {

            this.velocityX +=
                direction *
                this.acceleration *
                dt;


            this.direction =
                direction;
        }

        else {

            if (this.velocityX > 0) {

                this.velocityX =
                    Math.max(
                        0,
                        this.velocityX -
                        this.friction *
                        dt
                    );
            }


            if (this.velocityX < 0) {

                this.velocityX =
                    Math.min(
                        0,
                        this.velocityX +
                        this.friction *
                        dt
                    );
            }
        }


        this.velocityX =
            Math.max(
                -this.speed,
                Math.min(
                    this.speed,
                    this.velocityX
                )
            );


        if (
            input.jumpPressed &&
            this.onGround
        ) {

            this.velocityY =
                -this.jumpForce;

            this.onGround = false;


            particles.burst(
                this.x + this.width / 2,
                this.y + this.height,
                7
            );
        }


        input.consumeJump();


        this.velocityY +=
            this.gravity * dt;


        this.velocityY =
            Math.min(
                this.velocityY,
                1100
            );


        this.x +=
            this.velocityX * dt;


        resolveHorizontalCollision(
            this,
            platforms
        );


        const previousGround =
            this.onGround;


        this.onGround = false;


        this.y +=
            this.velocityY * dt;


        resolveVerticalCollision(
            this,
            platforms
        );


        if (
            !previousGround &&
            this.onGround
        ) {

            particles.burst(
                this.x + this.width / 2,
                this.y + this.height,
                5
            );
        }
    }


    draw(ctx, cameraX) {

        const screenX =
            Math.floor(
                this.x - cameraX
            );

        const screenY =
            Math.floor(this.y);


        if (this.sprite && this.sprite.complete) {

            ctx.save();


            if (this.direction < 0) {

                ctx.translate(
                    screenX + this.width,
                    0
                );

                ctx.scale(
                    -1,
                    1
                );

                ctx.drawImage(
                    this.sprite,
                    0,
                    screenY,
                    this.width,
                    this.height
                );

            }

            else {

                ctx.drawImage(
                    this.sprite,
                    screenX,
                    screenY,
                    this.width,
                    this.height
                );
            }


            ctx.restore();

        }

        else {

            // Fallback si el sprite todavía no carga

            ctx.fillStyle = "#b93b2e";

            ctx.fillRect(
                screenX,
                screenY,
                this.width,
                this.height
            );


            ctx.fillStyle = "#e8c69b";

            ctx.fillRect(
                screenX + 7,
                screenY + 5,
                this.width - 14,
                22
            );
        }
    }
}
