const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');

indexRouter.get('/', indexController.indexGet);

indexRouter.get('/post', indexController.postGet);
indexRouter.post('/post', indexController.postPost);
indexRouter.get('/:postId/del-post', indexController.postDel);

module.exports = indexRouter;
