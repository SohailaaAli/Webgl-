var VSHADER_SOURCE=
`attribute vec4 a_Position ;
uniform mat4 u_ModelMatrix;
attribute vec4 a_Color;
varying vec4 v_Color;
void main(){
    gl_Position =   u_ModelMatrix *a_Position;
    v_Color = a_Color;
}
`;

var FSHADER_SOURCE= 
`precision mediump float;
varying vec4 v_Color;
void main(){
    gl_FragColor = v_Color;
}
`;

var ANGLE_STEP = 45.0;
function main(){
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('failed to rendering webgl context');
        return;
    }

    if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE))
    {
        console.log('failed to initiate shaders');
        return;
    }

    var n = initVertexBuffers(gl)
    if(n<0){
        console.log('failed to initiate buffeers');
        return;
    }
    gl.clearColor(0.0 ,0.0 ,0.0 ,1.0);

    var u_ModelMatrix = gl.getUniformLocation(gl.program ,'u_ModelMatrix');
    if(!u_ModelMatrix){
        console.log('failed to retrier u_ModelMatrix location');
        return;
    }

    var currentAngle = 0.0;
    var ModelMatrix =new Matrix4();
    var tick =function(){
        currentAngle = animate(currentAngle);
        draw(gl , n  ,currentAngle , ModelMatrix ,u_ModelMatrix );
        requestAnimationFrame(tick ,canvas);
    }
    tick();
    
}

function initVertexBuffers(gl){
    var vertices = new Float32Array([
        -0.25, 0.25 ,1.0,0.0,0.0
         ,-0.25, -0.25,0.0,1.0,0.0  
         , 0.0, 0.25  ,0.0,0.0,1.0
    ]);
    var n= 3;
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log ('failed to create buffer');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER , vertices,gl.STATIC_DRAW);
    var FSIZE =vertices.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program , 'a_Position');
    if( a_Position<0)
    {
        console.log('failed to retrieve a_Position location');
        return false;
    }
    gl.vertexAttribPointer(a_Position,2 ,gl.FLOAT,false ,FSIZE*5,0);
    gl.enableVertexAttribArray(a_Position);
    var a_Color =gl.getAttribLocation(gl.program , 'a_Color');
    if(a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color,3 ,gl.FLOAT,false ,FSIZE*5,FSIZE*2);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER , null);
    return n;

}

function draw(gl , n , currentAngle ,modelMatrix,u_ModelMatrix ){
    modelMatrix.setRotate(currentAngle , 0 ,0 ,1);
   
    gl.uniformMatrix4fv(u_ModelMatrix , false , modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(4 , 0 ,n);
}

var g_last = Date.now();
function animate(angle)
{
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now ;
    var newAngle = angle + (ANGLE_STEP * elapsed )/1000.0;
    return newAngle %= 360 ; 
}