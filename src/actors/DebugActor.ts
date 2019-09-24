import { showMessage } from '../';
import * as env from '../environment';
import { Actor } from './';

export class DebugActor extends Actor {
    constructor() {
        super('Debug', {hp: 0, attack: 0, defense: 0}, {x: 0, y: 0}, 5, [env.ATTACKS.stab], document.createElement('div'));

        console.log(`Name: ${this.name}`);

        // showMessage(env.ATTACKS.stab.description, 'white');
    }
}
