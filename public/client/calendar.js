var React = require('react');
var ReactDOM = require('react-dom');

toastr.options.showMethod = 'slideDown';
toastr.options.closeButton = true;
toastr.options.positionClass = 'toast-bottom-right';

var Cal = React.createClass({

    // CREATE STEP 2 == RECEIVE THE DATA FROM CREATE / CLICK EVENT
    handleClick: function(start, end, eventArray){
        // CREATE STEP 2 == SEND THE DATA TO MAIN ALONG WITH 'SHOW WINDOW' COMMAND (true)
        this.props.handleCreate(true, start, end, eventArray);
    },

    // EDIT STEP 2 == RECEIVE THE DATA FROM EDIT / CLICK EVENT
    handleEdit: function(start, end, title, id, players, holes, walking, eventArray, editable, phoneNumber){
        this.props.handleEdit(true, start, end, title, id, players, holes, walking, eventArray, editable, phoneNumber);   
        // EDIT STEP 3 == SEND THE DATA TO MAIN ALONG WITH 'SHOW WINDOW' COMMAND (true) 
    },

    fetchEvents: function(){

            var self = this;

            var node = this.getDOMNode();

                $(function() {
                    $(node).fullCalendar({
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'month,agendaWeek,agendaDay'
                        },
                        timezone: 'local',
                        contentHeight: $(window).height()*0.79,
                        allDaySlot: false,
                        defaultView: 'agendaDay',
                        slotDuration: '00:05:00',
                        scrollTime: true,
                        slotLabelInterval: '00:05:00',
                        slotLabelFormat: 'h:mma',
                        selectable: true,
                        selectHelper: true,
                        theme: false,
                        lang: 'en',

                        views: {
                            agenda: {
                                minTime: '07:00',
                                maxTime: '18:00',
                                scrollTime: moment().format('HH:mm')
                            },
                            week: {
                              titleFormat: 'MMM D YYYY'  // like 'Sep 13 2009', for week views
                            },
                        },

                        businessHours: {
                                start: '07:00', // a start time (10am in this example)
                                end: '18:00', // an end time (6pm in this example)

                                dow: [ 0, 1, 2, 3, 4, 5, 6 ]
                            },

                        editable: true,
                        eventLimit: true, // allow "more" link when too many events
                        events: '/api/event',
                        type: 'GET',
                        dragRevertDuration: 700,

                        defaultTimedEventDuration: '00:05',
                        forceEventDuration: true,

                        eventDrop: function(event, delta, revertFunc) {

                            var self = this;

                            var check = moment(event.start).unix();
                            var today = moment(new Date()).unix();

                            if(check < today){
                                toastr.warning('Cannot move a tee time into the past', 'Hold on...');
                                $(node).fullCalendar( 'refetchEvents' );
                                $(node).fullCalendar( 'rerenderEvents' );
                                // Previous Day. show message if you want otherwise do nothing.
                                // So it will be unselectable
                            } else {

                                var startTime = moment(event._start).format();
                                var endTime = moment(event._end).format();

                                var playerName = event.title;

                                var id = event._id;

                                var players = event.players;
                                var holes = event.holes;
                                var walking = event.walking;
                                var phoneNumber = event.phoneNumber;

                                console.log('The phone number for ' + playerName + ' is ' + event.phoneNumber);

                                var putUrl = ('/api/event/' + event._id);

                                var newData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking, phoneNumber: phoneNumber};

                                $.ajax({
                                    url: putUrl,
                                    dataType: 'json',
                                    data: newData,
                                    type: 'PUT',
                                    success: function(data){
                                        toastr.info('Tee time updated for ' + playerName + ' on '+ moment(startTime).format('dddd') + ' at ' + moment(startTime).format('h:mm'));
                                        self.props.handleEdit(false, startTime, endTime, playerName, id, 'refresh');
                                    }.bind(this),
                                    error: function(xhr, status, err){
                                        console.log('Update is broken!')
                                        console.error(status, err.toString)
                                    }.bind(this)
                                });
                            }
                        },
                        eventOverlap: function(movingEvent, stillEvent) {
                            toastr.error( movingEvent.title + ' has already reserved a tee time at ' + moment(stillEvent.start).format('h:mm A') + ' on ' + moment(stillEvent.start).format('MMM D'), 'Can\'t do that...');
                            return false;
                        },
                        eventResize: function(event, delta, revertFunc) {

                            var startTime = moment(event._start).format();
                            var endTime = moment(event._end).format();


                            // CHECK IF DURATION IS LONGER THAN 15min, RESET TO 15min IF SO

                                var startTimeMinutes = (moment(startTime).toDate().getTime() / 1000) / 60;
                                var endTimeMinutes = (moment(endTime).toDate().getTime() / 1000) / 60;

                                var difference = endTimeMinutes - startTimeMinutes;

                                var maxDuration = moment.duration(15, 'minutes');

                                if (difference > 15) {
                                    endTime = moment(startTime).add(maxDuration).format();
                                    toastr.error('Can\'t have a tee slot longer than 15 minutes', 'Error!');
                                };

                            var playerName = event.title;

                            var id = event._id;

                            var players = event.players;
                            var holes = event.holes;
                            var walking = event.walking;
                            var phoneNumber = event.phoneNumber;

                            var putUrl = ('/api/event/' + event._id);

                            var newData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking, phoneNumber: phoneNumber};

                                $.ajax({
                                    url: putUrl,
                                    dataType: 'json',
                                    data: newData,
                                    type: 'PUT',
                                    success: function(data){
                                        $(node).fullCalendar( 'refetchEvents' )
                                        $(node).fullCalendar( 'rerenderEvents' );
                                        self.props.handleEdit(false, startTime, endTime, playerName, id, 'refresh');
                                        toastr.info('End of time slot for ' + playerName + ' moved to ' + moment(endTime).format('h:mm'));
                                    }.bind(this),
                                    error: function(xhr, status, err){
                                        console.log('Update is broken!')
                                        console.error(status, err.toString)
                                    }.bind(this)
                                })

                        },

                        select: function(start, end, jsEvent, view) {

                            if (view.name === "month") {
                                $(node).fullCalendar('gotoDate', start);
                                $(node).fullCalendar('changeView', 'agendaDay')
                            } else {
                                var check = moment(start).unix();
                                var today = moment(new Date()).unix();
                                if(check < today){
                                    $(node).fullCalendar('unselect');
                                    toastr.warning('Cannot schedule a tee time in the past', 'Hold on...');
                                    // Previous Day. show message if you want otherwise do nothing.
                                    // So it will be unselectable
                                } else {
                                        // Its a right date
                                                // Do something
                                    // CHECK IF DURATION IS LONGER THAN 15min, RESET TO 15min IF SO

                                    var startTime = moment(start).format();
                                    var endTime = moment(end).format();

                                        var startTimeMinutes = (moment(startTime).toDate().getTime() / 1000) / 60;
                                        var endTimeMinutes = (moment(endTime).toDate().getTime() / 1000) / 60;

                                        var difference = endTimeMinutes - startTimeMinutes;

                                        var maxDuration = moment.duration(15, 'minutes');

                                        if (difference > 15) {
                                            endTime = moment(startTime).add(maxDuration).format();
                                            toastr.error('Can\'t have a tee slot longer than 15 minutes', 'Error!');
                                            self.forceUpdate();
                                            $(node).fullCalendar( 'refetchEvents' );
                                            $(node).fullCalendar( 'rerenderEvents' );
                                        };

                                    // CREATE STEP 1 == SEND DATA TO THE 'handleCreate' METHOD ON CAL
                                    $.ajax({
                                    url: '/api/event',
                                    dataType: 'json',
                                    cache: false,
                                    success: function(data){

                                        self.handleClick(startTime, endTime, data);

                                    }.bind(this),
                                    error: function(xhr, status, err){
                                        console.log('It is all broken!')
                                        console.error(status, err.toString)
                                    }.bind(this)
                                    });
                                }
                            }
                        },

                        eventClick: function(event, jsEvent, view) {

                            $.ajax({
                                url: '/api/event',
                                dataType: 'json',
                                cache: false,
                                success: function(data){
                                     
                                    var check = moment(event.start).unix();
                                    var today = moment(new Date()).unix();
                                    if(check < today){
                                        self.handleEdit(event.start.toString(), event.end.toString(), event.title, event._id, event.players, event.holes, event.walking, data, true, event.phoneNumber);
                                    } else {
                                        self.handleEdit(event.start.toString(), event.end.toString(), event.title, event._id, event.players, event.holes, event.walking, data, false, event.phoneNumber);
                                        // console.log('this is the phoneNumber: ' + event.phoneNumber);
                                    } 
                                }.bind(this),
                                error: function(xhr, status, err){
                                    console.log('It is all broken!')
                                    console.error(status, err.toString)
                                }.bind(this)
                            });
                         }
                    })
            });
    },

    componentDidUpdate: function(){
        this.fetchEvents();
    },


    render: function(){
        return <div/>
    }
});


module.exports = Cal;
