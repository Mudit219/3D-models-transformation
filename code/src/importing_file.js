import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';

export async function getObjData(path){

    const response = await fetch(path);
    
    const objReadAsString = await response.text(); // Read the OBJ file and store the content into a string
    
    // console.log(new objLoader.Mesh(objReadAsString))
    return new objLoader.Mesh(objReadAsString);
}

export default getObjData;