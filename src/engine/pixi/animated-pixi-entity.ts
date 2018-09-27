import PIXIEntity from './pixi-entity';
import Vector from '../core/vector';
import { extras, Texture } from 'pixi.js';

export default abstract class AnimatedPIXIEntity extends PIXIEntity {

  get sprite() { return <extras.AnimatedSprite>this._sprite; }

  constructor(position: Vector, textures: Array<Texture>) {
    super(
      new extras.AnimatedSprite(textures),
      position,
    );
  }
}
