const values = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const range = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const defaultCell = {
  value: null,
  solved: false,
  possibleValues: [...values]
}

function buildRow(index) {
  return range.map(column => ({
    ...defaultCell,
    row: index,
    column
  }))
}

function buildGrid() {
  return range.map(it => buildRow(it))
}

const grid = buildGrid()
export default grid
