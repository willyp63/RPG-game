import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGHero from './actors/hero';
import TGActorFactory from './actor-factory';

const app = new HPApp({
  elementSelector: '#game-container',
  actorFactory: TGActorFactory,
  areaFile: 'public/areas/test-1.json',
  hero: new TGHero(),
  heroStart: new HPVector(200, 700),
});

app.start();
