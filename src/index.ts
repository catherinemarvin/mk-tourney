import * as SVG from 'svgjs';


document.getElementById("playerInputButton").addEventListener("click", () => {
    createTournament();
});

function createTournament() {
    let input = document.getElementById("playerInput") as HTMLInputElement;
    let playerNames: String[] = input.value.split(/\n/);
    console.log(playerNames);
    stateManager.initializeTournament(playerNames);
}

class Player {
    static #globalCounter = 0;
    id: Number;
    name: String;

    constructor(name: String) {
        this.id = Player.#globalCounter++;
        this.name = name;
    }
}

class Round {
    static #globalCounter = 0;
    id: Number;
    players: Player[] = [];
    nextRounds: Round[] = [];
    previousRounds: Round[] = [];

    constructor() {
        this.id = Round.#globalCounter++;
    }
}

class StateManager {
    players: Player[] = [];
    rounds: Round[] = [];

    getPlayerByID(id: Number): Player|null {
        return this.players.find((p) => p.id === id) || null;
    }

    getRoundByID(id: Number): Round|null {
        return this.rounds.find((r) => r.id === id) || null;
    }

    initializeTournament(playerNames: String[]) {
        playerNames.forEach(name => {
            let player = new Player(name);
            this.players.push(player);
        });
        console.log(this.players);
    }
}

let stateManager = new StateManager();