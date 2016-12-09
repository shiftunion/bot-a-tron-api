import Trello from "node-trello";

export const getCards = () => {

  const t = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_USER_TOKEN);

  /*

   t.get("/1/members/me", function(err, data) {
   if (err) throw err;
   console.log(data);
   });

   // URL arguments are passed in as an object.
   t.get("/1/members/me", { cards: "open" }, function(err, data) {
   if (err) throw err;
   console.log(data);
   });

   */

  let boardId = '584495469e2a4453b033996d';
  let url = '1/boards/' + boardId + '/lists?cards=open&fields=name&card_fields=desc,badges,name,id';


  return new Promise(
    (resolve, reject) => {
      t.get(url, {cards: "open"}, function (err, data) {
        if (err) reject(err);
        console.log(data);
        resolve(data);
      });
    }
  );
};

