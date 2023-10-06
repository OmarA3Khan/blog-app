<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Post, TimelinePost } from '../posts';
import { useRouter } from 'vue-router'
import { marked } from 'marked';
import highlightjs from 'highlight.js';
import debounce from "lodash/debounce";
import { usePosts } from '../stores/posts'

const props = defineProps<{
    post: TimelinePost | Post
}>()

const title = ref(props.post.title)
const content = ref(props.post.markdown)
const html = ref('')
const contentEditable = ref<HTMLDivElement>()

const posts = usePosts()
const router = useRouter()

function parseHTML (markdown: string) {
    marked.parse(markdown, {
        gfm: true,
        breaks: true,
        highlight: (code:string) => {
            return highlightjs.highlightAuto(code).value
        }
    }, (_err: Boolean, parseResult:string) => {
        html.value = parseResult
    })
}

watch(content, debounce((newContent:string) => {
    parseHTML(newContent)
}, 500), {
    immediate: true
})

onMounted(() => {
    if(!contentEditable.value) {
        throw Error('ContentEditable DOM node was not found')
    }
    contentEditable.value.innerText = content.value
})

function handleInput () {
    if(!contentEditable.value) {
        throw Error('ContentEditable DOM node was not found')
    }
    content.value = contentEditable.value?.innerText
}

async function handleClick () {
    const newPost: TimelinePost = {
        ...props.post,
        title: title.value,
        markdown: content.value,
        html: html.value
    }

    await posts.createPosts(newPost);
    router.push("/")
}

</script>

<template>
    <div class="columns">
        <div class="column">
            <div class="field">
                <div class="label">Post title</div>
                <input type="text" class="input" v-model="title">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column">
            <div contenteditable ref="contentEditable" @input="handleInput" />
        </div>
        <div class="column">
            <div v-html="html" />
        </div>
    </div>
    <div class="columns">
        <div class="column">
            <button class="button is-primary is-pulled-right" @click="handleClick">
                Save Post
            </button>
        </div>
    </div>
</template>