import mongoose from 'mongoose';

const dbConnection = async () => {
  return await mongoose
    .connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017')
    .then(() => {
      console.log('.......DataBase is connected.......');
    })
    .catch((err: any) => {
      console.log(`.......DataBase error...${err}....`);
    });
};

export { dbConnection };
