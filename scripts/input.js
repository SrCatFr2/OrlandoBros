export class Input {

    constructor() {

        this.left = false;
        this.right = false;

        this.jumpPressed = false;


        this.keys = new Set();


        window.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.code === "ArrowLeft" ||
                    event.code === "KeyA"
                ) {

                    this.left = true;
                }


                if (
                    event.code === "ArrowRight" ||
                    event.code === "KeyD"
                ) {

                    this.right = true;
                }


                if (
                    event.code === "Space" ||
                    event.code === "ArrowUp" ||
                    event.code === "KeyW"
                ) {

                    if (!this.keys.has(event.code)) {
                        this.jumpPressed = true;
                    }
                }


                this.keys.add(event.code);
            }
        );


        window.addEventListener(
            "keyup",
            (event) => {

                this.keys.delete(event.code);


                if (
                    event.code === "ArrowLeft" ||
                    event.code === "KeyA"
                ) {

                    this.left = false;
                }


                if (
                    event.code === "ArrowRight" ||
                    event.code === "KeyD"
                ) {

                    this.right = false;
                }
            }
        );


        this.setupTouch(
            "leftButton",
            "left"
        );


        this.setupTouch(
            "rightButton",
            "right"
        );


        const jump =
            document.getElementById(
                "jumpButton"
            );


        jump.addEventListener(
            "pointerdown",
            (event) => {

                event.preventDefault();

                this.jumpPressed = true;
            }
        );
    }


    setupTouch(
        id,
        property
    ) {

        const button =
            document.getElementById(id);


        button.addEventListener(
            "pointerdown",
            (event) => {

                event.preventDefault();

                this[property] = true;
            }
        );


        button.addEventListener(
            "pointerup",
            (event) => {

                event.preventDefault();

                this[property] = false;
            }
        );


        button.addEventListener(
            "pointercancel",
            () => {

                this[property] = false;
            }
        );


        button.addEventListener(
            "pointerleave",
            () => {

                this[property] = false;
            }
        );
    }


    consumeJump() {

        this.jumpPressed = false;
    }
}
