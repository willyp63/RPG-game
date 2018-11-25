import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGHero from './actors/hero';
import TGActorFactory from './actor-factory';

const hero = new TGHero();

const app = new HPApp(
  new HPVector(825, 525),
  '#game-container',
  TGActorFactory,
  [],
  'public/areas/test-1.json',
  hero,
  new HPVector(200, 700),
  new HPVector(0, 1),
  0.01,
);

app.start();
