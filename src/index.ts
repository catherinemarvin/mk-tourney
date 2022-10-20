import * as SVG from 'svgjs';
import * as _ from 'lodash';


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

    get startingRounds(): Round[] {
        let nextRounds: Number[] = _.uniqBy(this.rounds.flatMap(r => r.nextRounds).map(r => r.id));

        return this.rounds.filter(r => nextRounds.indexOf(r.id) === -1);
    }

    get finalRound(): Round {
        return this.rounds.find(r=> _.isEmpty(r.nextRounds));
    }

    initializePlayer(name: String): Player {
        let player = new Player(name);
        this.players.push(player);
        return player;
    }

    initializeRound(): Round {
        let round = new Round();
        this.rounds.push(round);
        return round;
    }

    initializeTournament(playerNames: String[]) {
        playerNames.forEach(name => this.initializePlayer(name));

        let numPlayers = playerNames.length;

        if (numPlayers <= 4) {
            let round = this.initializeRound();
            round.players = this.players;

            this.rounds.push(round);
            return;
        }

        let numFullRounds = Math.floor(numPlayers / 4);
        let numLeftoverRounds = numPlayers % 4;

        if (numFullRounds > 4) {
            // TODO(catherine): Do recursion
            // round1Winners = numFullRounds
            // solve(round1Winners)
            // point round1Winners to fill starting from beginning
            return;
        }
        if (numLeftoverRounds === 0) {
            let finalRound = this.initializeRound();
            _.chunk(this.players, 4).forEach(chunk => {
                let round = this.initializeRound();
                round.players = chunk;
                round.nextRounds.push(finalRound);
            });
            return;
        }
        let finalRound = this.initializeRound();
        let extraRound = this.initializeRound();
        _.chunk(this.players, 4).forEach(chunk => {
            if (chunk.length === 4) {
                let round = this.initializeRound();
                round.players = chunk;
                round.nextRounds = [extraRound, finalRound];
            } else {
                extraRound.players = chunk;
                extraRound.nextRounds.push(finalRound);
            }
        })
    }
}

let stateManager = new StateManager();