import $ from 'jquery';
import * as env from '../environment';
import { Point } from '../models';

//tslint:disable
export class Player {

    public coordinates: Point;
    public movementRange: number;

    private movementClicked: boolean;

    constructor(coordinates: Point) {
        this.coordinates = coordinates;
        this.movementRange = 5;
        this.movementClicked = false;

        $(".player").on('click', (ev) => {
            console.log(ev);
            console.log("LCick!");
            $(".player").animate({'top': 32 * 3, 'left': 32 * 9}, 500);
        });

        this.generatePlayer(this.coordinates);
        this.setHover();
        this.setClick();
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
        }
    }

    private moveHover = (coordinates: Point): void => {
        $(`#c${coordinates.x}-${coordinates.y}`).addClass('movementPlayerHover');
    }

    private movement = (coordinates: Point): void => {
        $(`#c${coordinates.x}-${coordinates.y}`).addClass('movement');
        $(`#c${coordinates.x}-${coordinates.y}`).click(() => {
            this.move(coordinates);
        });
    }

    public move = (coordinates: Point): void => {
        $('.player').animate({'left': `${32 * coordinates.x}px`, 'top':`${32 * coordinates.y}px`});
        this.coordinates = coordinates;

        $(".tile").removeClass('movement');
        this.movementClicked = false;
        $('.tile').unbind('click');
    }
}
