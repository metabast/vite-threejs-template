uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform mat4 uTime;


attribute vec3 position;

varying vec4 vModelPosition;

void main(){

	vec4 modelPosition = modelMatrix * vec4(position, 1.0);

	vModelPosition = modelPosition;

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectionPosition = projectionMatrix * viewPosition;

	gl_Position = projectionPosition;

}