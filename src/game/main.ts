import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGHero from './actors/hero';
import TGActorFactory from './actor-factory';

const app = new HPApp({
  viewSize: new HPVector(825, 525),
  elementSelector: '#game-container',
  actorFactory: TGActorFactory,
  assets: [],
  areaFile: 'public/areas/test-1.json',
  hero: new TGHero(),
  heroStart: new HPVector(200, 700),
  gravityForce: new HPVector(0, 1),
  airFrictionCoefficient: 0.01,
});

app.start();
