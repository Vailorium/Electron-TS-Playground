import $ from 'jquery';
import { currentMap, showMessage, enemyTurn } from '../';
import * as env from '../environment';
import { Attack, Point } from '../models';
import { Actor } from './Actor';

//tslint:disable
export class Player extends Actor {

    private movementClicked: boolean;

    constructor(coordinates: Point) {
        super(
            "Playername",
            {hp: 100, attack: 25, defense: 10},
            coordinates,
            5,
            [env.ATTACKS.stab, env.ATTACKS.shoot],
        );

        this.element = this.generatePlayer(this.coordinates);
        this.movementClicked = false;

        // this.generatePlayer(this.coordinates);
        this.setHover();
        this.setClick();

        currentMap.map[this.coordinates.x][this.coordinates.y].on = this;
    }

    public attack = (attack: Attack): void => {
        this.generateRangeTiles(attack.minRange, attack.maxRange, 'attack', this.coordinates, this.coordinates);
    }

    private generatePlayer = (coordinates: Point): HTMLDivElement => {
        const d: HTMLDivElement = document.createElement('div');
        $(d).attr({class: 'player'});
        $(d).css({'left': 32*coordinates.x, 'top': 32*coordinates.y});
        $('#container').append(d);

        return d;
    }

    private setHover = (): void => {
        $('.player').mouseenter(() => {
            this.generateRangeTiles(1, this.movementRange, 'moveHover', this.coordinates, this.coordinates);
        }).mouseleave(() => {
            $(".tile").removeClass('movementPlayerHover');
        });
    }

    private setClick = (): void => {
        $('.player').click(() => {
            if(!this.movementClicked){
                this.generateRangeTiles(1, this.movementRange, 'movement', this.coordinates, this.coordinates);
            }
            else{
                $(".tile").removeClass('movement');
            }
            this.movementClicked = !this.movementClicked;
        })
    }

    private generateRangeTiles = (minRange: number, maxRange: number, type: string, coordinates: Point, originCoordinates: Point, checked: Array<Point> = []): void => {
        for(const coordinate of checked){
            if(coordinate.x === coordinates.x && coordinate.y === coordinates.y){
                return;
            }
        }
        checked.push(coordinates); //? Includes all checked coordinates
        
        if((coordinates.x !== originCoordinates.x || coordinates.y !== originCoordinates.y)){
            if(Math.abs(coordinates.x - originCoordinates.x) + Math.abs(coordinates.y - originCoordinates.y) >= minRange){
                this.generateRangeTile(coordinates, type);
            }
        }
        

        if(Math.abs(coordinates.x - originCoordinates.x) + Math.abs(coordinates.y - originCoordinates.y) >= maxRange){
            return;
        }
        
        if(Math.abs(coordinates.x - originCoordinates.x) < maxRange && Math.abs(coordinates.y - originCoordinates.y) < maxRange){
            if(coordinates.x - 1 >= 0){
                this.generateRangeTiles(minRange, maxRange, type, {x: coordinates.x - 1, y: coordinates.y}, originCoordinates, checked);
            }
            if(coordinates.x + 1 < env.BOUNDS.x){
                this.generateRangeTiles(minRange, maxRange, type, {x: coordinates.x + 1, y: coordinates.y}, originCoordinates, checked);
            }
            if(coordinates.y - 1 >= 0){
                this.generateRangeTiles(minRange, maxRange, type, {x: coordinates.x, y: coordinates.y - 1}, originCoordinates, checked);
            }
            if(coordinates.y + 1 <  env.BOUNDS.y){
                this.generateRangeTiles(minRange, maxRange, type, {x: coordinates.x, y: coordinates.y + 1}, originCoordinates, checked);
            }
        }
    }

    private generateRangeTile = (coordinates: Point, type: string): void => {
        switch(type){
            case 'moveHover':
                this.moveHover(coordinates);
                break;
            case 'movement':
                this.movement(coordinates);
                break;

            case 'attack':
                this.attackTile(coordinates);
                break;
        }
    }

    private moveHover = (coordinates: Point): void => {
        $(`#c${coordinates.x}-${coordinates.y}`).addClass('movementPlayerHover');
    }

    private movement = (coordinates: Point): void => {
        for(let i = 0; i < env.EnemyList.length; i++){
            $(env.EnemyList[i].object).removeClass('attackable');
        }
        $('.tile').removeClass('attack');

        $(`#c${coordinates.x}-${coordinates.y}`).addClass('movement');
        $(`#c${coordinates.x}-${coordinates.y}`).click(() => {
            this.move(coordinates);
        });
    }

    private attackTile = (coordinates: Point): void => {
        for(let i = 0; i < env.EnemyList.length; i++){
            if(coordinates.x === env.EnemyList[i].coordinates.x && coordinates.y === env.EnemyList[i].coordinates.y){
                $(env.EnemyList[i].object).addClass('attackable');
                $(env.EnemyList[i].object).on('click', () => {
                    $(env.EnemyList[i].object).off('click');
                    env.EnemyList[i].damage(this.stats.attack, this.name);

                    for(let i = 0; i < env.EnemyList.length; i++){
                        $(env.EnemyList[i].object).removeClass('attackable');
                    }
                    $('.tile').removeClass('attack');
                });
            }
        }
        $(`#c${coordinates.x}-${coordinates.y}`).addClass('attack');
    }

    public move = (coordinates: Point): void => {
        $('.player').animate({'left': `${32 * coordinates.x}px`, 'top':`${32 * coordinates.y}px`});
        currentMap.map[coordinates.x][coordinates.y].on = this;
        currentMap.map[this.coordinates.x][this.coordinates.y].on = undefined;
        this.coordinates = coordinates;

        $(".tile").removeClass('movement');
        this.movementClicked = false;
        $('.tile').unbind('click');

        enemyTurn();
    }

    protected destroy = (): void => {
        if(this.element instanceof HTMLDivElement) {
            $(this.element as HTMLDivElement).remove();
            this.element = undefined;
            showMessage('You died', 'red');
        }
    }
}
