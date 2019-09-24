import { Point } from "./";

export class PathfindTile{
    public type: string;
    public coordinates: Point;
    public element: HTMLDivElement;
    public f: number;
    public g: number;
    public h: number;
    public parent?: PathfindTile;
}