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

const Seller = mongoose.model('seller', sellerSchema);

module.exports = Seller;