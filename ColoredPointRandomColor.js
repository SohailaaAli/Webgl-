
var VSHADER_SOURCE = `
attribute vec4 a_Pos;
attribute float a_Frag;
void main() { 
  gl_Position = a_Pos; 
  gl_PointSize = a_Frag ;
}`;

var FSHADER_SOURCE = ` 
precision mediump float; 
uniform vec4 u_color;
 void main() { 
   gl_FragColor = u_color; 
 }` ;

function main() {
  var canvas = document.getElementById('webgl');

  var gl = canvas.getContext('webgl');

  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  var a_Posit = gl.getAttribLocation(gl.program, 'a_Pos');
  var a_Frag = gl.getAttribLocation(gl.program , 'a_Frag');
  var u_fragcolor = gl.getUniformLocation(gl.program, 'u_color');
  canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Posit,a_Frag,u_fragcolor); };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];
function click(ev, gl, canvas, a_Posit,a_Frag, u_fragcolor) {
  var a_size =1;
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  var red_component = Math.random();
  var green_component = Math.random();
  var blue_component = Math.random();

  g_points.push([x, y]);
  g_colors.push([red_component,green_component,blue_component]);
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (var i = 0; i < g_points.length; i++) {
    var xy = g_points[i];
    var rgb = g_colors[i];
    gl.vertexAttrib3f(a_Posit, xy[0], xy[1], 0.0);
    gl.vertexAttrib1f(a_Frag , a_size);
    gl.uniform4f(u_fragcolor,rgb[0],rgb[1],rgb[2],1.0);
    gl.drawArrays(gl.POINTS, 0, 1);
    a_size+=0.5;
  }
}