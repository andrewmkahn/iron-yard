var booton = new Button();
var renderFn = booton.render;

var boundRenderFn = renderFn.bind();

document.body
	.appendChild(boundRenderFn());