var React = require('react');
var ReactDOM = require('react-dom');

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
const FlatButton = require('material-ui/lib/flat-button');
const FloatingActionButton = require('material-ui/lib/floating-action-button');



const ThemeManager = require('material-ui/lib/styles/theme-manager');
const MyRawTheme = require('./muiTheme.js');


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



var EventEditor = React.createClass({
    
    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },

    getChildContext() {
        return {
          muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
        };
    },

    getInitialState: function(){
        var self = this;
        
        return {playerVal: 0, startTime: ' ', endTime: ' ', date:  new Date(), holes: false, walking: false, title: 'Name', eventArray: [], eventId: ' ', validEndTimes: []}
    },
    // toggleApproval: function(e) {
    //     var self = this;
    
    //     var playerName = this.refs.playerName.getValue();
    //     var teeDate = moment(this.refs.datePick.getDate()).format('YYYY-MM-DD');
        
    //     var players = this.state.playerVal;
    //     var holes = this.state.holes;
    //     var walking = this.state.walking;
    //     var eventArray = this.state.eventArray;
        
    //     console.log('this is the eventarry' + eventArray);
    //     var startTime = moment((teeDate + ' ' + this.state.startTime), 'YYYY-MM-DD h:mm A').format();
    //     var endTime = moment((teeDate + ' ' + this.state.endTime), 'YYYY-MM-DD h:mm A').format();

    //     // if (!approved) {
    //     //     approved = true;
    //     //     this.setState({isApproved: 'not approved'});
    //     //     alert("Approved was false and is being set to " + approved);
    //     // } else {
    //     //     // this.setState({approved: false});
    //     //     approved = false;
    //     //     this.setState({isApproved: 'Approved'});
    //     //     alert("Approved was true as is being set to " + approved);
    //     // };
    //     var id = this.props.id;
    //     var putUrl = ('/api/event/' + this.props.id);
    //     alert(putUrl);
    //     var newEventData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking};
    //     $.ajax({
    //         url: putUrl,
    //         dataType: 'json',
    //         type: 'PUT',
    //         data: newEventData,
    //         success: function(data){
    //            console.log(data);
    //            // self.props.handleEdit(false, startTime, endTime, playerName, id, players, holes, walking, approved, eventArray, 'refresh');
    //            // if (!approved) {
    //            //      this.setState({approved: false});
    //            //      this.setState({isApproved: 'not approved'});
    //            //     toastr.info(playerName + 'is not approved to play.');
    //            // } else {
    //            //     this.setState({approved: true});
    //            //     this.setState({isApproved: 'Approved'});
    //            //     toastr.info(playerName + 'is now approved to play.');
    //            // };
    //         }.bind(this),
    //         error: function(xhr, status, err){
    //             console.log('Can\'t let you make that, Tiger!')
    //             console.error(status, err.toString)
    //         }.bind(this)
    //     });
    // },                       
    handleStartChange: function(e, selectedIndex, menuItem){
        let endArray = [];

        for (let i = 1; i <= 3; i++){
            let thing = moment(menuItem.text, 'h:mm A').add((i*5), 'minutes');
            endArray.push(thing.format('h:mm A'))
        }; 

        this.setState({startTime: menuItem.text, validEndTimes: endArray});
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
        this.refs.datePick.getDOMNode().firstChild.nextSibling.firstChild.setAttribute("style", "left: 5%; top: -5%; position: absolute;")
    },
        
    handleSubmit: function(e){
        
        var self = this;
    
        var playerName = this.refs.playerName.getValue();
        
        var teeDate = moment(this.refs.datePick.getDate()).format('YYYY-MM-DD');
        
        var players = this.state.playerVal;
        var holes = this.state.holes;
        var walking = this.state.walking;
        var eventArray = this.state.eventArray;
        
        
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
                self.props.handleEdit(false, startTime, endTime, playerName, id, players, holes, walking, eventArray, 'refresh');
                toastr.info('Tee time updated for ' + playerName + ' on '+ moment(startTime).format('dddd') + ' at ' + moment(startTime).format('h:mm'))
             }.bind(this),
             error: function(xhr, status, err){
                 console.log('Can\'t let you make that, Tiger!')
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
        var eventArray = this.state.eventArray;
        
        var startTime = moment((teeDate + ' ' + this.state.startTime), 'YYYY-MM-DD h:mm A').format();
        var endTime = moment((teeDate + ' ' + this.state.endTime), 'YYYY-MM-DD h:mm A').format();

        var id = this.props.id;
        var deleteUrl = ('/api/event/' + this.props.id);
        var newEventData = {title: playerName, start: startTime, end: endTime};
       
        $.ajax({
            url: deleteUrl,
            dataType: 'json',
            type: 'DELETE',
            data: newEventData,
            success: function(data){
                self.props.handleEdit(false, startTime, endTime, playerName, id, players, holes, walking, eventArray, 'refresh');
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
        walking: nextProps.walking,
        eventId: nextProps.id,
        eventArray: nextProps.eventArray,
        validEndTimes: [moment(nextProps.end).format('h:mm A')] });
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





    // NEW ELEGANT TIME SLOTS THING

        // Get array of all events on the cal
        var eventArray = this.state.eventArray;
        var eventId = this.state.eventId;

        let selectedDate = moment(this.state.date).format('MM/DD/YYYY')

        // Remove currently selected event by ID
        for (let i = 0; i < eventArray.length; i++){
            if (eventArray[i]._id === eventId){
                eventArray.splice(i, 1) 
            }
        };

        var sortedByDay = [];

        for (let i = 0; i < eventArray.length; i ++){
            if (moment(eventArray[i].start).format('MM/DD/YYYY') === selectedDate){
                sortedByDay.push(eventArray[i])
            }
        };


        // Create array of all minutes in the day
        var minutesArray = [];

        for (var i = 0; i < 1440; i = i + 5){
            minutesArray.push(i);
        }

        // Construct an array of all valid minute values, not including those already occupied
        let validStartTimes = minutesArray.slice(0);

        function startMaker(...inputs){
            for (let q in inputs){
            for (let i = 0; i < 1440; i = i + 5){

                    let startTime = moment(inputs[q].start).unix() - moment(self.state.date).hour(0).minute(0).second(0).unix();
                    let startTimeInMinutes = startTime / 60;

                    let endTime = moment(inputs[q].end).unix() - moment(self.state.date).hour(0).minute(0).second(0).unix();
                    let endTimeInMinutes = endTime / 60;

                    if (i >= startTimeInMinutes && i < endTimeInMinutes) {
                        validStartTimes.splice(validStartTimes.indexOf(i), 1);
                    }  
                }
            }
        };

        startMaker(...sortedByDay);

        // Condense all available times within business hours 
        var openTime = 7*60;
        var closeTime = 18*60;

        function openHours(value){
            return value >= openTime
        };

        function closeHours(value){
            return value <= closeTime
        };

        var filteredOpenHours = validStartTimes.filter(openHours);
        var filteredStartTimes = filteredOpenHours.filter(closeHours);

        // Format each slot to the right kind of string
        var formattedStartSlots = [];

        var dateInit = this.state.date;

        dateInit.setHours(0);
        dateInit.setMinutes(0);
        dateInit.setSeconds(0);

        var newDate = dateInit.getTime()

        for (var i = 0; i < filteredStartTimes.length; i++){
            var converted = moment((filteredStartTimes[i] * 60 * 1000) + newDate)
            var formatted = converted.format('h:mm A');
            formattedStartSlots.push(formatted);
        };

        let validEndTimes = this.state.validEndTimes;

        for (let i = 0; i < validEndTimes.length; i++){

            if (formattedStartSlots.indexOf(validEndTimes[i]) <= -1){
                validEndTimes.length = i + 1;
                break;
            }
        }


        // Push values into the right format for the DropDown component
        for (var i = 0; i < formattedStartSlots.length; i++){
            startMenuItems.push({ payload: i.toString(), text: formattedStartSlots[i] })
        };


        for (var i = 0; i < validEndTimes.length; i++){
            endMenuItems.push({ payload: i.toString(), text: validEndTimes[i] })
        };


        // Set the starting / selected value in each list

        let dropDownStartIndex = formattedStartSlots.indexOf(this.state.startTime);
        let dropDownEndIndex = this.state.validEndTimes.indexOf(this.state.endTime);




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
                                  
                            <div className="row center-block" style={{marginBottom: '40px'}}>
                                
                                <div className="col-md-12 vertical-center">
                                    <div className="col-md-4">
                                        <h4>9 Holes</h4>
                                    </div>
                                    <div className="col-md-4">
                                        <Toggle
                                          name="toggleName2"
                                          defaultToggled={holes}
                                          value={holes}
                                          onToggle={this.handleHolesChange}/>
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
                                          defaultToggled={walking}
                                          value={walking}
                                          onToggle={this.handleWalkingChange}/>
                                    </div>
                                    <div className="col-md-4">
                                        <h4>Walking</h4>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className='col-md-12'>
                                <div className="col-md-6 center-block">
                                    <RaisedButton label="Submit" fullWidth={false} onClick={this.handleSubmit} style={{marginLeft: '10%'}} />
                                </div>
                                <div className="col-md-6 center-block">
                                    <RaisedButton label="Delete" fullWidth={false} onClick={this.handleDelete} style={{marginLeft: '5%'}} />
                                </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
});

module.exports = EventEditor;