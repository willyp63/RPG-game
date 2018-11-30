import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import TGActorFactory from './actor-factory';
import TGHero from './actors/hero/hero';
import TGWeapon from './actors/hero/weapon';
import TGWizard from './actors/hero/classes/wizard/wizard';
import TGWarrior from './actors/hero/classes/warrior/warrior';
import TGRouge from './actors/hero/classes/rouge/rouge';
import TGAbilityIcon from './ui/ability-icon';
import TGStatusBar from './ui/status-bar';
import HPUIElement, { HPUIElementAlignment, HPUIElementLayoutDirection, HPUIElementPosition } from '../engine/ui/ui-element';

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

const uiElements = [
  new HPUIElement({
    position: HPUIElementPosition.Absolute,
    alignment: HPUIElementAlignment.BottomLeft,
    layoutDirection: HPUIElementLayoutDirection.Vert,
    margin: new HPVector(6, 0),
    children: [
      new TGStatusBar(0xFF0000),
      new TGStatusBar(0x00FF00),
      new HPUIElement({
        margin: new HPVector(0, 6),
        children: [
          new TGAbilityIcon(),
          new TGAbilityIcon(),
          new TGAbilityIcon(),
          new TGAbilityIcon(),
          new TGAbilityIcon(),
          new TGAbilityIcon(),
        ],
      }),
    ],
  }),
];

const app = new HPApp({
  elementSelector: '#game-container',
  actorFactory: TGActorFactory,
  areaFile: 'public/areas/test-1.json',
  textures,
  uiElements,
  hero,
  heroStart: new HPVector(200, 700),
});

app.start();
