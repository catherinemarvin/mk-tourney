import { OnPlayerClickFunction, Player, Round, StateManager } from "./models";

import * as _ from 'lodash';
import { Container, SVG, find, Marker } from '@svgdotjs/svg.js';

const roundHeight = 100;
const heightPadding = 20;

const roundWidth = 100;
const widthPadding = 40;

const levelLowerAmount = 50;

const markerHeight = 4;
const markerWidth = 4;


export function draw(stateManager: StateManager) {
    const draw = SVG().addTo("body").size(3 * (roundWidth + widthPadding), 3 * (roundHeight + heightPadding + levelLowerAmount));
    const marker = draw.marker(markerWidth, markerHeight, add => {
        add.polygon([
            [0, 0],
            [markerWidth, markerHeight / 2],
            [0, markerHeight],
        ]);
    }).ref(0, markerHeight / 2);

    const startingContainer = draw.nested().move(0,0);
    const intermediateContainer = draw.nested().move(roundWidth + widthPadding, levelLowerAmount);
    const finalContainer = draw.nested().move(2 * (roundWidth + widthPadding), levelLowerAmount * 2);

    drawLevel(startingContainer, stateManager.startingRounds, stateManager.onPlayerClick)
    drawLevel(intermediateContainer, stateManager.intermediateRounds, stateManager.onPlayerClick);
    drawLevel(finalContainer, [stateManager.finalRound], stateManager.onPlayerClick);

    for (const r of stateManager.startingRounds) {
        drawNextRoundArrows(draw, r, stateManager, marker);
    }
    for (const r of stateManager.intermediateRounds) {
        drawNextRoundArrows(draw, r, stateManager, marker);
    }
}

export function advancePlayer(roundId: number, playerId: number) {

}

function drawLevel(container: Container, rounds: Round[], onPlayerClick: OnPlayerClickFunction) {
    let dy = 0;

    for (const r of rounds) {
        const rect = container.rect(roundHeight, roundWidth).move(0, dy).attr({ fill: '#f06'});
        rect.node.dataset.roundId = r.id.toString();
        const playersContainer = container.nested().move(0, dy);
        drawPlayers(playersContainer, r, onPlayerClick);

        dy += roundHeight + heightPadding;
    }
}

function drawPlayers(container: Container, round: Round, onPlayerClick: OnPlayerClickFunction) {
    let dy = 0;
    for (const p of round.players) {
        const player = container.text(p.name).move(0,dy).font({fill: '#000'});
        player.node.dataset.playerId = p.id.toString();
        player.node.dataset.roundId = round.id.toString();
        
        player.click(() => onPlayerClick(round.id, p.id));
        dy += 20;
    }
}

function drawNextRoundArrows(draw: Container, round: Round, stateManager: StateManager, marker: Marker) {
    const sourceRect = _.head(find(`[data-round-id="${round.id}"]`));
    const sourceBBox = sourceRect.rbox(draw);

    for (const nextRound of round.nextRounds) {
        const destRect = _.head(find(`[data-round-id="${nextRound.id}"]`));
        const destBBox = destRect.rbox(draw);

        // Check if directly adjacent
        if ((_.includes(stateManager.startingRounds, round) && _.includes(stateManager.intermediateRounds, nextRound)) ||
            (_.includes(stateManager.intermediateRounds, round) && stateManager.finalRound === nextRound)) {
                draw.line(
                    sourceBBox.x + sourceRect.width(), 
                    sourceBBox.y + (sourceRect.height() / 2),
                    destBBox.x - markerWidth * 4,
                    sourceBBox.y + (sourceRect.height() / 2))
                .stroke({ color: 'black', width: 4})
                .marker('end', marker);

                continue;
            }

        // Otherwise: start to end
        // else, draw an arrow from the top
        draw.polyline(
            [
                [sourceBBox.x + sourceBBox.width, sourceBBox.y + 4],
                [destBBox.x + (destBBox.width / 2), sourceBBox.y + 4],
                [destBBox.x + (destBBox.width / 2), destBBox.y - markerWidth * 4]
            ])
            .fill('none')
            .stroke({ color: 'black', width: 4 })
            .marker('end', marker);
    }
}