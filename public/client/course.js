var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, IndexRoute, Link } from 'react-router'

var Course = React.createClass({
	render: function(){
		return(
			<div className="text-center vertical-center" style={{height: '85vh', width: '100%'}}>
				<div style={{width: '100%'}}>
				<p><i>Your Course Information</i></p>
				<h2> COMING SOON</h2>
				</div>
			</div>
			)
	}
})

module.exports = Course;