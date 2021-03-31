const Question = require('../models/questionModel')


exports.create_question = async (req, res) => {
    const { language, question_text, sub_category, answers } = req.body
    console.log("arrived")
    try {
        const createdQuestion = await Question.create({ 
            language, question_text, sub_category, answers
        })
        res.json(createdQuestion)
    } catch (e) {
        res.status(500).send(e.message)
    }
}


exports.get_question = async (req, res) => {
    const { id } = req.params
    try {
      const target = await Question.findById(id)
      if (!target) return res.status(404).send('No such entry')
      res.json(target)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }

exports.get_questions = async (req, res) => {
    try {
      const allQuestions = await Question.find({})
      res.json(allQuestions)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }