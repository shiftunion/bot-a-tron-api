module.exports = app => {
  const question = app.models.questionAnswerSets;

  app.get('/question', (req, res) => {
    question.find({}, (err, journal) => {
      if (err) {
        return res.status(412).json(err);
      }
      return res.json(journal);
    });
  });

  app.get('/question/:taskId', (req, res) => {
    const {taskId} = req.params;
    question.findById(taskId, (err, task) => {
      if (err) {
        return res.status(412).json(err);
      }
      if (task) {
        return res.json(task);
      }
      return res.status(404).end();
    });
  });

  app.post('/question', (req, res) => {
    const questionAnswerSet = req.body;
    question.create(questionAnswerSet, (err, newEntry) => {
      if (err) {
        return res.status(412).json(err);
      }
      return res.json(newEntry);
    });
  });

  app.put('/question/:taskId', (req, res) => {
    const {taskId} = req.params;
    const task = req.body;
    question.update({_id: taskId}, {$set: task}, (err) => {
      if (err) {
        return res.status(412).json(err);
      }
      question.findById(taskId, (findErr, newTask) => {
        if (findErr) {
          return res.status(412).json(err);
        }
        return res.json(newTask);
      });
      return true;
    });
  });

  app.delete('/journal/:taskId', (req, res) => {
    const {taskId} = req.params;
    question.findByIdAndRemove(taskId, (err) => {
      if (err) {
        return res.status(412).json(err);
      }
      return res.status(204).end();
    });
  });
};
