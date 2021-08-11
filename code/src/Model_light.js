import Transform from './transform.js'
import getObjData from './importing_file.js';
import { vec3, mat4,vec4 } from 'https://cdn.skypack.dev/gl-matrix';
export default class Model_light
{
	constructor(gl,my_scene,data,position,colors)
	{
		this.selected = false;
		this.shininess = 100;
		this.switch_on = true;
		this.ambient_col = colors[0];
		this.diffuse_col = colors[1];
		this.specular_col = colors[2];
		this.bb_box_length = 1;
		this.my_scene = my_scene;
		this.vertexPositionData = new Float32Array(data.vertices);
		this.vertexIndices = new Uint16Array(data.indices);
		this.gl = gl;
		this.buffer = this.gl.createBuffer();
		this.light_pos = position;
		// this.light_pos = vec3.create();
		// vec3.copy(this.light_pos,position);
		if (!this.buffer)
		{
			throw new Error("Buffer could not be allocated");
		}
		this.transform = new Transform();
		this.transform.setTranslate(position);
		// this.transform.update_mvp_quat();
	}

	draw(shader)
	{		
		const elementPerVertex = 3;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionData, this.gl.STATIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 3*this.vertexPositionData.BYTES_PER_ELEMENT, 0);

		const v_color = shader.uniform("v_color");
		shader.setUniform3f(v_color,this.ambient_col);
		
		// var shininess = 100;
		// const shininess_loc = shader.uniform("v_shininess");
		// this.gl.uniform1f(shininess_loc,this.shininess);

		const indexbuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexbuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, this.gl.STATIC_DRAW);

		// draw geometry lines by indices
		
		const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
		const projectionMatrix = shader.uniform("projection");
		const viewMatrix = shader.uniform("view");
		
		shader.setUniformMatrix4fv(uModelTransformMatrix,this.transform.get_mvp_quat());
		shader.setUniformMatrix4fv(projectionMatrix,this.my_scene.create_projection());
		shader.setUniformMatrix4fv(viewMatrix,this.my_scene.create_view());

		this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndices.length, this.gl.UNSIGNED_SHORT, indexbuffer);
		// this.gl.drawElements(this.gl.TRIANGLES, this.light_indices.length, this.gl.UNSIGNED_SHORT, 0);
		
		// this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexPositionData.length / (2*elementPerVertex));
	}

	setSelect(value){
		this.selected = value;
	}
	getSelect(){
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
	get_pos(){
		var x = vec3.create();
		vec3.copy(x,this.light_pos);
		return x;
	}
	set_pos(value){
		this.light_pos=value;
		this.transform.setTranslate(this.light_pos);
	}
	get_colors(){
		return [this.ambient_col,this.diffuse_col,this.specular_col];
	}
	get_bbox_length(){
		return this.bb_box_length;
	}
	set_bbox_length(value){
		this.bb_box_length = value;
	}
}
