import { getCards, getAttachments } from '../api-client/trelloClient';

export function getAllTrelloCardsAsBotCards() {

  /*
   * - iterate through each card, check mongo, and if it's changed, then update it.
   * */

  var refinedData = null;

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

    refinedData = result;
    return result;
  }

  function appendAttachments(data) {
    let promises = [];
    for (let card of data) {
      promises.push(getAttachments(card.trelloCardId)
      );
    }
    return Promise.all(promises).then((attachData) => insertIntoData(attachData))
  }

  function insertIntoData(attachData) {

    for (let card of refinedData) {
      for (let arItem of attachData)
        if (card.trelloCardId === arItem.trelloCardId) {
          card['attachments'] = arItem;
        }
    }
    return refinedData;
  }
}










