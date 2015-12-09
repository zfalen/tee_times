var React = require('react');
var ReactDOM = require('react-dom');

const ThemeManager = require('material-ui/lib/styles/theme-manager');
const MyRawTheme = require('./muiTheme.js');


var Cal = require('./calendar');
var EventCreator = require('./eventCreator');
var EventEditor = require('./eventEditor');


// First we import some components...
import { Router, Route, Link } from 'react-router'



var Main = React.createClass({
    
    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },

    getChildContext() {
        return {
          muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
        };
    },

    getInitialState: function(){
        return({showingCreate: ' ', showingEdit: ' ', start: null, end: null, title: 'poop', id: null, players: 0, holes: false, walking: false, eventArray: []});
    },

    handleCreate: function(showing, start, end, eventArray, callback){
 
        // CREATE STEP 4 == FIRST FUNCTION CALL - SHOW EDIT WINDOW, SEND DATA TO STATES ----> PASS TO 'EventCreator'
        if (showing === true){
            this.setState({showingCreate: 'active', start: start, end: end, eventArray: eventArray})
        } else {
            this.setState({showingCreate: ' '})
        }
        
        if (callback === 'refresh'){
            
            this.refs.cal.fetchEvents();
            
            this.refs.cal.forceUpdate();
            
            var node = this.refs.cal.getDOMNode();
            
            $(node).fullCalendar( 'refetchEvents' )
            $(node).fullCalendar( 'rerenderEvents' );
            
        }
    },

    handleEdit: function(showing, start, end, title, id, players, holes, walking, eventArray, callback){

        // EDIT STEP 4 == FIRST FUNCTION CALL - SHOW EDIT WINDOW, SEND DATA TO STATES ----> PASS TO 'EventEditor'
        if (showing === true){
            this.setState({showingEdit: 'active', start: start, end: end, title: title, id: id, players: players, holes: holes, walking: walking, eventArray: eventArray})
        } else {
            this.setState({showingEdit: ' '})
        }
        
        // SECOND FUNCTION CALL - TRIGGER CALENDAR REFRESH WITH (callback)
        if (callback === 'refresh'){

            // alert('(Main) updating calenda!!!!');
            
            this.refs.cal.fetchEvents();
            
            this.refs.cal.forceUpdate();
            
            var node = this.refs.cal.getDOMNode();
            
            $(node).fullCalendar( 'refetchEvents' )
            $(node).fullCalendar( 'rerenderEvents' );
            
        }
    },
    
    componentDidMount: function(){
        
        var self = this;
        
        $.ajax({
            url: '/api/event',
            dataType: 'json',
            cache: false,
            success: function(data){
                console.log('We got events, Tiger!');
                console.log(data);

                self.setState({eventArray: data});
                
            }.bind(this), 
            error: function(xhr, status, err){
                console.log('It is all broken!')
                console.error(status, err.toString)
            }.bind(this)
        });  
    },

    render: function(){
        return(
        <div>

            <Cal ref='cal' handleCreate={this.handleCreate} handleEdit={this.handleEdit} eventArray={this.state.eventArray} handleEdit={this.handleEdit}/>
                
            <div id="popup-wrapper">    
    
                <EventCreator eventArray={this.state.eventArray}
                              showing={this.state.showingCreate} 
                              start={this.state.start} 
                              end={this.state.end} 
                              handleCreate={this.handleCreate}/>
    
    
                {/* EDIT STEP 5 == PASS STATES INTO 'EventEditor'*/}
                <EventEditor eventArray={this.state.eventArray}
                             showing={this.state.showingEdit} 
                             start={this.state.start} 
                             end={this.state.end} 
                             title={this.state.title} 
                             id={this.state.id}
    
                             players={this.state.players} 
                             holes={this.state.holes} 
                             walking={this.state.walking} 
                             handleEdit={this.handleEdit}/>
            </div>
        </div>
        )
    }

})
 
module.exports = Main;