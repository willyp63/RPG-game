import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import HPActorFactory from '../engine/core/actor-factory';
import HPActorData from '../engine/services/data/actor-data';
import HPActor from '../engine/core/actor';

class TGActorFactory extends HPActorFactory {

  protected _createFromData(data: HPActorData): HPActor | undefined {
    return super._createFromData(data) || this.__createFromData(data);
  }

  __createFromData(data: HPActorData): HPActor | undefined {
    return undefined;
  }
}

const app = new HPApp(
  new HPVector(825, 525),
  '#game-container',
  new TGActorFactory(),
  [],
  'public/areas/test-1.json',
  new HPVector(0, 1),
  0.01,
);

app.start();
