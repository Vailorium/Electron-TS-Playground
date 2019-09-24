import { Dictionary } from '../interfaces';
import { Attack } from "../models";

// tslint:disable: object-literal-sort-keys
export const ATTACKS: Dictionary<Attack> = {
    stab: { name: "Stab", description: "Basic stabbing move", damage: 5, minRange: 1, maxRange: 1 },
    shoot: { name: "Shoot", description: "Basic ranged move", damage: 3, minRange: 2, maxRange: 4 },
};
