const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
  
  test('Logic handles a valid puzzle string of 81 characters', (done) => {
    assert.equal(solver.validate(puzzlesAndSolutions[0][0]), true);
    done();
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    const invalidPuzzle = puzzlesAndSolutions[0][0].replace('.', 'X');
    assert.property(solver.validate(invalidPuzzle), 'error');
    assert.equal(solver.validate(invalidPuzzle).error, 'Invalid characters in puzzle');
    done();
  });

  test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
    const shortPuzzle = puzzlesAndSolutions[0][0].substring(0, 80);
    assert.property(solver.validate(shortPuzzle), 'error');
    assert.equal(solver.validate(shortPuzzle).error, 'Expected puzzle to be 81 characters long');
    done();
  });

test('Logic handles a valid row placement', (done) => {
  assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 'A', '2', '3'), true);
  done();
});

test('Logic handles an invalid row placement', (done) => {
  assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 'A', '2', '1'), false);
  done();
});

test('Logic handles a valid column placement', (done) => {
  assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 'A', '2', '3'), true);
  done();
});

test('Logic handles an invalid column placement', (done) => {
  assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 'A', '2', '2'), false);
  done();
});

  test('Logic handles a valid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 'A', '2', '3'), true);
    done();
  });

  test('Logic handles an invalid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 'A', '2', '6'), false);
    done();
  });

  test('Valid puzzle strings pass the solver', (done) => {
    const result = solver.solve(puzzlesAndSolutions[0][0]);
    assert.property(result, 'solution');
    done();
  });

  test('Invalid puzzle strings fail the solver', (done) => {
    const unsolveable = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(unsolveable);
    assert.property(result, 'error');
    assert.equal(result.error, 'Puzzle cannot be solved');
    done();
  });

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    const result = solver.solve(puzzlesAndSolutions[0][0]);
    assert.equal(result.solution, puzzlesAndSolutions[0][1]);
    done();
  });

});