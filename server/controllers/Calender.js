const models = require('../models');

const {
  Calender,
} = models;

const makerPage = (req, res) => {
  Calender.CalenderModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occurred',
      });
    }

    return res.render('app', {
      csrfToken: req.csrfToken(),
      calenders: docs,
    });
  });
};

const makeCalender = (req, res) => {
  if (!req.body.activity || !req.body.date || !req.body.level) {
    return res.status(400).json({
      error: 'Error! All three fields are required',
    });
  }

  const calenderData = {
    activity: req.body.activity,
    date: req.body.date,
    priorityLevel: req.body.level,
    owner: req.session.account._id,
  };

  const newCalender = new Calender.CalenderModel(calenderData);

  const calenderPromise = newCalender.save();

  calenderPromise.then(() => res.json({
    redirect: '/maker',
  }));

  calenderPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Activity already exists.',
      });
    }

    return res.status(400).json({
      error: 'An error occurred',
    });
  });

  return calenderPromise;
};

const getCalenders = (request, response) => {
  const req = request;
  const res = response;

  return Calender.CalenderModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occurred',
      });
    }

    return res.json({
      calenders: docs,
    });
  });
};

const deleteCalender = (req, res) => Calender.CalenderModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({
      error: 'An error occurred',
    });
  }
  Calender.CalenderModel.deleteMany({
    owner: req.session.account._id,
  }, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('successfully delete');
    }
  });


  return res.json({
    calenders: docs,
  });
});

module.exports.makerPage = makerPage;
module.exports.getCalenders = getCalenders;
module.exports.make = makeCalender;
module.exports.deleteCalender = deleteCalender;
