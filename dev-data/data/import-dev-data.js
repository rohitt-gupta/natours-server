const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const Tour = require('./../../models/tourModel')

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('DB conncetion successful'));

// READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//IMPORT DATA INTO DATABASE
const importData = async () => {

    try {
        await Tour.create(tours);
        console.log("Data successfulky loaded!!");

    } catch (error) {
        console.log(error);
    }
    process.exit()

}

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log("Data successfulky deleted!!");
        // process.exit()
    } catch (error) {
        console.log(error);
    }
    process.exit()
}


if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
    console.log("hello delete");
    deleteData();
}

console.log(process.argv);