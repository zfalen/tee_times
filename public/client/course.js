var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, IndexRoute, Link } from 'react-router'

var Course = React.createClass({
	render: function(){
		return(
			<div>
				<h2> My Course Page </h2>
			</div>
			)
	}
})

module.exports = Course;