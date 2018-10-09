import RPGSystem from "./rpg-system";
import Vector from "../engine/core/vector";

const system = new RPGSystem('public/areas/ruins-1.json', new Vector(240, 240));
system.init();
