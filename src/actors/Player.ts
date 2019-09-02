import $ from 'jquery';
import * as env from '../environment';
import { Point } from '../models';
import { Actor } from './Actor';

//tslint:disable
export class Player extends Actor {

    public coordinates: Point;
    public movementRange: number;

    private movementClicked: boolean;

    constructor(coordinates: Point) {
        super("Playername", {hp: 100, attack: 25, defense: 10}, [env.ATTACKS.stab]);

        this.coordinates = coordinates;
        this.movementRange = 5;
        this.movementClicked = false;

        this.generatePlayer(this.coordinates);
        this.setHover();
        this.setClick();
    }

    public attack = (): void => {
        this.generateRangeTiles(3, 5, 'attack', this.coordinates, this.coordinates);
    }

    private generatePlayer = (coordinates: Point): void => {
        const d: HTMLDivElement = document.createElement('div');
        $(d).attr({class: 'player'});
        $(d).css({'left': 32*coordinates.x, 'top': 32*coordinates.y});
        $('#container').append(d);
    }

    private setHover = (): void => {
        $('.player').mouseenter(() => {
            this.generateRangeTiles(3, 5, 'moveHover', this.coordinates, this.coordinates);
        }).mouseleave(() => {
            $(".tile").removeClass('movementPlayerHover');
        });
    }

    private setClick = (): void => {
        $('.player').click(() => {
            if(!this.movementClicked){
                this.generateRangeTiles(3, 5, 'movement', this.coordinates, this.coordinates);
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
                console.log("Enemy inside attack bounds!");
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
        this.coordinates = coordinates;

        $(".tile").removeClass('movement');
        this.movementClicked = false;
        $('.tile').unbind('click');
    }
}
