import { getCards, getAttachments } from '../api-client/trelloClient';

export function getAllTrelloCardsAsBotCards(trelloBoardId) {

  let refinedData = null;

  return getCards(trelloBoardId)
    .then((data) => mapDataFormats(data))
    .then((data) => appendAttachments(data))
    .catch((err) => {
      throw ('could not achieve the mapping you wanted: ' + err)
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

  /** @description Calls trello API to get every attachment for a card 
   * */
  function appendAttachments(data) {
    // Todo: consider optimising this to not call for every card
    let promises = [];
    for (let card of data) {
      promises.push(getAttachments(card.trelloCardId)
      );
    }
    return Promise.all(promises).then((attachData) => insertIntoData(attachData))
  }

  /** @description takes an array of trello attachment objects and enriches refined data variable in the closure
   * */
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










