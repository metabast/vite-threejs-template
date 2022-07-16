import { Vector2 } from "three";

function getScreenPosition(vector, camera, width, height) {
    const hw = width / 2;
    const hh = height / 2;
    const position = vector.clone().project(camera);
    return new Vector2(
        (position.x + 1) * hw,
        -(position.y - 1 ) * hh
    );
}

export {getScreenPosition};