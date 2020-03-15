import express from 'express';
import connectDB from '../dbmongo.js';
import user from '../controller/user.js';
import account from '../controller/account.js';
import channel from '../controller/channel.js';
import message from '../controller/message.js';

const router = express();

connectDB((db) => {
  router.use('/users', user({ db }));
  router.use('/accounts', account({ db }));
  router.use('/channels', channel({ db }));
  router.use('/messages', message({ db }));
});

export default router;
