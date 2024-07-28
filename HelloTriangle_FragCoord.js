var VSHADER_SOURCE =`
attribute vec4 a_Position ;
uniform mat4 u_ModelMatrix;
void main(){
    gl_Position = u_ModelMatrix * a_Position;
}
`;

var FSHADER_SOURCE  =`
precision mediump float;
uniform float u_Width;
uniform float u_Height;
void main(){
    gl_FragColor = vec4(0.0, gl_FragCoord.x/u_Width, gl_FragCoord.y/u_Height, 1.0);
}
`;


var ANGLE_STEP=45.0;
function main()
{
    var canvas =document.getElementById('webgl');
  // var gl = getWebGLContext(canvas);
  var gl= canvas.getContext('webgl');
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

    var n = initVertexBuffers(gl);
    if(n<0){
        console.log('failed to initiate vertex buffer');
        return;
    }

    gl.clearColor(0.0 ,0.0 ,0.0 ,1.0 );

    var u_ModelMatrix= gl.getUniformLocation(gl.program ,'u_ModelMatrix');
    if(! u_ModelMatrix)
    {
     console.log('failed to retrieve u_ModelMatrix');
     return;
    }


    var currentAngle = 0.0;
    var modelMatrix = new Matrix4();

    var tick = function()
    {
        currentAngle = animate(currentAngle);
        draw(gl , n ,currentAngle ,modelMatrix ,u_ModelMatrix);
        requestAnimationFrame(tick , canvas); 
    }
    tick();
    
    
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        //-0.5 , -0.25     ,0.25,-0.25    , 0.5 ,0.25    ,           -0.25 ,0.25 ,
        //-1.0,0.0        ,    -0.75,0.0          ,-0.875, 0.5
        0.0 , 0.0       ,      0.25 ,0.5            , 0.5 ,0.25 ,
        0.0 ,0.0        ,      -0.25 ,0.5           , -0.5 ,0.25 ,
        0.0 ,0.0        ,       -0.25,-0.5          , -0.5 ,-0.25,
        0.0 ,0.0         ,       0.25,-0.5         , 0.5 , -0.25
    ]);
    var n = 12;
  
    
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
   
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
    if (!u_Width) {
      console.log('Failed to get the storage location of u_Width');
      return;
    }
  
    var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
    if (!u_Height) {
      console.log('Failed to get the storage location of u_Height');
      return;
    }
  
    
    gl.uniform1f(u_Width, gl.drawingBufferWidth);
    gl.uniform1f(u_Height, gl.drawingBufferHeight);
  
    
    gl.enableVertexAttribArray(a_Position);
  
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return n;
  }

function draw(gl , n ,currentAngle ,modelMatrix ,u_ModelMatrix)
{
    modelMatrix.setRotate(currentAngle , 0 ,0,1);
    gl.uniformMatrix4fv(u_ModelMatrix , false , modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.TRIANGLE_FAN , 0 , 3);
    gl.drawArrays(gl.TRIANGLES ,0 ,3);
    gl.drawArrays(gl.TRIANGLES ,3 ,3);
    gl.drawArrays(gl.TRIANGLES , 6 ,3);
    gl.drawArrays(gl.TRIANGLES ,9 ,n);
}

var g_last = Date.now();
function animate(angle)
{
    var now =Date.now();
    var elapsed = now - g_last;
    g_last= now;
    var newAngle = angle + (ANGLE_STEP * elapsed)/1000.0;
    return newAngle %= 360;
}
