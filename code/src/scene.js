import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import Transform from './transform.js';

export default class scene{
    constructor(){
        this.transform = new Transform();
        this.camera_pos = vec3.fromValues(0, 0, 10);
        this.radius = 0.5;
        this.angle = 0;
    }
    create_projection(){
        const projection_matrix = mat4.create();
        mat4.perspective(projection_matrix, Math.PI/2 , 1 , 1, 1000);
        // console.log(projection_matrix);
        return projection_matrix;
    }
    create_view(){
        const view_matrix = mat4.create();
        mat4.lookAt(view_matrix, this.camera_pos, vec3.fromValues(0.0,0.0,0.0), vec3.fromValues(0.0, 1.0, 0.0));
        return view_matrix;
    }
    camera_rotation(shader){
        // const aPosition = shader
        const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
        shader.setUniformMatrix4fv(uModelTransformMatrix,this.transform.getMVPMatrix());
    }
    getCameraAngle(){
        return this.angle;
    }
    setCameraAngle(angle,axis){
        this.angle = angle;
        if(axis == 'x')
            vec3.rotateX(this.camera_pos,this.camera_pos,vec3.fromValues(0,0,0),this.angle);
        if(axis == 'y')
            vec3.rotateY(this.camera_pos,this.camera_pos,vec3.fromValues(0,0,0),this.angle);
        if(axis == 'z')
            vec3.rotateZ(this.camera_pos,this.camera_pos,vec3.fromValues(0,0,0),this.angle);
    }
    getCameraPos(){
        return this.camera_pos;
    }
}