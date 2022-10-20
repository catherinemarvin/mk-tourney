import { Player, Round, StateManager } from "./models";

import { SVG } from '@svgdotjs/svg.js';

let roundHeight = 100;
let heightPadding = 20;

let roundWidth = 100;
let widthPadding = 40;

let levelLowerAmount = 50;

let markerHeight = 4;
let markerWidth = 4;


export default function draw(stateManager: StateManager) {
    let draw = SVG().addTo('body').size(300, 300);
    draw.rect(100, 100).attr({fill: '#f06'});
}