import { showMessage } from '../';
import * as env from '../environment';
import { Stats } from "../models";
import { Attack } from '../models/Attack';

export class Actor {

    public hp: number;
    public stats: Stats;

    protected name: string;

    protected attacks: Attack[];

    constructor(name: string, stats: Stats, attacks: Attack[]) {
        this.name = name;
        this.stats = stats;
        this.hp = stats.hp;
        this.attacks = attacks;
    }

    public log = (): void => {
        console.log(`Log for ${this.name}`);
    }

    public damage = (dam: number, attacker: string): void => {
        this.hp -= dam;
        showMessage(`${attacker} did ${dam} damage to ${this.name}! HP: ${this.hp}`, env.green);
    }
}
