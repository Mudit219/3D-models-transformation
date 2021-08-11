// varying attribute is passed on to the fragment shader.
const vertexShader_light = `      
        attribute vec3 aPosition;
        uniform mat4 uModelTransformMatrix;
        uniform mat4 projection;
        uniform mat4 view; 

        void main () {             
          gl_Position = projection * view * uModelTransformMatrix * vec4(aPosition, 1.0); 
          gl_PointSize = 5.0;
        }                          
	  `;

export default vertexShader_light;
