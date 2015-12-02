var React = require('react');
var ReactDOM = require('react-dom');

var Cal = React.createClass({

    render: function(){

            var self = this;
            
            console.log(this.props.data);

            var eventArray = [{
                            title  : 'event2',
                            start  : '2015-12-05',
                            end    : '2015-12-07'
                        }];

            // if (this.props.data === []){
            //     eventArray.push({
            //                 title  : 'event2',
            //                 start  : '2015-12-05',
            //                 end    : '2015-12-07'
            //             }
            // } else {
            //     eventArray = this.props.data;
            // };

            // console.log(eventArray);

        return(
        <div>

            <div className="col-md-offset-3 col-md-8 well calendar-holder vertical-center">
                <div id="calendar"></div>
            </div>
        </div>

            )
    }
});

var Main = React.createClass({

    getInitialState: function(){
        return({data: []})
    },

    fetchEvents: function(){
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
                            end: data[i].end})
                    };

                $(function() {
                    $('#calendar').fullCalendar({
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'month,agendaWeek,agendaDay'
                        },
                        // contentHeight: 700,
                        allDaySlot: false,
                        
                        defaultView: 'agendaDay',
                        slotDuration: '00:01:00',
                        scrollTime: true,
                        slotLabelInterval: '00:05:00',
                        slotLabelFormat: 'h:mma',
                        selectable: true,
                        selectHelper: true,
                        // selectOverlap: false,
                        editable: true,
                        eventLimit: true, // allow "more" link when too many events
                        events: eventArray
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
        <Cal data={this.state.data}/>
        </div>
        )
    }

});


ReactDOM.render(<Main/>, document.getElementById("render-here"));