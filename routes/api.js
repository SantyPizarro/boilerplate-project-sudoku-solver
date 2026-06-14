'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      if (!/^[A-I][1-9]$/i.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate[0].toUpperCase();
      const col = coordinate[1];
      const rIdx = row.charCodeAt(0) - 65;
      const cIdx = parseInt(col) - 1;
      const targetIdx = rIdx * 9 + cIdx;

      let tempPuzzle = puzzle.split('');
      tempPuzzle[targetIdx] = '.';
      const puzzleToCheck = tempPuzzle.join('');

      const rowValid = solver.checkRowPlacement(puzzleToCheck, row, col, value);
      const colValid = solver.checkColPlacement(puzzleToCheck, row, col, value);
      const regValid = solver.checkRegionPlacement(puzzleToCheck, row, col, value);

      if (rowValid && colValid && regValid) {
        return res.json({ valid: true });
      }

      let conflicts = [];
      if (!rowValid) conflicts.push('row');
      if (!colValid) conflicts.push('column');
      if (!regValid) conflicts.push('region');

      return res.json({ valid: false, conflict: conflicts });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }

      const result = solver.solve(puzzle);
      return res.json(result);
    });
};