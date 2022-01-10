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
            tubeList.forEach((d, i) => d.reset(TUBE_POS_LIST[i]));
            bird.reset();
        }
        //button.classList.add("hide");
    });
}

// ボタン押下で開始に
// temp bird class test
// let bird = new Bird(container, BIRD_FRAME_LIST, CANVAS_WIDTH_HEIGHT);
// bird.test();

// let tube = new Tube(container, 100, CANVAS_WIDTH_HEIGHT);
// tube.test();
let bird;
// let tube;

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

//let tubeList = TUBE_POS_LIST.map((d) => new Tube(container, d, CANVAS_WIDTH_HEIGHT));
// const tubeList = TUBE_POS_LIST.map((d) => new Tube(container, d));

//const tubeList = TUBE_POS_LIST.map((d) => new Tube(displayObject, d));
// tubeList.forEach((d, i) => d.reset(TUBE_POS_LIST[i]));
/*
let tubeList = [];
for (let i = 0; i < TUBE_POS_LIST.length; i++) {
    console.log(i);
    let temp;
    temp = new Tube(container, i, CANVAS_WIDTH_HEIGHT);
    tubeList.push(temp);
}
*/

// requestAnimationFrame(draw);

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
    if (isGameStarted) {
        bird.updateSprite();
        if (!isGameFailed) tubeList.forEach((d) => d.update());
    } else {
        //console.log("まだスタートしてない");
    }
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

// ボタン押下で開始に
ticker.start(); // reder start

/**
 * app rendering
 * @param { number } time
 */
const update = (time) => {
    //console.log("update()")
    // 得点表示等に使用

    if (isGameStarted) {
        bird.updateSprite();
        if (!isGameFailed) tubeList.forEach((d) => d.update());
    }

}

/**
 * 鳥のクラス
 */
class Bird {

    // 
    speedY = 0; // 鳥のy座標移動スピード
    sprite = new PIXI.Sprite(); // 鳥用スプライト
    isDied = false; // 鳥の死亡フラグ
    textureCounter = 0; // 鳥のスプライトアニメ表示切り替え用カウンター
    sprite_ary; // 鳥のスプライトアニメ画像リスト
    canvasWidthHeight; // ステージの縦横サイズ
    tubeList; // 

    /**
     * Bird Animation
     * 鳥のアニメーション
     * @returns 
     */
    updateTexture = () => {
        console.log("Bird updateTexture()");
        if (this.isDied) return; // 死んでいたらキャンセル
        // if (!this.isGameStarted) return;
        // this.sprite.texture =
        // PIXI.loader.resources[BIRD_FRAME_LIST[this.textureCounter++]].texture;
        this.sprite.texture = PIXI.Texture.from(this.sprite_ary[this.textureCounter++]);
        // console.log("this.sprite.texture: ", this.sprite.texture);
        if (this.textureCounter === BIRD_FRAME_LIST.length) this.textureCounter = 0; // 最後まで再生でリセット
    };

    /**
     * Bird Move and Collision
     * 鳥の移動と当たり判定のチェック
     */
    updateSprite = () => {
        console.log("Bird updateSprite()");
        this.speedY += GRAVITY / 70; // 重力を加算
        this.sprite.y += this.speedY; // 鳥のy座標を移動
        this.sprite.rotation = Math.atan(this.speedY / GAME_SPEED_X);

        let isCollide = false; // 当たり判定をリセット
        const { x, y, width, height } = this.sprite; // 鳥の各プロパティを取得
        this.tubeList.forEach((d) => { // チューブとの当たり判定をチェック
            if (d.checkCollision(x - width / 2, y - height / 2, width, height))
                isCollide = true;
        });
        if (y < -height / 2 || y > this.canvasWidthHeight + height / 2) isCollide = true; // 壁との当たり判定をチェック

        if (isCollide) { // 当たり時の処理
            this.onCollision();
            this.isDied = true; // 死亡フラグをtrueに
        }
    };

    /**
     * Bird y speed
     * 鳥のy方向のスピードを加算する
     * @param {*} speedInc 
     */
    addSpeed(speedInc) {
        console.log("Bird addSpeed()");
        this.speedY += speedInc; // y方向スピードにスピード増加分を加算
        this.speedY = Math.max(-GRAVITY, this.speedY); // マイナスした重力かy方向のスピードの大きい方を使用
    }

    /**
     * Bird property reset
     * 鳥のプロパティのリセット
     */
    reset() {
        console.log("Bird reset()");
        this.sprite.x = this.canvasWidthHeight / 6;
        this.sprite.y = this.canvasWidthHeight / 2.5;
        this.speedY = 0; // スピードを0に＝停止
        this.isDied = false; // 死亡フラグをリセット
    }

    onCollision() {
        console.log("Bird onCollision()");
    }

