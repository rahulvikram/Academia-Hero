let fs = require("fs");

fetch('https://canvas.oregonstate.edu/api/v1/users/6561405/courses',{
    headers: {Authorization: 'Bearer 1002~1CLkFXujVzVnTkiFPi5p4peT9VsJKAJs8YeJleQyikb07K8fpOoxyZLkmm9n6vgS'}
})
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        fs.writeFile('tests/courses.json', JSON.stringify(json), (err) => {
            if (err) {
                throw new Error('Something went wrong.')
            }

            // if success
            console.log('JSON written to file.');
        })
    })
    .catch(err => console.error(err));


// gets course list and filters out undefined stuff
var obj = JSON.parse(fs.readFileSync('tests/courses.json', 'utf8'));
const courses = obj.map((course) => {
    if (course.name.includes("(")) {
        return course.name     
    }
}).filter((element) => {
    return element !== undefined;
});

console.log(courses)