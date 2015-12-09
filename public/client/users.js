var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, IndexRoute, Link } from 'react-router'

var Users = React.createClass({
	render: function(){
		return(
			<div className="text-center vertical-center" style={{height: '85vh', width: '100%'}}>
				<div style={{width: '100%'}}>
				<p><i>Registered Users</i></p>
				<h2> COMING SOON</h2>
				</div>
			</div>
			)
	}
})

module.exports = Users;