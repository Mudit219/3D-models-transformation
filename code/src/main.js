import { vec3, mat4, quat } from 'https://cdn.skypack.dev/gl-matrix';
import Shader from './shader.js';
import vertexShader_gourad from '../shaders/vertex_gourad.js';
import fragmentShader_gourad from '../shaders/fragment_gourad.js';
import vertexShader_phong from '../shaders/vertex_phong.js';
import fragmentShader_phong from '../shaders/fragment_phong.js'
import vertexShader_light from '../shaders/vertex_light.js';
import fragmentShader_light from '../shaders/fragment_light.js';
import Renderer from './renderer.js';
import scene from './scene.js';
import getObjData from './importing_file.js';
import Model from './Model.js';
import Model_light from './Model_light.js';

const renderer = new Renderer();
const gl = renderer.webGlContext();
gl.enable(gl.DEPTH_TEST);
var shader_gourad = new Shader(gl, vertexShader_gourad, fragmentShader_gourad);
var shader_phong = new Shader(gl, vertexShader_phong, fragmentShader_phong);
let shader = shader_gourad;
shader.use();
// const shader_light = new Shader(gl,vertexShader_light,fragmentShader_light);
// shader_light.use();
const my_scene = new scene();


var camera_axis = "y";
var cam = false;
// var shape_mode='s';
var mesh_rectangle = [];
var lights = [];
var axes = [];
// Transformations
let rotationAngleX = 0;
let rotationAxisX = vec3.fromValues(1,0,0);
let rotationAngleY = 0;
let rotationAxisY = vec3.fromValues(0,1,0);
let rotationAngleZ = 0;
let rotationAxisZ = vec3.fromValues(0,0,1);

let translation = vec3.fromValues(0,0,0);
let scale = vec3.fromValues(0.5,0.5,0.5);

var position = vec3.fromValues(0,0,0);
let pick_mode = false;
let light_mode = false;
let shader_mode = false;
let shader_code = "none";
let shine = 100;

var selected_mesh;
var curr_quat = quat.create();

