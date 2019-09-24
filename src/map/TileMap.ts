import $ from 'jquery';
import * as env from '../environment';
import { Point, Tile } from '../models';

export class TileMap {

    public map: Tile[][];

    constructor() {
        this.map = [];
        // constructor
    }

    public generateMap = (): void => {
        const BOUNDS: Point = env.BOUNDS;

        for (let x = 0; x < BOUNDS.x; x++) {
            this.map[x] = [];
            for (let y = 0; y < BOUNDS.y; y++) {
                const d: HTMLDivElement = document.createElement('div');
                $(d).addClass('tile');
                $(d).attr({id: `c${x}-${y}`});

                $("#container").append(d);

                this.map[x].push({type: 'normal', coordinates: {x, y}, element: d});
            }
        }
    }
}
