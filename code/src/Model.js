import Transform from './transform.js'
import { vec3, mat4,vec4 } from 'https://cdn.skypack.dev/gl-matrix';
export default class Model
{
	constructor(gl,my_scene,data,color,material,center)
	{
		this.selected = false;
		this.shininess = 100;
		this.center = center;
		this.color = color;
		this.ka = material[0];
		this.kd = material[1];
		this.ks = material[2];
		this.original_color = color;
		this.my_scene = my_scene;
		this.data = data;
		this.vertexPositionData = new Float32Array(data.vertices);
		this.vertexIndices = new Uint16Array(data.indices);
		this.normals = new Float32Array(data.vertexNormals);
		// console.log(data.vertices);
		// console.log(this.vertexIndices.length);
		// this.light_pos = new Float32Array(light.vertices);
		// this.light_indices = new Uint16Array(light.indices);
		// console.log(data.vertexNormals);
		// console.log(data.vertices[0]);
		this.bbox_length = -1;
		
		this.lights = [];
		this.my_light = NaN;
		this.gl = gl;
		this.buffer = this.gl.createBuffer();
		this.indexbuffer = this.gl.createBuffer();
		this.normalbuffer = this.gl.createBuffer();

		this.light_pos = NaN;
		if (!this.buffer)
		{
			throw new Error("Buffer could not be allocated");
		}
		this.transform = new Transform();
		this.transform.setTranslate(center);
		this.transform.update_mvp_quat();
		for(let i=0;i<5898;i=i+1){
			if(Math.abs(this.data.vertices[i]) > this.bbox_length)
				this.bbox_length = this.data.vertices[i];	
		}
		this.bbox_length *= this.transform.getScale()[0];
		this.bbox_length += 3.0;
		this.bbox_length *=2;
	}

	draw(shader)
	{		
		const elementPerVertex = 3;
		const colorPerVertex = 3;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionData, this.gl.DYNAMIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 3*this.vertexPositionData.BYTES_PER_ELEMENT, 0);
		
		const v_color = shader.uniform("v_color");
		shader.setUniform3f(v_color,this.color);
		
		if(this.lights[0].switch_on === true){

			// console.log(this.lights[0].get_light_pos());
			var light_pos = shader.uniform("lights[0].light_position");
			shader.setUniform3f(light_pos,this.lights[0].get_pos());
			var light_ambient = shader.uniform("lights[0].ambient");
			shader.setUniform3f(light_ambient,this.lights[0].get_colors()[0]);
			var light_diffuse = shader.uniform("lights[0].diffuse");
			shader.setUniform3f(light_diffuse,this.lights[0].get_colors()[1]);
			var light_specular = shader.uniform("lights[0].specular");
			shader.setUniform3f(light_specular,this.lights[0].get_colors()[2]);

			const lights0constant = shader.uniform("lights[0].constant");
			this.gl.uniform1f(lights0constant, 0.75);
			const lights0linear = shader.uniform("lights[0].linear");
			this.gl.uniform1f(lights0linear, 0.09);
			const lights0quadratic = shader.uniform("lights[0].quadratic");
			this.gl.uniform1f(lights0quadratic, 0.032);
		}

		if(this.lights[1].switch_on === true){

			var light_pos = shader.uniform("lights[1].light_position");
			shader.setUniform3f(light_pos,this.lights[1].get_pos());
			var light_ambient = shader.uniform("lights[1].ambient");
			shader.setUniform3f(light_ambient,this.lights[1].get_colors()[0]);
			var light_diffuse = shader.uniform("lights[1].diffuse");
			shader.setUniform3f(light_diffuse,this.lights[1].get_colors()[1]);
			var light_specular = shader.uniform("lights[1].specular");
			shader.setUniform3f(light_specular,this.lights[1].get_colors()[2]);

			const lights1constant = shader.uniform("lights[1].constant");
		this.gl.uniform1f(lights1constant, 0.25);
		const lights1linear = shader.uniform("lights[1].linear");
		this.gl.uniform1f(lights1linear, 0.09);
		const lights1quadratic = shader.uniform("lights[1].quadratic");
		this.gl.uniform1f(lights1quadratic, 0.032);
		
		}

		if(this.lights[2].switch_on === true){

			var light_pos = shader.uniform("lights[2].light_position");
			shader.setUniform3f(light_pos,this.lights[2].get_pos());
			var light_ambient = shader.uniform("lights[2].ambient");
			shader.setUniform3f(light_ambient,this.lights[2].get_colors()[0]);
			var light_diffuse = shader.uniform("lights[2].diffuse");
			shader.setUniform3f(light_diffuse,this.lights[2].get_colors()[1]);
			var light_specular = shader.uniform("lights[2].specular");
			shader.setUniform3f(light_specular,this.lights[2].get_colors()[2]);

			const lights2constant = shader.uniform("lights[2].constant");
		this.gl.uniform1f(lights2constant, 0.25);
		const lights2linear = shader.uniform("lights[2].linear");
		this.gl.uniform1f(lights2linear, 0.09);
		const lights2quadratic = shader.uniform("lights[2].quadratic");
		this.gl.uniform1f(lights2quadratic, 0.032);
		}

