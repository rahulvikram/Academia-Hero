const { mysql } = require('mysql2')

const database = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: process.env['SQLPWD'],
  database: "testdb"
}

// establishes MySQL DB connection
const pool = mysql.createPool(database).promise() // uses promise API of mysql to use async await


// SQL SELECT: retrives list of existing user IDs in database for registration check
async function duplicateSearch(id) {
  const result = await pool.query(`
  SELECT id from users
  `)
  const ids = result[0].map((idobj) => idobj.id);
  return ids;
}

// SQL INSERT: inserts user metadata for user registration
async function insertUserData(id, firstname, lastname, email) {
  const result = await pool.query(`
  INSERT INTO Users (ID, FirstName, LastName, Email)
  VALUES (?, ?, ?, ?)
  `, [id, firstname, lastname, email])
  return result;
}

// fetch, manipulate, and use canvas API request data for user registration process
fetch("https://canvas.oregonstate.edu/api/v1/users/6561405/profile", {
  headers: {Authorization: `Bearer 1002~VKMLKOd8RyOFeGqwGOYJGjUdRX3Vnah8u4LUqd7RFFBO9H1EiQw93b1sGdxeBraa`}
})
.then((response) => {
  return response.json(); // parse response as JSON data
})
.then(async (data) => {
  let id = data['id'];
  const first_name = data['short_name'].split(' ')[0];
  const last_name = data['short_name'].split(' ')[1];
  const email = data['primary_email'];

  const ids = await duplicateSearch(id);
  if (!ids.includes(id)) { // if ID provided is unique (i.e. student is NOT registered in DB, then run registration insert statement)
    // register the user
    await insertUserData(id, first_name, last_name, email);
  }
  else {
    console.log(`${first_name} ${last_name} (${id}) is already registered.`)
  }
});
