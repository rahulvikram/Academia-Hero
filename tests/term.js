// data store to get enrollment_term.id from canvas api obj
const termDict = {
    "fall_2023": 7029,
    "winter_2024": 7030,
    "spring_2024": 7031,
    "fall_2024": 7032,
    "winter_2025": 7033,
    "spring_2025": 7034,
    "fall_2025": 7035,
    "winter_2026": 7036,
    "spring_2026": 7037,
    "fall_2026": 7038,
    "winter_2027": 7039,
    "spring_2027": 7040,
    "undefined": 0
}

// get the current enrollment term (necessary for correct retrieval of classes)
function getEnrollmentTerm(todayString) {
    let thisYear = todayString.slice(-4); // get this year based on today's string
    console.log(todayString);

    // create Date objects for term start and end dates
    const fallStart = Date.parse(`${"09/21"}/${thisYear}`);
    const fallEnd = Date.parse(`${"12/31"}/${thisYear}`);
    const winterStart = Date.parse(`${"01/01"}/${thisYear}`);
    const winterEnd = Date.parse(`${"03/20"}/${thisYear}`);
    const springStart = Date.parse(`${"03/21"}/${thisYear}`);
    const springEnd = Date.parse(`${"06/20"}/${thisYear}`);
    
    // today's Date object to be checked
    let checkString = Date.parse(todayString);

    // returns seasondict key based on today's date
    var seasonDictRef;
    if (checkString <= winterEnd && checkString >= winterStart) {
        seasonDictRef = `winter_${thisYear}`;    
    } else if (checkString <= fallEnd && checkString >= fallStart) {
        seasonDictRef = `fall_${thisYear}`;       
    } else if (checkString <= springEnd && checkString >= springStart) {
        seasonDictRef = `spring_${thisYear}`;       
    } else {
        seasonDictRef = 'undefined';   
    }

    return termDict[seasonDictRef]; // return the correct term code from predefined json object
}

// set today's date and get this year
const today = new Date()
let todayString = today.toLocaleString('en-US', { timeZone: 'UTC' }).split(',')[0]

getEnrollmentTerm(todayString)
module.exports = getEnrollmentTerm;