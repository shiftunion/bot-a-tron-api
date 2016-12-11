import mongoose from 'mongoose';

module.exports = () => {
    const schema = new mongoose.Schema({
        title: {type: String, trim: true, required: true},
        listName: {type: String, trim: true, required: true},
        description: {type: String, trim: true},
        attachmentsUrl: [{url: String, attachType: String}],
    });
    return mongoose.model('cards', schema);
};

