import * as PIXI from "pixi.js";
import { displayDateText } from "./helper/text.js";
import { displayParamText } from "./helper/text.js";
import { displaySprite } from "./helper/sprite.js";
import { Common } from "./helper/common.js";

// import { Bird } from "./Bird.js";
// import { Tube } from "./Tube.js";

// import img_snowman from "./images/pic_yukidaruma.png";
// import img_bg from "./images/pic_darksky_bg.jpg";

import img_frame1 from "./images/frame-1.png";
import img_frame2 from "./images/frame-2.png";
import img_frame3 from "./images/frame-3.png";
import img_frame4 from "./images/frame-4.png";

import "./main.css";

const CANVAS_WIDTH_HEIGHT = Math.min(
    Math.min(window.innerHeight, window.innerWidth),
    512
);
const GRAVITY = 9.8;
const GAME_SPEED_X = 40;
const BIRD_FRAME_LIST = [
    img_frame1,
    img_frame2,
    img_frame3,
    img_frame4,
];
const TUBE_POS_LIST = [
    CANVAS_WIDTH_HEIGHT + 50,
    CANVAS_WIDTH_HEIGHT + 250,
    CANVAS_WIDTH_HEIGHT + 480,
];

/*
const renderer = PIXI.autoDetectRenderer(canvasWidthHeight, canvasWidthHeight, {
    backgroundColor: 0xc1c2c4,
});
document.body.appendChild(renderer.view);
const stage: PIXI.Container = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle(0, 0, 1000, 1000);
renderer.render(stage);
*/

// const tubeList = TUBE_POS_LIST.map((idx) => new Tube(stage, idx));

let isGameStarted = false;
let isGameFailed = false;

// PIXI.loader.add(BIRD_FRAME_LIST).load(setup);

// init
let app = new PIXI.Application({ width: CANVAS_WIDTH_HEIGHT, height: CANVAS_WIDTH_HEIGHT });
app.renderer.backgroundColor = 0xc1c2c4;
document.body.appendChild(app.view);

// bg area
let container_bg = new PIXI.Container();
container_bg.x = 0;
container_bg.y = 0;
app.stage.addChild(container_bg);

// bird, wall area
let container = new PIXI.Container();
container.width = CANVAS_WIDTH_HEIGHT;
container.height = CANVAS_WIDTH_HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactive = true;
container.visible = true;
app.stage.addChild(container);

// click area
let hitArea = new PIXI.Graphics();
hitArea.lineStyle(1, 0xff0033, 1); // width, color, alpha
hitArea.beginFill(0xff0033);
hitArea.drawRect(0, 0, CANVAS_WIDTH_HEIGHT, CANVAS_WIDTH_HEIGHT);
hitArea.endFill();
hitArea.alpha = 0;
hitArea.visible = false;
hitArea.interactive = true;
hitArea.interactiveChildren = false;
hitArea.buttonMode = false
container.addChild(hitArea);
hitArea.visible = true;


const button = document.querySelector("#start");
if (button) {
    button.addEventListener("click", () => {
        console.log("button pushed!");
        isGameStarted = true;
        button.innerHTML = "Retry";
        if (isGameFailed) {
            isGameFailed = false;
            // tubeList.forEach((d, i) => d.reset(TUBE_POS_LIST[i]));
            // bird.reset();
        }
        button.classList.add("hide");
    });
}

// temp bird class test
let bird = new Bird(container, BIRD_FRAME_LIST, CANVAS_WIDTH_HEIGHT);
bird.test();

// console.log(img_cat); // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAA.....

// Execute the method defined in sprite.js
//displaySprite(app, img_bg, 0, 0);
//displaySprite(app, img_snowman, 200, 200, 0.5, 0.5);

// Execute the method defined in text.js
displayDateText(app);

// Execute the method and Read the property defined in common.js
let ver = Common.pixi_version;
let size = Common.getAppRenderSize(app);
let type = Common.getAppRenderType(app);

// display Pixi data
displayParamText(app, ver, 230);
displayParamText(app, size, 260);
displayParamText(app, type, 290);

//// Main

// v5 ticker
let ticker = PIXI.Ticker.shared;
// Set this to prevent starting this ticker when listeners are added.
// By default this is true only for the PIXI.Ticker.shared instance.
ticker.autoStart = false;
// FYI, call this to ensure the ticker is stopped. It should be stopped
// if you have not attempted to render anything yet.
// ticker.stop();
// Call this when you are ready for a running shared ticker.
// ticker.start();

ticker.add((time) => {
    // app.renderer;
    // console.log("render...", time);
    update(time);
});
/*
// You may use the shared ticker to render...
let renderer = PIXI.autoDetectRenderer();
let stage = new PIXI.Container();
document.body.appendChild(renderer.view);
ticker.add(function (time) {
    renderer.render(stage);
});
*/

// TODO: separate text, animation, pic layer
// let container_bg = new PIXI.Container();
// container_bg.x = 0;
// container_bg.y = 0;
// app.stage.addChild(container_bg);

ticker.start(); // reder start

/**
 * app rendering
 * @param { number } time
 */
const update = (time) => {
    console.log("update()")
}

//テスト用
/*
class Bird {

        constructor(){
            console.log("Bird constructor()");
        }

        test(){
            console.log("Bird test()");
        }

}
*/

/**
 * 
 */
class Bird {

    // speedY = 0;
    // sprite = new PIXI.Sprite();
    // isDied = false;
    // stextureCounter = 0;

    // 
    speedY = 0;
    sprite = new PIXI.Sprite();
    isDied = false;
    textureCounter = 0;
    sprite_ary;
    canvasWidthHeight;
    tubeList;

