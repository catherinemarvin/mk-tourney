import { Player, Round, StateManager } from './models';
import draw from './drawer';


document.getElementById("playerInputButton").addEventListener("click", () => {
    createTournament();
});

function createTournament() {
    let input = document.getElementById("playerInput") as HTMLInputElement;
    let playerNames: string[] = input.value.split(/\n/);
    stateManager.initializeTournament(playerNames);
    console.log(stateManager);
    console.log(stateManager.intermediateRounds);
    draw(stateManager);
}

let stateManager = new StateManager();