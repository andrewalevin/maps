

const centerMap = [36.7109, 55.6773];

const zoomMap = 11;

const styleMap = 'mapbox://styles/mapbox/satellite-streets-v12';

const pitchMap =  80;

const bearingMap =  240;

const rangeFog = [-0.5, 2];

let animationDuration = 10000;

const getAltitude = tan;

function linear(x, high=900000, low=300000) {
    return high * (1 - x) + low;
}

function median(x, start=2000, end=2000) {
    return 0.5 * (start + end);
}


function atan(x, start=900000, end=300000) {
    return   0.5 * (end - start) * Math.atan(x - 0.5) / Math.atan(0.5) + 0.5 * (start + end);
}



function descend(x, high=900000, low=300000) {
    return high * (1 - x) + low;
}

function tan(x, high=900000, low=100000) {
    if (x<0.5)
        return -high * Math.tan(x - 0.5) + 0.5*high + low;
    else{
        return high * (1 - x) + low;
    }
}

function tanAndLinear(x, high=900000, low=100000) {
    if (x<0.5)
        return -high * Math.tan(x - 0.5) + 0.5*high + low;
    else{
        return high * (1 - x) + low;
    }
}

function logFunction(x, high=700000, low=200000) {
    x = x + 1
    if (x <= 0.5) {
        return high;
    } else if (x > 1 && x <= 1.5) {
        return 20000 * Math.log(1.5) / Math.log(x);
    } else if (x > 1.5 && x <= 2) {
        return 10000 * Math.log(2) / Math.log(x);
    } else {
        return low;
    }
}

function getAltitude1(x) {
    return -600000 * Math.log10(x+1) + 500000;
}