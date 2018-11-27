import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGActorFactory from './actor-factory';
import TGHero from './actors/hero/hero';

const assets = [
  TGHero.textureFile,
];

const app = new HPApp({
  elementSelector: '#game-container',
  actorFactory: TGActorFactory,
  areaFile: 'public/areas/test-1.json',
  assets,
  hero: new TGHero(),
  heroStart: new HPVector(200, 700),
});

app.start();
