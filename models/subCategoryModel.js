const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

const subCategorySchema = new Schema({
    name: { type: String, min: 2, max: 50, required: true, unique: true },
    category: { type: ObjectId, ref: 'Category', required: true },
    questions: [{ type: ObjectId, ref: 'Question' }],
})

const SubCategory = mongoose.model('SubCategory', subCategorySchema)

module.exports = SubCategory;
