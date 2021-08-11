// varying attribute is passed on to the fragment shader.

const vertexShader_phong = `
        attribute vec3 aPosition;
        attribute vec3 a_normal;
        uniform mat4 uModelTransformMatrix;
        uniform mat4 projection;
        uniform mat4 view; 
        uniform mat4 normal_matrix;
        
        varying vec3 v_normal;
        varying vec3 point_position;

        void main () {             
          gl_Position = projection * view * uModelTransformMatrix * vec4(aPosition, 1.0); 
          v_normal = mat3(normal_matrix)*a_normal;
          point_position = (uModelTransformMatrix * vec4(aPosition,1.0)).xyz;
        }                          
	  `;
    // eye_light = vec4(eye_position,1.0)-point_position;

export default vertexShader_phong;
