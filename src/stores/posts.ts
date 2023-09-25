import { defineStore } from 'pinia'
import { Post, today, thisWeek, thisMonth, TimelinePost } from '../posts'
import { Period } from '../constants'
import { DateTime } from "luxon";

interface PostsState {
    ids: string[],
    all: Map<string, Post>,
    selectedPeriod: Period,
}

function delay () {
    return new Promise<void>(res => setTimeout(res, 1500))
}

export const usePosts = defineStore("posts", {
    state: (): PostsState => ({
        ids: [],
        all: new Map(),
        selectedPeriod: "Today"
    }),

    actions: {
        setSelectedPeriod (period: Period) {
            this.selectedPeriod = period
        },

        async fetchPosts () {
            const res = await window.fetch("http://localhost:8000/posts")
            const data = (await res.json()) as Post[]
            await delay()

            let ids = []
            let all = new Map<string, Post>()

            for (const post of data) {
                ids.push(post.id)
                all.set(post.id, post)
            }

            this.ids = ids
            this.all = all
        }

    },

    getters: {
        filteredPosts: (state): TimelinePost[] => {

            const dateThresholds = {
                'Today': DateTime.now().minus({ day: 1 }),
                'This Week': DateTime.now().minus({ week: 1 }),
                'This Month': DateTime.now().minus({ weeks: 4 }),
            };
            
            return state.ids.reduce((posts, postId) => {
                const post = state.all.get(postId)
            
                if(!post) {
                    throw Error(`Post with id of ${postId} was expected but not found.`)
                }
            
                const created = DateTime.fromISO(post.created);
            
                if (created >= dateThresholds[state.selectedPeriod]) {
                    posts.push({ ...post, created });
                }
            
                return posts;
            }, []);

        }
    }
})