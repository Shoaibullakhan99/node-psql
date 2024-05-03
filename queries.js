//Creating a pool of connection to database so that the 
//client does not make subsequent requests to server every time it tries to communicate.

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'TEST_ROLE',
    host: 'localhost',
    database: 'api',
    password: 'ssauto',
    port: 5432,
})


//Creating all the required routes.

//Get all Users.
//  api endpoint : '/users'
const getUsers = (request, response) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, result) => {
        if( error ) throw error;
        response.status(200).json(result.rows);
    })
}

//Get user by ID.
// api endpoit :  '/users/:id'
const getUserById = (request, response) => {
    const id = parseInt(request.params.id);
    // In the SQL query, we’re looking for id=$1. In this instance, 
    // $1 is a numbered placeholder that PostgreSQL uses natively instead of the ?
    pool.query("SELECT * FROM users where id = $1", [id] , (error, result) => {
        if( error ) throw error;
        response.status(200).json(result.rows);
    })
}

//Post a new user
//api endpoint /users
const createUser = (request, response) => {
    const {name, email} = request.body;

    pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", 
    [name, email], 
    (error, result) => {
        if( error ) throw error;
        response.status(200).json(`User added with ID: ${result.rows[0].id}`);
    })
}

//Update existing user's data
// api endpont : '/users/:id'
const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const {name, email} = request.body;

    pool.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3",
        [name, email, id],
        (error, result) => {
            if ( error ) throw error;
            response.status(200).json(`User modified with ID ${id}`)
        }
    )
}

//Delete the user
// api endpoint : '/users/:id'
const deleteUser = (request,response) => {
    const id = parseInt(request.params.id);

    pool.query("DELETE FROM users WHERE id= $1", [id], ( error, result ) => {
        if( error ) throw error;
        response.status(200).json(`User with id ${id} deleted successfully`);
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}