const SubCategory = require('../models/subCategoryModel')


exports.create_sub_category = async (req, res) => {
    const { name, category, questions } = req.body
    try {
        const createdCategory = await SubCategory.create({ 
          name, category, questions
        })
        res.json(createdCategory)
    } catch (e) {
        res.status(500).send(e.message)
    }
}


exports.get_sub_category = async (req, res) => {
    const { id } = req.params
    try {
      const target = await SubCategory.findById(id)
      if (!target) return res.status(404).send('No such subCategory')
      res.json(target)
    } catch (e) {
      res.status(500).send(e.message)
    }
}


exports.get_sub_categories = async (req, res) => {
  try {
    const allSubCategories = await SubCategory.find({})
    res.json(allSubCategories)
  } catch (e) {
    res.status(500).send(e.message)
  }
}