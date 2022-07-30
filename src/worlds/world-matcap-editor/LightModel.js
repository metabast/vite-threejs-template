import { Vector2 } from "three";

class LightModel{
    _light;
    _screenPosition = new Vector2();
    _distance = 0;
    _sphereFaceNormal;
    _positionOnSphere;

    get light() {
        return this._light;
    }

    set light(value) {
        this._light = value;
    }

    get screenPosition() {
        return this._screenPosition;
    }

    set screenPosition(value) {
        this._screenPosition = value;
    }

    get distance() {
        return this._distance;
    }

    set distance(value) {
        this._distance = value;
    }

    get sphereFaceNormal() {
        return this._sphereFaceNormal;
    }

    set sphereFaceNormal(value) {
        this._sphereFaceNormal = value;
    }

    get positionOnSphere() {
        return this._positionOnSphere;
    }

    set positionOnSphere(value) {
        this._positionOnSphere = value;
    }

}

export default LightModel;