import { vec3, mat4,quat } from 'https://cdn.skypack.dev/gl-matrix';

export default class Transform
{
	constructor()
	{
		this.translate = vec3.fromValues( 0, 0, 0);
		this.scale = vec3.fromValues( 1, 1, 1);
		this.rotationAngleX = 0;
		this.rotationAxisX = vec3.fromValues(1,0,0);
		this.rotationAngleY = 0;
		this.rotationAxisY = vec3.fromValues(0,1,0);
		this.rotationAngleZ = 0;
		this.rotationAxisZ = vec3.fromValues(0,0,1);

		this.rotationAngle_global = 0;
		this.rotationAxis_global = vec3.fromValues( 0, 0, 1);
		this.translate_global = vec3.fromValues( 0, 0, 0)
		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);
		this.model_quat = quat.create();
		quat.fromEuler(this.model_quat,this.rotationAngleX,this.rotationAngleY,this.rotationAngleZ);
		this.quat_mat = mat4.create();
		mat4.fromQuat(this.quat_mat,this.model_quat);
		this.mvpMatrix = this.modelTransformMatrix;

		this.update_mvp_quat();
	}

	getMVPMatrix()
	{
		return this.modelTransformMatrix;
	}

	// Keep in mind that modeling transformations are apthis.mvpMatrixplied to objects in the opposite of the order in which they occur in the code
	updateMVPMatrix()
	{
		// console.log("MVP here")
		mat4.identity(this.modelTransformMatrix);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleX, this.rotationAxisX);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleY, this.rotationAxisY);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleZ, this.rotationAxisZ);
		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	}
	
	get_mvp_quat()
	{
		return this.modelTransformMatrix;
	}

	get_quat_mat(){
		return this.quat_mat;
	}
	update_mvp_quat(){
		mat4.identity(this.modelTransformMatrix);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		mat4.multiply(this.modelTransformMatrix,this.modelTransformMatrix,this.quat_mat);
		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	}

	updateMVPMatrix_global()
	{
		// console.log("MVP here")
		let reverse_trans = vec3.fromValues(-this.translate_global[0],-this.translate_global[1],0)
		mat4.identity(this.modelTransformMatrix);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate_global);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle_global, this.rotationAxis_global);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, reverse_trans);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle, this.rotationAxis);
		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	}

	setTranslate(translationVec)
	{
		this.translate = translationVec;
	}

	setTranslate_global(translationVec)
	{
		this.translate_global = translationVec;
	}
	getTranslate()
	{
		let x = vec3.create();
		vec3.copy(x,this.translate);
		return x;
	}

	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	getScale()
	{
		return this.scale;
	}

	setRotateX(rotationAxis, rotationAngle)
	{
		this.rotationAngleX = rotationAngle;
		this.rotationAxisX = rotationAxis;
	}
	setRotateY(rotationAxis, rotationAngle)
	{
		this.rotationAngleY = rotationAngle;
		this.rotationAxisY = rotationAxis;
	}
	setRotateZ(rotationAxis, rotationAngle)
	{
		this.rotationAngleZ = rotationAngle;
		this.rotationAxisZ = rotationAxis;
	}
	setRotate_global(rotationAxis, rotationAngle)
	{
		this.rotationAngle_global = rotationAngle;
		this.rotationAxis_global = rotationAxis;
	}
	getRotationX()
	{
		return [this.rotationAngleX,this.rotationAxisX];
	}
	getRotationY()
	{
		return [this.rotationAngleY,this.rotationAxisY];
	}
	getRotationZ()
	{
		return [this.rotationAngleZ,this.rotationAxisZ];
	}
	set_quat(value){
		this.quat_mat = value;
	}
	// getRotationAxis(){
	// 	return this.rotationAxis;
	// }

}