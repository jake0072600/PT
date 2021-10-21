$("#age").slider({
    value:20,
    min: 15,
    max: 99,
    step: 1,
    slide: function( event, ui ) {
        //$( "#amount" ).val( "$" + ui.value );
    }
});