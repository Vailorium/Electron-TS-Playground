import { PathfindTile } from "../models";
import { TileMap } from "./TileMap";

export class PathfindMap{

    public map: PathfindTile[][];
    constructor(source: TileMap) {
        this.map = [];
        for (let x = 0; x < source.map.length; x++) {
            this.map[x] = [];
            for(let y = 0; y < source.map[x].length; y++){
                this.map[x][y] = {
                    type: source.map[x][y].type,
                    coordinates: source.map[x][y].coordinates,
                    element: source.map[x][y].element,
                    f: 0,
                    g: 0,
                    h: 0,
                    parent: undefined,
                }
            }
        }
    }
}