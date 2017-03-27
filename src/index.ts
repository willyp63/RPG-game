import { Container, Application, IApplicationOptions } from 'pixi.js';

// Custom classes
import * as Shape from './shapes';

new class Main {
    app: Application;

    settings: IApplicationOptions = {
        backgroundColor: 0xFFFFFF,
        antialias: true
    };

    constructor() {
        this.app = new Application(window.innerWidth, window.innerHeight, this.settings);
        document.body.appendChild(this.app.view);

        let circle: Shape.Circle = new Shape.Circle();
        this.app.stage.addChild(circle);

        // Animation loop
        this.app.ticker.add((delta) => {
            circle.position.x += delta * 0.3;
            circle.position.y += delta * 0.3;
        });
    }
}