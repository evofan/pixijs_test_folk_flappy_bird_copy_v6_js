import * as PIXI from "pixi.js";
import { STAGES, VARS, displayScore } from "./constants";

export class Tube {

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
    scoreFlag = true; // スコア加算フラグ
    container; // 参照

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
        this.scoreFlag = true;
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
        this.x -= STAGES.GAME_SPEED_X / 60; // x座標をゲームスピード/60フレーム分左に進める
        if (this.x - 100 < -this.tubeWidth) this.addScore(); // チューブを通り抜けられた場合に得点を加算
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
     * 得点を加算する（鳥がチューブを通過）
     */
    addScore() {
        if (this.scoreFlag) {
            this.scoreFlag = false;
            VARS.score = VARS.score + 1;
            console.log("得点追加！", VARS.score);
            displayScore(this.container, 1);
        }

    }

    /**
     * コンストラクタ
     * @param {object} displayObject チューブを表示するコンテナ
     * @param {number} x チューブの本数分のx開始位置
     * @param {number} idx チューブの本数確認用テスト
     * @param {number} widthHeight ステージサイズ
     * @param {object} container 参照
     */
    constructor(displayObject, x, idx, widthHeight, container) {

        console.log("Tube constructor()", x, idx);
        this.displayObject = displayObject;
        this.canvasWidthHeight = widthHeight;
        this.container = container;
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
        this.graphics2.angle = 45;
        this.graphics2.x = 212;
        this.graphics2.y = -93;

        this.graphics3.clear();
        this.graphics3.beginFill(0xff0033, 10);
        this.graphics3.drawRect(270, 300, 50, 10);
        this.graphics3.endFill();
        displayObject.addChild(this.graphics3);
        this.graphics3.angle = 135;
        this.graphics3.x = 630;
        this.graphics3.y = 228;
    }

}
