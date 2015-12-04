var React = require('react');
var ReactDOM = require('react-dom');

let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const Mui = require('material-ui');
const TextField = require('material-ui/lib/text-field');
const Slider = require('material-ui/lib/slider');
const DatePicker = require('material-ui/lib/date-picker/date-picker');
const DatePickerDialog = require('material-ui/lib/date-picker/date-picker-dialog');
const DropDownMenu = require('material-ui/lib/drop-down-menu');
const Toggle = require('material-ui/lib/toggle');
const RaisedButton = require('material-ui/lib/raised-button');


const ThemeManager = require('material-ui/lib/styles/theme-manager');
class OuterMostParentComponent extends React.Component {
  // Important!
  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }
};
// Important!
OuterMostParentComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};




var Cal = React.createClass({

    getInitialState: function(){
        return({data: []})
    },

    handleClick: function(start, end){
        this.props.handleCreate(true, start, end);
    },

    fetchEvents: function(){

        var self = this;

        var node = this.getDOMNode();

        $.ajax({
            url: '/api/event',
            dataType: 'json',
            cache: false,
            success: function(data){
                console.log('We got events, Tiger!');
                this.setState({data: data});

                var eventArray = [];

                for (var i = 0; i < data.length; i++){
                        eventArray.push({
                            title: data[i].title,
                            start: data[i].start,
                            end: data[i].end,
                            id: data[i]._id})
                    };

                $(function() {
                    $(node).fullCalendar({
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'month,agendaWeek,agendaDay'
                        },
                        timezone: 'local',
                        contentHeight: 700,
                        allDaySlot: false,
                        defaultView: 'agendaDay',
                        slotDuration: '00:05:00',
                        scrollTime: true,
                        slotLabelInterval: '00:05:00',
                        slotLabelFormat: 'h:mma',
                        selectable: true,
                        selectHelper: true,

                        views: {
                            agenda: {
                                minTime: '06:00',
                                maxTime: '19:00'
                            },
                        },
                        
                        businessHours: {
                                start: '07:00', // a start time (10am in this example)
                                end: '18:00', // an end time (6pm in this example)

                                dow: [ 0, 1, 2, 3, 4, 5, 6 ]
                            },

                        editable: true,
                        eventLimit: true, // allow "more" link when too many events
                        events: eventArray,
                        dragRevertDuration: 1000,

                        eventDrop: function(event, delta, revertFunc) {
                            var newData = {title: event.title, start: moment(event._start).format(), end: moment(event._end).format()};
                            if (confirm("Are you sure about this change?")) {
                                $.ajax({
                                    url: '/api/event/' + event.id,
                                    dataType: 'json',
                                    data: newData,
                                    type: 'PUT',
                                    success: function(data){

                                    }.bind(this), 
                                    error: function(xhr, status, err){
                                        console.log('Update is broken!')
                                        console.error(status, err.toString)
                                    }.bind(this)
                                });
                            }
                        },

                        eventResize: function(event, delta, revertFunc) {
                            var newData = {title: event.title, start: moment(event._start).format(), end: moment(event._end).format()};

                            if (confirm("Are you sure about this change?")) {
                                $.ajax({
                                    url: '/api/event/' + event.id,
                                    dataType: 'json',
                                    data: newData,
                                    type: 'PUT',
                                    success: function(data){
                                        console.log( 'A new tee-time has been created:\n' + data)
                                    }.bind(this), 
                                    error: function(xhr, status, err){
                                        console.log('Update is broken!')
                                        console.error(status, err.toString)
                                    }.bind(this)
                                });
                            }
                        },
                        select: function(start, end, jsEvent, view) {

                            alert('Start: ' + start.toString() + '\n End: ' + end.toString())

                            if (view.name === "month") {
                                $(node).fullCalendar('gotoDate', start);
                                $(node).fullCalendar('changeView', 'agendaDay')
                            } else {
                                self.handleClick(start.toString(), end.toString());
                               // console.log(moment(start).format());
                               // var title = prompt('What\'s your name?');
                               //  // var newEventData = {title: title, start: start, end: end};
                               //  if (title) {
                               //      $(node).fullCalendar('renderEvent',
                               //          {
                               //              title: title,
                               //              start: start,
                               //              end: end,
                               //          },
                               //          true // make the event "stick"
                               //      );
                               //      $.ajax({
                               //          url: '/api/event/',
                               //          dataType: 'json',
                               //          type: 'POST',
                               //          data: {title: title, start: moment(start).format(), end: moment(end).format()},
                               //          success: function(data){
                                            
                               //          }.bind(this),
                               //          error: function(xhr, status, err){
                               //              console.log('Can\'t let you make that, Tiger!')
                               //              console.error(status, err.toString)
                               //          }.bind(this)
                               //      });
                               //  }
                               //  $(node).fullCalendar('unselect');
                            }
                        },

                        // dayClick: function(date, jsEvent, view) {
                        //    if (view.name === "month") {
                        //         $(node).fullCalendar('gotoDate', date);
                        //         $(node).fullCalendar('changeView', 'agendaDay') 
                        //     } else {
                        //         self.handleClick();
                        //     }
                        // },

                        eventClick: function(event, jsEvent, view) {
                            if (confirm("Do you wish to delete " + event.title + "\'s tee time?")) {
                                $.ajax({
                                    url: '/api/event/' + event.id,
                                    dataType: 'json',
                                    type: 'DELETE',
                                    success: function(data){
                                        $(node).fullCalendar('removeEvents', event._id);
                                    }.bind(this),
                                    error: function(xhr, status, err){
                                        console.log('Can\'t let you delete that, Tiger!')
                                        console.error(status, err.toString)
                                    }.bind(this)
                                });
                            }
                        }
                });
            });
            }.bind(this), 
            error: function(xhr, status, err){
                console.log('It is all broken!')
                console.error(status, err.toString)
            }.bind(this)
        });


    },

    componentDidMount: function(){
        this.fetchEvents();
    },


    render: function(){
        return <div/>
    }
});

