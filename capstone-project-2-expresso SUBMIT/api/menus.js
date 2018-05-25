//menus.js
const menusRouter = require('express').Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItemsRouter = require('./menu-items.js');



///api/menus/:menuId GET
menusRouter.param('menuId', (req, res, next, menuId) => {
  const sql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
  const values = {$menuId: menuId};
  db.get(sql, values, (error, menu) => {
    if (error) {
      next(error);
    } else if (menu) {
      req.menu = menu;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

menusRouter.use('/:menuId/menu-items', menuItemsRouter);

///api/menus GET  >>A
menusRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu',
    (err, menus) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({menus: menus});
      }
    });
});

//-----------UNKNOWN
///api/menu/:menuId GET
menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({menu: req.menu});
});

///api/menus POST
menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO Menu (title) VALUES ($title)';
  const values = {
    $title: title
  };

  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
        (error, menu) => {
          res.status(201).json({menu: menu});
        });
    }
  });
});


//--->D
///api/menus/:menuId PUT
menusRouter.put('/:menuId', (req, res, next) => {
  //const title1 = req.body.menu.title;
  const title = req.body.menu.title;
  const menuId = req.params.menuId;
  //console.log(title);
  //console.log(menuId);
  if (!title) {
    return res.sendStatus(400);
  }

  const sql = 'UPDATE Menu SET title = $title WHERE Menu.id = $menuId';
  const values = {
    $menuId: menuId,
    $title: title
  };

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`,
        (error, menu) => {
          res.status(200).json({menu: menu});
          //console.log(menu);
        });
    }
  });
});


///api/menu/:menu DELETE
//----COME BACK TO THIS
//------DIFFERENT DELETE
menusRouter.delete('/:menuId', (req, res, next) =>
{
   const aSql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';//${req.params.menuId}`;
   const aValues = {$menuId: req.params.menuId};//{$menuItemId: req.params.menuItemId};
   //console.log(req.params.menuId);
   db.get(aSql, aValues, (error, menuItem) =>
   {
     //console.log(menuItem);
     if(error)
     {
       next(error);
     }
     else if(menuItem){
       res.sendStatus(400);
     }
     else
     {

       // const bSql = `SELECT * FROM MenuItems WHERE MenuItems.id = ${req.params.menuId}`;
       // const bValues = {$menuId: req.params.menuId};
       // db.get(aSql, aValues, (error, menu) =>
       // {
       //   if (error)
       //   {
       //     next(error);
       //   }
       //   else if (menu)
       //   {
       //     res.sendStatus(400);
       //   }
       //   else
       //   {
           const sql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
           const values = {$menuId: req.params.menuId};
           db.run(sql, values, (error) =>
           {
             if(error)
             {
               next(error);
             }
             else
             {
               res.sendStatus(204);
             }
           });
        // }
       // });
     }
   });
 });



module.exports = menusRouter;
