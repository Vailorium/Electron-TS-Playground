import $ from 'jquery';
import { DebugActor, Enemy, Player } from './actors';
import * as env from './environment';
import { TileMap } from './map';

export let player: Player;

export let enemy: Enemy;

export let currentMap: TileMap;

$(document).ready(() => {
    console.log(`Height: ${window.innerHeight}px, Width: ${window.innerWidth}px`);
    currentMap = new TileMap();
    currentMap.generateMap();

    player = new Player({x: 6, y: 6});

    enemy = new Enemy();

    const debugActor = new DebugActor();


    KeyListener();
    // showMessage('this is a test message');
});

export function showMessage(message: string, color?: string) {
    const p: HTMLParagraphElement = document.createElement('p');

    $(p).text(message);
    $(p).addClass('popupMessage');

    if (color) {
        $(p).css({color});
    }

    $('body').append(p);

    $(p).animate({top: '40%', opacity: '1'}, 1000, 'swing', () => {
        setTimeout(() => {
            $(p).animate({opacity: 0}, 500, 'swing', () => {
                $(p).remove();
            });
        }, 1000);
    });
}

export let enemyTurn = (): void => {
    for (const enemy of env.EnemyList) {
        enemy.ai.turn(enemy, player); // needs to be changed and calculated per enemy

    }
}
export let KeyListener = (): void => {
    $('body').keydown((ev) => {
        switch (ev.key) {
            case 'e':
                new Enemy();
                break;

            default:
                console.log('Key is not used');
        }
    });
};
