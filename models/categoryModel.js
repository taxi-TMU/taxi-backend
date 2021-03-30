const mongoose = require('mongoose');

const Schema = mongoose.Schema

const ObjectId = mongoose.Schema.Types.ObjectId;

const categorySchema = new Schema({
    name: { type: String, min: 2, max: 50, required: true, unique: true },
    sub_categories: [{ type: ObjectId, ref: 'SubCategory', required: true }],

})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category;
