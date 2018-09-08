// https://newsignature.github.io/us-map/

$(document).ready(function() {
    $('#map').usmap({
        'stateStyles': {fill: 'whitesmoke', stroke:'tan'},
        'labelBackingStyles': {fill:'gainsboro', stroke:'tan', color:'blue' },

        'stateHoverStyles': {fill: 'dodgerblue'},

        'mouseoverState': {
            'HI' : function(event, data) {
                //return false;
            }
        },

        // 'click' : function(event, data) {
        //     $('#alert')
        //         .text('StateGame.  You clicked '+data.name+' on the map')
        //         // .parent().effect('highlight', {color: 'green'}, 2000)
        //         .stop()
        //         .css('backgroundColor', '#ff0') //
        //         .animate({backgroundColor: '#ddd'}, 1000); //
        // }
    })
        .css('width' , '70%')
        .css('height' , 'auto');


    $('#over-md').click(function(event){
        $('#map').usmap('trigger', 'MD', 'mouseover', event);
        $('#map').usmap('trigger', 'PA', 'mouseover', event);
    });

    $('#out-md').click(function(event){
        $('#map').usmap('trigger', 'MD', 'mouseout', event);
    });
});