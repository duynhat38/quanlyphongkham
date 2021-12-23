var mongoose = require('mongoose');
const config = require('./../config');

//Thiết lập một kết nối mongoose mặc định
var mongoDB = config.mongoDB;
mongoose.connect(mongoDB);
//Ép Mongoose sử dụng thư viện promise toàn cục
mongoose.Promise = global.Promise;
//Lấy kết nối mặc định
var db = mongoose.connection;
//Ràng buộc kết nối với sự kiện lỗi (để lấy ra thông báo khi có lỗi)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;