    updateTexture = () => {
        console.log("Bird updateTexture()");
        if (this.isDied) return;
        // this.sprite.texture =
            // PIXI.loader.resources[BIRD_FRAME_LIST[this.textureCounter++]].texture;
            this.sprite.texture = PIXI.Texture.from(this.sprite_ary[this.textureCounter++]);
        console.log("this.sprite.texture: ", this.sprite.texture);
        if (this.textureCounter === BIRD_FRAME_LIST.length) this.textureCounter = 0;
    };

    updateSprite = () => {
        console.log("Bird updateSprite()");
        this.speedY += GRAVITY / 70;
        this.sprite.y += this.speedY;
        this.sprite.rotation = Math.atan(this.speedY / GAME_SPEED_X);

        let isCollide = false;
        const { x, y, width, height } = this.sprite;
        this.tubeList.forEach((d) => {
            if (d.checkCollision(x - width / 2, y - height / 2, width, height))
                isCollide = true;
        });
        if (y < -height / 2 || y > canvasWidthHeight + height / 2) isCollide = true;

        if (isCollide) {
            this.onCollision();
            this.isDied = true;
        }
    };

    addSpeed(speedInc) {
        console.log("Bird addSpeed()");
        this.speedY += speedInc;
        this.speedY = Math.max(-GRAVITY, this.speedY);
    }

    reset() {
        console.log("Bird reset()");
        this.sprite.x = this.canvasWidthHeight / 6;
        this.sprite.y = this.canvasWidthHeight / 2.5;
        this.speedY = 0;
        this.isDied = false;
    }

    /**
     * 
     * @param {*} stage 
     * @param {*} tubeList 
     */
    constructor(
        // stage, // ゲーム用ステージのコンテナ
        // tubeList, // 鳥のスプライトリスト
        // onCollision // 当たり判定用、縦横pxか512の小さい方
        displayObject,// ゲーム表示用ステージのコンテナ
        spriteAry,// 鳥のスプライトリスト
        widthHeight// 当たり判定用、縦横pxか512の小さい方

    ) {
        // console.log("Bird constructor()");
        // stage.addChild(this.sprite);

        this.sprite_ary = spriteAry;
        // this.canvasWidthHeight = widthHeight;
        // this.tubeList = 

        displayObject.addChild(this.sprite);
        this.sprite.anchor.set(0.5, 0.5);
        this.updateTexture();
        this.sprite.scale.x = 0.06;
        this.sprite.scale.y = 0.06;
        this.sprite.x = 100;
        this.sprite.y = 100;
        //this.reset();

        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 32) this.addSpeed(-GRAVITY / 3);
        });
        // stage.on("pointerdown", () => this.addSpeed(-GRAVITY / 3));
        displayObject.on("pointerdown", () => this.addSpeed(-GRAVITY / 3));

        setInterval(this.updateTexture, 200);
    }

    test() {
        console.log("Bird test()");
    }
}

/*
class Tube {
    x = 0;
    y = 0;
    innerDistance = 80;
    tubeWidth = 20;
    sprite = new PIXI.Graphics();

    reset(x = canvasWidthHeight + 20) {
        this.x = x;
        const tubeMinHeight = 60;
        const randomNum =
            Math.random() *
            (canvasWidthHeight - 2 * tubeMinHeight - this.innerDistance);
        this.y = tubeMinHeight + randomNum;
    }

    checkCollision(x, y, width, height) {
        if (!(x + width < this.x || this.x + this.tubeWidth < x || this.y < y)) {
            return true;
        }
        if (
            !(
                x + width < this.x ||
                this.x + this.tubeWidth < x ||
                y + height < this.y + this.innerDistance
            )
        ) {
            return true;
        }
        return false;
    }

    update() {
        this.x -= GAME_SPEED_X / 60;
        if (this.x < -this.tubeWidth) this.reset();

        this.sprite.clear();
        this.sprite.beginFill(0xffffff, 1);
        const { x, y, tubeWidth, innerDistance } = this;
        this.sprite.drawRect(x, 0, tubeWidth, y);
        this.sprite.drawRect(x, y + innerDistance, tubeWidth, canvasWidthHeight);
        this.sprite.endFill();
    }

    constructor(stage, x) {
        stage.addChild(this.sprite);
        this.reset(x);
    }
}
*/

/*
const renderer = PIXI.autoDetectRenderer(canvasWidthHeight, canvasWidthHeight, {
    backgroundColor: 0xc1c2c4,
});
document.body.appendChild(renderer.view);
const stage = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle(0, 0, 1000, 1000);
renderer.render(stage);

const tubeList = TUBE_POS_LIST.map((d) => new Tube(stage, d));

PIXI.loader.add(BIRD_FRAME_LIST).load(setup);

let bird;
const button = document.querySelector("#start");

function setup() {
    bird = new Bird(stage, tubeList, () => {
        // Called when bird hit tube/ground/upper bound
        isGameFailed = true;
        if (button) {
            button.classList.remove("hide");
        }
    });
    requestAnimationFrame(draw);
}

let isGameStarted = false;
let isGameFailed = false;
function draw() {
    if (isGameStarted) {
        bird.updateSprite();
        if (!gameFailed) tubeList.forEach((d) => d.update());
    }
    renderer.render(stage);
    requestAnimationFrame(draw);
}

if (button) {
    button.addEventListener("click", () => {
        isGameStarted = true;
        button.innerHTML = "Retry";
        if (gameFailed) {
            isGameFailed = false;
            tubeList.forEach((d, i) => d.reset(TUBE_POS_LIST[i]));
            bird.reset();
        }
        button.classList.add("hide");
    });
}
*/