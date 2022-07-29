const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/TourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to Mongo'))
  .catch(() => console.log('Error Connecting to Mongo'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const reseed = async () => {
  try {
    console.log('Data Seeding Started');
    await Tour.create(tours);
    console.log('Data Successfully Loaded');
  } catch (err) {
    console.log(err);
  }
};

const wipeDB = async () => {
  try {
    console.log('Wiping Data...');
    await Tour.deleteMany();
    console.log('Data Wipe Complete');
  } catch (err) {
    console.log('Delete many failed');
  }
};

if (process.argv[2] === '--import') {
  reseed();
  process.exit();
} else if (process.argv[2] === '--delete') {
  wipeDB();
  process.exit();
} else if (process.argv[2] === '--reseed') {
  wipeDB()
    .then(() => reseed())
    .then(() => process.exit())
    .catch((err) => {
      console.log('Reseed Failed', err);
      process.exit();
    });
} else if (process.argv[2] === '--dataCheck') {
  const checkFor = ['maxGroupSize', 'imageCover', 'description'];

  const entries = [];

  tours.forEach((tour) => {
    checkFor.forEach((check) => {
      if (!Object.keys(tour).includes(check)) {
        entries.push({ tourId: tour.id, missing: check });
      }
    });
  });

  console.log(entries);
}
