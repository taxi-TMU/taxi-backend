const Question = require('../models/questionModel')


exports.create_question = async (req, res) => {
    const { language, question_text } = req.body
    console.log("arrived")
    try {
        const createdQuestion = await Question.create({ 
            language, question_text 
        })
        res.json(createdQuestion)
    } catch (e) {
        res.status(500).send('Error while creating the question')
    }
}


exports.find_question = async (req, res) => {
    const { id } = req.params
    try {
      const target = await Question.findById(id)
      if (!target) return res.status(404).send('No such question')
      res.json(target)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }

exports.list_questions = async (req, res) => {
    try {
      const allQuestions = await Question.find({})
      res.json(allQuestions)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }