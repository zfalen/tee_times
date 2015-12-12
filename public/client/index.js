var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, IndexRoute, Link } from 'react-router'

let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

var Main = require('./main');
var Users = require('./users');
var Course = require('./course');

var Holder = React.createClass({

	handleLogout: function(e){

		$('body').removeClass('loaded').addClass('transitioning');

		setTimeout(function(){
			$.ajax({
					url: '/logout',
					dataType: 'json',
					cache: false,
					success: function(data){
							window.location.href = '/'
					}.bind(this),
					error: function(xhr, status, err){
							console.log('Cannot log out')
							console.error(status, err.toString)
					}.bind(this)
			});
		}, 2000);

	},

	render: function(){
		return(
			<div>
				<div id="sidebar-wrapper" className="col-md-3">
	                <ul id="mainSidebar" className="sidebar-nav">
	                    <a href="#">
	                        <img id="mainLogo" src="./img/forePlay_logo.png"/>
	                    </a>
	                    <li>
	                        <Link className="mainNav" to="/">Calendar</Link>
	                    </li>
	                    <div className="navSpacer center-block"></div>
	                    <li>
	                        <Link className="mainNav" to="/users">Users</Link>
	                    </li>
	                    <div className="navSpacer center-block"></div>
	                    <li>
	                        <Link className="mainNav" to="/course">My Course</Link>
	                    </li>
											<div className="navSpacer center-block"></div>
											<li>
												<a onClick={this.handleLogout} className="mainNav">Log Out</a>
											</li>
	                </ul>
	            </div>
	            <div className="col-md-offset-3 col-md-8 well calendar-holder vertical-center">
					{this.props.children}
				</div>
			</div>
			)
	}
});



ReactDOM.render((<Router>
					<Route path='/' component={Holder}>
						<IndexRoute component={Main} />
						<Route path='users' component={Users} />
						<Route path='course' component={Course} />
					</Route>
				 </Router>), document.getElementById("render-here"));