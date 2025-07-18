<script lang="ts">
    import { onMount } from 'svelte';

    import { generateGrid , generateWinningGrid } from "../grid";
    import type { Grid } from "../types";

    // Stores
    import { isDarkModeEnabled, loggedUser, statusColor } from "../stores";

    //Firebase
    import { db } from "../firebase";
    import { doc, getDoc, updateDoc, setDoc, getDocs, collection } from "firebase/firestore";

    let grid: Grid = [];
    let highlighted: Set<string> = new Set();
    let gameState: 'notStarted' | 'ongoing' | 'win' | 'lose' = 'notStarted';
    let gameTime = 0;
    let startTime = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    let score = 0;
    let best_score;
    let successful_games;
    let best_time;

    let leaderboard = [];
    let score_leader, time_leader;

    onMount(async () => {
        grid = generateGrid();

        // My stats
        const stats = await getPlayerStats($loggedUser.uid);
        best_score = stats.best_score ?? 0;
        best_time = stats.best_time ?? 0;
        successful_games = stats.successful_games ?? 0;

        if (best_time == Infinity){
            best_time = "-";
        }

        // Fetch leaderboard
        leaderboard = await fetchLeaderboard();

        score_leader = sortLeaderboard(leaderboard, "score")[0];
        time_leader = sortLeaderboard(leaderboard, "time")[0];

        // Leader details TODO card
        score_leader.displayName = await getDisplayNameFromUid(score_leader.uid);
        time_leader.displayName = await getDisplayNameFromUid(time_leader.uid);
    });

    async function getDisplayNameFromUid(uid){
        const docSnap = await getDoc(doc(db, "userDetails", uid));
        if (docSnap.exists())
        {
            return docSnap.data().displayName;
        }
    }

    async function fetchLeaderboard(){
        const snapshot = await getDocs(collection(db, 'StoneDestructorSinglePlayerStats'));

        const players = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));

        return players;
    }

    function sortLeaderboard(players, type) {
        let sorted = [];

        if (type === 'score') {
            sorted = players.sort((a, b) => b.best_score - a.best_score);
        } else if (type === 'time') {
            sorted = players.sort((a, b) => a.best_time - b.best_time);
        }

        return sorted.slice(0, 1);
    }

    async function getPlayerStats(uid) {
        const ref = doc(db, 'StoneDestructorSinglePlayerStats', uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            const defaultStats = {
                best_score: 0,
                best_time: Infinity,
                successful_games: 0,
            };
            await setDoc(ref, defaultStats);
            return defaultStats;
        }
        return snap.data();
    }

    async function updatePlayerStats(uid, score, time) {
        const ref = doc(db, 'StoneDestructorSinglePlayerStats', uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            await setDoc(ref, {
                best_score: score,
                best_time: time,
                successful_games: 1,
            });
        } else {
            const data = snap.data();

            const newStats = {
                best_score: Math.max(data.best_score ?? 0, score),
                best_time: Math.min(data.best_time ?? Infinity, time),
                successful_games: (data.successful_games ?? 0) + 1,
            };

            await updateDoc(ref, newStats);
        }
    }

    async function updateBestScoreOnly(uid, score) {
        const ref = doc(db, 'StoneDestructorSinglePlayerStats', uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            await setDoc(ref, {
                best_score: score,
                best_time: Infinity,
                successful_games: 0,
            });
        } else {
            const data = snap.data();
            const current = data.best_score ?? 0;

            if (score > current) {
                await updateDoc(ref, {
                    best_score: score,
                });
            }
        }
    }

    function startTimer() {
        if (timer) return;

        startTime = performance.now();
        timer = setInterval(() => {
            gameTime = performance.now() - startTime;
        }, 33); // cca 30 fps
    }

    function stopTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
            gameTime = performance.now() - startTime;
        }
    }

    function checkGameOver(grid: Grid): 'win' | 'lose' | 'ongoing' {
        const numRows = grid.length;
        const numCols = grid[0].length;

        let hasAnyGroup = false;
        let hasAnyTile = false;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const color = grid[row][col].color;
                if (color !== null) {
                    hasAnyTile = true;

                    // Susedia
                    const neighbors = [
                        [row - 1, col],
                        [row + 1, col],
                        [row, col - 1],
                        [row, col + 1],
                    ];

                    for (const [nr, nc] of neighbors) {
                        if (
                            nr >= 0 && nr < numRows &&
                            nc >= 0 && nc < numCols &&
                            grid[nr][nc].color === color
                        ) {
                            hasAnyGroup = true;
                            break;
                        }
                    }
                }
            }
        }

        if (!hasAnyTile) return 'win';
        if (!hasAnyGroup) return 'lose';
        return 'ongoing';
    }

    function shiftColumnsLeft(grid: Grid){
        const numRows = grid.length;
        const numCols = grid[0].length;

        const newCols: string[][] = [];

        // Pre každý stĺpec zľava doprava
        for (let col = 0; col < numCols; col++) {
            const column = grid.map(row => row[col].color);

            const isEmpty = column.every(color => color === null);
            if (!isEmpty) {
                newCols.push(column);
            }
        }

        const missingCols = numCols - newCols.length;

        // Pridaj prázdne stĺpce na koniec
        for (let i = 0; i < missingCols; i++) {
            newCols.push(Array(numRows).fill(null));
        }

        // Prepíš grid podľa newCols
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                grid[row][col].color = newCols[col][row];
            }
        }
    }

    function applyGravity(grid: Grid){
        const numRows = grid.length;
        const numCols = grid[0].length;

        for (let col = 0; col < numCols; col++) {
            const stack: (string | null)[] = [];

            for (let row = numRows - 1; row >= 0; row--) {
                const color = grid[row][col].color;
                if (color !== null) {
                    stack.push(color);
                }
            }

            for (let row = numRows - 1; row >= 0; row--) {
                grid[row][col].color = stack.length > 0 ? stack.shift()! : null;
            }
        }
    }

    function newGame(){
        score = 0;
        grid = generateGrid();
        highlighted = new Set();
        gameState = 'notStarted';
        gameTime = 0;
        stopTimer();
    }

    function formatTime(ms): string {
        if (ms == "-") { return "-"};

        const minutes = Math.floor(ms / 60000)
            .toString()
            .padStart(2, '0');

        const seconds = Math.floor((ms % 60000) / 1000)
            .toString()
            .padStart(2, '0');

        const millis = Math.floor(ms % 1000)
            .toString()
            .padStart(3, '0');

        return `${minutes}:${seconds}:${millis}`;
    }

    async function handleClick(row: number, col: number) {
        if (gameState === 'win' || gameState === 'lose') return;

        const group = findGroup(grid, row, col);
        if (group.length < 2) return;

        if (gameState === 'notStarted') {
            gameState = 'ongoing';
            startTimer();
        }

        score += (group.length) ** 2;

        for (const [r, c] of group) {
            grid[r][c].color = null;
        }

        applyGravity(grid);
        shiftColumnsLeft(grid);
        highlighted = new Set();

        const state = checkGameOver(grid);
        if (state !== 'ongoing') {
            stopTimer();
        }
        gameState = state;

        if (state === 'win') {
            await updatePlayerStats($loggedUser.uid, score, gameTime);

            const stats = await getPlayerStats($loggedUser.uid);
            best_score = stats.best_score ?? 0;
            best_time = stats.best_time ?? 0;
            successful_games = stats.successful_games ?? 0;
        }

        if (state === 'lose') {
            if (score > best_score){
                await updateBestScoreOnly($loggedUser.uid, score);
                best_score = score;
            }
        }
    }

    function findGroup(grid: Grid, row: number, col: number): [number, number][] {
        const targetColor = grid[row][col]?.color;
        if (!targetColor) return [];

        const visited = new Set<string>();
        const result: [number, number][] = [];

        function dfs(r: number, c: number) {
            const key = `${r},${c}`;
            if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return;
            if (visited.has(key)) return;
            if (grid[r][c]?.color !== targetColor) return;

            visited.add(key);
            result.push([r, c]);

            dfs(r - 1, c);
            dfs(r + 1, c);
            dfs(r, c - 1);
            dfs(r, c + 1);
        }

        dfs(row, col);
        return result;
    }

    function clearHighlight(){
        highlighted = new Set();
    }

    function handleHover(row: number, col: number) {
        let group = findGroup(grid, row, col);

        if (group.length < 2) {
            highlighted = new Set();
            return;
        }
        highlighted = new Set(group.map(([r, c]) => `${r},${c}`));
    }
