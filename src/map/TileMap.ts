import $ from 'jquery';
import * as env from '../environment';
import { Point } from '../models';

export class TileMap {
    constructor() {
        console.log("Hello!");
    }

    public generateMap = (): void => {
        const BOUNDS: Point = env.BOUNDS;

        for (let x = 0; x < BOUNDS.x; x++) {
            for (let y = 0; y < BOUNDS.y; y++) {
                const d: HTMLDivElement = document.createElement('div');
                $(d).addClass('tile');
                $(d).attr({id: `c${x}-${y}`});

                $("#container").append(d);
            }
        }
    }
}
