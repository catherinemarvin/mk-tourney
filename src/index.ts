import * as SVG from 'svgjs';


document.getElementById("playerInputButton").addEventListener("click", () => {
    createTournament();
});

function createTournament() {
    let input = document.getElementById("playerInput") as HTMLInputElement;
    let playerNames: String[] = input.value.split(/\n/);
    stateManager.initializeTournament(playerNames);
    console.log(stateManager);
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
            this.players.push(new Player(name));
        });

        let numPlayers = playerNames.length;

        if (numPlayers <= 4) {
            let round = new Round();
            round.players = this.players;

            this.rounds.push(round);
            return;
        }
    }
}

let stateManager = new StateManager();