import * as PIXI from "pixi.js";
import img_frame1 from "./images/frame-1.png";
import img_frame2 from "./images/frame-2.png";
import img_frame3 from "./images/frame-3.png";
import img_frame4 from "./images/frame-4.png";

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
