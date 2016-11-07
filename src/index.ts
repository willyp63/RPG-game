/// <reference path="./../typings/index.d.ts" />
import * as PIXI from 'pixi.js';

// Custom classes
import * as Shape from './shapes';

class Main {
    renderer: any;
    stage: PIXI.Container;

    settings: Object = {
        backgroundColor: 0xFFFFFF,
        antialias: true
    };

    constructor() {
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, this.settings);
        this.stage = new PIXI.Container();

        this.addShapes();

        document.body.appendChild(this.renderer.view);
    }

    addShapes() {

        // Circles
        let circle = new Shape.Circle();
        this.stage.addChild(circle);
    }

    render() {
        // Render
        this.renderer.render(this.stage);

        // Do something more
    }

    animate() {
        this.render();

        window.requestAnimationFrame(this.animate.bind(this));
    }
} 

new Main().animate();