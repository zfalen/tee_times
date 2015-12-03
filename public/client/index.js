var React = require('react');
var ReactDOM = require('react-dom');

var Cal = React.createClass({

    getInitialState: function(){
        return({data: []})
    },

    fetchEvents: function(){

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
                        select: function(start, end) {
                           console.log(moment(start).format());
                           var title = prompt('What\'s your name?');
                            // var newEventData = {title: title, start: start, end: end};
                            if (title) {
                                $(node).fullCalendar('renderEvent',
                                    {
                                        title: title,
                                        start: start,
                                        end: end,
                                    },
                                    true // make the event "stick"
                                );
                                $.ajax({
                                    url: '/api/event/',
                                    dataType: 'json',
                                    type: 'POST',
                                    data: {title: title, start: moment(start).format(), end: moment(end).format()},
                                    success: function(data){
                                        
                                    }.bind(this),
                                    error: function(xhr, status, err){
                                        console.log('Can\'t let you make that, Tiger!')
                                        console.error(status, err.toString)
                                    }.bind(this)
                                });
                            }
                            $(node).fullCalendar('unselect');
                        },
                        dayClick: function(date, jsEvent, view) {
                           if (view.name === "month") {
                                $(node).fullCalendar('gotoDate', date);
                                $(node).fullCalendar('changeView', 'agendaDay') 
                            }
                        },
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
    render: function() {
        var tempStyle = {
            backgroundColor: '#000'
        }
        return (
            <div>
                <div className="overlay active"/>
                <div className="eventCreator-wrapper">
                    <div className="eventCreator active">
                        <div className="eventCreator-header">
                            <h2 className="text-center">New Tee Time</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var Main = React.createClass({

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
            <Cal/>
        </div>
        <EventCreator/>
        </div>
        )
    }

});


ReactDOM.render(<Main/>, document.getElementById("render-here"));