			const material_ambient = shader.uniform("material.ambient");
			this.gl.uniform1f(material_ambient,this.ka);
			const material_diffuse = shader.uniform("material.diffuse");
			this.gl.uniform1f(material_diffuse,this.kd);
			const material_specular = shader.uniform("material.specular");
			this.gl.uniform1f(material_specular,this.ks);
			const material_shine = shader.uniform("material.shininess");
			this.gl.uniform1f(material_shine,this.shininess);


			const eye_pos = shader.uniform("eye_position");
			shader.setUniform3f(eye_pos,this.my_scene.getCameraPos());

			// var shininess = 100;
			

			// draw geometry lines by indices
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalbuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normals, this.gl.DYNAMIC_DRAW);
			const aNormal = shader.attribute("a_normal");
			this.gl.enableVertexAttribArray(aNormal);
			this.gl.vertexAttribPointer(aNormal, elementPerVertex, this.gl.FLOAT, false, 3*this.normals.BYTES_PER_ELEMENT, 0);		
		const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
		const projectionMatrix = shader.uniform("projection");
		const viewMatrix = shader.uniform("view");
		const normalMatrix = shader.uniform("normal_matrix");
		var norm_mat = mat4.create(); 
		// mat4.multiply(norm_mat,this.my_scene.create_view(),this.transform.getMVPMatrix());
		mat4.invert(norm_mat,this.transform.get_mvp_quat());
		mat4.transpose(norm_mat,norm_mat);

		shader.setUniformMatrix4fv(uModelTransformMatrix,this.transform.get_mvp_quat());
		shader.setUniformMatrix4fv(projectionMatrix,this.my_scene.create_projection());
		shader.setUniformMatrix4fv(viewMatrix,this.my_scene.create_view());
		shader.setUniformMatrix4fv(normalMatrix,norm_mat);



		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, this.gl.DYNAMIC_DRAW);

		this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndices.length, this.gl.UNSIGNED_SHORT, this.indexbuffer);
		// this.gl.drawElements(this.gl.TRIANGLES, this.light_indices.length, this.gl.UNSIGNED_SHORT, 0);
		
		// this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexPositionData.length / (2*elementPerVertex));
	}

	get_center(){
		return this.transform.getTranslate();
	}
	set_select(value){
		this.selected = value;
	}
	get_select(){
		return this.selected;
	}
	setMass(mass){
		this.mass = mass;
	}
	getMass(){
		return this.mass;
	}
	getColor(){
		return this.original_color;
	}
	setColor(color){
		this.color = color;
	}
	getShine(){
		return this.shininess;
	}
	setShine(value){
		this.shininess = value;
	}
	
	set_scene_lights(value){
		this.lights = value;
	}
	set_light(value){
		this.my_light = value;
		this.get_light().set_bbox_length(this.bbox_length*1.25);
		// let constraints = vec3.create();
		// constraints = vec3.subtract(constraints,value.get_pos(),this.get_center());
		// constraints = vec3.length(constraints);
		// let min_length = 1000000;
		// let new_coord = value.get_pos();
		// let bbox_coords = [
		// 	vec3.fromValues(this.bbox_length,this.bbox_length,this.bbox_length),
		// 	vec3.fromValues(this.bbox_length,-this.bbox_length,-this.bbox_length),
		// 	vec3.fromValues(-this.bbox_length,this.bbox_length,-this.bbox_length),
		// 	vec3.fromValues(-this.bbox_length,-this.bbox_length,this.bbox_length),
		// 	vec3.fromValues(-this.bbox_length,this.bbox_length,this.bbox_length),
		// 	vec3.fromValues(this.bbox_length,-this.bbox_length,this.bbox_length),
		// 	vec3.fromValues(this.bbox_length,this.bbox_length,-this.bbox_length),
		// 	vec3.fromValues(-this.bbox_length,-this.bbox_length,-this.bbox_length)
		// ];
		// for(let i =0;i<bbox_coords.length;i++){
		// 	if(constraints > Math.pow(3,0.5)*value.get_bbox_length()/2 || constraints < this.get_bbox_length()/2){
		// 		let coord = vec3.create();
		// 		let temp = vec3.create();
		// 		vec3.add(coord,this.get_center(),bbox_coords[i]);
		// 		vec3.subtract(temp,value.get_pos(),coord);
		// 		let length = vec3.length(temp);
		// 		if(length < min_length)
		// 			new_coord = coord;
		// 	}
		// }
		// value.set_pos(new_coord);
		// console.log(new_coord);
		// value.set_pos(vec3.fromValues(this.get_center()[0]+value.get_bbox_length()/2,this.get_center()[1]+value.get_bbox_length()/2,this.get_center()[2]+value.get_bbox_length()/2));
		// console.log((value.get_bbox_length()/2));
	}
	get_light(){
		return this.my_light;
	}
	get_bbox_length(){
		return this.bbox_length;
	}
	set_bbox_length(value){
		this.bbox_length = value;
	}
}
