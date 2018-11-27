import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGActorFactory from './actor-factory';
import TGHero from './actors/hero/hero';
import TGWeapon from './actors/hero/weapon';
import TGWizard from './actors/hero/classes/wizard/wizard';

const textures = [
  TGHero.textureFile,
  TGWeapon.textureFile,
];

const app = new HPApp({
  elementSelector: '#game-container',
  actorFactory: TGActorFactory,
  areaFile: 'public/areas/test-1.json',
  textures,
  hero: new TGWizard(),
  heroStart: new HPVector(200, 700),
});

app.start();
