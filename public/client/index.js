var React = require('react');
var ReactDOM = require('react-dom');

let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

var Main = require('./main');


 
ReactDOM.render(<Main/>, document.getElementById("render-here"));