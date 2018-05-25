//timesheets.js
const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//api/employees/:employeeId/timesheets/:timesheetId GET
//GET All of Timesheet ID
timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
  const sql = 'SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId';
  const values = {$timesheetId: timesheetId};
  db.get(sql, values, (error, timesheet) => {
    if (error) {
      next(error);
    } else if (timesheet) {
      req.timesheet = timesheet;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

///api/employees/:employeeId/timesheets GET
//---->>F
timesheetsRouter.get('/', (req, res, next) => {

  const sql = 'SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId';
  const values = {$employeeId: req.params.employeeId};
  db.all(sql, values, (error, timesheets) => {
    if(error){
      next(error);
    } else {
      res.status(200).json({timesheets: timesheets});
    }
  });
});

///api/employees/:employeeId GET
timesheetsRouter.get('/:timesheetId', (req, res, next) => {
  res.status(200).json({timesheet: req.timesheet});
});

///api/employees POST

//----->>G
//ERROR should return the newly created timesheet after timesheet creation
timesheetsRouter.post('/', (req, res, next) =>
{
  const hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        date = req.body.timesheet.date,
        employeeId = req.params.employeeId;
  //console.log(req.params.employeeId);
  const asql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
  const avalues = {$employeeId: employeeId};

  db.get(asql, avalues, (error, employee) =>
  {
    if(error)
    {
      next(error);
    }
    else
    {
       if (!hours || !rate || !date || !employee)
       {
        return res.sendStatus(400);
      }


      const sql = 'INSERT INTO Timesheet(hours, rate, date, employee_id) ' +
      'VALUES ($hours, $rate, $date, $employeeId)';
      const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: req.params.employeeId
      };

      db.run(sql, values, function(error)
      {

        if(error)
        {
          next(error);
        }
        else
        {
          db.get(`SELECT * FROM Timesheet WHERE id = ${this.lastID}`, //this.lastID
          function(error, timesheet)
          {
            //console.log(timesheet); //undefined
            //console.log(this.lastID); //undefined
            //console.log(error);
            res.status(201).json({timesheet: timesheet});

          });
        }
      });
    }
    });
});






///api/employees/:employeeId PUT
timesheetsRouter.put('/:timesheetId', (req, res, next) =>
{

  const hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        date = req.body.timesheet.date,
        employeeId = req.params.employeeId;//req.body.timesheet.employeeId;
        //console.log(employeeId);


  const aSql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
  const aValues = {$employeeId: employeeId};
  db.get(aSql, aValues, function(error, employee)
  {
      //console.log(employee);
      if(error)
      {
        next(error);
      }
      else
      {
        if (!hours || !rate || !date)// || !employeeId)
        {
          //console.log(employee);
          return res.sendStatus(400);//.json({employee: employee});
        }
      //}
  //});


  const sql = `UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE Timesheet.id = ${req.params.timesheetId}`;//$timesheetId';

  const values =
  {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: req.params.employeeId
  };
  //console.log(req.body.timesheet.rate);
 //console.log(rate);
  db.run(sql, values, function(error)
  {
    if (error)
    {
      next(error);
    }
    else
    {
      db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
        function(error, timesheet)
        {

          res.status(200).json({timesheet: timesheet});
          //console.log(timesheet);
          //console.log(error);
        });
    }
  });
}
});
});

///api/employees/:employeeId DELETE
timesheetsRouter.delete('/:timesheetId', (req, res, next) =>
{
  const sql = 'DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId';
  const values = {$timesheetId: req.params.timesheetId};

  db.run(sql, values, (error) =>
  {
    if (error)
    {
      next(error);
    }
    else
    {
      db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
        (error, timesheet) =>
        {
          res.status(204).json({timesheet: timesheet});
        });
    }
  });
});

module.exports = timesheetsRouter;
