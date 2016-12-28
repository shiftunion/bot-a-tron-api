import {getCards, getLastActivityForTrelloBoard} from '../api-client/trelloClient';
import {getAllTrelloCardsAsBotCards} from '../models/dataHelper';

module.exports = (app) => {

    const Cards = app.models.cards;

    app.get('/bot/:msg', (req, res) => {

        const message = req.params.msg;

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

    //
    // async function mainFlow(trelloBoardId) {
    //   let myDate = await getLastActivityForTrelloBoard(trelloBoardId);
    //
    //
    //   console.log('mydate:' + myDate);
    //   return myDate;
    //}

    app.get('/cards', async(req, res) => {

        let trelloBoardId = '584495469e2a4453b033996d';
        let latestRemoteTrelloDate = await getLastActivityForTrelloBoard(trelloBoardId);
        let fullRemoteDataRefreshRequired = await getAndUpdateLastUpdatedDate(trelloBoardId, latestRemoteTrelloDate);

        if (fullRemoteDataRefreshRequired) {
            let data = await getAllTrelloCardsAsBotCards(trelloBoardId);
            await CheckMongoAndUpdateAllCardsToIt(data);
        }

        await Cards.find({}, function (err, cards) {
            return res.json(cards);
        })
    });

    app.get('/cards/random/:requestedCount', async(req, res) => {

        let randomCards = [];
        let alreadyUsed = [];

        let reqCount = req.params.requestedCount;

        let docCount = await Cards.count().exec();

        if (reqCount > docCount) reqCount = docCount;

        for (let step = 0; step < reqCount; step++) {
            let random = Math.floor(Math.random() * docCount);
            while (alreadyUsed.includes(random)) { //keep generating a new random number
                random = Math.floor(Math.random() * docCount);
            }

            alreadyUsed.push(random);

            await Cards.findOne().skip(random).exec(
                function (err, result) {
                    randomCards.push(result);
                });
        }
        return res.json(randomCards);
    });


    async function CheckMongoAndUpdateAllCardsToIt(data) {
        let i = 0;
        for (let card of data) {
            i = i + 1;
            await FindCardInMongo(card)
                .then((existingCard) => {
                    if (existingCard) {
                        Cards.findByIdAndUpdate(existingCard._id, card)
                            .catch(err => console.log(`error updating mongo card: ${err}`));
                    }
                    else {
                        Cards.create(card)
                            .catch(err => console.log(`error creating a mongo card: ${err}`));

                    }
                })
        }
    }

    async function FindCardInMongo(card) {
        let query = Cards.findOne({'trelloCardId': card.trelloCardId});
        return await query
            .exec()
            .catch(err => console.log(`error updating mongo card in FindCardInMongo: ${err}`))
    }

    async function getAndUpdateLastUpdatedDate(trelloBoardId, lastRemoteTrelloUpdateDate) {

        const trelloBoards = app.models.trelloBoards;

        let fullRemoteDataRefreshRequired = true;

        await trelloBoards.findOne({'trelloBoardId': trelloBoardId})
            .exec()
            .then((doc) => {
                if (doc) {

                    let localLastModDate = Date.parse(doc.lastUpdatedDate);
                    let remoteLastModDate = Date.parse(lastRemoteTrelloUpdateDate);

                    // console.log('local date : ' + localLastModDate + ' --- remote date: ' + remoteLastModDate);

                    if (localLastModDate < (remoteLastModDate - 1000)) {
                        // we have new data, so save to Mongo
                        trelloBoards.findByIdAndUpdate(doc._id, {
                            'trelloBoardId': trelloBoardId,
                            'lastUpdatedDate': remoteLastModDate
                        })
                            .exec()
                            .catch(err => console.log(`error updating mongo 3 TrelloBaord: ${err}`))
                    }
                    else {
                        fullRemoteDataRefreshRequired = false;
                    }
                }
                else {
                    trelloBoards.create({
                        'trelloBoardId': trelloBoardId,
                        'lastUpdatedDate': lastRemoteTrelloUpdateDate
                    });
                    /*  .exec()
                     .catch(err => console.log(`error creating a mongo 1 TrelloBaord: ${err}`));*/
                    fullRemoteDataRefreshRequired = true;
                }
            })
            .catch(err => console.log(`error updating mongo 2 TrelloBoard: ${err}`));

        return fullRemoteDataRefreshRequired;
    }
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

