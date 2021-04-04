const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const sellerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    }
});

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    sellers: [ sellerSchema ]
},{
    timestamps: true
});

var Books = mongoose.model('Book', bookSchema);

module.exports = Books;