var EventCreator = React.createClass({

    getInitialState: function(){
        return {playerVal: 1}
    },
    // componentDidMount: function() {
    //     this.setState({playerVal: document.getElementsByName("playerSlider")[1].value})
    // },
    handleSliderChange: function() {
        var value = document.getElementsByName("playerSlider")[1].value;
        switch(value) {
            case '0': 
                this.setState({playerVal: 1})
                break
            case '0.2': 
                
                this.setState({playerVal: 2})
                break
            case '0.4': 
                this.setState({playerVal: 3})
                break
            case '0.6': 
                this.setState({playerVal: 4})
                break
            case '0.8': 
                this.setState({playerVal: 5})
                break
            case '1': 
                this.setState({playerVal: 6})
        }

        

    },
    render: function() {
        var tempStyle = {
            backgroundColor: '#000'
        }

        let startMenuItems = [
           { payload: '1', text: moment(this.props.start).format('h mm A') },
        ];

        let endMenuItems = [
           { payload: '1', text: moment(this.props.end).format('h mm A') },
        ];

        return (
            <div>
                <div className={"overlay " + this.props.showing}/>
                <div className="eventCreator-wrapper">
                    <div className={"eventCreator " + this.props.showing}>
                        <div className="eventCreator-header">
                            <h2 className="text-center">New Tee Time</h2>
                        </div>
                        <div className="eventCreator-fieldWrapper">
                            <TextField id="playerName"
                              floatingLabelText="Name" />

                            <div className="row">
                                <div className="col-md-3">
                                    <div className="text-center"><p>Party Size</p></div>
                                </div>
                                <div className='col-md-9'>
                                    <Slider onChange={this.handleSliderChange} name="playerSlider" defaultValue={0} step={0.2}/>
                                </div>
                                <h3>{this.state.playerVal}</h3>
                            </div>

                            <div className="row">
                                <div className='col-md-12'>
                                    <DatePicker id="datePick" hintText="Date" autoOk={true} />
                                </div>
                            </div>

                            <DropDownMenu name="startTime" selected={this.props.menuItem[0].text} menuItems={startMenuItems} />
                            <DropDownMenu id="endTime" menuItems={endMenuItems} />

                            <Toggle
                              name="toggleName2"
                              value="toggleValue2"
                              label="Holes (9 / 18)"
                              defaultToggled={true}/>

                            <Toggle
                              name="toggleName2"
                              value="toggleValue2"
                              label="Walking / Riding"
                              defaultToggled={true}/>

                              <TextField
                                  hintText="Amt Due"
                                  disabled={true}
                                  defaultValue="$2,000"
                                  floatingLabelText="Amt Due" />


                            <RaisedButton label="Submit" fullWidth={false}/>
                            <RaisedButton label="Close the bitch" fullWidth={false} onClick={this.props.handleCreate.bind(this, false)}/>





                        </div>

                    </div>
                </div>
            </div>
        );
    }
});

var Main = React.createClass({

    getInitialState: function(){
        return({showing: ' ', start: null, end: null});
    },

    handleCreate: function(showing, start, end){
        if (showing === true){
            this.setState({showing: 'active', start: start, end: end})
        } else {
            this.setState({showing: ' ', start: null, end: null})
        }
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
                        <a className="mainNav" href="#">Calendar</a>
                    </li>
                    <div className="navSpacer center-block"></div>
                    <li>
                        <a className="mainNav" href="#">Users</a>
                    </li>
                    <div className="navSpacer center-block"></div>
                    <li>
                        <a className="mainNav" href="#">My Course</a>
                    </li>
                </ul>
            </div>
        <div className="col-md-offset-3 col-md-8 well calendar-holder vertical-center">
            <Cal handleCreate={this.handleCreate}/>
        </div>
        <EventCreator showing={this.state.showing} start={this.state.start} end={this.state.end} handleCreate={this.handleCreate}/>
        </div>
        )
    }

});


ReactDOM.render(<Main/>, document.getElementById("render-here"));