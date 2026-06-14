class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (/[^1-9.]/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    return true;
  }

checkRowPlacement(puzzleString, row, column, value) {
    const r = row.toUpperCase().charCodeAt(0) - 65;
    const c = parseInt(column) - 1;
    const start = r * 9;
    
    for (let i = 0; i < 9; i++) {
      if (i === c) continue;
      if (puzzleString[start + i] === value.toString()) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const r = row.toUpperCase().charCodeAt(0) - 65;
    const c = parseInt(column) - 1;
    
    for (let i = 0; i < 9; i++) {
      if (i === r) continue;
      if (puzzleString[i * 9 + c] === value.toString()) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const r = row.toUpperCase().charCodeAt(0) - 65;
    const c = parseInt(column) - 1;
    
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const curRow = startRow + i;
        const curCol = startCol + j;
        if (curRow === r && curCol === c) continue;
        if (puzzleString[curRow * 9 + curCol] === value.toString()) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) return validation;

    let chars = puzzleString.split('');
    
    const backtrack = () => {
      const index = chars.indexOf('.');
      if (index === -1) return true;

      const r = String.fromCharCode(65 + Math.floor(index / 9));
      const c = (index % 9) + 1;

      for (let num = 1; num <= 9; num++) {
        const valStr = num.toString();
        const currentStr = chars.join('');
        
        if (
          this.checkRowPlacement(currentStr, r, c, valStr) &&
          this.checkColPlacement(currentStr, r, c, valStr) &&
          this.checkRegionPlacement(currentStr, r, c, valStr)
        ) {
          chars[index] = valStr;
          if (backtrack()) return true;
          chars[index] = '.';
        }
      }
      return false;
    };

    if (backtrack()) {
      const solution = chars.join('');
      return { solution };
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;