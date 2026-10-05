export function resolveHorizontalCollision(
    entity,
    platforms
) {

    for (const platform of platforms) {

        if (
            entity.x < platform.x + platform.width &&
            entity.x + entity.width > platform.x &&
            entity.y < platform.y + platform.height &&
            entity.y + entity.height > platform.y
        ) {

            if (entity.velocityX > 0) {

                entity.x =
                    platform.x -
                    entity.width;

            }

            else if (entity.velocityX < 0) {

                entity.x =
                    platform.x +
                    platform.width;
            }


            entity.velocityX = 0;
        }
    }
}


export function resolveVerticalCollision(
    entity,
    platforms
) {

    for (const platform of platforms) {

        const horizontal =
            entity.x < platform.x + platform.width &&
            entity.x + entity.width > platform.x;


        if (!horizontal) {
            continue;
        }


        if (
            entity.velocityY >= 0 &&
            entity.y + entity.height >= platform.y &&
            entity.y + entity.height -
            entity.velocityY * 0.02 <= platform.y
        ) {

            entity.y =
                platform.y -
                entity.height;

            entity.velocityY = 0;

            entity.onGround = true;
        }


        else if (
            entity.velocityY < 0 &&
            entity.y <= platform.y + platform.height &&
            entity.y -
            entity.velocityY * 0.02 >=
            platform.y + platform.height
        ) {

            entity.y =
                platform.y +
                platform.height;

            entity.velocityY = 0;
        }
    }
}
