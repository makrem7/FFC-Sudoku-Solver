'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

const { check, validationResult } = require('express-validator');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    
    .post(
      [      
        check('puzzle').trim().escape(),
        check('coordinate').trim().escape().toUpperCase(),
        check('value').trim().escape()
      ],
      (req, res) => {    

        const errors = validationResult(req);        
        if (!errors.isEmpty()) {
          return res.status(400).send({ errors: errors.array()});                 
        }        
        
        let puzzle = req.body.puzzle;                  
        var coordinate = req.body.coordinate;        
        // problem started when I wrote the solve I thought it would be a good idea to split coordinate before in row and col to make life easier, but expected tests results have a special case for an invalid corrdinate with single character in mind. I would have treated this as missing input, but 
        if (coordinate==='' || coordinate===undefined ){           
          var row = '';
          var column = '';
          //console.log('missing input coordinate');
        } 
        else if (coordinate.length===1){
          var row = coordinate;          
          var column = '0'; // have to set it to a invalid value to not trigger error missing input
          //console.log('not sufficient coordinate '+row+' '+column);
        } else { 
          let coordinateArray = coordinate.split("") ;          
          var row = coordinateArray[0].toString();          
          var column = coordinateArray.slice(1).toString(); //slice row from array to still be able to validate if coordinate length higher 2
        }
        let value = req.body.value;

        let solution = new SudokuSolver(puzzle, row, column ,value);

        //I would rather use express validator here as well, but tutorial wants to use here explicit class for validation so we use it
        if (solution.validate()){
          res.status(400).json(solution.validate());        
        }
        
        if(solution.checkAll()){
          var result ={
            "valid": solution.checkAll(),  
          }        
        }
        else {
          let conflict =[];
          if (!solution.checkRowPlacement()){
            conflict.push('row');
          }
          if (!solution.checkColPlacement()){
            conflict.push('column');
          }
          if (!solution.checkRegionPlacement()){
            conflict.push('region');
          }
          var result ={
            "valid": solution.checkAll(),
            "conflict": conflict
          } 
        }
        res.status(200).json(result);    
      }
    );
    
  app.route('/api/solve')
    .post([      
      check('puzzle').trim().escape(),
    ],
    (req, res) => {
      let solution = new SudokuSolver(req.body.puzzle);
      if (solution.validate()){
        res.status(400).json(solution.validate());        
      }
      
      else {
        
        var result = solution.solve();
        if (!result){
          res.status(200).json({
            "error": "Puzzle cannot be solved"
          });
        } else {
          res.status(200).json({
            "solution": result
          });
        }
      }
    }
    );    
};
