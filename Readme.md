### Overview:

I have made 3 models (cube, monkey, spike) in blender and imported them. There are different features implemented including lighting, shading, translation of meshes and lights .

### Implementation

Each task can done by pressing a certain key on keyboard. These are the following keys and their features:

**Key c : **

- Import 3 models and 3 lights
- Render those models with each light assigned to each model.
- All the models will be assigned different color, material and each light will have different color components of ambient, diffuse and specular.

#### Modes :

1. Mesh translation mode **Key m : ** 
   - Press either **Key** **4/5/6** to select one of the meshes.
   - Press **Arrow keys up, down, left, right** and **key a** and **key z** for 3D translation of the selected mesh.
   - Along the with mesh its corresponding light will also translate as it always have to be within its bounding box.
   - Use **mouse left click** and drag to use trackball and rotate the selected mesh in any direction.
   - Use   **Key +/-** to scale to mesh. There is a restrictions on scaling. If the bounding box of light or mesh is going to collide with the light then it will not scale further.
   - Whatever operation is done is also reflected in bounding box.
2. Illumination mode **Key l :**
   - Press either **Key** **4/5/6** to select one of the meshes.
   - Press **Arrow keys up, down, left, right** and **key a** and **key z** for 3D translation of the selected mesh.
   - Light will have a restrictions to remain within the common area of the mesh and the light bounding box.
   - Press **Key 0/1** to turn off/on the light of the selected mesh. Lights which are turned off will not contribute to local illumination.  
3. Shade mode **Key s : **
   - Press either **Key** **4/5/6** to select one of the meshes.
   - By default, all the meshes are rendered with gourad light shading.
   - Press **Key p** to switch to blinn-phong shading for the selected mesh.
   - Press **Key g** to switch to gourad shading for the selected mesh.

#### Files:

- main.js : All the functionalities like key pressing, clicking, importing models and animation.
- Model.js : A generic code for creating any type of model by with the given vertices, indices  of the model. Each model will be assign a transform object. Each model can be assigned with its specific material properties including ambient, diffuse and specular.
- Model_light.js : A generic code for creating light objects. Each light can be assigned its own color component of ambient, diffuse, specular and attenuation property.
- vertex_phong.js : Vertex shader for phong light shading.
- fragment_phong.js : Fragment shader for phong light shading.
- vertex_gourad.js : Vertex shader for gourad light shading.
- fragment_gourad.js : Fragment shader for gourad light shading.
- trackball.js : Track ball implementation.
- Transform.js : A generic code which is contained by each model which enables any type of translation, rotation and scaling of the object(Model transformation matrix).
- scene.js : Creates projection and view matrix which is global and common to all the models in the scene. It contains camera object also which enables view from different positions and angles.
- shader.js : Enable vertex and fragment shaders and assign it to the main program.
