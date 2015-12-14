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

	calendarLoader: function(){
		$('#interiorLoader').removeClass('loaded').addClass('interior-transitioning');
		setTimeout(function(){
				$('#interiorLoader').removeClass('interior-transitioning').addClass('loaded');
		}, 1500)
	},

	usersLoader: function(){
		$('#interiorLoader').removeClass('loaded').addClass('interior-transitioning');
		setTimeout(function(){
				$('#interiorLoader').removeClass('interior-transitioning').addClass('loaded');
		}, 800)
	},

	courseLoader: function(){
		$('#interiorLoader').removeClass('loaded').addClass('interior-transitioning');
		setTimeout(function(){
				$('#interiorLoader').removeClass('interior-transitioning').addClass('loaded');
		}, 800)
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
	                <Link className="mainNav" to="/" onClick={this.calendarLoader}>Calendar</Link>
	            </li>
	            <div className="navSpacer center-block"></div>
	            <li>
	                <Link className="mainNav" to="/users" onClick={this.usersLoader}>Users</Link>
	            </li>
	            <div className="navSpacer center-block"></div>
	            <li>
	                <Link className="mainNav" to="/course" onClick={this.courseLoader}>My Course</Link>
	            </li>
							<div className="navSpacer center-block"></div>
							<li>
								<a onClick={this.handleLogout} className="mainNav">Log Out</a>
							</li>
	        </ul>
	    	</div>
        <div className="col-md-offset-3 col-md-8 well calendar-holder vertical-center">
					{this.props.children}

					<div id="interiorLoader" className="loaded">
						<div id="interior-loader-wrapper" className="interior-loader-wrapper">
							<div id="interior-loader"></div>
							<div className="loader-section section-left"></div>
							<div className="loader-section section-right"></div>
						</div>
					</div>

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
