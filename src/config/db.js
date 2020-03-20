import mongoose from 'mongoose';

const mongo = async () => {
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_CONTAINER,
    MONGO_DB,
  } = process.env;

  return mongoose
    .connect(
      `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CONTAINER}/${MONGO_DB}?authSource=admin`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Erro on connect DB', err));
};

export default {
  mongo,
};
