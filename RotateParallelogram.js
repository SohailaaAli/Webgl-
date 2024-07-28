var VSHADER_SOURCE =`
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
void main(){
    gl_Position = a_Position * u_ModelMatrix;
}
`;


var FSHADER_SOURCE =`
void main(){
    gl_FragColor = vec4(1.0 ,0.0 ,0.0 ,1.0);
}
`;


var ANGLE =0.0;

function main(){
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl)
    {
    console.log('failed to get rendering webgl context');
    return;
    }
    if(!initShaders(gl , VSHADER_SOURCE ,FSHADER_SOURCE))
    {
     console.log('failed to initiate webgl Shaders');
     return;
    }
 
    var n =initVertexBuffers(gl);
    if(n < 0)
    {
     console.log('faild to initiate vertex buffers');
     return;
    }
    var radian = Math.PI*ANGLE/180.0;
    var cosB = Math.cos(radian); 
    var sinB = Math.sin(radian);
    var modelMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
       -sinB, cosB, 0.0, 0.0,
         0.0,  0.0, 1.0, 0.0,
         0.0,  0.0, 0.0, 1.0
     ]);
   

    var u_ModelMatrix = gl.getUniformLocation(gl.program ,'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
    gl.clearColor(0.0 ,0.0 ,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN,0,n);

}
function initVertexBuffers(gl)
{
    var vertices =new Float32Array([
        0.0 ,0.5 , 0.25,0.0   ,0.0 , 0.25     ,-0.25,0.0                
    ])
    var n = 4;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER ,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER ,vertices,gl.STATIC_DRAW );
    
    var a_Position = gl.getAttribLocation(gl.program ,'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    gl.vertexAttribPointer(a_Position,2,gl.FLOAT ,false ,0,0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}

