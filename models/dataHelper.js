import { getCards, getAttachments } from '../api-client/trelloClient';

export function getAllTrelloCardsAsBotCards() {

  /*
   * - iterate through each card, check mongo, and if it's changed, then update it.
   * */


  return getCards()
    .then((data) => mapDataFormats(data))
    .then((data) => appendAttachments(data))
    .catch((err) => {
      throw('could not achieve the mapping you wanted: ' + err)
    });


  function mapDataFormats(data) {

    let result = [];

    for (let list of data) {

      for (let card of list.cards) {

        let newCard = {
          title: card.name,
          description: card.desc,
          listName: list.name,
          trelloCardId: card.id
        };
        result.push(newCard);
      }
    }

    return result;
  }
}

export function appendAttachments(data) {

  let promises = [];
  for (let card of data) {
    promises.push(getAttachments(card.trelloCardId))
  }

  Promise.all(promises)
    .then((attachArray, trelloCardId) => {
      return insertIntoData(attachArray, trelloCardId, data);
    })
    .catch((err) => {
      throw(' these are not the droids you are looking for => ' + err)
    });
  return data;

  /*  getAttachments(card.trelloCardId)
   .then((data) => {

   return {
   url: "https://mlab.com/",
   name: "mylink",
   mimeType: ""
   }
   })
   .catch((err) => {
   throw('could not achieve the droids you are looking for: ' + err)
   });
   }*/

  function insertIntoData(attachArray, trelloCardId, data) {

    console.log('trelloCardId: ' + trelloCardId);
    console.log('attachArray: ' + attachArray.count);
    for (let card of data) {

      if (card.trelloCardId === trelloCardId) {
        card['attachments'] = attachArray;
        console.log('match !! ');
      }
      console.log('card: ');
      console.log(card);
    }
    return data;
  }

}






