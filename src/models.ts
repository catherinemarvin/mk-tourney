import * as _ from 'lodash';

export type OnPlayerClickFunction = (roundId: number, playerId: number) => void;

export class Player {
    static #globalCounter = 0;
    id: number;
    name: string;

    constructor(name: string) {
        this.id = Player.#globalCounter++;
        this.name = name;
    }
}

export class Round {
    static #globalCounter = 0;
    id: number;
    players: Player[] = [];
    nextRounds: Round[] = [];

    numToFinalRound: number = 0;
    numToIntermediateRound: number = 0;

    constructor() {
        this.id = Round.#globalCounter++;
    }
}

export class StateManager {
    players: Player[] = [];
    rounds: Round[] = [];
    onPlayerClick: OnPlayerClickFunction;

    getPlayerByID(id: number): Player|null {
        return this.players.find((p) => p.id === id) || null;
    }

    getRoundByID(id: number): Round|null {
        return this.rounds.find((r) => r.id === id) || null;
    }


    get startingRounds(): Round[] {
        let nextRounds: Number[] = _.uniqBy(this.rounds.flatMap(r => r.nextRounds).map(r => r.id));

        return this.rounds.filter(r => nextRounds.indexOf(r.id) === -1);
    }

    get intermediateRounds(): Round[] {
        return this.rounds.filter(r => {
            return this.startingRounds.indexOf(r) === -1 && this.finalRound !== r;
        })
    }

    get finalRound(): Round {
        return this.rounds.find(r=> _.isEmpty(r.nextRounds));
    }

    getPreviousRounds(round: Round): Round[] {
        return this.rounds.filter(r => _.includes(r.nextRounds, round));
    }

    initializePlayer(name: string): Player {
        let player = new Player(name);
        this.players.push(player);
        return player;
    }

    initializeRound(): Round {
        let round = new Round();
        this.rounds.push(round);
        return round;
    }

    initializeTournament(playerNames: string[]) {
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
            this.initializeNextRoundNumbers();
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
        this.initializeNextRoundNumbers();
    }

    initializeNextRoundNumbers() {
        const finalRound = this.finalRound;
        finalRound.numToFinalRound = -1;
        finalRound.numToIntermediateRound = -1;

        const startingRounds = this.startingRounds;
        
        if (startingRounds.length % 2 === 0) {
            for (const r of startingRounds) {
                r.numToFinalRound = 4 / startingRounds.length;
                r.numToIntermediateRound = -1;
            }
            return;
        }

        for (const r of startingRounds) {
            r.numToFinalRound = 1;
        }
        const numStartingToFinal = startingRounds.reduce((prev, curr) => prev + curr.numToFinalRound, 0);



        const intermediateRound = this.intermediateRounds[0];
        intermediateRound.numToFinalRound = 4 - numStartingToFinal;

        let totalNumToIntermediate = 4 - intermediateRound.players.length;

        let i = 0;
        while (totalNumToIntermediate > 0) {
            startingRounds[i % startingRounds.length].numToIntermediateRound++;
            totalNumToIntermediate--;
            i++;
        }
    }

    // Returns the Round that the player advances to
    advancePlayer(round: Round, player: Player): Round {
        if (round.numToFinalRound > 0) {
            this.finalRound.players.push(player);
            round.numToFinalRound--;
            return this.finalRound;
        } else if (round.numToIntermediateRound > 0) {
            this.intermediateRounds[0].players.push(player);
            round.numToIntermediateRound--;
            return this.intermediateRounds[0];
        } else {
            console.log("Don't advance");
            return null;
        }
    }
}