// Customize how the browser will display the contents of Thing update messages received
//

const correctColor = '#0000bb';
const wrongColor = '#ff5544';
var stateCount = 0;


var styles = {};

function init() {
    console.log('body loaded');
    clearMap('all');
}

function handleMessage(msg) {  // called from within connectAsThing.js

    var game = JSON.parse(msg).game;
    var myState = JSON.parse(msg).usstate;
    var stateList = JSON.parse(msg).stateList;
    var say = JSON.parse(msg).say;
    var allowedNextStates = JSON.parse(msg).allowedNextStates;
    //var ImgUrl = "https://www.google.com/search?tbm=isch&q=" + encodeURI(myCity);  // Message Body (Image Search URL)

    if (myState == 'clear') {
        clearStateList();
        clearMap('all');
        stateCount = 0;

    } else {
        var correct = false;
        if (myState == stateList[stateList.length-1]) {
            correct = true;
        }
        updateMapList(myState, stateList, correct, false);
        updateStateList(stateList, allowedNextStates);
    }
    console.log(say.substring(0,18));

    updateSay(say);
    if (game !== '') {
        demo(game);
    }

}

function updateSay(say) {
        $('#alert')
            .text(say.replace(/<(?:.|\n)*?>/gm, '')) // strip out any <ssml> tags
            // .parent().effect('highlight', {color: 'green'}, 2000)
            .stop();
            // .css('backgroundColor', '#ff0') //
            // .animate({backgroundColor: '#ddd'}, 1000); //
}

function updateStateList(list, allowedNextStates) {
    $("#statelist ul").empty();

    var activeLine = '';
    var badge = '';

    for (var i = 0; i < list.length; i++) {
        if (i == list.length - 1) {
            activeLine = 'active';
        }
        badge = '<span class="badge badge-default badge-pill">' + (i+1) + '</span>';
        $("#statelist ul").append('<li class="list-group-item justify-content-between ' + activeLine + '">' + badge + list[i] + '</li>');
    }
    for (var j = 0; j < allowedNextStates.length; j++) {
        $("#statelist ul").append('<li class="list-group-item list-group-item-warning justify-content-end "><i>'  + allowedNextStates[j] + '</i> </li>');

    }

}
function clearStateList() {
    $("#statelist ul").empty();
    // document.getElementById('statelist').innerHTML = '';

}
function clearMap(usstateAbbr) {
    var event;
    // console.log('clearMap(' + usstateAbbr + ')');
    styles = {};

    if (usstateAbbr == 'all') {
        for (var i = 0; i < states.length; i++) {

            styles[states[i][1]] = {fill:correctColor};

            $('#map').usmap('trigger', states[i][1], 'mouseout', event);

        }
        $('#map').usmap('stateSpecificHoverStyles',styles);

    } else {
        $('#map').usmap('trigger', usstateAbbr, 'mouseout', event);
    }

}
function updateMapList(usstate, list, correct, demo) {
    var usstateAbbr = '';

    // alert(usstate);
    clearMap('all');
    for (var i = 0; i < list.length; i++) {
        usstateAbbr = abbrState(list[i], 'abbr');

        styles = {};
        var newColor = '';

        var shift = 0;

        if (!demo) {
            shift = (list.length - (i < list.length - 5 ? list.length - 5 : i) + 2) * 0.1;
            newColor = shadeColor(correctColor, shift );
        } else {
            newColor = '#dd3388';
        }

        styles[usstateAbbr] = {fill:newColor };
        // console.log('fill state ' + usstateAbbr);

        // Use new method to set the stateSpecificStyles property
        $('#map').usmap('stateSpecificHoverStyles',styles);
        $('#map').usmap('trigger', usstateAbbr, 'mouseover', event);

    }

    var event;
    // alert('usstate is ' + usstate);
    usstateAbbr = abbrState(usstate, 'abbr');

    if (usstateAbbr == 'not found') {
        console.log(usstate, ' is not a valid state');
    } else    {
        // $('#TN').css('fill','#DD7733');
        // update state to mouseover color

        if(!correct) {

            // $('#map').usmap('trigger', usstateAbbr, 'mouseover', event);

            styles = {};
            styles[usstateAbbr] = {fill:wrongColor};

            // Use new method to set the stateSpecificStyles property

            $('#map').usmap('stateSpecificHoverStyles',styles);

            $('#map').usmap('trigger', usstateAbbr, 'mouseover', event);
            // console.log('updated state incorrect');


            // setTimeout(function(){
            //     styles[usstateAbbr] = {fill:'whitesmoke'};
            //     $('#map')
            //         .usmap('trigger', usstateAbbr, 'mouseout', event)
            //         .usmap('stateSpecificHoverStyles',styles);
            //
            //     // $('#map').usmap('trigger', usstateAbbr, 'mouseout', event);
            // }, 3000);

        } else {
            // stateCount += 1;
            styles = {};

            styles[usstateAbbr] = {fill:correctColor };

            // Use new method to set the stateSpecificStyles property

            $('#map').usmap('stateSpecificHoverStyles',styles);
            $('#map').usmap('trigger', usstateAbbr, 'mouseover', event);
        }

        //'stateHoverStyles': {fill: 'dodgerblue'},
        // .css('backgroundColor', 'red');
    }
}

function reloader() {
    location.reload(true);  // hard reload including .js and .css files

}

function demo(game) {
    console.log('demo game ' + game);
    clearMap('all');

    if (game == 'coast to coast') {

        setTimeout(function(){
            updateMapList('', ['Maine','New Hampshire','Massachusetts','Rhode Island', 'Connecticut','New York',
                'New Jersey', 'Delaware','Maryland','Virginia', 'North Carolina', 'South Carolina', 'Georgia', 'Florida'
            ], true, true);
        }, 3500);

        setTimeout(function(){
            updateMapList('', ['California', 'Oregon', 'Washington'
            ], true, true);
        }, 4800);

        setTimeout(function(){  clearMap('all'); }, 7000);

        var myList = ['New Jersey', 'Pennsylvania','Ohio', 'Indiana','Illinois','Iowa',
                        'Nebraska','Colorado','Utah','Idaho','Washington'];
        for (var i = 0; i < myList.length; i++) {

            doSetTimeout(8500, i, myList);

        }
        setTimeout(function(){  clearMap('all'); }, 17000);

    }
    if (game == 'bigger pop') {

        var myList = ['Wyoming', 'Nebraska','Kansas', 'Missouri','Illinois'];
        for (var i = 0; i < myList.length; i++) {

            doSetTimeout(12000, i, myList);

        }
        setTimeout(function(){  clearMap('all'); }, 20000);

    }

}

function doSetTimeout(delay, x, list) {
    // setTimeout(function() { alert(i); }, 100);
    setTimeout(function(){ updateMapList(list[x], list.slice(0,x), true, false ); }, delay + (x * 700) );
}

// USAGE:
// abbrState('ny', 'name');
// --> 'New York'
// abbrState('New York', 'abbr');
// --> 'NY'

const states = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arizona', 'AZ'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
];

function abbrState(input, to){



    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }
        return('not found');

    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }
    }
}

function shadeColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}