import { PathfindMap, TileMap } from "./map";
import { PathfindTile, Point } from "./models";
// tslint:disable: max-line-length

export let KeyListener = (): void => {
    $('body').keydown((ev) => {
        switch (ev.key) {
            case 'e':

        }
    });
};

export let pathfind = (start: Point, target: Point, map: TileMap): Point[] => {

    console.log(`START OF PATH: ${start.x}, ${start.y}`);
    console.log(`TARGET OF PATH: ${target.x}, ${target.y}`);

    let openList: PathfindTile[] = [];
    const closedList: PathfindTile[] = [];

    const pathfindMap = new PathfindMap(map);
    openList.push(pathfindMap.map[start.x][start.y]);

    let iterations = 0;

    while (openList.length > 0) {
        iterations++;

        if (iterations > 1000) {
            throw new Error("Iterations Overload in pathfind");
            return [];
        }

        let lowestCost: number = openList[0].f;
        let lowestTile: PathfindTile = openList[0];

        for (const tile of openList) {
            if (lowestCost === 0 || tile.f < lowestCost) {
                lowestCost = tile.f;
                lowestTile = tile;
            }
        }

        openList = openList.filter((arr: PathfindTile) => {
            return arr.coordinates.x !== lowestTile.coordinates.x && arr.coordinates.y !== lowestTile.coordinates.y;
        });

        const neighbors = getNeighbors(pathfindMap, lowestTile);
        for (const neighbor of neighbors) {

            if (neighbor.coordinates.x === target.x && neighbor.coordinates.y === target.y) {
                neighbor.parent = lowestTile;
                let node = neighbor;
                const path = [];
                let iterationsA = 0;
                while (node.parent) {
                    iterationsA++;
                    if (iterationsA > 1000) {
                        throw new Error("Iterations Overload in Pathfind Parent")
                        return [];
                    }
                    path.push({x: node.coordinates.x, y: node.coordinates.y});
                    node = node.parent;
                }
                path.push({x: node.coordinates.x, y: node.coordinates.y});

                return path.reverse();
            }

            if (isInList(closedList, neighbor) || neighbor.type === "wall") {
                continue;
            }

            const gScore = lowestTile.g + 1;
            let gScoreIsBest = false;

            if (!isInList(openList, neighbor)) {
                gScoreIsBest = true;
                neighbor.h = Math.abs(neighbor.coordinates.x - target.x)  + Math.abs(neighbor.coordinates.y - target.y);
                openList.push(neighbor);
            } else if (gScore < neighbor.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                neighbor.parent = lowestTile;

                neighbor.f = neighbor.g + neighbor.h;
            }
        }
        closedList.push(lowestTile);
    }

    return [];
};

const isInList = (list: PathfindTile[], node: PathfindTile): boolean => {
    for (const tile of list) {
        if (node.coordinates.x === tile.coordinates.x && node.coordinates.y === tile.coordinates.y && tile.f <= node.f) {
            return true;
        }
    }
    return false;
};

const getNeighbors = (map: PathfindMap, node: PathfindTile): PathfindTile[] => {
    const returnList = [];

    if (node.coordinates.x !== 0) {
        returnList.push(map.map[node.coordinates.x - 1][node.coordinates.y]);
    }
    if (node.coordinates.x < map.map.length) {
        returnList.push(map.map[node.coordinates.x + 1][node.coordinates.y])
    }
    if (node.coordinates.y !== 0) {
        returnList.push(map.map[node.coordinates.x][node.coordinates.y - 1]);
    }
    if (node.coordinates.y < map.map[node.coordinates.x].length) {
        returnList.push(map.map[node.coordinates.x][node.coordinates.y + 1]);
    }
    return returnList;
};
