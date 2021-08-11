const fragmentShader_gourad = `
        precision mediump float;
        uniform vec3 v_color;
        varying vec3 result;
        void main () {               
          gl_FragColor = vec4(result*v_color,1.0);
        }                            
	  `;    
export default fragmentShader_gourad;
