import $ from 'jquery';
import { DebugActor, Enemy, Player } from './actors';
import { TileMap } from './map';

export let player: Player;

export let enemy: Enemy;

$(document).ready(() => {
    console.log(`Height: ${window.innerHeight}px, Width: ${window.innerWidth}px`);

    player = new Player({x: 6, y: 6});

    enemy = new Enemy();
    const map = new TileMap();

    const debugActor = new DebugActor();

    map.generateMap();

    showMessage('this is a test message');
});

export function showMessage(message: string, color?: string){
    const p: HTMLParagraphElement = document.createElement('p');

    $(p).text(message);
    $(p).addClass('popupMessage');

    if (color) {
        $(p).css({color});
    }

    $('body').append(p);

    $(p).animate({top: '40%', opacity: '1'}, 3000, 'swing', () => {
        setTimeout(() => {
            $(p).animate({opacity: 0}, 1000, 'swing', () => {
                $(p).remove();
            });
        }, 3000);
    });
}