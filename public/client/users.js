var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, IndexRoute, Link } from 'react-router'

var Users = React.createClass({
	render: function(){
		return(
			<div>
				<h2> USERS GO HERE!!!!</h2>
			</div>
			)
	}
})

module.exports = Users;