// Key Press events
window.addEventListener("keydown",function (event)
{
	switch (event.key)
	{
		case "c":
			if(mesh_rectangle.length==0){
				(async () => {
				
				// Importing models
				var light = await getObjData('../meshes/light.obj');
				var mesh1 = await getObjData('../meshes/monkey.obj');
				var mesh2 = await getObjData('../meshes/spiky.obj');
				var mesh3 = await getObjData('../meshes/Cube.obj');

				// Making models
				var monkey = new Model(gl,my_scene,mesh1,vec3.fromValues(1.0,0.84,0.0),[0.4,0.6,1.0],[5.0,2.0,0.0]);
				var spiky = new Model(gl,my_scene,mesh2,vec3.fromValues(1.0,0.0,0.0),[0.5,0.5,0.8],[-7.0,2.0,0.0]);
				var cube = new Model(gl,my_scene,mesh3,vec3.fromValues(0.0,0.0,1.0),[0.6,0.7,0.9],[0.0,-4.0,0.0]);

				monkey.transform.setScale(vec3.fromValues(4.0,4.0,4.0));
				spiky.transform.setScale(vec3.fromValues(1.0,1.0,1.0));
				cube.transform.setScale(vec3.fromValues(2.0,2.0,2.0));

				// Making light objects
				var light_colors = [vec3.fromValues(0.8,0.8,0.8),vec3.fromValues(1.0,0.8,0.5),vec3.fromValues(0.8,0.7,1.0)];
				var light_model = new Model_light(gl,my_scene,light,vec3.fromValues(4.1,2.4,3.4),light_colors);
				light_model.transform.setScale(vec3.fromValues(0.1,0.1,0.1));
				lights.push(light_model);

				monkey.set_light(light_model);

				light_colors = [vec3.fromValues(0.5,0.5,0.5),vec3.fromValues(0.4,0.4,0.4),vec3.fromValues(1.0,1.0,1.0)];
				light_model = new Model_light(gl,my_scene,light,vec3.fromValues(-5.0,6.0,1.0),light_colors);
				light_model.transform.setScale(vec3.fromValues(0.1,0.1,0.1));
				lights.push(light_model);
				spiky.set_light(light_model);
				
				light_colors = [vec3.fromValues(0.6,0.6,0.6),vec3.fromValues(0.5,0.4,0.3),vec3.fromValues(0.5,0.5,0.5)];
				light_model = new Model_light(gl,my_scene,light,vec3.fromValues(0.0,-0.0,0.8),light_colors);
				light_model.transform.setScale(vec3.fromValues(0.1,0.1,0.1));
				lights.push(light_model);
				cube.set_light(light_model);

				// Assigning lights to models
				monkey.set_scene_lights(lights);
				spiky.set_scene_lights(lights);
				cube.set_scene_lights(lights);

				mesh_rectangle.push(monkey);
				mesh_rectangle.push(spiky);
				mesh_rectangle.push(cube);
				console.log("All the models have been importes sucessfully. Please enter one of the following mode: \n 'm' : Mesh-transformation mode\n 'l' : Illuminator mode \n 's' : Shade mode");
				})();
			}
			break;

		// Mesh Pick mode
		case "m":
			if(pick_mode === false && mesh_rectangle.length!=0){
				pick_mode = true;
				light_mode = false;
				shader_mode = false;
				selected_mesh = mesh_rectangle[0];
				selected_mesh.set_select(true);
				console.log("Pick mode activated.  Please select a mesh :\n '4' : Monkey \n '5': Spike \n '6': Cube \n");
			}
			else{
				pick_mode = false;
				selected_mesh.set_select(false);
				console.log("Pick mode deactivated.");
			}
			break;
		
		// Un-select all the meshes
		case "2":
			for(let i=0;i<mesh_rectangle.length;i++){
				mesh_rectangle[i].selected = false;
			}
			selected_mesh = NaN;
			break;

		case "4":
			if(pick_mode === true || light_mode === true || shader_mode === true){
				console.log("mesh1 is selected.");
				selected_mesh = mesh_rectangle[0];
				mesh_rectangle[0].set_select(true);
				mesh_rectangle[1].set_select(false);
				mesh_rectangle[2].set_select(false);				
			}	
			break;

		case "5":
			if(pick_mode === true || light_mode === true || shader_mode === true){
				selected_mesh = mesh_rectangle[1];
				console.log("mesh2 is selected.");
				mesh_rectangle[1].set_select(true);
				mesh_rectangle[0].set_select(false);
				mesh_rectangle[2].set_select(false);
			}
			break;

		case "6":
			if(pick_mode === true || light_mode === true || shader_mode === true){
				selected_mesh = mesh_rectangle[2];
				console.log("mesh3 is selected.");
				mesh_rectangle[2].set_select(true);
				mesh_rectangle[0].set_select(false);
				mesh_rectangle[1].set_select(false);
			}
			break;

		// Illumation mode
		case "l":
			if(light_mode === false && mesh_rectangle.length!=0){
				light_mode = true;
				pick_mode = false;
				shader_mode=false;
				selected_mesh = mesh_rectangle[0];
				selected_mesh.set_select(true);
				console.log("light mode activated. Please select a mesh :\n '4' : Monkey \n '5': Spike \n '6': Cube \n");
			}
			else{
				light_mode = false;
				selected_mesh.set_select(false);
				console.log("light mode deactivated.");
			}
			break;

		case "0":
			if(light_mode === true && selected_mesh!=NaN){
				console.log("Light of the this mesh is turned off.");
				selected_mesh.get_light().switch_on=false;
			}
			break;

		case "1":
			if(light_mode === true && selected_mesh!=NaN){
				console.log("Light of the this mesh is turned on.");
				selected_mesh.get_light().switch_on=true;
			}
			break;
		// Keys to move the mesh and the light.
		case "ArrowRight":
			if(pick_mode === true && selected_mesh!=NaN ){
				translation= selected_mesh.transform.getTranslate();
				translation[0] += 0.4;
				let light_translate = selected_mesh.get_light().get_pos();
				light_translate[0] += 0.4;
				selected_mesh.transform.setTranslate(translation);
				selected_mesh.get_light().set_pos(light_translate);
			}
			if(light_mode === true && selected_mesh!=NaN ){
				let selected_light = selected_mesh.get_light();
				let constraints = vec3.create();
				var translation_light = selected_light.get_pos();
				translation_light[0] += 0.1;
				// debugger;
				vec3.subtract(constraints,translation_light,selected_mesh.get_center());
				constraints = vec3.length(constraints);
				// console.log(constraints,selected_mesh.get_bbox_length()/2,selected_light.get_bbox_length()/2);
				if(constraints > selected_mesh.get_bbox_length()/2 && constraints < selected_light.get_bbox_length()/2){
					// console.log("right");
					selected_light.set_pos(translation_light);
				}
				
			}
			break;

		case "ArrowUp":
			if(pick_mode === true && selected_mesh!=NaN){
				translation = selected_mesh.transform.getTranslate();
				translation[1] += 0.4;
				let light_translate = selected_mesh.get_light().get_pos();
				light_translate[1] += 0.4;
				selected_mesh.transform.setTranslate(translation);
				selected_mesh.get_light().set_pos(light_translate);
			}
			if(light_mode === true && selected_mesh!=NaN ){
				let selected_light = selected_mesh.get_light();
				let constraints = vec3.create();
				var translation_light= selected_light.get_pos();
				translation_light[1] += 0.1;
				vec3.subtract(constraints,translation_light,selected_mesh.get_center());
				constraints = vec3.length(constraints);
				// console.log(constraints,selected_mesh.get_bbox_length()/2,selected_light.get_bbox_length()/2);
				if(constraints > selected_mesh.get_bbox_length()/2 && constraints < selected_light.get_bbox_length()/2){
					// console.log("up");
					selected_light.set_pos(translation_light);
				}
				
			}
			break;

		case "ArrowLeft":
			if(pick_mode === true && selected_mesh!=NaN){
				translation = selected_mesh.transform.getTranslate();
				translation[0] -= 0.4;
				let light_translate = selected_mesh.get_light().get_pos();
				light_translate[0] -= 0.4;
				selected_mesh.transform.setTranslate(translation);
				selected_mesh.get_light().set_pos(light_translate);
			}
			if(light_mode === true && selected_mesh!=NaN ){
				let selected_light = selected_mesh.get_light();
				let constraints = vec3.create();
				var translation_light= selected_light.get_pos();
				translation_light[0] -= 0.1;
				vec3.subtract(constraints,translation_light,selected_mesh.get_center());
				constraints = vec3.length(constraints);
				// console.log(constraints,selected_mesh.get_bbox_length()/2,selected_light.get_bbox_length()/2);
				if(constraints > selected_mesh.get_bbox_length()/2 && constraints < selected_light.get_bbox_length()/2){
					// console.log("left");
					selected_light.set_pos(translation_light);
				}
				
			}
			break;

		case "ArrowDown":
			if(pick_mode === true && selected_mesh!=NaN){
				translation = selected_mesh.transform.getTranslate();
				translation[1] -= 0.4;
				let light_translate = selected_mesh.get_light().get_pos();
				light_translate[1] -= 0.4;
				// console.log(light_translate,selected_mesh.get_light().get_pos());
				selected_mesh.transform.setTranslate(translation);
				selected_mesh.get_light().set_pos(light_translate);
			}
			if(light_mode === true && selected_mesh!=NaN ){
				let selected_light = selected_mesh.get_light();
				let constraints = vec3.create();
				var translation_light= selected_light.get_pos();
				// debugger;
				translation_light[1] -= 0.1;
				// debugger;
				// console.log(selected_light.get_pos(),translation_light);
				vec3.subtract(constraints,translation_light,selected_mesh.get_center());
				constraints = vec3.length(constraints);
				// console.log(constraints,selected_mesh.get_bbox_length()/2,selected_light.get_bbox_length()/2);
				if(constraints > selected_mesh.get_bbox_length()/2 && constraints < selected_light.get_bbox_length()/2){
					// console.log("down");
					selected_light.set_pos(translation_light);
				}
				
			}
			break;

		case "a":
			if(pick_mode === true && selected_mesh!=NaN){
				translation = selected_mesh.transform.getTranslate();
				translation[2] -= 0.4;
				let light_translate = selected_mesh.get_light().get_pos();
				light_translate[2] -= 0.4;
				// console.log(light_translate,selected_mesh.get_light().get_pos());
				selected_mesh.transform.setTranslate(translation);
				selected_mesh.get_light().set_pos(light_translate);
			}
			if(light_mode === true && selected_mesh!=NaN ){
				let selected_light = selected_mesh.get_light();
				let constraints = vec3.create();
				var translation_light= selected_light.get_pos();
				// debugger;
				translation_light[2] -= 0.1;
				// debugger;
				// console.log(selected_light.get_pos(),translation_light);
				vec3.subtract(constraints,translation_light,selected_mesh.get_center());
				constraints = vec3.length(constraints);
				// console.log(constraints,selected_mesh.get_bbox_length()/2,selected_light.get_bbox_length()/2);
				if(constraints > selected_mesh.get_bbox_length()/2 && constraints < selected_light.get_bbox_length()/2){
					// console.log("down");
					selected_light.set_pos(translation_light);
				}
			
			}
			break;
	case "z":
			if(pick_mode === true && selected_mesh!=NaN){
				translation = selected_mesh.transform.getTranslate();
				translation[2] += 0.4;
				let light_translate = selected_mesh.get_light().get_pos();
				light_translate[2] += 0.4;
				// console.log(light_translate,selected_mesh.get_light().get_pos());
				selected_mesh.transform.setTranslate(translation);
				selected_mesh.get_light().set_pos(light_translate);
			}
			if(light_mode === true && selected_mesh!=NaN ){
				let selected_light = selected_mesh.get_light();
				let constraints = vec3.create();
				var translation_light= selected_light.get_pos();
				// debugger;
				translation_light[2] += 0.1;
				// debugger;
				// console.log(selected_light.get_pos(),translation_light);
				vec3.subtract(constraints,translation_light,selected_mesh.get_center());
				constraints = vec3.length(constraints);
				// console.log(constraints,selected_mesh.get_bbox_length()/2,selected_light.get_bbox_length()/2);
				if(constraints > selected_mesh.get_bbox_length()/2 && constraints < selected_light.get_bbox_length()/2){
					// console.log("down");
					selected_light.set_pos(translation_light);
				}
				
			}
			break;

		case "+":
			if(pick_mode === true && selected_mesh!=NaN){
				let selected_light = selected_mesh.get_light();
				let constraints = vec3.create();
				vec3.subtract(constraints,selected_light.get_pos(),selected_mesh.get_center());
				constraints = vec3.length(constraints);
				// console.log(constraints,selected_mesh.get_bbox_length()/2*1.01,selected_light.get_bbox_length()/2*1.01);
				if(constraints > selected_mesh.get_bbox_length()/2){
					scale = selected_mesh.transform.getScale();
					scale[0]*=1.01;
					scale[1]*=1.01;
					scale[2]*=1.01;
					selected_mesh.set_bbox_length(selected_mesh.get_bbox_length()*1.01);
					selected_light.set_bbox_length(selected_light.get_bbox_length()*1.01);
					selected_mesh.transform.setScale(scale);
				}
			}
			break;

		case "-":
			if(pick_mode === true && selected_mesh!=NaN){
				let selected_light = selected_mesh.get_light();
				let constraints = vec3.create();
				vec3.subtract(constraints,selected_light.get_pos(),selected_mesh.get_center());
				constraints = vec3.length(constraints);
				// console.log(constraints,selected_mesh.get_bbox_length()/2*1.01,selected_light.get_bbox_length()/2*1.01);
				if(constraints < selected_light.get_bbox_length()/2){
					scale = selected_mesh.transform.getScale();
					scale[0]/=1.01;
					scale[1]/=1.01;
					scale[2]/=1.01;
					selected_mesh.set_bbox_length(selected_mesh.get_bbox_length()/1.01);
					selected_light.set_bbox_length(selected_light.get_bbox_length()/1.01);
					selected_mesh.transform.setScale(scale);
				}
			}
			break;
		// Shader mode. Switch between gourad and phong shaders
		case "s":
			if(shader_mode === false && mesh_rectangle.length!=0){
				pick_mode = false;
				light_mode = false;
				shader_mode = true;
				selected_mesh = mesh_rectangle[0];
				selected_mesh.set_select(true);
				console.log("Shader mode activated. Please select a mesh :\n '4' : Monkey \n '5': Spike \n '6': Cube \n" );
				console.log("Press 'g' to switch to gourad or 'p to phong" );
			}
			else{
				shader_mode = false;
				selected_mesh.set_select(false);
				console.log("Shader mode deactivated.");
			}
			break;
			
		case "g":
			if(shader_mode === true && selected_mesh!=NaN){
				shader_code = "g";
				console.log("Gourad mode is activate for the selected mesh");
			}
			break;

		case "p":
			if(shader_mode === true && selected_mesh!=NaN){
				shader_code = "p";
				console.log("Phong mode is activate for the selected mesh");
			}
		break;
	}
}
, true);


