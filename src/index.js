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
const GRAVITY = 4.4; //;9.8;
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
        button.classList.add("hide");
    });
}

let bird;
let tubeList;

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
displayParamText(app, ver, 450);
displayParamText(app, size, 470);
displayParamText(app, type, 490);

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
        if (!isGameFailed) tubeList.forEach((d) => d.update()); // ゲームが終了していなければチューブを更新する
    }

}

/**
 * 鳥のクラス
 */
class Bird {

    speedY = 0; // 鳥のy座標移動スピード
    sprite = new PIXI.Sprite(); // 鳥用スプライト
    isDied = false; // 鳥の死亡フラグ
    textureCounter = 0; // 鳥のスプライトアニメ表示切り替え用カウンター
    sprite_ary; // 鳥のスプライトアニメ画像リスト
    canvasWidthHeight; // ステージの縦横サイズ
    tubeList; // 各チューブの情報

    /**
     * Bird Animation
     * 鳥のアニメーション
     * @returns 
     */
    updateTexture = () => {
        //　console.log("Bird updateTexture()");
        if (this.isDied) return; // 死んでいたらキャンセル
        // this.sprite.texture =
        // PIXI.loader.resources[BIRD_FRAME_LIST[this.textureCounter++]].texture;
        this.sprite.texture = PIXI.Texture.from(this.sprite_ary[this.textureCounter++]);
        // console.log("this.sprite.texture: ", this.sprite.texture);
        if (this.textureCounter === BIRD_FRAME_LIST.length) this.textureCounter = 0; // 最後まで再生でリセット
    };

    /**
     * Bird Move and Collision Check
     * 鳥の移動と当たり判定のチェック
     */
    updateSprite = () => {
        // console.log("Bird updateSprite()");
        this.speedY += GRAVITY / 170; // 70;// 重力を加算
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
     * @param {number} speedInc 
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

    /**
     * Bird constructor
     * @param {object} displayObject // ゲーム表示用ステージのコンテナ
     * @param {array} spriteAry // 鳥のスプライトリスト
     * @param {number} widthHeight // 周囲の壁当たり判定用、縦横pxか512の小さい方
     * @param {array} tubeList // 各チューブの情報
     * @param {function} func // 衝突時に実行される命令、クラス生成時に無名関数で渡される＝考え方
     */
    constructor(
        displayObject,
        spriteAry,
        widthHeight,
        tubeList,
        func
    ) {
        console.log("Bird constructor()");
        // stage.addChild(this.sprite);

        this.sprite_ary = spriteAry;
        this.canvasWidthHeight = widthHeight;
        this.tubeList = tubeList;
        this.onCollision = func;

        displayObject.addChild(this.sprite);
        this.sprite.anchor.set(0.5, 0.5);
        this.updateTexture();
        this.sprite.scale.x = 0.06;
        this.sprite.scale.y = 0.06;
        //this.sprite.x = 100;
        //this.sprite.y = 100;

        this.reset();

        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 32) this.addSpeed(-GRAVITY / 3);
        });
        // stage.on("pointerdown", () => this.addSpeed(-GRAVITY / 3));
        displayObject.on("pointerdown", () => this.addSpeed(-GRAVITY / 3));

        // 鳥の羽ばたきアニメをスタート
        setInterval(this.updateTexture, 200);
    }

}

/**
 * チューブのクラス
 */
class Tube {

    x = 0; // チューブのx座標
    y = 0; // チューブのy座標
    innerDistance = 180; // チューブの通り抜けられる部分（縦幅）のベース
    tubeWidth = 30; // チューブの横幅
    graphics = new PIXI.Graphics(); // チューブ用グラフィック
    graphics1 = new PIXI.Graphics();
    graphics2 = new PIXI.Graphics();
    graphics3 = new PIXI.Graphics();
    canvasWidthHeight; // ステージの縦横サイズ
    displayObject;// ゲーム表示用ステージのコンテナ

    /**
     * チューブの描画をリセットする、パラメーターを初期化する
     * @param {number} x チューブの本数分の表示位置が送られる
     */
    reset(x = this.canvasWidthHeight + 20) {
        console.log("Tube reset()");
        this.x = x;
        const tubeMinHeight = 60;
        const randomNum =
            Math.random() *
            (this.canvasWidthHeight - 2 * tubeMinHeight - this.innerDistance); // 通り抜けられる位置をランダムに決定
        this.y = tubeMinHeight + randomNum;
        console.log("randomNum: ", randomNum);
        console.log("tubeMinHeight: ", tubeMinHeight);
        console.log("y: ", this.y);
    }

    /**
     * 鳥とチューブとの衝突判定する
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @returns 
     */
    checkCollision(x, y, width, height) {
        // console.log("Tube checkCollision()");
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

    /**
     * チューブの描画を更新する＝チューブが移動する
     */
    update() {
        // console.log("Tube update()");
        this.x -= GAME_SPEED_X / 60; // x座標をゲームスピード/60フレーム分左に進める
        if (this.x < -this.tubeWidth) this.reset(); // 画面左に移動しきったらリセット

        this.graphics1.clear();
        this.graphics2.clear();
        this.graphics3.clear();

        // 描画
        this.graphics.clear();
        this.graphics.beginFill(0xffffff, 1);
        const { x, y, tubeWidth, innerDistance } = this; // 分割代入
        this.graphics.drawRect(x, 0, tubeWidth, y); // 通り抜ける穴の上部分
        this.graphics.drawRect(x, y + innerDistance, tubeWidth, this.canvasWidthHeight);// 通り抜ける穴の下部分
        this.graphics.endFill();

    }

    /**
     * コンストラクタ
     * @param {object} displayObject チューブを表示するコンテナ
     * @param {number} x チューブの本数分のx開始位置
     * @param {number} idx チューブの本数確認用テスト
     * @param {number} widthHeight ステージサイズ
     */
    constructor(displayObject, x, idx, widthHeight) {

        console.log("Tube constructor()", x, idx);
        this.displayObject = displayObject;
        this.canvasWidthHeight = widthHeight;
        displayObject.addChild(this.graphics);

        this.reset(x);

        // arrow
        this.graphics1.clear();
        this.graphics1.beginFill(0xff0033, 10);
        this.graphics1.drawRect(120, 200, 100, 10);
        this.graphics1.endFill();
        displayObject.addChild(this.graphics1);

        this.graphics2.clear();
        this.graphics2.beginFill(0xff0033, 10);
        this.graphics2.drawRect(170, 200, 50, 10);
        this.graphics2.endFill();
        displayObject.addChild(this.graphics2);
        this.graphics2.angle =45;
        this.graphics2.x=212;
        this.graphics2.y=-93;

        this.graphics3.clear();
        this.graphics3.beginFill(0xff0033, 10);
        this.graphics3.drawRect(270, 300, 50, 10);
        this.graphics3.endFill();
        displayObject.addChild(this.graphics3);
        this.graphics3.angle =135;
        this.graphics3.x=630;
        this.graphics3.y=228;
    }

}


tubeList = TUBE_POS_LIST.map((d, idx) => new Tube(container, d, idx, CANVAS_WIDTH_HEIGHT));

bird = new Bird(container, BIRD_FRAME_LIST, CANVAS_WIDTH_HEIGHT, tubeList, () => {
    console.log("Called when bird hit tube/ground/upper bound");
    isGameFailed = true; // チューブの移動が止まる
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