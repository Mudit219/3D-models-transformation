const fragmentShader_light = `      
        precision mediump float;
        uniform vec3 v_color;
        uniform float v_shininess;
        void main () {               
          gl_FragColor = vec4(1.0);
        }                            
	  `;
export default fragmentShader_light;
