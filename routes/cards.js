import { getCards } from '../api-client/trelloClient';
import { getAllTrelloCardsAsBotCards } from '../models/dataHelper';

module.exports = (app) => {

  const Cards = app.models.cards;

  app.get('/bot', (req, res) => {

    getCards().then((data) => res.json(data))
      .catch((err) => res.status(412).json(err));
  });


  app.get('/cards_old', (req, res) => {
    Cards.find({}, (err, cards) => {
      if (err) {
        return res.status(412).json(err);
      }
      return res.json(cards);
    });
  });

  app.get('/bot/:msg', (req, res) => {

    const message = req.params.msg;

    getAllTrelloCardsAsBotCards()
      .then((data) => CheckMongoAndUpdateAllCardsToIt(data))
      .then((data) => res.json(data))
      .catch((err) => res.status(412).json(err));


    function CheckMongoAndUpdateAllCardsToIt(data) {

      for (let card of data) {

        FindCardInMongo(card)
          .then((existingCard) => {
            if (existingCard) {
              Cards.findByIdAndUpdate(existingCard._id, card)
                .exec()
                .then((doc) => {
                  console.log("card updated: " + doc._id);
                  return doc
                })
                .catch(err => console.log(`error updating mongo card: ${err}`))
            }
            else {
              Cards.create(card)
                .exec()
                .then((doc) => {
                  console.log("card created: " + doc._id);
                  return doc
                })
                .catch(err => console.log(`error creating a mongo card: ${err}`))
            }
          })
      }
      return data;
    }

    function FindCardInMongo(card) {
      var query = Cards.findOne({'trelloCardId': card.trelloCardId});
      return query
        .exec()
        .then((doc) => {
          console.log("card updated: " + doc._id);
          return doc
        })
        .catch(err => console.log(`error updating mongo card: ${err}`))

    }
  })
};


/* function CheckMongoAndUpdateAllCardsToIt(data) {

 for (let card of data) {

 Cards.find({trelloCardId: card[trelloCardId]}, (err, cards) => {
 if (err) {
 console.log(err);
 //return res.status(412).json(err);
 throw("big error 64 " + err)
 }
 if (cards) {
 console.log('123');
 Cards.update({trelloCardId: cards[0].trelloCardId}, {$set: cards[0]}, (err) => {
 if (err) {
 throw("big error 65 " + err);
 //return res.status(412).json(err);
 }
 })
 }
 else {
 console.log('234');
 Cards.create(card, (err, newCard) => {
 if (err) {
 throw("big error 66 " + err);
 }
 console.log(newCard);
 })
 }
 }
 )
 }
 }*/



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

