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

    protected name: string;

    protected attacks: Attack[];


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

    public turn = (): void => {
        // console.log(system.pathfind(this.coordinates, player.coordinates, currentMap));
        // return;

        //! First AI is max range priority AI (i.e. will go max range always even if it does less damage)
        if (Math.abs(player.coordinates.x - this.coordinates.x) + Math.abs(player.coordinates.y - this.coordinates.y) <= this.getMaxRange()) {
            console.log(`${this.name}'s AI: Player is in range, moving to max range to attack`);

            // const minAbs = Math.abs(player.coordinates.x - this.coordinates.x) + Math.abs(player.coordinates.y - this.coordinates.y) - this.movementRange;

            let possibleTiles = [];
            for(let x = 0; x <= this.movementRange; x++){
                for(let y = x - this.movementRange; y <= this.movementRange - x; y++){
                    if (this.coordinates.x + x < env.BOUNDS.x && this.coordinates.y + y < env.BOUNDS.y && this.coordinates.y + y >= 0) {
                        if (Math.abs(this.coordinates.x + x - player.coordinates.x) + Math.abs(this.coordinates.y + y - player.coordinates.y) <= this.getAttackMaxRange()){
                            possibleTiles.push({x: this.coordinates.x + x, y: this.coordinates.y + y});
                        }
                    }
                    if (x > 0) {
                        if (Math.abs(this.coordinates.x - x - player.coordinates.x) + Math.abs(this.coordinates.y + y - player.coordinates.y) <= this.getAttackMaxRange()){
                            possibleTiles.push({x: this.coordinates.x - x, y: this.coordinates.y + y});
                        }
                    }
                }
            }

            while (possibleTiles.length > 0) {
                const path = system.pathfind(this.coordinates, possibleTiles[0], currentMap);
                if (path.length > 0) {
                    this.move(possibleTiles[0]);
                    return;
                } else {
                    console.log("No path could be found to this possible tile, trying next");
                    possibleTiles.shift();
                }
            }
            console.log("No valid path could be found, skipping turn (in future, will kite backwards)")
        } else {
            console.log(`${this.name}'s AI: Player is not in range, moving closer`);
        }
    }

    protected getMaxRange = (): number => {
        return this.movementRange + Math.max.apply(null, this.attacks.map((attack) => attack.maxRange));
    }

    protected getAttackMaxRange = (): number => {
        return Math.max.apply(null, this.attacks.map((attack) => attack.maxRange));
    }

    protected destroy = (): void => {
        if (this.element instanceof HTMLDivElement) {
            $(this.element as HTMLDivElement).remove();
            this.element = undefined;
        }
    }
}
