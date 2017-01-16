import mongoose from 'mongoose';

module.exports = () => {
  const schema = new mongoose.Schema({
    questionAnswerSetType: {type: String, trim: true, required: true},
    questions: [{
      questionId: String,
      question: String,
      response: String,
      notes: String,
      questionType: String
    }],
    notes: String
  });
  return mongoose.model('questionAnswerSets', schema);
};

