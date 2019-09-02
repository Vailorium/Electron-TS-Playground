import * as env from '../environment';
import { Actor } from './';

export class DebugActor extends Actor{
    constructor() {
        super('Debug', {hp: 0, attack: 0, defense: 0}, [env.ATTACKS.stab]);

        console.log(`Name: ${this.name}`);
    }
}