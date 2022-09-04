import { Vector2, Vector3 } from "three";

class LightModel{
    _light;
    _screenPosition = new Vector2();
    _distance = 0;
    _sphereFaceNormal;
    _positionOnSphere;
    _positionTarget = new Vector3(0,0,0);
    _lookAtTarget = true;

    get light() {
        return this._light;
    }
    
    set light(value) {
        this._light = value;
        this.update();
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

    get positionTarget() {
        return this._positionTarget;
    }

    set positionTarget(value) {
        this._positionTarget = value;
        if(this._lookAtTarget) {
            this._light.lookAt(this._positionTarget);
        }
    }

    set positionTargetX(value) {
        this._positionTarget.x = value;
        if(this._lookAtTarget) {
            this._light.lookAt(this._positionTarget);
        }
    }

    set positionTargetY(value) {
        this._positionTarget.y = value;
        if(this._lookAtTarget) {
            this._light.lookAt(this._positionTarget);
        }
    }

    set positionTargetZ(value) {
        this._positionTarget.z = value;
        if(this._lookAtTarget) {
            this._light.lookAt(this._positionTarget);
        }
    }   

    get lookAtTarget() {
        return this._lookAtTarget;
    }

    set lookAtTarget(value) {
        this._lookAtTarget = value;
        if(value) {
            this._light.lookAt(this._positionTarget);
        }else{
            this._light.rotation.set(0,0,0);
        }
    }

    update(){
        if(this._lookAtTarget) {
            this._light.lookAt(this._positionTarget);
        }
    }
}

export default LightModel;