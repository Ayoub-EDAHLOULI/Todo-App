const app = require('./index')
require('dotenv').config()
const port = process.env.PORT || 5000
const hostman = process.env.HOST || '127.0.0.1'
const DB = require('./dbServer/dbConnect')


DB.dbConnection();


app.listen(port, hostman, () => {
    console.log(`App is listning on port => http://${hostman}:${port}`);
})