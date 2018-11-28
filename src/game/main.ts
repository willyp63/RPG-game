import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGActorFactory from './actor-factory';
import TGHero from './actors/hero/hero';
import TGWeapon from './actors/hero/weapon';
import TGWizard from './actors/hero/classes/wizard/wizard';
import TGWarrior from './actors/hero/classes/warrior/warrior';
import TGRouge from './actors/hero/classes/rouge/rouge';

const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get('class') || TGWarrior.id;

const heroFactory = {
  [TGWarrior.id]: () => new TGWarrior(),
  [TGWizard.id]: () => new TGWizard(),
  [TGRouge.id]: () => new TGRouge(),
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
