import * as PIXI from "pixi.js";
import { displayDateText, displayParamText, displayScoreText } from "./helper/text.js";
import { displaySprite } from "./helper/sprite.js";
import { Common } from "./helper/common.js";

import { STAGES, BIRD, VARS, displayScore } from "./constants";
import { Bird } from "./Bird.js";
import { Tube } from "./Tube.js";

import img_bg from "./images/pic_bg_sea2.jpg";

import "./main.css";

const TUBE_POS_LIST = [
    STAGES.CANVAS_WIDTH_HEIGHT + 50,
    STAGES.CANVAS_WIDTH_HEIGHT + 250,
    STAGES.CANVAS_WIDTH_HEIGHT + 480,
];

let isGameStarted = false;
let isGameFailed = false;

// init
let app = new PIXI.Application({ width: STAGES.CANVAS_WIDTH_HEIGHT, height: STAGES.CANVAS_WIDTH_HEIGHT });
app.renderer.backgroundColor = 0xc1c2c4;
document.body.appendChild(app.view);

// bg area
let container_bg = new PIXI.Container();
container_bg.x = 0;
container_bg.y = 0;
app.stage.addChild(container_bg);
displaySprite(app.stage, img_bg, 0, 0);

// bird, wall area
let container = new PIXI.Container();
container.width = STAGES.CANVAS_WIDTH_HEIGHT;
container.height = STAGES.CANVAS_WIDTH_HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactive = true;
container.visible = true;
app.stage.addChild(container);

// score
let container_score = new PIXI.Container();
container_score.width = STAGES.CANVAS_WIDTH_HEIGHT;
container_score.height = STAGES.CANVAS_WIDTH_HEIGHT;
container_score.x = 0;
container_score.y = 0;
container_score.pivot.x = 0;
container_score.pivot.y = 0;
container_score.interactive = true;
container_score.visible = true;
app.stage.addChild(container_score);

// click area
let hitArea = new PIXI.Graphics();
hitArea.lineStyle(1, 0xff0033, 1); // width, color, alpha
hitArea.beginFill(0xff0033);
hitArea.drawRect(0, 0, STAGES.CANVAS_WIDTH_HEIGHT, STAGES.CANVAS_WIDTH_HEIGHT);
hitArea.endFill();
hitArea.alpha = 0;
hitArea.visible = false;
hitArea.interactive = true;
hitArea.interactiveChildren = false;
hitArea.buttonMode = true;
container.addChild(hitArea);
hitArea.visible = true;

const button = document.querySelector("#start");
if (button) {
    button.addEventListener("click", () => {
        console.log("button pushed!");
        isGameStarted = true;
        VARS.score = 0;
        button.innerHTML = "Retry";
        if (isGameFailed) {
            isGameFailed = false;
            tubeList.forEach((d, i) => d.reset(TUBE_POS_LIST[i]));
            bird.reset();
            VARS.score = 0;
            displayScoreText(container_score, 2);
        }
        button.classList.add("hide");
    });
}

let bird;
let tubeList;


// Execute the method defined in text.js
displayDateText(app.stage);

// Execute the method and Read the property defined in common.js
let ver = Common.pixi_version;
let size = Common.getAppRenderSize(app);
let type = Common.getAppRenderType(app);

// display Pixi data
displayParamText(app.stage, ver, 450);
displayParamText(app.stage, size, 470);
displayParamText(app.stage, type, 490)

displayScoreText(container_score, 0);


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

ticker.start(); // reder start

/**
 * app rendering
 * @param { number } time
 */
const update = (time) => {
    // console.log("update()")
    // ????????????????????????

    if (isGameStarted) {
        bird.updateSprite();
        if (!isGameFailed) tubeList.forEach((d) => d.update()); // ??????????????????????????????????????????????????????????????????
    }

}

tubeList = TUBE_POS_LIST.map((d, idx) => new Tube(container, d, idx, STAGES.CANVAS_WIDTH_HEIGHT, container_score));

bird = new Bird(container, BIRD.BIRD_FRAME_LIST, STAGES.CANVAS_WIDTH_HEIGHT, tubeList, () => {
    // console.log("Called when bird hit tube/ground/upper bound");
    isGameFailed = true; // ?????????????????????????????????
    if (button) {
        button.classList.remove("hide");
    }
});
