import mongoose from 'mongoose';

module.exports = () => {
    const schema = new mongoose.Schema({
        entryType: {type: String, trim: true, required: true},
        question: [{
            questionId: String,
            question: String,
            response: String,
            notes: String
        }],
        notes: String
    });
    return mongoose.model('journalEntries', schema);
};

