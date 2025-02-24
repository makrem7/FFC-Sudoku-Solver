const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    // api/solve tests
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({
        "puzzle":"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      })
      .end(function(err, res){          
        assert.equal(res.status, 200);
        assert.isTrue(res.ok);
        assert.equal(res.type, 'application/json');
        assert.propertyVal(res.body, 'solution', "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
        done();
      })

    });
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
          "puzzle":""  
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, { error: "Required field missing" });
          done();
        });
    });
    test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            "puzzle":",.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });
    test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            "puzzle":"...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."      
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
          done();
        });
    });
    
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            "puzzle":"5168497323.76.5...8.97...65135.6.9.7472591..696837..5.253186.746842.75..791.5.6.8"      
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, { error: "Puzzle cannot be solved" });
          done();
        });
    });
    
    test('Solve a puzzle with incorrect length', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            "puzzle":"...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."      
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
          done();
        });
    });

    // api/check tests
    test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle":"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate":"A2",
          "value":"6"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        });
    });
    
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle":"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate":"A1",
          "value":"6"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ['column']);
          done();
        });
    });
    
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle":"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate":"A1",
          "value":"1"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "column"]);
          done();
        });
    });
    
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle":"..9..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate":"A1",
          "value":"1"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
          done();
        });
    });
    
    test('Check a puzzle placement with missing required fields: POST request to /api/check - value', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle":"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate":"A2",
          "value":""
        })
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body.error, 'Required field(s) missing');
          done();
        });
    });
    
    test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "A2",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid characters in puzzle'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": ".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "A2",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Expected puzzle to be 81 characters long'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "A0",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid coordinate'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "A1",
          "value": "0"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid value'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check - col 0', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "A0",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid coordinate'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check - invalid row J', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "J1",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid coordinate'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check - no col defined', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "A",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid coordinate'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check - no row defined', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "1",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid coordinate'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check - length coordinate', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "A10",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid coordinate'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check - length coordinate 2', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "AB10",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid coordinate'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check - invalid row number', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "01",
          "value": "6"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Invalid coordinate'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with missing required fields: POST request to /api/check - coordinate', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          "coordinate": "",
          "value": "1"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Required field(s) missing'
          });
          done();
        });
    });
    
    test('Check a puzzle placement with missing required fields: POST request to /api/check - puzzle', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          "puzzle": "",
          "coordinate": "A1",
          "value": "1"
        })
        .end(function(err, res) {
          assert.strictEqual(res.status, 400);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(res.body, {
            error: 'Required field(s) missing'
          });
          done();
        });
    });
});
