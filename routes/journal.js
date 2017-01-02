module.exports = app => {
    const Journal = app.models.journalEntries;

    app.get('/journal', (req, res) => {
        Journal.find({}, (err, journal) => {
            if (err) {
                return res.status(412).json(err);
            }
            return res.json(journal);
        });
    });

    app.get('/journal/:taskId', (req, res) => {
        const { taskId } = req.params;
        Journal.findById(taskId, (err, task) => {
            if (err) {
                return res.status(412).json(err);
            }
            if (task) {
                return res.json(task);
            }
            return res.status(404).end();
        });
    });

    app.post('/journal', (req, res) => {
        const task = req.body;
        Journal.create(task, (err, newEntry) => {
            if (err) {
                return res.status(412).json(err);
            }
            return res.json(newEntry);
        });
    });

    app.put('/journal/:taskId', (req, res) => {
        const { taskId } = req.params;
        const task = req.body;
        Journal.update({ _id: taskId }, { $set: task }, (err) => {
            if (err) {
                return res.status(412).json(err);
            }
            Journal.findById(taskId, (findErr, newTask) => {
                if (findErr) {
                    return res.status(412).json(err);
                }
                return res.json(newTask);
            });
            return true;
        });
    });

    app.delete('/journal/:taskId', (req, res) => {
        const { taskId } = req.params;
        Journal.findByIdAndRemove(taskId, (err) => {
            if (err) {
                return res.status(412).json(err);
            }
            return res.status(204).end();
        });
    });
};
