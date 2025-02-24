import Enemy from "./Enemy";
class Birdman extends Enemy{
    constructor(scene, x, y) {
        super(scene, x, y, "birdman");
    }
}


class Snaky extends Enemy{
    constructor(scene, x, y) {
        super(scene, x, y, "Snaky");
    }
}


export { Birdman, Snaky };