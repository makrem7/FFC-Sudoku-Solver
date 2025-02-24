const chai = require('chai');
const { response } = require('express');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {

  // validation string tests
  test('Logic handles a valid puzzle string of 81 characters', function(done){               
    let isValid = new Solver('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');         
    assert.isNotOk(isValid.validate());
    done();
  });
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done){
    let isInValid = new Solver('A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
    assert.isOk(isInValid.validate()); // here we must check to be true not false because error is returned with true
    done();
  });
 
  test('Logic handles a puzzle string that is not 81 characters in length', function(done){
    var isInValid = new Solver('29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
    assert.isOk(isInValid.validate()); // here we must check to be true not false because error is returned with true
    done();
  });
 
  //row placement tests
  test('Logic handles a valid row placement', function(done){               
    let isValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','7');             
    assert.isOk(isValid.checkRowPlacement());
    done();
  });
  test('Logic handles an invalid row placement', function(done){               
    let isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','1');             
    assert.isNotOk(isInValid.checkRowPlacement());
    done();
  });

  //column placement tests
  test('Logic handles a valid column placement', function(done){               
    let isValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','7');             
    assert.isOk(isValid.checkColPlacement());
    done();
  });
  test('Logic handles an invalid column placement', function(done){               
    let isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','1');             
    assert.isNotOk(isInValid.checkColPlacement());
    done();
  });

  //region placement tests
  test('Logic handles a valid region (3x3 grid) placement', function(done){               
    let isValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','7');             
    assert.isOk(isValid.checkRegionPlacement());
    done();
  });
  test('Logic handles an invalid region (3x3 grid) placement', function(done){               
    let isInValid = new Solver('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51','A','3','2');
    assert.isNotOk(isInValid.checkRegionPlacement());
    done();
  });
  

  //solving tests  
  test('Valid puzzle strings pass the solver', function(done){               
    let isValid = new Solver('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');             
    assert.equal(isValid.solve(),'135762984946381257728459613694517832812936745357824196473298561581673429269145378');
    done();
  });

  test('Invalid puzzle strings fail the solver', function(done){               
    let isInValid = new Solver('5168497323.76.5...8.97...65135.6.9.7472591..696837..5.253186.746842.75..791.5.6.8');             
    assert.isNotOk(isInValid.solve());  
    done();
  });  
  
  test('Solver returns the the assert.equaled solution for an incomplete puzzzle', function(done){               
    let isValid = new Solver('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51');             
    assert.equal(isValid.solve(),'827549163531672894649831527496157382218396475753284916962415738185763249374928651');
    done();
  });

});
