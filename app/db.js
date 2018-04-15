import mongoose from 'mongoose';

const dbURI = process.env.MONGO_URL || 'mongodb://localhost/splitTasks';
mongoose.connect(dbURI);
mongoose.connection.once('open', () => global.logger.info(`Mongoose connect to ${dbURI}`));
mongoose.connection.on('error', () => global.logger.info(`Mongoose failed to connect to ${dbURI}`));
