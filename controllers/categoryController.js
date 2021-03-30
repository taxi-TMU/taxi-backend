const Category = require('../models/categoryModel')


exports.create_category = async (req, res) => {
    const { name, sub_categories } = req.body
    try {
        const createdCategory = await Category.create({ 
            name, sub_categories
        })
        res.json(createdCategory)
    } catch (e) {
        res.status(500).send('Error while creating the category')
    }
}


exports.find_category = async (req, res) => {
    const { id } = req.params
    try {
      const target = await Category.findById(id)
      if (!target) return res.status(404).send('No such category')
      res.json(target)
    } catch (e) {
      res.status(500).send(e.message)
    }
}


exports.list_categories = async (req, res) => {
    try {
      const allCategories = await Category.find({})
      res.json(allCategories)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }