import {getCards} from '../api-client/trelloClient';

module.exports = app => {

    const Cards = app.models.cards;

    app.get('/cards', (req, res) => {

        getCards().then((data) => res.json(data))
            .catch((err) => res.status(412).json(err))

        getCards().then((data) => res.json(data))
            .catch((err) => res.status(412).json(err))

    });

    app.get('/cards_old', (req, res) => {
        Cards.find({}, (err, cards) => {
            if (err) {
                return res.status(412).json(err);
            }
            return res.json(cards);
        });
    });

    app.get('/cards/:taskId', (req, res) => {
        const {taskId} = req.params;
        Cards.findById(taskId, (err, task) => {
            if (err) {
                return res.status(412).json(err);
            }
            if (task) {
                return res.json(task);
            }
            return res.status(404).end();
        });
    });



    /*    app.post('/cards', (req, res) => {
     const task = req.body;
     Cards.create(task, (err, newTask) => {
     if (err) {
     return res.status(412).json(err);
     }
     return res.json(newTask);
     });
     });

     app.put('/cards/:taskId', (req, res) => {
     const { taskId } = req.params;
     const task = req.body;
     Cards.update({ _id: taskId }, { $set: task }, (err) => {
     if (err) {
     return res.status(412).json(err);
     }
     Cards.findById(taskId, (findErr, newTask) => {
     if (findErr) {
     return res.status(412).json(err);
     }
     return res.json(newTask);
     });
     return true;
     });
     });

     */

};
