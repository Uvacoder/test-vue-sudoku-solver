<template>
  <div id="app">
    <main>
      <div class="home">
        <section>
          <div>
            <h1>Sudoku Solver</h1>
            <Grid :grid="grid" @updated="setCell" />
          </div>
          <div v-show="showLoader" class="loader">
            <LoadingSpinner />
          </div>
          <div v-show="!showLoader">
            <p>Calculations required: {{ puzzle.calculations }}</p>
            <p>Time to solve: {{ puzzle.solveTime }}</p>
            <button @click="solve">Solve</button>
            <button v-if="status !== 'solving'" @click="clear">Clear Puzzle</button>
            <ImportPuzzle @import="setPuzzle" />
          </div>
        </section>

        <aside>
          <h3>Prefill a puzzle:</h3>
          <button @click="loadPuzzle('easy')">Easy Puzzle</button>
          <button @click="loadPuzzle('medium')">Medium Puzzle</button>
          <button @click="loadPuzzle('hard')">Hard Puzzle</button>
          <button @click="loadPuzzle('evil')">Evil Puzzle</button>
          <section>
            Try one of <a href="http://www.aisudoku.com/index_en.html" target="_blank" rel="noreferrer noopener nofollow">Dr. Arto Inkala's</a> top 10 most difficult puzzles:

            <div class="insane">
              <button v-for="(p, i) in 10" :key="p" @click="loadInsanePuzzle(i)">{{ p }}</button>
            </div>
          </section>
        </aside>
      </div>
    </main>
    <footer>
      <a
        href="https://github.com/mikemcbride/vue-sudoku"
        target="_blank"
        rel="noreferrer noopener nofollow"
        >GitHub</a
      >
    </footer>
  </div>
</template>

<script>
import defaultGrid from './lib/defaultGrid'
import puzzles from './lib/puzzles'
import parsePuzzle from './lib/parsePuzzle'
import Solver from './lib/Solver'
import Grid from './components/Grid.vue'
import ImportPuzzle from './components/ImportPuzzle.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { solvePuzzle } from './workers/solve.worker'
import { klona } from 'klona/json'

export default {
  name: 'App',
  components: {
    Grid,
    ImportPuzzle,
    LoadingSpinner
  },
  data() {
    return {
      puzzle: Solver.setDefaultPuzzle(),
      status: 'loaded'
    }
  },
  computed: {
    grid() {
      return this.puzzle.grid
    },
    showLoader() {
      return this.status === 'solving'
    }
  },
  methods: {
    async solve() {
      this.status = 'solving'
      // this setTimeout is a dumb hack. The call kicks off,
      // and the main thread seems to be blocked until it finishes.
      // wrapping the solve call in a setTimeout seems to work.
      setTimeout(() => {
        const grid = klona(this.grid)
        solvePuzzle(grid).then(res => {
          this.puzzle = res
          this.status = 'solved'
        })
      }, 0)
    },
    loadPuzzle(level) {
      let puzzle = parsePuzzle(puzzles[level])
      this.puzzle = new Solver(puzzle)
    },
    loadInsanePuzzle(level) {
      let p = parsePuzzle(puzzles.insane[level])
      this.puzzle = new Solver(p)
    },
    setPuzzle(puzzle) {
      this.puzzle = new Solver(puzzle)
    },
    clear() {
      this.puzzle = Solver.setDefaultPuzzle()
    },
    setCell(payload) {
      this.puzzle.setCell(payload)
    }
  }
}
</script>
