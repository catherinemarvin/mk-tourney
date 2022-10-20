import { Player, Round, StateManager } from './models';
import draw from './drawer';


document.getElementById("playerInputButton").addEventListener("click", () => {
    createTournament();
});

function createTournament() {
    let input = document.getElementById("playerInput") as HTMLInputElement;
    let playerNames: String[] = input.value.split(/\n/);
    stateManager.initializeTournament(playerNames);
    draw(stateManager);
}

let stateManager = new StateManager();