var VSHADER_SOURCE =
`attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
void main()
{
    gl_Position = a_Position * u_ModelMatrix;
}
`;

var FSHADER_SOURCE =
`void main()
{
    gl_FragColor = vec4(1.0 , 0.0 , 0.0 , 1.0);
}
`;

var ANGLE_STEP= 45.0;
function main()
{
    var canvas = document.getElementById('webgl');

    var  gl = getWebGLContext(canvas);
    if(!gl)
    {
        console.log ('failed to get rendering context');
        return;
    }

    if(!initShaders(gl ,VSHADER_SOURCE ,FSHADER_SOURCE))
    {
        console.log('failed to initiate webgl shaders');
        return;
    }

    var n = initVetexBuffers(gl);
    if(n < 0)
    {
        console.log('failed to initiate vertex buffer');
        return;
    }

    gl.clearColor(0.0 ,0.0 ,0.0 ,1.0);

    var u_ModelMatrix = gl.getUniformLocation(gl.program , 'u_ModelMatrix');
    if(!u_ModelMatrix)
    {
        console.log('failed to get u_ModelMatrix location');
        return;
    } 

    var currentAngle = 0.0;
    var modelMatrix = new Matrix4();

    var tick = function()
    {
        currentAngle = animate(currentAngle);
        draw(gl , n , currentAngle ,modelMatrix,u_ModelMatrix );
        requestAnimationFrame(tick ,canvas);
    } 
    tick();
}

function initVetexBuffers(gl)
{
    var vertices = new Float32Array([
        -0.25 , 0.5     ,    -0.75 , -0.5       ,0.25 , 0.5       ,0.75 ,-0.5  ,
        -1.0,0.0        ,    -0.75,0.0          ,-0.875, 0.5
    ])
    var  n = 7;
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
    {
        console.log('failed to create buffer');
        return -1 ;
    } 

    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER ,vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program ,'a_Position');
    if(a_Position<0)
    {
        console.log('failed to retrieve location');
        return -1;
    }
    
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n ;
}

function draw(gl , n , currentAngle ,modelMatrix,u_ModelMatrix ){
    modelMatrix.setRotate(currentAngle , 0 ,0 ,1);
   
    gl.uniformMatrix4fv(u_ModelMatrix , false , modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP , 0 ,4);
    gl.drawArrays(gl.TRIANGLES ,4 ,3)
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

function up(){
    ANGLE_STEP += 10;
}


function down(){
    ANGLE_STEP -= 10;
}