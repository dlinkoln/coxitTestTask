<script setup lang="ts" >
    import {type NowPlayingData} from "@/interfaces/NowPlayingTypes"
    const props = defineProps<NowPlayingData>()
</script>
<template>
    <div class="track">
        <ul v-if="props">
            <li v-for="track in props.nowplaying" :key="track.title+Date.now()">
                <slot name="track" :track="track"></slot>
            </li>
        </ul>
    </div>
</template>
<style scoped lang="scss"></style>