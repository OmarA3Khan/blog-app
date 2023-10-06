import { defineStore } from 'pinia'
import { NewUser } from '../users'

interface UsersState {
    currentUserId?: string,
    loading: boolean,
}

export const useUsers = defineStore("users", {
    state: (): UsersState => ({
        currentUserId: undefined,
        loading: false,
    }),

    actions: {
        async authenticate () {
            this.loading = true;
            try {
                const res = await window.fetch('/api/current-user', {
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });
                const result = await res.json();
                this.currentUserId = result.id;
            } catch (e) {
                this.currentUserId = undefined;
            }
            this.loading = false;
        },

        async logout () {
            await window.fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            return this.authenticate()
        },

        async createUser (newUser: NewUser) {
            const body = JSON.stringify(newUser)
            await window.fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body
            })

            return this.authenticate()
        }
    }
})