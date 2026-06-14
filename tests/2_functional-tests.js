const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Functional Tests', () => {

  suite('POST /api/solve', () => {
    
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[0][0].replace('.', 'X') })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[0][0].substring(0, 80) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
      const unsolveable = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: unsolveable })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });

  });

  suite('POST /api/check', () => {

    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, true);
          done();
        });
    });

test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
  chai.request(server)
    .post('/api/check')
    .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '4' })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.property(res.body, 'valid');
      assert.equal(res.body.valid, false);
      assert.property(res.body, 'conflict');
      assert.isArray(res.body.conflict);
      assert.lengthOf(res.body.conflict, 1);
      assert.include(res.body.conflict, 'row');
      done();
    });
});

test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
  chai.request(server)
    .post('/api/check')
    .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '1' })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.property(res.body, 'valid');
      assert.equal(res.body.valid, false);
      assert.property(res.body, 'conflict');
      assert.isArray(res.body.conflict);
      assert.lengthOf(res.body.conflict, 2);
      assert.include(res.body.conflict, 'row');
      assert.include(res.body.conflict, 'region');
      done();
    });
});

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '2' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, false);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 3);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
          done();
        });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0].replace('.', 'X'), coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0].substring(0, 80), coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'Z2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '10' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });

  });
});