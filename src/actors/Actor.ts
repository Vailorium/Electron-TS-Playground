import $ from 'jquery';
import { player, showMessage, currentMap } from '../';
import * as env from '../environment';
import { Point, Stats } from "../models";
import { Attack } from '../models';
import * as system from '../system';

export class Actor {

    public hp: number;
    public stats: Stats;
    public movementRange: number;

    public coordinates: Point;

    public element?: HTMLDivElement;

    public name: string;

    public attacks: Attack[];


    // tslint:disable-next-line: max-line-length
    constructor(name: string, stats: Stats, coordinates: Point, movementRange: number, attacks: Attack[], element?: HTMLDivElement) {
        this.name = name;
        this.stats = stats;
        this.hp = stats.hp;
        this.attacks = attacks;
        this.coordinates = coordinates;
        this.movementRange = movementRange;
        this.element = element;

        console.log(`Max range of ${this.name} is ${Math.max.apply(null, attacks.map((a) => a.maxRange))}`);
    }

    public log = (): void => {
        console.log(`Log for ${this.name}`);
    }

    public damage = (dam: number, attacker: string): void => {
        this.hp -= dam;
        if (this.hp <= 0) {
            this.hp = 0;
            this.destroy();
        }
        showMessage(`${attacker} did ${dam} damage to ${this.name}! HP: ${this.hp}`, env.green);
    }

    public move = (coordinates: Point): void => {
        $(this.element as HTMLDivElement).animate({left: `${32 * coordinates.x}px`, top: `${32 * coordinates.y}px`});
        currentMap.map[coordinates.x][coordinates.y].on = this;
        currentMap.map[this.coordinates.x][this.coordinates.y].on = undefined;
        this.coordinates = coordinates;

        $('.tile').unbind('click');
    }

    public getMaxRange = (): number => {
        return this.movementRange + Math.max.apply(null, this.attacks.map((attack) => attack.maxRange));
    }

    public getAttackMaxRange = (): number => {
        return Math.max.apply(null, this.attacks.map((attack) => attack.maxRange));
    }

    public getMaxRangeAttack = (): Attack => {
        return this.attacks.find((a) => {
            return a.maxRange === this.getAttackMaxRange();
        }) as Attack;
    }

    protected destroy = (): void => {
        if (this.element instanceof HTMLDivElement) {
            $(this.element as HTMLDivElement).remove();
            this.element = undefined;
        }
    }
}
