const express = require('express');
const apiRouter = express.Router();
const employeesRouter = require('./employees.js');
const menusRouter = require('./menus.js');
const menuItemsRouter = require('./menu-items.js');
const timesheetsRouter = require('./timesheets.js');

apiRouter.use('/employees', employeesRouter);
apiRouter.use('/menus', menusRouter);
apiRouter.use('/menu-items', menuItemsRouter);
apiRouter.use('/timesheets', timesheetsRouter);

module.exports = apiRouter;
