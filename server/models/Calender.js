const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let CalenderModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CalenderSchema = new mongoose.Schema({
  activity: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  date: {
    type: String,
    min: 0,
    required: true,
  },

  priorityLevel: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

CalenderSchema.statics.toAPI = (doc) => ({
  activity: doc.activity,
  date: doc.date,
  priorityLevel: doc.priorityLevel,
});

CalenderSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CalenderModel.find(search).select('activity date priorityLevel').lean().exec(callback);
};

CalenderModel = mongoose.model('Calender', CalenderSchema);

module.exports.CalenderModel = CalenderModel;
module.exports.CalenderSchema = CalenderSchema;
