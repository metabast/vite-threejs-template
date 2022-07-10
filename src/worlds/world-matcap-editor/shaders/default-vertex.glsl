#define M_PI 3.1415926535897932384626433832795

uniform float uTime;

varying vec4 vColor;

void main()
{
    vec3 col = 0.5 + 0.5*cos(uTime+uv.xyx+vec3(0,2,4));
    vColor = vec4(col, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}