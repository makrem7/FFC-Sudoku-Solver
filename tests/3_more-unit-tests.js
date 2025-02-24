const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const Solver = require('../controllers/sudoku-solver.js');
let solver;


//TODO clean dupplicates
suite('Unit Tests Part 2', () => {
 
  // validation string tests
  it('returns error when missing required field puzzle', function(){
    let isInValid = new Solver('');        
    expect(isInValid.validate()).to.have.property('error').eql("Required field missing");    
  });
   it('returns error if input <81 characters', function(){
    var isInValid = new Solver('29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
    expect(isInValid.validate()).to.have.property('error').eql("Expected puzzle to be 81 characters long");   
  });
  it('returns error if input >81 characters', function(){
    var isInValid = new Solver('1129..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
    expect(isInValid.validate()).to.have.property('error').eql("Expected puzzle to be 81 characters long");   
  });
  it('returns error if both coordinates missing', function(){
    var isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','','','7');
    expect(isInValid.validate()).to.have.property('error').eql("Required field(s) missing");   
  });
  it('returns error if row is missing', function(){
    var isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','','1','7');
    expect(isInValid.validate()).to.have.property('error').eql("Required field(s) missing");   
  });
  it('returns error if column is missing', function(){
    var isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','','7');
    expect(isInValid.validate()).to.have.property('error').eql("Required field(s) missing");   
  });
  it('returns error if value missing', function(){
    var isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','');
    expect(isInValid.validate()).to.have.property('error').eql("Required field(s) missing");   
  });
  it('returns error if wrong coordinate row Z', function(){
    var isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','Z','1','7');
    expect(isInValid.validate()).to.have.property('error').eql("Invalid coordinate");   
  });
  it('returns error if wrong coordinate col 0', function(){
    var isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','0','7');
    expect(isInValid.validate()).to.have.property('error').eql("Invalid coordinate");   
  });
  it('returns error if wrong value 0', function(){
    var isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','0');
    expect(isInValid.validate()).to.have.property('error').eql("Invalid value");   
  });



  //row placement tests
  it('returns true by correct placement with different coordinates', function(){               
    let isValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','E','3','7');             
    expect(isValid.checkRowPlacement()).to.be.true;
  });

  //column placement tests
  it('returns true by correct placement to column with different coordinates', function(){               
    let isValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','E','3','7');             
    expect(isValid.checkColPlacement()).to.be.true;
  });

  //region placement tests
  it('returns true by correct placement to region with different coordinates', function(){               
    let isValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','E','3','7');             
    expect(isValid.checkRegionPlacement()).to.be.true;
  });
  it('returns true region validation works for invalid value-1', function(){               
    let isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','9');             
    expect(isInValid.checkRegionPlacement()).to.be.false;
  });
  it('returns true region validation works for invalid value-2', function(){               
    let isInValid = new Solver('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51','A','3','2');
    expect(isInValid.checkRegionPlacement()).to.be.false;
  });
  
  //check all tests  
  
  it('returns true by allowed value overall', function(){               
    let isValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','7');             
    expect(isValid.checkAll()).to.be.true;
  });
  it('returns true by allowed value overall with different coordinates', function(){               
    let isValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','E','3','7');             
    expect(isValid.checkAll()).to.be.true;
  });
  it('returns false if one check fails- 1', function(){               
    let isInValid = new Solver('.29..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','2');             
    expect(isInValid.checkAll()).to.be.false;
  });
  it('returns false if one check fails-2 ', function(){               
    let isInValid = new Solver('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.','A','2','1');             
    expect(isInValid.checkAll()).to.be.false;
  });
  it('returns false if one check fails-3', function(){               
    let isInValid = new Solver('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3','B','4','1');             
    expect(isInValid.checkAll()).to.be.false;
  });
  

  //solving tests
  
  it('returns solved string for puzzled string with simple example for region', function(){               
    let isValid = new Solver('.35762984946381257728459613694517832812936745357824196473298561581673429269145378');             
    expect(isValid.solve()).to.equal('135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });
  
  it('returns solved string for puzzled string with simple example for column', function(){               
    let isValid = new Solver('.35762984.46381257728459613694517832812936745357824196473298561581673429269145378');             
    expect(isValid.solve()).to.equal('135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });
  
  it('returns solved string for puzzled string with simple example for row', function(){               
    let isValid = new Solver('..5762984946381257728459613694517832812936745357824196473298561581673429269145378');             
    expect(isValid.solve()).to.equal('135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });

  it('returns solved string for puzzled string-1', function(){               
    let isValid = new Solver('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');             
    expect(isValid.solve()).to.equal('135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });
 
  it('returns solved string for puzzled string-2', function(){               
    let isValid = new Solver('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3');             
    expect(isValid.solve()).to.equal('568913724342687519197254386685479231219538467734162895926345178473891652851726943');
  });  
  
  it('returns solved string for puzzled string-3', function(){               
    let isValid = new Solver('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1');             
    expect(isValid.solve()).to.equal('218396745753284196496157832531672984649831257827549613962415378185763429374928561');
  });
    
  it('returns solved string for puzzled string-4', function(){               
    let isValid = new Solver('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6');             
    expect(isValid.solve()).to.equal('473891265851726394926345817568913472342687951197254638734162589685479123219538746');
  });
  
  it('returns solved string for puzzled string-4', function(){               
    let isValid = new Solver('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51');             
    expect(isValid.solve()).to.equal('827549163531672894649831527496157382218396475753284916962415738185763249374928651');
  });

});
