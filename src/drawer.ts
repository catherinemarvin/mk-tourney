import { Player, Round, StateManager } from "./models";

import { Container, SVG } from '@svgdotjs/svg.js';

const roundHeight = 100;
const heightPadding = 20;

const roundWidth = 100;
const widthPadding = 40;

const levelLowerAmount = 50;

const markerHeight = 4;
const markerWidth = 4;


export default function draw(stateManager: StateManager) {
    const draw = SVG().addTo("body").size(3 * (roundWidth + widthPadding), 3 * (roundHeight + heightPadding + levelLowerAmount));
    const marker = draw.marker(markerWidth, markerHeight, add => {
        add.polygon([
            [0, 0],
            [markerWidth, markerHeight / 2],
            [0, markerHeight],
        ]);
    }).ref(0, markerHeight / 2);

    const startingContainer = draw.nested().move(0,0);

    drawLevel(startingContainer, stateManager.startingRounds)
}

function drawLevel(container: Container, rounds: Round[]) {
    let dy = 0;

    for (const r of rounds) {
        let rect = container.rect(roundHeight, roundWidth).move(0, dy).attr({ fill: '#f06'});
        let playersContainer = container.nested().move(0, dy);
        drawPlayers(playersContainer, r.players);

        dy += roundHeight + heightPadding;
    }
}

function drawPlayers(container: Container, players: Player[]) {
    let dy = 0;
    for (const p of players) {
        container.text(p.name).move(0,dy).font({fill: '#000'});
        dy += 20;
    }
}