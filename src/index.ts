import $ from 'jquery';
import { Player } from './actors';
import { TileMap } from './map';

$(document).ready(() => {
    console.log('Hello! Testasdf!');
    console.log(`Height: ${window.innerHeight}px, Width: ${window.innerWidth}px`);

    const player = new Player({x: 6, y: 6});
    const map = new TileMap();
    map.generateMap();
});
