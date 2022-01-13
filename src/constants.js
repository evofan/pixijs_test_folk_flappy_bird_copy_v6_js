import * as PIXI from "pixi.js";
import img_frame1 from "./images/frame-1.png";
import img_frame2 from "./images/frame-2.png";
import img_frame3 from "./images/frame-3.png";
import img_frame4 from "./images/frame-4.png";


const FIRST = 0;

// stage settings
export const STAGES = {
    CANVAS_WIDTH_HEIGHT: Math.min(
        Math.min(window.innerHeight, window.innerWidth),
        512
    ),

    GRAVITY: 4.4, // 9.8 // 重力
    GAME_SPEED_X: 40, // ゲームのスピード（チューブの移動速度）


};

export const BIRD = {
    BIRD_FRAME_LIST: [
        img_frame1,
        img_frame2,
        img_frame3,
        img_frame4
    ]

}

export const VARS = {
    score: 0 // スコア
}

let text_score = 0;
const FIRST_START = 0;
const UPDATE = 1;
const RETRY = 2;
/**
 * Show score num
 * @param reference
 * @param num
 */
export const displayScore = (container, num) => {

    if (num !== FIRST) {
        console.log("初回では無いので一旦消す");
        //console.log(app.stage);
        //app.stage.removeChild(text_score);
        container.removeChild(text_score);
        //app.stage.removeChildAt(1);//鳥とチューブbがキえる
        //app.stage.removeChildAt(2);
        //app.stage.removeChildAt(3);
        //app.stage.removeChildAt(4);
    }
    text_score = new PIXI.Text(`Score: ${VARS.score}`, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: 0xff0033,
        align: "right",
        fontWeight: "bold",
        lineJoin: "round"
    });
    console.log("表示する");
    container.addChild(text_score);
    //container.removeChild(text_score);//ok
    text_score.x = 350;
    text_score.y = 400;
};
