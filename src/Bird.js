import * as PIXI from "pixi.js";
import { STAGES, BIRD } from "./constants";

export class Bird {

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
        if (this.textureCounter === BIRD.BIRD_FRAME_LIST.length) this.textureCounter = 0; // 最後まで再生でリセット
    };

    /**
     * Bird Move and Collision Check
     * 鳥の移動と当たり判定のチェック
     */
    updateSprite = () => {
        // console.log("Bird updateSprite()");
        this.speedY += STAGES.GRAVITY / 170; // 70;// 重力を加算
        this.sprite.y += this.speedY; // 鳥のy座標を移動
        this.sprite.rotation = Math.atan(this.speedY / STAGES.GAME_SPEED_X);

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
        this.speedY = Math.max(-STAGES.GRAVITY, this.speedY); // マイナスした重力かy方向のスピードの大きい方を使用
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
            if (e.keyCode == 32) this.addSpeed(-STAGES.GRAVITY / 3);
        });
        // stage.on("pointerdown", () => this.addSpeed(-GRAVITY / 3));
        displayObject.on("pointerdown", () => this.addSpeed(-STAGES.GRAVITY / 3));

        // 鳥の羽ばたきアニメをスタート
        setInterval(this.updateTexture, 200);
    }

}