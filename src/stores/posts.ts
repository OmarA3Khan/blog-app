import { defineStore } from 'pinia'
import { Post, today, thisWeek, thisMonth, TimelinePost } from '../posts'
import { Period } from '../constants'
import { DateTime } from "luxon";

interface PostsState {
    ids: string[],
    all: Map<string, Post>,
    selectedPeriod: Period,
}

export const usePosts = defineStore("posts", {
    state: (): PostsState => ({
        ids: [today.id, thisWeek.id, thisMonth.id],
        all: new Map([
            [today.id, today],
            [thisWeek.id, thisWeek],
            [thisMonth.id, thisMonth],
        ]),
        selectedPeriod: "Today"
    }),

    actions: {
        setSelectedPeriod (period: Period) {
            this.selectedPeriod = period
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