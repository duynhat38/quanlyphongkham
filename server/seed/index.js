const db = require('../db/connect');
const Users = require('../models/models.users');
const AllCodes = require('../models/models.allcodes');
const users = require('./users.json');
const allcodes = require('./allcodes.json');

// Import Sample Data In DB
const importData = async() => {
    try {
        await Users.create(users);
        await AllCodes.create(allcodes);
        console.log(`Data successfully imported`);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// Delete the data from DB
const deleteData = async() => {
    try {
        await Users.deleteMany();
        await AllCodes.deleteMany();
        console.log(`Data successfully deleted`);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '-i') {
    importData().then();
} else if (process.argv[2] === '-d') {
    deleteData().then();
}