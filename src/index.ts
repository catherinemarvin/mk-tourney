import { Player, Round, StateManager } from './models';
import draw from './drawer';


document.getElementById("playerInputButton").addEventListener("click", createTournament);

function createTournament() {
    const input = document.getElementById("playerInput") as HTMLInputElement;
    const playerNames: string[] = input.value.trim().split(/\n/);
    stateManager.initializeTournament(playerNames);
    draw(stateManager);
}

let stateManager = new StateManager();