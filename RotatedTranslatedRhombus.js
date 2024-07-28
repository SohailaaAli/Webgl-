var VSHADER_SOURCE =
`attribute vec4 a_Position ;
uniform mat4 u_ModelMatrix;
void main(){
    gl_Position = a_Position * u_ModelMatrix ;
}
`;


var FSHADER_SOURCE =
`void main(){
    gl_FragColor = vec4(0.0 ,0.0 ,1.0 ,1.0);
}
`;

function main(){
    var canvas = document.getElementById('webgl');

    var gl =getWebGLContext(canvas);
    if(!gl)
    {
        console.log('failed to rendering context');
        return;
    }

    if(!initShaders(gl ,VSHADER_SOURCE ,FSHADER_SOURCE))
    {
        console.log('failed to initiate shaders');
        return;
    }
     
    var n = initVertexBuffers(gl);
    if(n<0)
    {
        console.log('failed to initiate buffer');
        return;
    }

   var modelMatrix = new Matrix4();
    var ANGLE =60.0;
    var TX =0.5;

    modelMatrix.setRotate(ANGLE,0,0,1)
    

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_xformMatrix');
      return;
    }

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clearColor(0.0 ,0.0 ,0.0 , 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP , 0 , n);

}
function initVertexBuffers(gl){
    var vertices = new Float32Array([
        -0.2,0.25  ,0.0 ,0.5  ,0.2 ,0.25             
    ])
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
    {
        console.log('failed to create buffer');
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER ,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER , vertices , gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program ,'a_Position');
    if(a_Position<0)
    {
        console.log('failed to get location');
        return -1;
    }
    gl.vertexAttribPointer(a_Position , 2 ,gl.FLOAT ,false , 0 ,0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}