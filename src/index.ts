import { Player, Round, StateManager } from './models';
import { draw } from './drawer';

import './index.css';


document.getElementById("playerInputButton").addEventListener("click", createTournament);

function createTournament() {
    const input = document.getElementById("playerInput") as HTMLInputElement;
    const playerNames: string[] = input.value.trim().split(/\n/);
    stateManager.initializeTournament(playerNames);
    draw(stateManager);
}

let stateManager = new StateManager();
stateManager.onPlayerClick = (roundId: number, playerId: number) => {
    const round = stateManager.getRoundByID(roundId);
    const player = stateManager.getPlayerByID(playerId);

    stateManager.advancePlayer(round, player);
    console.log(stateManager);

    draw(stateManager);
}