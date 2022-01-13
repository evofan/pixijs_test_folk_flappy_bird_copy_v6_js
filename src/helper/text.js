import * as PIXI from "pixi.js";
import { VARS } from "../constants";

/**
 * Define the displayDateText() function using the export statement.
 * @param { object } app reference
 */
export const displayDateText = (app) => {
  // Date
  let dt = new Date();
  let year = dt.getFullYear();
  let month = dt.getMonth();
  let day = dt.getDate();
  let week_num = dt.getDay();
  let week_ary = ["Sun", "Mon", "Thu", "Wed", "Thu", "Fri", "Sat"];
  let week = week_ary[week_num];
  let dtText = `${year}.${month + 1}.${day}(${week})`;
  // console.log("dtText", dtText); // dtText 2019.7.2.Thu

  // Text
  // let textDate = new PIXI.Text(`Today: ${dtText}`, {
  let textDate = new PIXI.Text(`PixiJS Flappy Bird clone test`, {
    fontFamily: "Arial",
    fontSize: 24,
    // fill: 0x3366cc,
    fill: 0x333333,
    fill: 0x000000,
    align: "center",
    fontWeight: "bold",
    stroke: "#cccccc",
    stroke: "#ffffff",
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  textDate.x = 100;
  textDate.y = 10;
  app.stage.addChild(textDate);
}

/**
 * Define the displayParamText() function using the export statement.
 * @param { object } app reference
 * @param { string } str display text
 * @param { num } y position
 */
export const displayParamText = (app, str, y) => {
  let textParam = new PIXI.Text(`${str}`, {
    fontFamily: "Arial",
    fontSize: 16,
    fill: 0xe0e0e0,
    fill: 0x3399cc,
    align: "left",
    fontWeight: "bold",
    stroke: "#cccccc",
    stroke: "#003366",
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  textParam.x = 15;
  textParam.y = y;
  app.stage.addChild(textParam);
}

/*
export const displayScore = (app) => {
  let textParam = new PIXI.Text(`Score: ${VARS.score}`, {
    fontFamily: "Arial",
    fontSize: 32,
    fill: 0xff0033,
    align: "right",
    fontWeight: "bold",
    lineJoin: "round"
  });
  textParam.x = 350;
  textParam.y = 450;
  */
  /*
  if (app.stage.getChildByName(textParam)) {
    app.stage.removeChild(textParam)
  }*/
 // if (app.stage.getChildAt(0)) {
   // app.stage.removeChild(textParam)
 // }
 // app.stage.addChild(textParam);
//}