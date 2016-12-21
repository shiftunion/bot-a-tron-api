import { getCards, getLastActivityForTrelloBoard, getLastActivityForTrelloBoardSync } from '../api-client/trelloClient';
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

    let trelloBoardId = '584495469e2a4453b033996d';

    const message = req.params.msg;

    // Todo: Make the overall promise parent return the Mongo data
    // Fork (if) the path to take a route based on what it needs to do.. If the date is good..
    // OR just call trello without a promise... syncronously!
    // OR let the higher order promises return Rich objects with statuses
   
    var func1 = function(err, data) {
      if (err)
        throw ('fuck-- trello error: ' + err)
      if (data === '2016-12-17T19:07:38.912Z')
      { 
        return; }

console.log('date:' + data._value)

      getAllTrelloCardsAsBotCards(trelloBoardId)
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
        var query = Cards.findOne({ 'trelloCardId': card.trelloCardId });
        return query
          .exec()
          .then((doc) => {
            if (doc) console.log("found card: " + doc._id);
            else console.log("no card found: " + card.trelloCardId);
            return doc
          })
          .catch(err => console.log(`error updating mongo card in FindCardInMongo: ${err}`))

      }


      // Todo: Work out what this is doing
      function GetAndUpdateLastUpdatedDate(trelloBoardId, lastTrelloUpdateDate) {

        const trelloBoards = app.models.trelloBoards;

        var query = Cards.findOne({ 'trelloBoardId': trelloBoardId });
        return query
          .exec()
          .then((doc) => {
            if (doc) {
              if (doc.lastUpdatedDate < lastTrelloUpdateDate) {
                trelloBoards.findByIdAndUpdate(doc._id, {
                  'trelloBoardId': trelloBoardId,
                  'lastUpdatedDate': lastUpdateDate
                })
                  .exec()
                  .then((doc) => {
                    console.log("card updated: " + doc._id);
                    return true; // a mongo refresh is required
                  })
                  .catch(err => console.log(`error updating mongo card: ${err}`))
              }
              return false; // no mongo refresh is required
            }
            else {
              trelloBoards.create({ 'trelloBoardId': trelloBoardId, 'lastUpdatedDate': lastUpdateDate })
                .exec()
                .then((doc) => {
                  console.log("card created: " + doc._id);
                  return true; // a mongo refresh is required
                })
                .catch(err => console.log(`error creating a mongo card: ${err}`))
            }
            return true; // a mongo refresh is required
          })
          .catch(err => console.log(`error updating mongo card in FindCardInMongo: ${err}`))
      }
    }

  getLastActivityForTrelloBoardSync(trelloBoardId, func1)


  })
};




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

