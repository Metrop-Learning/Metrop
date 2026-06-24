//Code from https://github.com/ante87/dottedWorldMap
function openSvg() {
    document.querySelector('.content').innerHTML=svg;
    centerSvg();
    window.addEventListener('resize', centerSvg );
    animate();
    document.addEventListener('animationend', animate);
}

function centerSvg() {
    var containerDOM = document.querySelector('.content');
    var svgElement = document.querySelector('svg');
    var offset = (containerDOM.clientWidth - svgElement.clientWidth) / 2;
    svgElement.setAttribute("style", "left:" + offset + "px;");
}

function animate(event) {
    var domElement = event ? event.target : null;
    if (domElement != null) {
        domElement.removeAttribute('class');
    }

    var oldStyles = document.getElementsByTagName('style');
    for (var i=0, max = oldStyles.length; i < max; i++) {
        oldStyles[i].parentNode.removeChild(oldStyles[i]);
    }

    var circles = document.querySelectorAll('circle');
    var randomNumber = Math.floor(Math.random() * circles.length)
    var circle = circles[randomNumber];

    var svg = circle.parentNode;
    svg.removeChild(circle);
    svg.appendChild(circle);

    var color = [81,81,227,0.8]
    var radius = 15 + Math.floor((Math.random() * 30));
    var css = '@keyframes blink {' +
            '0%   { transform: scale(1); }' +
            '30%  { transform: scale(' + (radius / 5.5) + '); }' +
            '100% { transform: scale(1); }' +
          '}' +
          '.animate {' +
            'fill: rgba(' + color.join(',') + ');' +
            'animation: blink 1s;' +
            'transform-box: fill-box;' +    /* ← origine relative au cercle */
            'transform-origin: center;' +   /* ← centre du cercle */
          '}';

    head = document.head || document.getElementsByTagName('head')[0];
    style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);

    circle.setAttribute('class', 'animate');
}