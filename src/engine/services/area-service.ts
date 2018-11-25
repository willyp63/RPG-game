import getJson from "../util/get-json";
import HPAreaData from "./data/area-data";

export default class HPAreaService {

  static getAreaData(areaFile: string) {
    return getJson(areaFile).then(json => <HPAreaData>json);
  }

}
