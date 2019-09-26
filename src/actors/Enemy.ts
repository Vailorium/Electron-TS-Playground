import $ from 'jquery';
import { showMessage } from '../';
import * as env from '../environment';
import { Point } from "../models";
import { Actor } from './Actor';
import { SafeAI} from '../ai';

export class Enemy extends Actor {

    public coordinates: Point;

    public object: HTMLDivElement;

    public ai: SafeAI;

    constructor() {
        super(
            "Blah",
            {hp: 50, attack: 0, defense: 0},
            {x: Math.floor(Math.random() * env.BOUNDS.x), y: Math.floor(Math.random() * env.BOUNDS.y)},
            10,
            [env.ATTACKS.stab, env.ATTACKS.shoot],
        );
        this.element = this.generateEnemy(this.coordinates);
        
        this.ai = new SafeAI();
        env.EnemyList.push(this);
    
    }

    private generateEnemy = (coordinates: Point): HTMLDivElement => {
        const d: HTMLDivElement = document.createElement('div');
        $(d).attr({class: 'enemy'});
        $(d).css({left: 32 * coordinates.x, top: 32 * coordinates.y});
        this.object = d;
        $('#container').append(d);

        return d;
    }
}
