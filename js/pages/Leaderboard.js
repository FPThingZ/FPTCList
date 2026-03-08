import { fetchLeaderboard, fetchUnratedLeaderboard, fetchCombinedLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
        tab: 'rated',
        ratedBoard: [],
        unratedBoard: [],
        combinedBoard: [],
        ratedErr: [],
        unratedErr: [],
        combinedErr: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="tab-buttons" style="display:flex;gap:0.5rem;margin-bottom:1rem;">
                    <button @click="switchTab('rated')" :class="{ active: tab === 'rated' }" class="tab-btn">Rated</button>
                    <button @click="switchTab('unrated')" :class="{ active: tab === 'unrated' }" class="tab-btn">Unrated</button>
                    <button @click="switchTab('combined')" :class="{ active: tab === 'combined' }" class="tab-btn">Combined</button>
                </div>
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <div class="player">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.verified">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{entry.progressed.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        const [[rated, ratedErr], [unrated, unratedErr], [combined, combinedErr]] =
            await Promise.all([fetchLeaderboard(), fetchUnratedLeaderboard(), fetchCombinedLeaderboard()]);
        this.ratedBoard = rated;
        this.unratedBoard = unrated;
        this.combinedBoard = combined;
        this.ratedErr = ratedErr;
        this.unratedErr = unratedErr;
        this.combinedErr = combinedErr;
        this.leaderboard = rated;
        this.err = ratedErr;
        this.loading = false;
    },
    methods: {
        localize,
        switchTab(tab) {
            this.tab = tab;
            this.selected = 0;
            if (tab === 'rated') {
                this.leaderboard = this.ratedBoard;
                this.err = this.ratedErr;
            } else if (tab === 'unrated') {
                this.leaderboard = this.unratedBoard;
                this.err = this.unratedErr;
            } else {
                this.leaderboard = this.combinedBoard;
                this.err = this.combinedErr;
            }
        },
    },
};
