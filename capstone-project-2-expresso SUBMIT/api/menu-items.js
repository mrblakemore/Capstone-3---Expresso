//menu-itmes.js
const menuItemsRouter = require('express').Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//api/menus/:MenuItemId GET
menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const values = {$menuItemId: menuItemId};
  db.get(sql, values, (error, menuItem) => {
    if (error) {
      next(error);
    } else if (menuItem) {
      req.menuItem = menuItem;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

///api/employees GET
//-------> F
menuItemsRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
  const values = { $menuId: req.params.menuId};
  db.all(sql, values, (error, menuItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({menuItems: menuItems});
      }
    });
});

///api/employees/:employeeId GET
menuItemsRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({menuItem: req.menuItem});
});

//-------G
///api/employees POST

menuItemsRouter.post('/', (req, res, next) => {
//newly


  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price;
        menuId = req.params.menuId;//body.menuItem.menu_id; //undefined
  //console.log(req.body.menuItem); //menu_id not in request body
  //console.log(menuId); //undefined

  const asql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
  const avalues = {$menuId: menuId};


  db.get(asql, avalues, (error, menu) =>
  {
  //  console.log(error);
    //console.log(menu);
    if(error)
    {
      next(error);
    }
    else
    {

      if (!name ||  !inventory || !price  || !menuId || !menu)
      {
      //  console.log("test1");
        return res.sendStatus(400);
      }

  const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) ' +
            'VALUES ($name, $description, $inventory, $price, $menuId)';
  const values = {
    $name: name,
    $description: description,
    $inventory: inventory,
    $price: price,
    $menuId: menuId
  };

  db.run(sql, values, function(error)
  {
    //console.log(error);
    if (error)
    {
      next(error);
    }
    else
    {
      //console.log('LastID: ', this.lastID);
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`,
        function(error, menuItem)
        {
          //console.log(menuItem);
          res.status(201).json({menuItem: menuItem});
        });
    }
  });
}
});
});


//->H
///api/employees/:employeeId PUT
menuItemsRouter.put('/:menuItemId', (req, res, next) => {

  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price,
        menuId = req.params.menuId;
//console.log(menuId);
//console.log(menuId);
const aSql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
const aVal = {$menuId: menuId};
//console.log(menuId);
db.get(aSql, aVal, function(error, menu) {
  //console.log(menu);
  if(error){
    next(error);
  }
  else
  {
    if (!name || !inventory || !price || !menuId )
    {
      return res.sendStatus(400);
    }


  const sql = 'UPDATE MenuItem SET name = $name, description = $description, ' +
      'inventory = $inventory, price = $price, menu_id = $menuId ' +
      'WHERE MenuItem.id = $menuItemId';
      //console.log($menuItemId);
  const values =
  {
    $name: name,
    $description: description,
    $inventory: inventory,
    $price: price,
    $menuId: menuId,
    $menuItemId: req.params.menuItemId //added Item
  };

  db.run(sql, values, function(error)
  {
    if (error) {
      next(error);
    } else {
      //console.log('made it');
      //console.log(req.params.menuItemId);
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
        (error, menuItem) => {
          ///console.log(menuItem);
          //console.log(error);
          res.status(200).json({menuItem: menuItem});
        });
    }
  });
}
});
});




///api/employees/:employeeId DELETE
menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  const sql = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const values = {$menuItemId: req.params.menuItemId};

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
        (error, menuItem) => {


          res.sendStatus(204);//.json({menuItem: menuItem});


        });
    }
  });
});




module.exports = menuItemsRouter;
