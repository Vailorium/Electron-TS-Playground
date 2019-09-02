import $ from 'jquery';
import { showMessage } from '../';
import * as env from '../environment';
import { Point } from "../models";
import { Actor } from './Actor';

export class Enemy extends Actor {

    public coordinates: Point;

    public object: HTMLDivElement;

    constructor() {
        super("Blah", {hp: 50, attack: 0, defense: 0}, [env.ATTACKS.stab]);

        this.coordinates = {x: Math.floor(Math.random() * env.BOUNDS.x), y: Math.floor(Math.random() * env.BOUNDS.y)};
        this.generateEnemy(this.coordinates);

        env.EnemyList.push(this);
    }

    private generateEnemy = (coordinates: Point): void => {
        const d: HTMLDivElement = document.createElement('div');
        $(d).attr({class: 'enemy'});
        $(d).css({left: 32 * coordinates.x, top: 32 * coordinates.y});
        this.object = d;
        $('#container').append(d);
    }
}
