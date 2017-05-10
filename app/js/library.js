//carousel
$('#slider').carousel();

// blocks height
setEqualHeight($(".b-card"));
$( window ).resize(function() {
    setEqualHeight($(".b-card"));
});

// easing for animate counter
$.extend($.easing, {
    // This is ripped directly from the jQuery easing plugin (easeOutExpo), from: http://gsgd.co.uk/sandbox/jquery/easing/
    spincrementEasing: function (x, t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    }
})
// function counter
function counterNumber(to, className){
    $({numberValue: 0}).animate({numberValue: to}, {
        duration: 4000,
        easing: 'spincrementEasing',
        step: function() {
            className.text(Math.ceil(this.numberValue));
        }
    });
};

//function blocks height
function setEqualHeight(columns) {
    var tallestcolumn = 0;
    columns.each(
        function()
        {
            var currentHeight = $(this).height();
            if(currentHeight > tallestcolumn)
            {
                tallestcolumn = currentHeight;
            }
        }
    );
    columns.height(tallestcolumn);
}

