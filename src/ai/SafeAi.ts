import * as system from '../system';
import { Enemy, Player, Actor } from '../actors';
import * as env from '../environment';
import { currentMap } from '../';
import { Point } from '../models';

export class SafeAI{

    constructor(){

    }

    public turn = <U extends Actor, T extends Actor>(user: U, target: T): void => {
        // console.log(system.pathfind(user.coordinates, target.coordinates, currentMap));
        // return;

        //! First AI is max range priority AI (i.e. will go max range always even if it does less damage)
        if (Math.abs(target.coordinates.x - user.coordinates.x) + Math.abs(target.coordinates.y - user.coordinates.y) <= user.getMaxRange()) {
            console.log(`${user.name}'s SAFE AI: Player is in range, moving to max range to attack`);
            
            const possibleTiles = [];
            for(let x = 0; x <= user.movementRange; x++){
                for(let y = x - user.movementRange; y <= user.movementRange - x; y++){
                    if (user.coordinates.x + x < env.BOUNDS.x && user.coordinates.y + y < env.BOUNDS.y && user.coordinates.y + y >= 0) {
                        if (Math.abs(user.coordinates.x + x - target.coordinates.x) + Math.abs(user.coordinates.y + y - target.coordinates.y) <= user.getAttackMaxRange()){
                            possibleTiles.push({x: user.coordinates.x + x, y: user.coordinates.y + y});
                        }
                    }
                    if (x > 0) {
                        if (Math.abs(user.coordinates.x - x - target.coordinates.x) + Math.abs(user.coordinates.y + y - target.coordinates.y) <= user.getAttackMaxRange()){
                            possibleTiles.push({x: user.coordinates.x - x, y: user.coordinates.y + y});
                        }
                    }
                }
            }

            //! Get Max Range
            //! Set loop to max range, then decrease. Each tile that amount away from player is a filteredTile
            //! once range = 0, stop

            const sortedArray: Point[] = possibleTiles.sort((a, b): number => {
                if(Math.abs(a.x - target.coordinates.x) + Math.abs(a.y - target.coordinates.y) > Math.abs(b.x - target.coordinates.x) + Math.abs(b.y - target.coordinates.y)){
                    return -1;
                } else if(Math.abs(a.x - target.coordinates.x) + Math.abs(a.y - target.coordinates.y) < Math.abs(b.x - target.coordinates.x) + Math.abs(b.y - target.coordinates.y)) {
                    return 1;
                }
                return 0;
            });

            let newArray: Point[] = [];
            for(let i = Math.abs(sortedArray[0].x - target.coordinates.x) + Math.abs(sortedArray[0].y - target.coordinates.y); i >= Math.abs(sortedArray[sortedArray.length - 1].x - target.coordinates.x) + Math.abs(sortedArray[sortedArray.length - 1].y - target.coordinates.y); i--){
                const filterArray = [];

                for(const item of sortedArray){
                    if(Math.abs(item.x - target.coordinates.x) + Math.abs(item.y - target.coordinates.y) === i){
                        filterArray.push(item);
                    }
                }

                let sortArray: Point[] = filterArray.sort((a, b): number => {
                    if(Math.abs(a.x - user.coordinates.x) + Math.abs(a.y - user.coordinates.y) < Math.abs(b.x - user.coordinates.x) + Math.abs(b.y - user.coordinates.y)){
                        return -1;
                    } else if(Math.abs(a.x - user.coordinates.x) + Math.abs(a.y - user.coordinates.y) > Math.abs(b.x - user.coordinates.x) + Math.abs(b.y - user.coordinates.y)){
                        return 1;
                    }
                    return 0;
                });

                newArray = newArray.concat(sortArray);
            }
            
            while (newArray.length > 0) {
                const path = system.pathfind(user.coordinates, newArray[0], currentMap);
                if (path.length > 0) {
                    user.move(newArray[0]);
                    target.damage(user.getMaxRangeAttack().damage, user.name);
                    return;
                } else {
                    console.log("No path could be found to user possible tile, trying next");
                    newArray.shift();
                }
            }
            console.log("No valid path could be found, skipping turn (in future, will kite backwards)")
        } else {
            console.log(`${user.name}'s SAFE AI: Player is not in range, moving away`);
        }
    }
}