export default class KeyListener {
  private _code: number;
  private _onPress: Function;
  private _onRelease?: Function;
  private _isDown = false;

  constructor(keyCode: number, onPress: Function, onRelease?: Function) {
    this._code = keyCode;
    this._onPress = onPress;
    this._onRelease = onRelease;

    window.addEventListener('keydown', this._downHandler.bind(this), false);
    window.addEventListener('keyup', this._upHandler.bind(this), false);
  }

  _downHandler(e: KeyboardEvent) {
    if (e.keyCode === this._code) {
      if (!this._isDown && this._onPress) this._onPress();
      this._isDown = true;
    }
  }

  _upHandler(e: KeyboardEvent) {
    if (e.keyCode === this._code) {
      if (this._isDown && this._onRelease) this._onRelease();
      this._isDown = false;
    }
  }
}
