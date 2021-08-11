const fragmentShader_phong = `
precision mediump float;
#define no_of_lights 3
struct Material {
  float ambient;
  float diffuse;
  float specular;
  float shininess;
}; 

struct light{
  vec3 light_position;
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  float constant;
  float linear;
  float quadratic;

};

        uniform vec3 v_color;
        uniform Material material;
        uniform vec3 eye_position;

        uniform light lights[no_of_lights];
        varying vec3 v_normal;
        varying vec3 point_position;

        void main () {               
          vec3 result = vec3(0.0,0.0,0.0);
              for(int i=0;i<no_of_lights;i++){

                  light light_temp = lights[i];
                  // Ambient lighting
                  vec3 ambient = material.ambient * light_temp.ambient;
                  
                  // Diffuse Lighting
                  vec3 normal_dir = normalize(v_normal);
                  vec3 surface_light = light_temp.light_position - point_position;
                  vec3 surface_light_dir = normalize(surface_light);
                  float diff = max(dot(normal_dir, surface_light_dir),0.0);
                  vec3 diffuse = material.diffuse* diff * light_temp.diffuse;
                  
                  // Specular lighting
                  vec3 eye_light = eye_position - point_position;
                  vec3 eye_light_dir = normalize(eye_light);
                  vec3 half_vector = normalize(surface_light_dir + eye_light_dir);
                  float spec = pow(dot(normal_dir,half_vector),material.shininess);
                  vec3 specular = spec * light_temp.specular;
                  float distance = length(light_temp.light_position - point_position);
                  if(light_temp.constant > 0.0){
                  float attenuation = 1.0 / (light_temp.constant + light_temp.linear * distance + light_temp.quadratic * (distance * distance));    
                  ambient *= attenuation;
                  diffuse *= attenuation;
                  specular *= attenuation;
                  };
                  result += (ambient+diffuse+specular)*v_color;
              }
        if(result == vec3(0.0,0.0,0.0)){
          result = 0.3*v_color;
        }
          gl_FragColor = vec4(result,1.0);
        }                            
	  `;    

    export default fragmentShader_phong;
