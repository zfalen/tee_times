var React = require('react');
var ReactDOM = require('react-dom');

let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const Mui = require('material-ui');
var Colors = require('material-ui/src/styles/colors');
const TextField = require('material-ui/lib/text-field');
const Slider = require('material-ui/lib/slider');
const DatePicker = require('material-ui/lib/date-picker/date-picker');
const DatePickerDialog = require('material-ui/lib/date-picker/date-picker-dialog');
const DropDownMenu = require('material-ui/lib/drop-down-menu');
const Toggle = require('material-ui/lib/toggle');
const RaisedButton = require('material-ui/lib/raised-button');
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');


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

    // CREATE STEP 2 == RECEIVE THE DATA FROM CREATE / CLICK EVENT
    handleClick: function(start, end){
        // CREATE STEP 2 == SEND THE DATA TO MAIN ALONG WITH 'SHOW WINDOW' COMMAND (true)
        this.props.handleCreate(true, start, end);
    },

    // EDIT STEP 2 == RECEIVE THE DATA FROM EDIT / CLICK EVENT
    handleEdit: function(start, end, title, id, players, holes, walking){
        // EDIT STEP 3 == SEND THE DATA TO MAIN ALONG WITH 'SHOW WINDOW' COMMAND (true)
        this.props.handleEdit(true, start, end, title, id, players, holes, walking);
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
                        events: '/api/event',
                        type: 'GET',
                        dragRevertDuration: 1000,

                        defaultTimedEventDuration: '00:05',
                        forceEventDuration: true,

                        eventDrop: function(event, delta, revertFunc) {

                            // alert(event.walking);

                            var startTime = moment(event._start).format();
                            var endTime = moment(event._end).format();

                            var playerName = event.title;

                            var id = event._id;

                            var players = event.players;
                            var holes = event.holes;
                            var walking = event.walking;

                            var putUrl = ('/api/event/' + event._id);

                            var newData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking};

                            $.ajax({
                                url: putUrl,
                                dataType: 'json',
                                data: newData,
                                type: 'PUT',
                                success: function(data){
                                    self.props.handleEdit(false, startTime, endTime, playerName, id, 'refresh');
                                    toastr.options.showMethod = 'slideDown';
                                    toastr.options.closeButton = true;
                                    toastr.info(playerName + ' party of ' + players + '.', 'Tee time updated:');
                                }.bind(this), 
                                error: function(xhr, status, err){
                                    console.log('Update is broken!')
                                    console.error(status, err.toString)
                                }.bind(this)
                            });
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

                            var putUrl = ('/api/event/' + event._id);

                            var newData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking};
                            
                                $.ajax({
                                    url: putUrl,
                                    dataType: 'json',
                                    data: newData,
                                    type: 'PUT',
                                    success: function(data){
                                        $(node).fullCalendar( 'refetchEvents' )
                                        $(node).fullCalendar( 'rerenderEvents' );
                                        // console.log(data);
                                        self.props.handleEdit(false, startTime, endTime, playerName, id, 'refresh');
                                        toastr.info(playerName + ' party of ' + players + '.', 'Tee time updated:');
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

                                // CREATE STEP 1 == SEND DATA TO THE 'handleCreate' METHOD ON CAL
                                self.handleClick(start.toString(), end.toString());
                            }
                        },

                        eventClick: function(event, jsEvent, view) {

                            // EDIT STEP 1 == SEND DATA TO THE 'handleEdit' METHOD ON CAL
                             self.handleEdit(event.start.toString(), event.end.toString(), event.title, event._id, event.players, event.holes, event.walking);
                             

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

var EventCreator = React.createClass({

    getInitialState: function(){
        return {playerVal: 0, startTime: ' ', endTime: ' ', date: new Date(), holes: true, walking: true}
    }, 
                            
    handleStartChange: function(e, selectedIndex, menuItem){
        this.setState({startTime: menuItem.text});
    }, 
        
    handleEndChange: function(e, selectedIndex, menuItem){
        this.setState({endTime: menuItem.text});
    }, 

    handleSliderChange: function(event, value) {
        switch(value) {
            case 0: 
                this.setState({playerVal: 1})
                break
            case 0.2: 
                
                this.setState({playerVal: 2})
                break
            case 0.4: 
                this.setState({playerVal: 3})
                break
            case 0.6: 
                this.setState({playerVal: 4})
                break
            case 0.8: 
                this.setState({playerVal: 5})
                break
            case 1: 
                this.setState({playerVal: 6})
        }

    },
        
    handleCalChange: function(thing, date){
        this.setState({date: date});
    },
    
    handleFocus: function(){
        this.refs.datePick.getDOMNode().firstChild.nextSibling.firstChild.setAttribute("style", "left: 51.25%; top: 20%; position: absolute;")
    },
        
    handleHolesToggle: function(event, toggled){
      this.setState({holes: toggled})
    },
        
    handleWalkingToggle: function(event, toggled){
      this.setState({walking: toggled})
    },
        
    handleSubmit: function(e){
        
        var self = this;
    
        var playerName = this.refs.playerName.getValue();
        
        var players = this.state.playerVal;
        var holes = this.state.holes;
        var walking = this.state.walking;
        
        var teeDate = moment(this.refs.datePick.getDate()).format('YYYY-MM-DD');
        
        
        var startTime = moment((teeDate + ' ' + this.state.startTime), 'YYYY-MM-DD h:mm A').format();
        var endTime = moment((teeDate + ' ' + this.state.endTime), 'YYYY-MM-DD h:mm A').format();
        
//        if (playerName.length === 0)
        
        var newEventData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking};
//        
         $.ajax({
             url: '/api/event/',
             dataType: 'json',
             type: 'POST',
             data: newEventData,
             success: function(data){
                self.props.handleCreate(false, startTime, endTime, 'refresh');
                toastr.options.showMethod = 'slideDown';
                toastr.options.closeButton = true;
                toastr.success(playerName + ' party of ' + players + '.', 'New tee-time scheduled:');
             }.bind(this),
             error: function(xhr, status, err){
                 console.log('Can\'t let you make that, Tiger!')
                 console.error(status, err.toString)
             }.bind(this)
         });
        
    },
        
    handleClose: function(){
      this.setState({playerVal: 0, holes: true, walking: true});
      this.props.handleCreate(false);
    },
        
    componentWillReceiveProps: function(nextProps) {
        this.setState({startTime: moment(nextProps.start).format('h:mm A'), endTime: moment(nextProps.end).format('h:mm A'), date: moment(nextProps.start).toDate()});
    },
        
    render: function() {
        var tempStyle = {
            backgroundColor: '#000'
        }

        let startMenuItems = [
           { payload: '1', text: moment(this.props.start).format('h:mm A') },
        ];

        let endMenuItems = [
           { payload: '1', text: moment(this.props.end).format('h:mm A') },
        ];
        
        var self = this;
        
        var playerConverter = function(val){
            switch(val) {
            case 0: 
                return 0
                break
            case 1: 
                return 0
                break
            case 2: 
                return 0.2
                break
            case 3: 
                return 0.4
                break
            case 4: 
                return 0.6
                break
            case 5: 
                return 0.8
                break
            case 6:
                return 1
                break
            }
        };
        
        var players = playerConverter(this.state.playerVal);
        
        var playerVal = function(){
            
            if (self.state.playerVal === 0){
                return 1
            } else {
                return self.state.playerVal
            }
        };
            
        var playerSubtitle = function (){
            if (playerVal() > 1){
                return 'players'
            } else {
                return 'player'
            }
        };
         
        var startDate = this.state.date;
        
        return (
            <div>
                <div className={"overlay " + this.props.showing}/>
                <div className="eventCreator-wrapper">
                    <div className={"eventCreator " + this.props.showing}>
                        <div className="eventCreator-header">
                            <h2 className="text-center">New Tee Time</h2>
                            <IconButton ref='close' iconClassName="material-icons" tooltipPosition="top-center"
                                  tooltip="Cancel" style={{float: 'right', color: 'rgba(255, 255, 255, 0.87)'}} color={Colors.blue500} onClick={this.handleClose}>clear</IconButton>
                        </div>
                        <div className="eventCreator-fieldWrapper">
                            <TextField id="playerName" ref="playerName"
                              floatingLabelText="Name" />

                            <div className="row">
                                <div className='col-md-9' style={{height: '0px'}}>
                                    <div>
                                        <Slider onChange={this.handleSliderChange} value={players} step={0.2}/>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center"><h4>{playerVal()}</h4><p>{playerSubtitle()}</p></div>
                                </div>
                            </div>

                            <div className="row" style={{marginBottom: '5px'}}>
                                <div className='col-md-12'>
                                    <DatePicker ref='datePick' value={startDate} id="datePick"  hintText="Date" onChange={this.handleCalChange} onFocus={this.handleFocus} autoOk={true} />
                                </div>
                            </div>
            
                            <div className="row" style={{marginBottom: '20px'}}>
                                <div className="col-md-6">
                                <DropDownMenu ref="startTime" onChange={this.handleStartChange} menuItems={startMenuItems} style={{width: '100%'}}/>
                                </div>
                                <div className="col-md-6">
                                <DropDownMenu ref="endTime" menuItems={endMenuItems} style={{width: '100%'}}/>
                                </div>
                            </div>
            
                            <div className="row center-block" style={{marginBottom: '40px'}}>
                                
                                <div className="col-md-12 vertical-center">
                                    <div className="col-md-4">
                                        <h4>9 Holes</h4>
                                    </div>
                                    <div className="col-md-4">
                                        <Toggle
                                          name="toggleName2"
                                          value="toggleValue2"
                                          elementStyle={{marginLeft: '0px'}}
                                          style={{position: 'relative', transform: 'scale(1.5)'}}
                                          defaultToggled={true}
                                          onToggle={this.handleHolesToggle}/>
                                    </div>
                                    <div className="col-md-4">
                                        <h4>18 Holes</h4>
                                    </div>
                                </div>
                                      

                                <div className="col-md-12 vertical-center">
                                    <div className="col-md-4">
                                        <h4>Riding</h4>
                                    </div>
                                    <div className="col-md-4">
                                        <Toggle
                                          name="toggleName2"
                                          value="toggleValue2"
                                          elementStyle={{marginLeft: '0px'}}
                                          style={{position: 'relative', transform: 'scale(1.5)'}}
                                          defaultToggled={true}
                                          onToggle={this.handleWalkingToggle}/>
                                    </div>
                                    <div className="col-md-4">
                                        <h4>Walking</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <RaisedButton label="Create" fullWidth={false} onClick={this.handleSubmit} style={{marginRight: 'auto', marginLeft: 'auto', display: 'block'}}/>
                                </div>
                            </div>





                        </div>

                    </div>
                </div>
            </div>
        );
    }
});


var EventEditor = React.createClass({

    getInitialState: function(){
        return {playerVal: 0, startTime: ' ', endTime: ' ', date:  new Date(), holes: false, walking: false, title: 'Name', eventArray: []}
    }, 
                            
    handleStartChange: function(e, selectedIndex, menuItem){
        this.setState({startTime: menuItem.text});
        
    }, 
        
    handleEndChange: function(e, selectedIndex, menuItem){
        this.setState({endTime: menuItem.text});
    }, 

    handleSliderChange: function(event, value) {
        switch(value) {
            case 0: 
                this.setState({playerVal: 1})
                break
            case 0.2: 
                
                this.setState({playerVal: 2})
                break
            case 0.4: 
                this.setState({playerVal: 3})
                break
            case 0.6: 
                this.setState({playerVal: 4})
                break
            case 0.8: 
                this.setState({playerVal: 5})
                break
            case 1: 
                this.setState({playerVal: 6})
        }

    },
    
    handleFocus: function(){
        this.refs.datePick.getDOMNode().firstChild.nextSibling.firstChild.setAttribute("style", "left: 51.25%; top: 20%; position: absolute;")
    },
        
    handleSubmit: function(e){
        
        var self = this;
    
        var playerName = this.refs.playerName.getValue();
        
        var teeDate = moment(this.refs.datePick.getDate()).format('YYYY-MM-DD');
        
        var players = this.state.playerVal;
        var holes = this.state.holes;
        var walking = this.state.walking;
        
        
        var startTime = moment((teeDate + ' ' + this.state.startTime), 'YYYY-MM-DD h:mm A').format();
        var endTime = moment((teeDate + ' ' + this.state.endTime), 'YYYY-MM-DD h:mm A').format();
        
//        if (playerName.length === 0)
        var id = this.props.id;
        var putUrl = ('/api/event/' + this.props.id);
        var newEventData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking};
       
         $.ajax({
             url: putUrl,
             dataType: 'json',
             type: 'PUT',
             data: newEventData,
             success: function(data){
                console.log(data);
                self.props.handleEdit(false, startTime, endTime, playerName, id, players, holes, walking, 'refresh');
                toastr.info(playerName + ' party of ' + players + '.', 'Tee time updated:')
             }.bind(this),
             error: function(xhr, status, err){
                 console.log('Can\'t let you make that, Tiger!')
                 console.error(status, err.toString)
             }.bind(this)
         });
        
        $.ajax({
            url: '/api/event',
            dataType: 'json',
            cache: false,
            success: function(data){

                self.setState({eventArray: data});
                
            }.bind(this), 
            error: function(xhr, status, err){
                console.log('It is all broken!')
                console.error(status, err.toString)
            }.bind(this)
        }); 
    },

    handleDelete: function(){

        var self = this;
    
        var playerName = this.refs.playerName.getValue();
        
        var teeDate = moment(this.refs.datePick.getDate()).format('YYYY-MM-DD');
        
        var players = this.state.playerVal;
        var holes = this.state.holes;
        var walking = this.state.walking;
        
        var startTime = moment((teeDate + ' ' + this.state.startTime), 'YYYY-MM-DD h:mm A').format();
        var endTime = moment((teeDate + ' ' + this.state.endTime), 'YYYY-MM-DD h:mm A').format();

        var id = this.props.id;
        var deleteUrl = ('/api/event/' + this.props.id);
        var newEventData = {title: playerName, start: startTime, end: endTime};
       
            $.ajax({
                    url: deleteUrl,
                    dataType: 'json',
                    type: 'DELETE',
                    success: function(data){
                        self.props.handleEdit(false, startTime, endTime, playerName, id, players, holes, walking, 'refresh');
                        toastr.warning(playerName + ' party of ' + players + '.', 'Tee time cancelled:');
                    }.bind(this),
                    error: function(xhr, status, err){
                        console.log('Can\'t let you delete that, Tiger!')
                        console.error(status, err.toString)
                    }.bind(this)
                });
    },
        
    componentWillReceiveProps: function(nextProps) {
        this.setState({startTime: moment(nextProps.start).format('h:mm A'), 
                          endTime: moment(nextProps.end).format('h:mm A'), 
                          date: moment(nextProps.start).toDate(), 
                          title: nextProps.title,
                        holes: nextProps.holes, 
                        playerVal: nextProps.players,
                        walking: nextProps.walking});
    },

    handleStartFocus: function(){
        this.refs.startTime.getDOMNode().firstChild.nextSibling.setAttribute("class", "dropDown-scroll")
    },

    handleEndFocus: function(){
        this.refs.endTime.getDOMNode().firstChild.nextSibling.setAttribute("class", "dropDown-scroll")
    },

    handleTitleChange: function(event){
        this.setState({title: event.target.value})
    },

    handleCalChange: function(thing, date){
        this.setState({date: date});
    },

    handleHolesChange: function(event, toggled){
        this.setState({holes: toggled});
    },

    handleWalkingChange: function(event, toggled){
        this.setState({walking: toggled});
    },
    
    componentDidMount: function(){
        
        var self = this;
        
        $.ajax({
            url: '/api/event',
            dataType: 'json',
            cache: false,
            success: function(data){

                self.setState({eventArray: data});
                
            }.bind(this), 
            error: function(xhr, status, err){
                console.log('It is all broken!')
                console.error(status, err.toString)
            }.bind(this)
        });  
    },
        
    render: function() {
        var tempStyle = {
            backgroundColor: '#000'
        }

        let startMenuItems = [];

        let endMenuItems = [];
        
        var self = this;
        
        var startDate = this.state.date;
        
        var playerConverter = function(val){
            switch(val) {
            case 0: 
                return 0
                break
            case 1: 
                return 0
                break
            case 2: 
                return 0.2
                break
            case 3: 
                return 0.4
                break
            case 4: 
                return 0.6
                break
            case 5: 
                return 0.8
                break
            case 6:
                return 1
                break
            }
        };
        
        var players = playerConverter(this.state.playerVal);
        
        var playerVal = function(){
            if (self.state.playerVal === 0){
                return 1
            } else {
                return self.state.playerVal
            }
        };
            
        var playerSubtitle = function (){
            if (playerVal() > 1){
                return 'players'
            } else {
                return 'player'
            }
        };
        
        
        var name = this.state.title;

        var walking = this.state.walking;

        var holes = this.state.holes;






    //NASTY TIME SLOTS THING
        
        
        // Get the current date in minutes since UNIX start and push every minute to 'minutesArray' (there are 1440 min in a day)
        var dateInit = this.state.date;

        dateInit.setHours(0);
        dateInit.setMinutes(0);
        dateInit.setSeconds(0);


        var dateSeconds = dateInit.getTime() / 1000;
        var dateMinutes = dateSeconds / 60;

        var minutesArray = [];

        for (var i = dateMinutes; i < (dateMinutes + 1440); i++) {
            minutesArray.push(i);
        };

        
        // Get all events on the board
        var eventArray = this.state.eventArray;
        var eventMinutesArray = [];
        var otherEvents = [];


        for (let i = 0; i < eventArray.length; i++){

            let startTimeInMinutes = (((moment(eventArray[i].start).toDate().getTime()) / 1000) / 60 );
            let endTimeInMinutes = (((moment(eventArray[i].end).toDate().getTime()) / 1000) / 60 );

            otherEvents.push(startTimeInMinutes);

            var takenTimeSlot = startTimeInMinutes;
            while (takenTimeSlot < endTimeInMinutes) {
                eventMinutesArray.push(takenTimeSlot);
                takenTimeSlot += 5;
            }
        };
        
        

        // Remove the time slots of the currently selected event from the 'taken slots' array 
        let eventStart = (((moment(this.props.start).toDate().getTime()) / 1000) / 60 );
        let eventEnd = (((moment(this.props.end).toDate().getTime()) / 1000) / 60 );
        
        for (let i = 0; i < eventMinutesArray.length; i++){
            
            var eventTimeSlot = eventStart;
            while (eventTimeSlot < eventEnd) {
                eventMinutesArray.splice(eventMinutesArray.indexOf(eventTimeSlot), 1, 'DOUG IS MAGIC');
                eventTimeSlot += 5;
            }
        };
        
        
        // Remove the time slots of the currently selected event from the 'other events' array    
        for (let i = 0; i < otherEvents.length; i++){
            
            var eventTimeSlot = eventStart;
            while (eventTimeSlot < eventEnd) {
                otherEvents.splice(otherEvents.indexOf(eventTimeSlot), 1, 'DOUG IS MAGIC');
                eventTimeSlot += 5;
            }
        };


        // Loop thru 'minutesArray' and replace each taken time slot with a placeholder string
        let validStartTimes = minutesArray.slice(0);

        for (var i = 0; i < eventMinutesArray.length; i++){

            if (minutesArray.indexOf(eventMinutesArray[i]) > -1){
                validStartTimes.splice(minutesArray.indexOf(eventMinutesArray[i]), 1, 'DOUG IS MAGIC');
            }
        };
        
        
        // Condense all available times within business hours 
        var openTime = dateMinutes + 6*60;
        var closeTime = dateMinutes + 19*60;

        function openHours(value){
            return value >= openTime
        };

        function closeHours(value){
            return value <= closeTime
        };

        var filteredStartOpenHours = validStartTimes.filter(openHours);
        var filteredStartBusinessHours = filteredStartOpenHours.filter(closeHours);
        
        var filteredOtherEventOpenHours = otherEvents.filter(openHours);
        var otherEventBusinessHours = filteredOtherEventOpenHours.filter(closeHours);


        // Ditch all times that aren't divisible by 5 (our slot duration)
        function filterSlots(value){
            if (value % 5 === 0){
                return value
            } else if ( value % 5 === 0){
                return value
            }
        };

        var filteredStartSlots = filteredStartBusinessHours.filter(filterSlots);
        var filteredEndSlots = filteredStartBusinessHours.filter(filterSlots);
        var filteredOtherSlots = otherEventBusinessHours.filter(filterSlots);
        
        // Add 5min to each end slot to allow for end times that are the same as another event's start time
        for (var i = 0; i < filteredEndSlots.length; i++){
            filteredEndSlots[i] += 5
        };
        
        
        
        // Remove all end slots prior to the currently selected slot
        let selectedStartInMinutes = (((moment(this.state.startTime, 'h:mm a').toDate().getTime()) / 1000) / 60 );
        let validEndSlots = [];
        
        for (var i = 0; i < filteredEndSlots.length; i++){
          if (filteredEndSlots[i] > selectedStartInMinutes){
              validEndSlots.push(filteredEndSlots[i]);
          }
        };

        
        
        
        
        // Format each slot to the right kind of string
        var formattedStartSlots = [];
        var formattedEndSlots = [];
        var formattedOtherEventSlots = [];

        for (var i = 0; i < filteredStartSlots.length; i++){
            var converted = (filteredStartSlots[i] * 60 * 1000);
            var formatted = moment(converted).format('h:mm A');
            formattedStartSlots.push(formatted);
        };

        for (var i = 0; i < validEndSlots.length; i++){
            var converted = (validEndSlots[i] * 60 * 1000);
            var formatted = moment(converted).format('h:mm A');
            formattedEndSlots.push(formatted);
        };
        
        for (var i = 0; i < filteredOtherSlots.length; i++){
            var converted = (filteredOtherSlots[i] * 60 * 1000);
            var formatted = moment(converted).format('h:mm A');
            formattedOtherEventSlots.push(formatted);
        };
        
        

        // Limit the end time options - check if end times are within an existing event's time slot
        for (var i = 0; i < formattedOtherEventSlots.length; i++){
            if (formattedEndSlots.indexOf(formattedOtherEventSlots[i]) > -1){
                formattedEndSlots.length = formattedEndSlots.indexOf(formattedOtherEventSlots[i])
            }
        }; 
        
        // Limit the end time options - max length of an event is 15min
        for (var i = 0; i < formattedOtherEventSlots.length; i++){
            var endFormatted = ((moment(formattedOtherEventSlots[i], 'h:mm a').toDate().getTime() / 1000) / 60); 
            var startFormatted = ((moment(self.state.startTime, 'h:mm a').toDate().getTime() / 1000) / 60);
            
            if (endFormatted - startFormatted > 15 && formattedEndSlots.indexOf(formattedOtherEventSlots[i]) > -1){
                formattedEndSlots.length = formattedEndSlots.indexOf(formattedOtherEventSlots[i])
            }
        };
        
        if (formattedEndSlots.length > 3){
            formattedEndSlots.length = 3
        };
        
        
        // Push values into the right format for the DropDown component
        for (var i = 0; i < formattedStartSlots.length; i++){
            startMenuItems.push({ payload: i.toString(), text: formattedStartSlots[i] })
        };

        for (var i = 0; i < formattedEndSlots.length; i++){
            endMenuItems.push({ payload: i.toString(), text: formattedEndSlots[i] })
        };
        


        // Set the starting / selected value in each list
        let dropDownStartIndex = formattedStartSlots.indexOf(this.state.startTime);
        let dropDownEndIndex = formattedEndSlots.indexOf(this.state.endTime);


        return (
            <div>
                <div className={"overlay " + this.props.showing}/>
                <div className="eventEditor-wrapper">
                    <div className={"eventEditor " + this.props.showing}>
                        <div className="eventCreator-header">
                            <h2 className="text-center">Edit Tee Time</h2>
                            <IconButton ref='close' iconClassName="material-icons" tooltipPosition="top-center"
                                  tooltip="Cancel" style={{float: 'right', color: 'rgba(255, 255, 255, 0.87)'}} color={Colors.blue500} onClick={this.props.handleEdit.bind(this, false)}>clear</IconButton>
                        </div>
                        <div className="eventCreator-fieldWrapper">
                            <TextField ref='playerName' id="playerName" value={name} onChange={this.handleTitleChange} ref="playerName"
                              floatingLabelText="Name" />

                            <div className="row">
                                <div className='col-md-9' style={{height: '0px'}}>
                                    <Slider onChange={this.handleSliderChange} ref='playerSlider' value={players} step={0.2}/>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center"><h4>{playerVal()}</h4><p>{playerSubtitle()}</p></div>
                                </div>
                            </div>

                            <div className="row" style={{marginBottom: '5px'}}>
                                <div className='col-md-12'>
                                    <DatePicker ref='datePick' value={startDate} id="datePick"  hintText="Date" onChange={this.handleCalChange} onFocus={this.handleFocus} autoOk={true} />
                                </div>
                            </div>
            
                            <div className="row" style={{marginBottom: '20px'}}>
                                <div className="col-md-6">
                                    <DropDownMenu ref="startTime" onChange={this.handleStartChange} onClick={this.handleStartFocus} menuItems={startMenuItems} selectedIndex={dropDownStartIndex} style={{width: '100%'}} autoWidth={false}/>
                                </div>
                                <div className="col-md-6">
                                    <DropDownMenu ref="endTime" onChange={this.handleEndChange} onClick={this.handleEndFocus}  menuItems={endMenuItems} selectedIndex={dropDownEndIndex} style={{width: '100%'}} autoWidth={false}/>
                                </div>
                            </div>
            
                            <div className="row center-block">
                                <Toggle
                                  name="toggleName2"
                                  label="9 Holes / 18 Holes"
                                  defaultToggled={holes}
                                  value={holes}
                                  onToggle={this.handleHolesChange}/>

                                <Toggle
                                  name="toggleName2"
                                  label="Walking / Riding"
                                  defaultToggled={walking}
                                  value={walking}
                                  onToggle={this.handleWalkingChange}/>
                            </div>
            
                            <div className="row center-block" style={{marginBottom: '20px'}}>
                              <TextField
                                  hintText="Amt Due"
                                  disabled={true}
                                  defaultValue="$2,000"
                                  floatingLabelText="Amt Due" 
                                style={{width: '100%'}}/>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <RaisedButton label="Submit" fullWidth={false} onClick={this.handleSubmit} style={{marginRight: '15%'}}/>
                                </div>
                                <div className="col-md-6">
                                    <RaisedButton label="Delete" fullWidth={false} onClick={this.handleDelete} style={{marginRight: '15%'}}/>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
});
var Main = React.createClass({

    getInitialState: function(){
        return({showingCreate: ' ', showingEdit: ' ', start: null, end: null, title: 'poop', id: null, players: 0, holes: false, walking: false, eventArray: []});
    },

    handleCreate: function(showing, start, end, callback){
 
        // CREATE STEP 4 == FIRST FUNCTION CALL - SHOW EDIT WINDOW, SEND DATA TO STATES ----> PASS TO 'EventCreator'
        if (showing === true){
            this.setState({showingCreate: 'active', start: start, end: end})
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

    handleEdit: function(showing, start, end, title, id, players, holes, walking, callback){

        // EDIT STEP 4 == FIRST FUNCTION CALL - SHOW EDIT WINDOW, SEND DATA TO STATES ----> PASS TO 'EventEditor'
        if (showing === true){
            this.setState({showingEdit: 'active', start: start, end: end, title: title, id: id, players: players, holes: holes, walking: walking})
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
                        <a className="mainNav" href="/users">Users</a>
                    </li>
                    <div className="navSpacer center-block"></div>
                    <li>
                        <a className="mainNav" href="#">My Course</a>
                    </li>
                </ul>
            </div>
            <div className="col-md-offset-3 col-md-8 well calendar-holder vertical-center">
                <Cal ref='cal' handleCreate={this.handleCreate} handleEdit={this.handleEdit} eventArray={this.state.eventArray} handleEdit={this.handleEdit}/>
            </div>
                
            <div id="popup-wrapper">    
    
                <EventCreator showing={this.state.showingCreate} start={this.state.start} end={this.state.end} handleCreate={this.handleCreate}/>
    
    
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

});
 
ReactDOM.render(<Main/>, document.getElementById("render-here"));