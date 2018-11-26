import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGActorFactory from './actor-factory';
import TGWanderingTarget from './actors/wandering-target';
import TGWizard from './actors/heros/wizard';
import TGBarbarian from './actors/heros/barbarian';

const assets = [
  TGWizard.imageFile,
  TGBarbarian.imageFile,
  TGWanderingTarget.imageFile,
];

const app = new HPApp({
  elementSelector: '#game-container',
  actorFactory: TGActorFactory,
  areaFile: 'public/areas/test-1.json',
  assets,
  hero: new TGWizard(),
  heroStart: new HPVector(200, 700),
});

app.start();
