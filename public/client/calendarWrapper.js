var React = require('react');
var ReactDOM = require('react-dom');

var Cal = require('./calendar');

var CalendarWrapper = React.createClass({

    render: function(){
        return (
          <div>
            <div id="headerBg-top"></div>
            <div id="headerBg-bottom"></div>
            <div style={{position: 'relative', top: 37, marginBottom: 18}}>
              <Cal ref='cal' handleCreate={this.props.handleCreate} handleEdit={this.props.handleEdit} eventArray={this.props.eventArray} handleEdit={this.props.handleEdit}/>
            </div>
          </div>
        )
    }
});


module.exports = CalendarWrapper;
