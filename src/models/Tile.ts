import { Actor } from "../actors";
import { Point } from "./";

export class Tile {
    public type: string;
    public coordinates: Point;
    public element: HTMLDivElement;
    public on?: Actor;
}
