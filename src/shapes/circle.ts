export default class Circle extends PIXI.Sprite {

    graphics: PIXI.Graphics;

    constructor() { 
        super();

        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xF00d0F, 0.7);
        this.graphics.drawCircle(100, 100, 20);

        this.addChild(this.graphics);
    }
} 