</script>

<div
        class="game-wrapper"
        class:dark-mode={$isDarkModeEnabled}
        on:mouseleave={clearHighlight}
>
    <button
            on:click={newGame}
            class="new-game-button"
    >
        Nová hra
    </button>

    <div class="grid">
        {#each grid as row, rowIndex}
            {#each row as tile, colIndex}
                <div
                        class="tile"
                        class:highlighted={highlighted.has(`${rowIndex},${colIndex}`)}
                        on:mouseenter={() => handleHover(rowIndex, colIndex)}
                        on:click={() => handleClick(rowIndex, colIndex)}
                        style="background-color: {tile.color || 'transparent'};"
                ></div>
            {/each}
        {/each}
    </div>

    <div class="stats-panel">
        <div class="score-counter"><strong>🏆 Skóre:</strong> {score}</div>
        <div class="best-score"><strong>🏆 Najlepšie skóre:</strong> {best_score}</div>
        <div class="best-time"><strong>🕛 Najlepší čas:</strong> {formatTime(best_time)}</div>
        <div class="successful-games"><strong>Počet vyhratých hier:</strong> {successful_games}</div>
    </div>

    <!-- Game State -->
    {#if gameState === 'win'}
        <div class="game-state-label" style="color: green;"><strong>🎉 Vyhral si!</strong></div>
    {:else if gameState === 'lose'}
        <div class="game-state-label" style="color: red;"><strong>😞 Hra skončila – žiadne možné ťahy</strong></div>
    {/if}

    <!-- Timer -->
    <div class="game-time"><strong>{formatTime(gameTime)}</strong></div>

    <!-- Leaderboard TODO correct information-->
    {#if (leaderboard)}
        <div class="leaderboard">
            <h3>Najlepší hráči</h3>

            <!-- Score leader -->
            {#if score_leader}
                <div class="best-score">
                    🏆 {score_leader.best_score}
                    <div class="profile">
                        <img class="profile-photo" src="{$loggedUser.photoURL}">

                        <div class="name">
                            <label>{score_leader.displayName}</label>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Time leader -->
            {#if time_leader}
                <div class="best-time">
                    🕛 {formatTime(time_leader.best_time)}
                    <div class="profile">
                        <img class="profile-photo" src="{$loggedUser.photoURL}">
                        <div class="name">
                            <label>{time_leader.displayName}</label>
                        </div>
                    </div>
                </div>
            {/if}

        </div>
    {/if}

</div>



<style lang="scss">
    .game-wrapper{
      background: var(--welcome-section-background);

      position: relative;
      width: 100%;
      min-height: 80vh;
      margin-top: 100px;
    }

    //Leaderboard
    .game-wrapper .leaderboard{
      position: absolute;
      top: 150px;
      left: 150px;

      display: flex;
      flex-direction: column;
      gap: 60px;
    }

    .game-wrapper .leaderboard h3{
      color: var(--navbar-icon-color);
    }

    .game-wrapper .leaderboard .best-time{
      display: flex;
      gap: 20px;
    }

    .game-wrapper .leaderboard .best-score{
      display: flex;
      gap: 20px;
    }

    .game-wrapper .leaderboard .best-time .profile{
      display: flex;
      flex-direction: column;
      gap: 3px;
      align-items: center;
    }

    .game-wrapper .leaderboard .best-score .profile{
      display: flex;
      flex-direction: column;
      gap: 3px;
      align-items: center;
    }

    .name label{
      font-size: 18px;
    }

    .profile-photo{
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }

    .profile-photo:hover{
      cursor: pointer;
      transform: scale(1.02);
    }

    //New game button
    .game-wrapper .new-game-button{
      position: absolute;
      top: 50px;
      left: 150px;

      display: inline-block;
      background: #2b6209;
      color: #fff;
      font-size: 28px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
    }


    .game-wrapper .new-game-button:hover{
      background: rgba(43, 98, 9, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }

    .game-wrapper .stats-panel{
      position: absolute;
      top: 50px;
      right: 120px;

      display: flex;
      flex-direction: column;
      gap: 20px;
      //background: #009edb;
    }

    .game-wrapper .game-state-label{
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      width: max-content;

      margin-top: 10px;
    }

    .game-wrapper .game-time{
      position: absolute;
      top: 500px;
      left: 50%;
      transform: translate(-50%);

      font-size: 28px;
      color: var(--navbar-icon-color);
    }

    .game-wrapper .score-counter{
      color: var(--navbar-icon-color);
      font-size: 24px;
    }

    .game-wrapper .best-score{
      color: var(--navbar-icon-color);
      font-size: 24px;
    }

    .game-wrapper .best-time{
      color: var(--navbar-icon-color);
      font-size: 24px;
    }

    .game-wrapper .successful-games{
      color: var(--navbar-icon-color);
      font-size: 24px;
    }

    .game-wrapper .grid{
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translate(-50%);

      display: grid;
      grid-template-columns: repeat(20, 32px);
      gap: 2px;

    }

    .game-wrapper .grid .tile{
      width: 32px;
      height: 32px;
      border: 1px solid var(--navbar-icon-color);
    }

    .game-wrapper .grid .tile.highlighted {
      box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.8);
      transform: scale(1.08);
      transition: all 0.1s ease;
      z-index: 2;
    }


    @media (width <=1500px){
      .game-wrapper{
        height: 100vh;
      }

      .game-wrapper .leaderboard{
        position: absolute;
        left: 120px;
      }

      .status-circle{
        bottom: 118px;
        right: 81px;
      }

      .game-wrapper .new-game-button{
        position: absolute;
        top: 50px;
        left: 120px;

        font-size: 24px;
      }

      .game-wrapper .stats-panel{
        position: absolute;
        top: 50px;
        right: 100px;
      }

      .game-wrapper .game-time{
        top: 400px;
      }

      .game-wrapper .score-counter{
        font-size: 20px;
      }

      .game-wrapper .best-score{
        font-size: 20px;
      }

      .game-wrapper .best-time{
        font-size: 20px;
      }

      .game-wrapper .successful-games{
        font-size: 20px;
      }

      .game-wrapper .grid{
        grid-template-columns: repeat(20, 24px);
        gap: 2px;
      }

      .game-wrapper .grid .tile{
        width: 24px;
        height: 24px;
        border: 1px solid var(--navbar-icon-color);
      }
    }

    @media (width <= 1200px){
      .game-wrapper{
        height: 130vh;
      }

      .game-wrapper .leaderboard{
        visibility: hidden;
      }

      .game-wrapper .new-game-button{
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translate(-50%);
      }

      .game-wrapper .game-time{
        top: 500px;
      }

      .game-wrapper .stats-panel{
        position: absolute;
        top: 600px;
        right: 50%;
        transform: translate(50%);

        //background: #009edb;
      }

      .game-wrapper .grid{
        top: 150px;
      }
    }

    @media (width <= 600px){
      .game-wrapper .new-game-button{
        font-size: 20px;
      }

      .game-wrapper .grid{
        grid-template-columns: repeat(20, 20px);
        gap: 2px;
      }

      .game-wrapper .grid .tile{
        width: 20px;
        height: 20px;
        border: 1px solid var(--navbar-icon-color);
      }

      .game-wrapper .stats-panel{
        right: 50%;
        transform: translate(50%);
        width: max-content;
        //background: #009edb;
      }
    }
</style>