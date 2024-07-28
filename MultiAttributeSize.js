var VSHADER_SOURCE =
`attribute vec4 a_Position;
attribute float a_PointSize;
void main(){
    gl_Position = a_Position ;
    gl_PointSize =a_PointSize;
}
`;

var FSHADER_SOURCE =
`void main()
{
    gl_FragColor =vec4(1.0 ,0.0 ,0.0 ,1.0);
}
`;


function main(){
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('failed to rendering webgl context');
        return;
    }

    if(!initShaders(gl ,VSHADER_SOURCE,FSHADER_SOURCE))
    {
        console.log('failed to initiate shader');
        return;
    }

    var n = initVertexBuffers(gl);
    if(n<0){
        console.log('failed to initiate vertex buffer');
        return;
    }

    gl.clearColor(0.0 ,0.0 ,0.0 ,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS , 0 , n);
}

function initVertexBuffers(gl)
{
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    var n = 3;

    var sizes =new Float32Array([
        10.0, 20.0, 30.0
    ]);

    var vertexBuffer =gl.createBuffer();
    if(!vertexBuffer)
    {
        console.log('failed to create vertex buffer');
        return -1;
    }

    var sizeBuffer =gl.createBuffer();
    if(!sizeBuffer)
    {
        console.log('failed to create Size buffer');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER ,vertices , gl.STATIC_DRAW);
    var a_Position =gl.getAttribLocation(gl.program , 'a_Position');
    if(a_Position<0)
    {
        console.log('failed to retuen a_Position location');
        return false;
    }
    gl.vertexAttribPointer(a_Position , 2 ,gl.FLOAT ,false ,0,0);
    gl.enableVertexAttribArray(a_Position);


    gl.bindBuffer(gl.ARRAY_BUFFER , sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER ,sizes , gl.STATIC_DRAW);
    var a_PointSize =gl.getAttribLocation(gl.program , 'a_PointSize');
    if(a_PointSize<0)
    {
        console.log('failed to retuen a_PointSize location');
        return false;
    }
    gl.vertexAttribPointer(a_PointSize , 1 ,gl.FLOAT ,false ,0,0);
    gl.enableVertexAttribArray(a_PointSize);
    
    return n;

}