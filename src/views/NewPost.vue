<script lang="ts" setup>
import { DateTime } from 'luxon'
import PostWriter from '../components/PostWriter.vue'
import { Post, TimelinePost } from '../posts';
import { useUsers } from '../stores/users';
import { usePosts } from '../stores/posts';
import { useRouter } from 'vue-router';

const usersStore = useUsers();
const posts = usePosts();
const router = useRouter();

if(!usersStore.currentUserId) {
    throw Error('USer was not found');
}

const post: TimelinePost = {
    id: "-1",
    title: "Title",
    authorId: usersStore.currentUserId,
    created: DateTime.now(),
    markdown:'## Title',
    html: '<h2>Title</h2>',
}

async function handleSubmit (post: Post) {
    await posts.createPost(post);
    router.push("/")
}

</script>

<template>
    New Post
    <PostWriter :post="post" @submit="handleSubmit"/>
</template>