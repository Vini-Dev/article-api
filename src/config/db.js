import mongoose from 'mongoose';

const mongo = async () => {
  return mongoose
    .connect(`mongodb://mongo:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('Erro on connect DB', err));
};

export default {
  mongo,
};
