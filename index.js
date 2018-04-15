import app from './app';

const port = process.env.PORT || 3000;
app.listen(port, () => global.logger.info(`splitTasks is listening on port ${port}`));
