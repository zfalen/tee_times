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
const Dialog = require('material-ui/lib/dialog');
const Toggle = require('material-ui/lib/toggle');
const RaisedButton = require('material-ui/lib/raised-button');
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');
const RefreshIndicator = require('material-ui/lib/refresh-indicator');
const Snackbar = require('material-ui/lib/snackbar');


const ThemeManager = require('material-ui/lib/styles/theme-manager');
const MyRawTheme = require('./muiTheme.js');

// var SchedulerButton = React.createClass({

// });


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

// var Progress = React.createClass({
//     whileLoading: function(){

//     },
//     render: function() {
//         return(
//             <div>
//                 <CircularProgress mode="indeterminate" />
//             </div>
//         );
//     }
// });

var Scheduler = React.createClass({

    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },

    getChildContext() {
        return {
          muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
        };
    },

    getInitialState: function(){
        return {showing: ' ', errorMessage: '', openDialogCustomActions: false, eventId: null, playerVal: 0, startTime: '7:00 AM', endTime: '7:15 AM', date: new Date(), holes: true, walking: true, eventArray: [], validEndTimes: ['7:15 AM']}
    },
    _handleAction: function(){
      $.ajax(  {
        url: 'api/event/' + this.state.eventId,
        dataType: 'json',
        type: 'DELETE',
        success: function(data){

            this.refs.snackbar.dismiss();
            this._handleCustomDialogSubmit();

        }.bind(this),
        error: function(xhr, status, err){
            console.log('Can\'t let you delete that, Tiger!')
            console.error(status, err.toString)
        }.bind(this)
      });
    },
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
    // handleBadName: function(e) {
    //   this.setState({
    //     textFieldValue: e.target.value
    //   });
    //   if (this.state.textFieldValue.length < 3 ) {
    //      console.log('HEY');
    //   }
    // },

    handleCalChange: function(thing, date){
        this.setState({date: date});
    },

    handleFocus: function(){
        // ReactDOM.findDOMNode(this.refs.datePick).firstChild.nextSibling.firstChild.setAttribute("style", "left: 5%; top: -5%; position: absolute;")
    },

    handleStartFocus: function(){
        ReactDOM.findDOMNode(this.refs.startTime).firstChild.nextSibling.setAttribute("class", "dropDown-scroll")
    },

    handleEndFocus: function(){
        ReactDOM.findDOMNode(this.refs.endTime).firstChild.nextSibling.setAttribute("class", "dropDown-scroll")
    },

    handleHolesToggle: function(event, toggled){
      this.setState({holes: toggled})
    },

    handleWalkingToggle: function(event, toggled){
      this.setState({walking: toggled})
    },
    _handleCustomDialogSubmit: function() {
     this.setState({
      openDialogCustomActions: true,
      });
    },
    _handleRequestClose: function() {
     this.setState({
      openDialogCustomActions: false,
      });
    },

    handleSubmit: function(e){

        var self = this;

        var playerName = this.refs.playerName.getValue();

        var players = this.state.playerVal;
        var holes = this.state.holes;
        var walking = this.state.walking;
        var approved = this.state.approved;
        var eventArray= this.state.validEndTimes;

        var teeDate = moment(this.refs.datePick.getDate()).format('YYYY-MM-DD');


        var startTime = moment((teeDate + ' ' + this.state.startTime), 'YYYY-MM-DD h:mm A').format();
        var endTime = moment((teeDate + ' ' + this.state.endTime), 'YYYY-MM-DD h:mm A').format();
        var newEventData = {title: playerName, start: startTime, end: endTime, players: players, holes: holes, walking: walking, approved: approved};

       if (playerName.length === 0) {
         console.log('you must enter a name!');
         self.setState({errorMessage: "You must enter a name!"});
       } else {
         $.ajax({
             url: '/api/event/',
             dataType: 'json',
             type: 'POST',
             data: newEventData,
             success: function(data){
               self.setState({showing: ' ', playerVal: 0, startTime: '7:00 AM', endTime: '7:15 AM', date: new Date(), holes: true, walking: true, eventArray: [], validEndTimes: ['7:15 AM']});
               this.refs.playerName.clearValue()
               this.refs.snackbar.show();
               console.log(data._id);
               this.setState({eventId: data._id});
             }.bind(this),
             error: function(xhr, status, err){
                 console.log('Can\'t let you make that, Tiger!')
                 console.error(status, err.toString)
             }.bind(this)
         });
       }
    },

    handleClose: function(){
         this.setState({showing: ' ', playerVal: 0, startTime: '7:00 AM', endTime: '7:15 AM', date: new Date(), holes: true, walking: true, eventArray: [], validEndTimes: ['7:15 AM']});
         this.refs.playerName.clearValue();
    },

    showScheduler: function(){
      this.setState({showing: 'active'});
    },
    componentDidMount: function(){
        var self = this;

        $.ajax({
            url: '/api/event',
            dataType: 'json',
            cache: false,
            success: function(data){
                // for (var i = 0; i < data.length; i++) {
                //    if (data.length === 0) {

                //    }
                // };
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
            if (playerVal() === 1){
                return 'Just Me'
            } else if (playerVal() === 2) {
                return 'Two guys. One course.'
            } else if (playerVal() === 3) {
               return 'Three\'s company'
            } else if (playerVal() === 4) {
               return 'More like Four Play!'
            } else if (playerVal() === 5) {
               return 'Approaching critical mass...'
            } else if (playerVal() === 6) {
               return 'Seriously?'
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




        return (
            <div>
                <RaisedButton label="Click Here" fullWidth={true} onClick={this.showScheduler} style={{marginRight: 'auto', marginLeft: 'auto', display: 'block', marginTop: 50}}/>
                <div className={"overlay " + this.state.showing}/>
                <div className="eventScheduler-wrapper">
                    <div className={"eventScheduler " + this.state.showing}>
                        <div className="eventScheduler-header">
                            <img src="./img/sampleSite/bushwood-logo.png" className="scheduler-logo center-block"></img>
                            <IconButton ref='close' iconClassName="material-icons" tooltipPosition="top-center"
                                  tooltip="Cancel" style={{float: 'right', color: 'rgba(255, 255, 255, 0.87)', position: 'absolute', top: 0, right: 0}} color={Colors.blue500} onClick={this.handleClose}>clear</IconButton>
                        </div>
                        <div className="eventScheduler-fieldWrapper">
                            <TextField id="playerName" ref="playerName" setErrorText={this.state.errorMessage} floatingLabelText="NAME" style={{width: '100%', marginTop: -15}}/>

                            <div className="row">
                                <div className="col-md-2">
                                    <div className="text-center">
                                        <i className="fa fa-users fa-lg scheduler-userIcon"></i>
                                    </div>
                                </div>
                                <div className='col-md-10' style={{height: '0px'}}>
                                    <div className="scheduler-slider">
                                        <Slider onChange={this.handleSliderChange} style={{width: '90%', float: 'right'}} value={players} step={0.2}/>
                                    </div>
                                    <h4 className="scheduler-userCount">{playerVal()}</h4>
                                </div>
                            </div>

                            <div className="row" style={{marginBottom: '5px', marginTop: 30}}>
                                <div className='col-md-12'>
                                    <DatePicker ref='datePick' value={startDate} id="datePick"  hintText="Date" onChange={this.handleCalChange} onFocus={this.handleFocus} autoOk={true} textFieldStyle={{width: '100%'}}/>
                                </div>
                            </div>

                            <div className="row" style={{marginBottom: '20px'}}>
                                <div className="col-md-6 text-center">
                                    <h5>Start Time</h5>
                                    <DropDownMenu ref="startTime" onChange={this.handleStartChange} menuItems={startMenuItems} onClick={this.handleStartFocus} selectedIndex={dropDownStartIndex} style={{width: '100%', marginTop: -20}} autoWidth={false}/>
                                </div>
                                <div className="col-md-6 text-center">
                                    <h5>End Time</h5>
                                    <DropDownMenu ref="endTime" onChange={this.handleEndChange} menuItems={endMenuItems} onClick={this.handleEndFocus} selectedIndex={dropDownEndIndex} style={{width: '100%', marginTop: -20}} autoWidth={false}/>
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

                            <div className="trademark">
                              <p>Powered by <img src="./img/forePlay_logo.png" style={{width: 50}}/> </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Snackbar
                  ref="snackbar"
                  message="Tee time scheduled"
                  action="Second Thoughts?"
                  autoHideDuration={this.state.autoHideDuration}
                  onActionTouchTap={this._handleAction}/>
                  <Dialog
                     ref="customDialog"
                     title="Your tee time was cancelled"
                     open={this.state.openDialogCustomActions}
                     onRequestClose={this._handleRequestClose}>
                  </Dialog>
            </div>
        );
    }
});

ReactDOM.render(<Scheduler/>, document.getElementById("renderScheduler"));


// var submitHandler = function() {
//    var title = document.getElementById('name').value.trim();
//    var start = document.getElementById('startTime').value.trim();
//    var end = document.getElementById('endTime').value.trim();
//    var players = document.getElementById('players').value.trim();

//    var noHoles = document.getElementsByName('holes');
//    var isWalking = document.getElementsByName('walking');

//    var holes;
//    var walking;

//    for (var i = 0; i < noHoles.length; i++){
//       if (noHoles[i].checked) {
//          holes = noHoles[i].value;
//       }
//    }

//    for (var i = 0; i < isWalking.length; i++){
//       if (isWalking[i].checked) {
//          walking = isWalking[i].value;
//       }
//    }

//    var inputData = {title: title, start: start, end: end, players: players, holes: holes, walking: walking};


//    $.ajax({
//          url: '/api/event',
//          dataType: 'json',
//          data: inputData,
//          type: 'POST',
//             success: function(data){
//                console.log("posting data!");
//                console.log(data);
//             }.bind(this),
//             error: function(xhr, status, err){
//                alert("not posting data!");
//                alert(this.props.url, status, err.toString());
//             }.bind(this)
//    })
// }
