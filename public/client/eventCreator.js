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



var EventCreator = React.createClass({

    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },

    getChildContext() {
        return {
          muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
        };
    },
        
    getInitialState: function(){
        return {title: null, phoneNumber: '', playerVal: 0, startTime: ' ', endTime: ' ', date: new Date(), holes: true, walking: true, eventArray: [], validEndTimes: [], firstRender: true}
    }, 
                            
    handleStartChange: function(e, selectedIndex, menuItem){
        let endArray = [];

        for (let i = 1; i <= 3; i++){
            let thing = moment(menuItem.text, 'h:mm A').add((i*5), 'minutes');
            endArray.push(thing.format('h:mm A'))
        }; 

        this.setState({startTime: menuItem.text, validEndTimes: endArray, firstRender: false});
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
        this.refs.datePick.getDOMNode().firstChild.nextSibling.firstChild.setAttribute("style", "left: 5%; top: -5%; position: absolute;")
    },
        
    handleStartFocus: function(){
        this.refs.startTime.getDOMNode().firstChild.nextSibling.setAttribute("class", "dropDown-scroll")
    },

    handleEndFocus: function(){
        this.refs.endTime.getDOMNode().firstChild.nextSibling.setAttribute("class", "dropDown-scroll")
    },
        
    handleHolesToggle: function(event, toggled){
      this.setState({holes: toggled})
    },
        
    handleWalkingToggle: function(event, toggled){
      this.setState({walking: toggled})
    },

    handleTitleChange: function(event){
        this.setState({title: event.target.value})
        this.refs.playerName.setErrorText('');
        $('.eventCreator').attr('style', 'height: 600px');
    },

    handlePhoneChange: function(event){
        this.setState({phoneNumber: event.target.value})
        this.refs.phoneNumber.setErrorText('');
        $('.eventCreator').attr('style', 'height: 600px');
    },
        
    handleSubmit: function(e){
        
        var self = this;
    
        var playerName = this.refs.playerName.getValue();
        var phoneNumber = this.refs.phoneNumber.getValue();
        phoneNumber = phoneNumber.replace(/-| |\(|\)|\./g, '');
        phoneNumber = '+1' + phoneNumber;

        
        var players = this.state.playerVal;
        var holes = this.state.holes;
        var walking = this.state.walking;
        var eventArray= this.state.validEndTimes;
        
        
        var teeDate = moment(this.refs.datePick.getDate()).format('YYYY-MM-DD');
        
        
        var startTime = moment((teeDate + ' ' + this.state.startTime), 'YYYY-MM-DD h:mm A').format();
        var endTime = moment((teeDate + ' ' + this.state.endTime), 'YYYY-MM-DD h:mm A').format();
        

        
        var newEventData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking, phoneNumber: phoneNumber};

       if (playerName.length === 0) {
         $('.eventCreator').attr('style', 'height: 620px');
         setTimeout(function(){self.refs.playerName.setErrorText("You must enter a name!")}, 75);
       } else {

        if (phoneNumber === '+1') {
           self.refs.playerName.setErrorText('');
           $('.eventCreator').attr('style', 'height: 620px !important;');
           setTimeout(function(){ self.refs.phoneNumber.setErrorText('You must enter a phone number!')}, 75);
         } else {
                 $.ajax({
                     url: '/api/event/',
                     dataType: 'json',
                     type: 'POST',
                     data: newEventData,
                     success: function(data){
                        self.props.handleCreate(false, startTime, endTime, eventArray, 'refresh');
                        toastr.options.showMethod = 'slideDown';
                        toastr.options.closeButton = true;
                        toastr.success('New tee time created for ' + playerName + ' on '+ moment(startTime).format('dddd') + ' at ' + moment(startTime).format('h:mm'));

                        $.ajax({
                           url: '/api/message/',
                           dataType: 'json',
                           type: 'POST',
                           data: { phoneNumber: phoneNumber, date: moment(teeDate).format('ll'), startTime: moment(startTime).format('h:mm A'), name: playerName },
                           success: function(data){
                             self.setState({title: null, phoneNumber: null, playerVal: 0, startTime: ' ', endTime: ' ', date: new Date(), holes: true, walking: true, eventArray: [], validEndTimes: []})
                             self.refs.phoneNumber.clearValue()
                           }.bind(this),
                           error: function(xhr, status, err){
                               console.log('Can\'t let you make that, Tiger!')
                               console.error(status, err.toString)
                           }.bind(this)
                        })

                     }.bind(this),
                     error: function(xhr, status, err){
                         console.log('Can\'t let you make that, Tiger!')
                         console.error(status, err.toString)
                     }.bind(this)
                 });
            }
        }
        
    },
        
    handleClose: function(){
      this.setState({title: null, phoneNumber: null, playerVal: 0, startTime: ' ', endTime: ' ', date: new Date(), holes: true, walking: true, eventArray: [], validEndTimes: []})
      this.props.handleCreate(false);
    },
        
    componentWillReceiveProps: function(nextProps) {
        this.setState({startTime: moment(nextProps.start).format('h:mm A'), 
                        endTime: moment(nextProps.end).format('h:mm A'), 
                        date: moment(nextProps.start).toDate(),
                        eventArray: nextProps.eventArray,
                        validEndTimes: [moment(nextProps.end).format('h:mm A')]
                    });
    },
        
    render: function() {
        var tempStyle = {
            backgroundColor: '#000'
        }

        let startMenuItems = [];

        let endMenuItems = [];
        
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




        // NEW ELEGANT TIME SLOTS THING

        // Get array of all events on the cal
        var eventArray = this.state.eventArray;

        let selectedDate = moment(this.state.date).format('MM/DD/YYYY')


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

        if (this.state.firstRender){
            validEndTimes = [moment(this.state.startTime, 'h:mm A').add(5, 'minutes').format('h:mm A'), moment(this.state.startTime, 'h:mm A').add(10, 'minutes').format('h:mm A'), moment(this.state.startTime, 'h:mm A').add(15, 'minutes').format('h:mm A')];
        };

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


        let dropDownStartIndex = formattedStartSlots.indexOf(this.state.startTime);
        let dropDownEndIndex = this.state.validEndTimes.indexOf(this.state.endTime);

        let name = this.state.title;
        let phoneNumber = this.state.phoneNumber;

        
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
                              floatingLabelText="Name" value={name} onChange={this.handleTitleChange} style={{width: '100%', marginTop: 5}}/>
                            <TextField id="phoneNumber" ref="phoneNumber"
                              floatingLabelText="Mobile Number" onChange={this.handlePhoneChange} hintText="ex. (123) 456-7890" style={{width: '100%', marginTop: -15}}/>
                            
                            <div className="row editor-sliderRow">
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <i className="fa fa-users fa-lg editor-userIcon"></i>
                                    </div>
                                </div>
                                <div className='col-md-10' style={{height: '0px'}}>
                                    <h4 className="editor-userCount">{playerVal()}</h4>
                                    <div className="editor-slider">
                                        <Slider onChange={this.handleSliderChange} value={players} step={0.2}/>
                                    </div>
                                </div>
                            </div>

                            <div className="row" style={{marginBottom: '5px'}}>
                                <div className='col-md-12'>
                                    <DatePicker ref='datePick' value={startDate} id="datePick"  hintText="Date" onChange={this.handleCalChange} onFocus={this.handleFocus} autoOk={true} />
                                </div>
                            </div>
            
                            <div className="row" style={{marginBottom: '20px'}}>
                                <div className="col-md-6">
                                    <DropDownMenu ref="startTime" onChange={this.handleStartChange} menuItems={startMenuItems} onClick={this.handleStartFocus} selectedIndex={dropDownStartIndex} style={{width: '100%'}} autoWidth={false}/>
                                </div>
                                <div className="col-md-6">
                                    <DropDownMenu ref="endTime" onChange={this.handleEndChange} menuItems={endMenuItems} onClick={this.handleEndFocus} selectedIndex={dropDownEndIndex} style={{width: '100%'}} autoWidth={false}/>
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

module.exports = EventCreator;