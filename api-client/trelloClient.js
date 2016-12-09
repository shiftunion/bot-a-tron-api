import Trello from 'node-trello'

/* @flow */

export const getCards = () => {

    const t = new Trello("7881ebf3a03c1f99c3da84dac9c298d0", "3ec4373ca2ae3d7286634f1af50011dfdab7bc2d8242df39842bd664be7ded2e");

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