    /**
     * Bird constructor
     * @param {*} displayObject // ゲーム表示用ステージのコンテナ
     * @param {*} spriteAry // 鳥のスプライトリスト
     * @param {*} widthHeight // 当たり判定用、縦横pxか512の小さい方
     */
    constructor(
        // stage, // ゲーム用ステージのコンテナ
        // tubeList, // 鳥のスプライトリスト
        // onCollision // 当たり判定用、縦横pxか512の小さい方
        displayObject,// ゲーム表示用ステージのコンテナ
        spriteAry,// 鳥のスプライトリスト
        widthHeight,// 当たり判定用、縦横pxか512の小さい方
        tubeList

    ) {
        console.log("Bird constructor()");
        // stage.addChild(this.sprite);

        this.sprite_ary = spriteAry;
        this.canvasWidthHeight = widthHeight;
        this.tubeList = tubeList;

        displayObject.addChild(this.sprite);
        this.sprite.anchor.set(0.5, 0.5);
        this.updateTexture();
        this.sprite.scale.x = 0.06;
        this.sprite.scale.y = 0.06;
        //this.sprite.x = 100;
        //this.sprite.y = 100;

        this.reset();
        // this.sprite.stop();// 明示的に停止しないとアニメスタートしてしまうので

        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 32) this.addSpeed(-GRAVITY / 3);
        });
        // stage.on("pointerdown", () => this.addSpeed(-GRAVITY / 3));
        displayObject.on("pointerdown", () => this.addSpeed(-GRAVITY / 3));

        // ここでセットインターバルで回すか、tickerの方で統一するか
        setInterval(this.updateTexture, 200);
    }

    /**
     * for test
     */
    test() {
        console.log("Bird test()");
    }
}


/*
class Tube {

    constructor(displayObject, x, wh) {
        // stage.addChild(this.sprite);
        // this.reset(x);
        console.log("Tube constructor():", displayObject, x, wh);
    }

    test() {
        console.log("Tube test()");
    }

}
*/

class Tube {

    x = 0; // チューブのx座標
    y = 0; // チューブのy座標
    innerDistance = 180; // チューブの通り抜けられる部分（縦）のベース
    tubeWidth = 30; // チューブの横幅
    graphics = new PIXI.Graphics(); // チューブ用グラフィック
    canvasWidthHeight; // ステージの縦横サイズ
    displayObject;// ゲーム表示用ステージのコンテナ
    widthHeight// 当たり判定用、縦横pxか512の小さい方

    reset(x = this.canvasWidthHeight + 20) {
        console.log("Tube reset()");
        this.x = x;
        const tubeMinHeight = 60;
        const randomNum =
            Math.random() *
            (this.canvasWidthHeight - 2 * tubeMinHeight - this.innerDistance);
        this.y = tubeMinHeight + randomNum;
        console.log("randomNum: ", randomNum);
        console.log("tubeMinHeight: ", tubeMinHeight);
        console.log("y: ", this.y);
    }

    checkCollision(x, y, width, height) {
        console.log("Tube checkCollision()");
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
        console.log("Tube update()");
        this.x -= GAME_SPEED_X / 60; // x座標をゲームスピード/60フレーム分左に進める
        if (this.x < -this.tubeWidth) this.reset(); // 飛騨に移動しきったらリセット

        this.graphics.clear(); // 
        this.graphics.beginFill(0xffffff, 1);
        const { x, y, tubeWidth, innerDistance } = this;
        this.graphics.drawRect(x, 0, tubeWidth, y);
        this.graphics.drawRect(x, y + innerDistance, tubeWidth, this.canvasWidthHeight);
        this.graphics.endFill();


        // green move ok
        /*
        this.graphics.clear(); // 
        this.graphics.beginFill(0x008800, 10);
        this.graphics.drawRect(this.x, 200, 300, 400);
        this.graphics.endFill();
        this.displayObject.addChild(this.graphics);
        */

    }

    constructor(displayObject, x, idx, widthHeight) {

        console.log("Tube constructor()", x, idx);
        this.displayObject = displayObject;
        this.widthHeight = widthHeight;
        displayObject.addChild(this.graphics);
        this.canvasWidthHeight = widthHeight;
        this.reset(x);

        // this.canvasWidthHeight = CANVAS_WIDTH_HEIGHT; // temp


        console.log("Tube constructor2)");
        this.graphics.clear(); // 
        this.graphics.beginFill(0xff0033, 10);
        this.graphics.drawRect(50, 100, 200, 300);
        this.graphics.endFill();
        displayObject.addChild(this.graphics);
    }

    test() {
        console.log("Tube test()");
    }

}


let tubeList = TUBE_POS_LIST.map((d, idx) => new Tube(container, d, idx, CANVAS_WIDTH_HEIGHT));

// let bird = new Bird(container, BIRD_FRAME_LIST, CANVAS_WIDTH_HEIGHT);
bird = new Bird(container, BIRD_FRAME_LIST, CANVAS_WIDTH_HEIGHT, tubeList, () => {
    // Called when bird hit tube/ground/upper bound
    isGameFailed = true;
    if (button) {
        button.classList.remove("hide");
    }
});


/*
const renderer = PIXI.autoDetectRenderer(canvasWidthHeight, canvasWidthHeight, {
    backgroundColor: 0xc1c2c4ｙ
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