//Draw loop
function animate()
{
	var i=0;
	renderer.clear();	
	var shader = new Shader(gl, vertexShader_gourad, fragmentShader_gourad);
	for(i=0;i<mesh_rectangle.length;i++){
		let curr_mesh = mesh_rectangle[i];
		if(curr_mesh.get_select() && pick_mode === true){
			Trackball.RotationWithQuaternion.onRotationChanged = function (updatedRotationMatrix) 
				{
					let rotation_mat = mat4.create();
					mat4.copy(rotation_mat, updatedRotationMatrix);
					curr_mesh.transform.set_quat(rotation_mat);
				}
		}
		if(shader_mode === true && shader_code === "p" && curr_mesh.get_select()){
			shader = new Shader(gl, vertexShader_phong, fragmentShader_phong);
			shader.use();
			curr_mesh.transform.update_mvp_quat();
			// console.log("This mesh is in phong mode",i);
			curr_mesh.draw(shader);
		}
		if(shader_mode === true && shader_code === "g" && curr_mesh.get_select()){
			shader = new Shader(gl, vertexShader_gourad, fragmentShader_gourad);
			shader.use();
			curr_mesh.transform.update_mvp_quat();
			// console.log("This mesh is in gourad mode",i);
			curr_mesh.draw(shader);
		}
		else{
			shader.use();
			curr_mesh.transform.update_mvp_quat();
			// console.log("Normal mode");
			curr_mesh.draw(shader);
		}
	}
	const shader_light = new Shader(gl,vertexShader_light,fragmentShader_light);
	shader_light.use();
	for(i=0;i<lights.length;i++){
		let curr_mesh = lights[i];
		curr_mesh.transform.update_mvp_quat();
		curr_mesh.draw(shader_light);
	}
	window.requestAnimationFrame(animate);
}

animate();
shader.delete();