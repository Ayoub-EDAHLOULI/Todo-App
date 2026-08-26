const mongoose = require('mongoose')
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)


//Connect to the database
const dbConnection = async () => {
    try{
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
          .then(() => console.log('Connected to the database 🌍!'))
          .catch((err)=> console.log(err, 'the database is not connected'));

    }catch(err){
        console.log(err);
    }
}

module.exports = {dbConnection}