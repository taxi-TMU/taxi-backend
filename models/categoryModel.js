const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = mongoose.Schema.Types;

const categorySchema = new Schema({
  name: {
    type: String, min: 2, max: 50, required: true, unique: true,
  },
  sub_categories: [{ type: ObjectId, ref: 'SubCategory' }],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
