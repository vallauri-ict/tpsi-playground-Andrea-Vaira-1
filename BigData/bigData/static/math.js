'use strict';

let media = (values) => {
    let sum = values.reduce((acc, el) => acc + el, 0);
    return sum / values.length;
};

let stdDev = (values) => {
    let m = media(values);
    let sum = values.reduce((acc, el) => acc + Math.pow(el - m, 2), 0);
    return Math.sqrt(sum / values.length);
};

let min = (values) => {
    return values.reduce((acc, el) => acc < el ? acc : el, values[0]);
}

let max = (values) => {
    return values.reduce((acc, el) => acc > el ? acc : el, values[0]);
}

let median = (values) => {
    values.sort((a, b) => a - b);
    let mid = Math.floor(values.length / 2);
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}

let mode = (values) => {
    let map = new Map();
    values.forEach(el => {
        if (!map.has(el)) {
            map.set(el, 1);
        } else {
            map.set(el, map.get(el) + 1);
        }
    });
    let max = 0;
    let mode = null;
    map.forEach((value, key) => {
        if (value > max) {
            max = value;
            mode = key;
        }
    });
    return mode;
}

let range = (values) => {
    return max(values) - min(values);
}

