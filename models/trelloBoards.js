import mongoose from 'mongoose';

module.exports = () => {
  const schema = new mongoose.Schema({
    title: {type: String, trim: true},
    trelloBoardId: {type: String, trim: true, required: true},
    lastUpdatedDate: {type: Date, required: true}
  });
  return mongoose.model('trelloBoards', schema);
};

