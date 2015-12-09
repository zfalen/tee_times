var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, IndexRoute, Link } from 'react-router'

let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

var Main = require('./main');
var Users = require('./users');
var Course = require('./course');

var Holder = React.createClass({
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