import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGActorFactory from './actor-factory';
import TGHero from './actors/hero/hero';
import TGWeapon from './actors/hero/weapon';
import TGBarbarian from './actors/hero/classes/barbarian/barbarian';
import TGWizard from './actors/hero/classes/wizard/wizard';

const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get('class') || TGBarbarian.id;

const heroFactory = {
  [TGBarbarian.id]: () => new TGBarbarian(),
  [TGWizard.id]: () => new TGWizard(),
};

if (!heroFactory[classId]) throw new Error(`No hero class with id: ${classId}`);
const hero = heroFactory[classId]();

const textures = [
  TGHero.textureFile,
  TGWeapon.textureFile,
];

const app = new HPApp({
  elementSelector: '#game-container',
  actorFactory: TGActorFactory,
  areaFile: 'public/areas/test-1.json',
  textures,
  hero,
  heroStart: new HPVector(200, 700),
});

app.start();
