const Training = require('../models/trainingModel')


exports.create_training = async (req, res) => {
    const { user, simulation, time_start, time_end, question_set } = req.body
    try {
        const createdTraining = await Training.create({ 
            user, simulation, time_start, time_end, question_set
        })
        res.json(createdTraining)
    } catch (e) {
        res.status(500).send('Error while creating the training')
    }
}


exports.get_training = async (req, res) => {
    const { id } = req.params
    try {
      const target = await Training.findById(id)
      if (!target) return res.status(404).send('No such training')
      res.json(target)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }

exports.get_trainings = async (req, res) => {
    try {
      const allTrainings = await Training.find({})
      res.json(allTrainings)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }