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


function initVertexBuffers(gl){
    var verticesSizes =  new Float32Array([
        0.0, 0.5, 10.0, 
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0
    ])

    var n =3 ;

    var vertexSizeBuffer =gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER , vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER , verticesSizes , gl.STATIC_DRAW);
    var FSize =verticesSizes.BYTES_PER_ELEMENT;
    var a_Position =gl.getAttribLocation(gl.program , 'a_Position');
    if(a_Position<0)
    {
        console.log('failed to retuen a_Position location');
        return false;
    }
    gl.vertexAttribPointer(a_Position , 2 ,gl.FLOAT ,false ,FSize*3,0);
    gl.enableVertexAttribArray(a_Position);

    var a_PointSize =gl.getAttribLocation(gl.program , 'a_PointSize');
    if(a_PointSize<0)
    {
        console.log('failed to retuen a_PointSize location');
        return false;
    }
    gl.vertexAttribPointer(a_PointSize , 1 ,gl.FLOAT ,false ,FSize*3,FSize*2);
    gl.enableVertexAttribArray(a_PointSize);
    return n;

    }