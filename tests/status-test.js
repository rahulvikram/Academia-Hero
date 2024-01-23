function randomActivity(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

function randomLink(obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

const activities = {
  "Multivariable Calculus": "nIJQPX5kxp4",
  "Data Structures & Algorithms": "8hly31xKli0",
  "Organic Chemistry Compounds":"asdf",
  "Intro to Circuit Boards":"fafasdfsdf",
  "Convolutional Neural Networks":"2gq3refdg",
  "Intro to Fluid Mechanics":"fb98b3904",
  "Ordinary Differential Equations":"fp2938n3290f"
};


var activity = randomActivity(activities);
var link = randomLink(activities);

console.log(activity);
console.log(link);