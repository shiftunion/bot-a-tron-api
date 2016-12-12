import mongoose from 'mongoose';

module.exports = () => {
  const schema = new mongoose.Schema({
    title: {type: String, trim: true, required: true},
    description: {type: String, trim: true},
    listName: {type: String, trim: true, required: true},
    trelloCardId: {type: String, trim: true},
    attachments: [{id: String, url: String, name: String, mimeType: String}],
  });
  return mongoose.model('cards', schema);
};

