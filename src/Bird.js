import * as PIXI from "pixi.js";
export class Bird {
    speedY = 0;
    sprite = new PIXI.Sprite();
    isDied = false;
    textureCounter = 0;
    sprite_ary;
    canvasWidthHeight;
    tubeList;

    updateTexture = () => {
        if (this.isDied) return;
        // this.sprite.texture = PIXI.loader.resources[BIRD_FRAME_LIST[this.textureCounter++]].texture;
        this.sprite.texture = PIXI.Texture.from(this.sprite_ary[this.textureCounter++]);
        if (this.textureCounter === this.sprite_ary.length) this.textureCounter = 0;
    };

    updateSprite = () => {
        this.speedY += GRAVITY / 70;
        this.sprite.y += this.speedY;
        this.sprite.rotation = Math.atan(this.speedY / GAME_SPEED_X);

        let isCollide = false;
        const { x, y, width, height } = this.sprite;
        this.tubeList.forEach((idx) => {
            if (idx.checkCollision(x - width / 2, y - height / 2, width, height))
                isCollide = true;
        });
        if (y < -height / 2 || y > this.canvasWidthHeight + height / 2) isCollide = true;

        if (isCollide) {
            this.onCollision();
            this.isDied = true;
        }
    };

    addSpeed(speedInc) {
        this.speedY += speedInc;
        this.speedY = Math.max(-GRAVITY, this.speedY);
    }

    reset() {
        this.sprite.x = this.canvasWidthHeight / 6;
        this.sprite.y = this.canvasWidthHeight / 2.5;
        this.speedY = 0;
        this.isDied = false;
    }

    test() {
        console.log("test()");
    };

    constructor(
        // stage: PIXI.Container,
        // tubeList: Tube[],
        // onCollision: () => {}
        displayObject,
        spriteAry,
        widthHeight
    ) {
        this.sprite_ary = spriteAry;
        this.canvasWidthHeight = widthHeight;
        // this.tubeList = 

        displayObject.addChild(this.sprite);
        this.sprite.anchor.set(0.5, 0.5);
        this.updateTexture();
        this.sprite.scale.x = 0.06;
        this.sprite.scale.y = 0.06;
        this.reset();

        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 32) this.addSpeed(-GRAVITY / 3);
        });
        displayObject.on("pointerdown", () => this.addSpeed(-GRAVITY / 3));

        setInterval(this.updateTexture, 200);
    }
}