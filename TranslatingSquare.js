var VSHADER_SOURCE = `
   attribute vec4 a_Position; 
   uniform mat4 u_ModelMatrix; 
   attribute vec4 a_Color;
   varying vec4 v_Color;
   void main() { 
     gl_Position = u_ModelMatrix * a_Position; 
     v_Color = a_Color;
    }`;

var FSHADER_SOURCE = `  
    precision mediump float;
    varying vec4 v_Color;
    void main(){
    gl_FragColor = v_Color;
    }`;

var TRANS_STEP = 1.0;

var Tx=0;

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var n = initVertexBuffers(gl);


    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var modelMatrix = new Matrix4();

    var tick = function () {
        newTranslate = animate();
        draw(gl, n, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick, canvas);
    };
    tick();
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.1, 0.1, 1.0 ,0.0 ,0.0,
        0.1, 0.1, 0.0 ,1.0 ,0.0,
        0.1, -0.1, 0.0 ,0.0 ,1.0,
        -0.1, -0.1 , 1.0 ,0.0 ,1.0
    ]);
    var n = 4;
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('failed to create buffer');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER ,vertices , gl.STATIC_DRAW );
    var FSIZE =vertices.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program ,'a_Position');
    if(a_Position<0){
        console.log('failed to retrieve a_Position location');
        return -1;
    }

    gl.vertexAttribPointer(a_Position , 2 , gl.FLOAT , false ,FSIZE*5 , 0 );
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program ,'a_Color');
    if(a_Color<0){
        console.log('failed to retrieve a_Position location');
        return -1;
    }
    gl.vertexAttribPointer(a_Color , 3 , gl.FLOAT , false ,FSIZE*5 , FSIZE*2 );
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER , null);
    return n;

}


function draw(gl, n, modelMatrix, u_ModelMatrix) {
    modelMatrix.setTranslate(Tx, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

var g_last = Date.now();
function animate() {
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    Tx = Tx + (TRANS_STEP * elapsed) / 1000.0;
    if(Tx>1-0.3||Tx<-1+0.3)
    TRANS_STEP=-1*TRANS_STEP;
}