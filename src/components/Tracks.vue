<script setup lang="ts">
    import {computed,ref,onMounted,onUnmounted}  from 'vue'
    import {useAxios} from '@/composables/useAxios';
    import {type NowPlayingItem,type NowPlayingData} from "@/interfaces/NowPlayingTypes"
    import Track from "./Track.vue"


    const {data,error,isLoading} = useAxios<NowPlayingData>(`${import.meta.env.VITE_API_URI}`, 2000, true)

    const sortedNowPlaying = computed(() => {
        if (data.value && data.value.nowplaying) {
            const sorted: NowPlayingItem[] = [...data.value.nowplaying];
            const playingIndex: number = sorted.findIndex(item => item.status === "playing");
            if (playingIndex !== -1) {
                const [playingItem] = sorted.splice(playingIndex, 1);
                sorted.unshift(playingItem);
            }
            sorted.slice(1).sort((a, b) => (b.time.localeCompare(a.time)));
            return sorted;
        }
        return [];
    });
    const elapsed = ref(0);

    const elapsedTime = (trackStartTime:number) => {
      const now = new Date();
      return Math.floor((now.getTime() - new Date(trackStartTime).getTime()) / 1000);  
    };
    function timeToSeconds(timeString:String):number {
      const parts = timeString.split(":");
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      return hours * 3600 + minutes * 60 + seconds;
    }

    function secondsToTime(totalSeconds:number):string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        const seconds = totalSeconds - (hours * 3600) - (minutes * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    const progressBarWidth = (trackStartTime:any,trackDuration:any) => {
        elapsed.value = elapsedTime(trackStartTime);
        const percentagePlayed = Math.min((elapsed.value / timeToSeconds(trackDuration)) * 100, 100);  // Cap it at 100%
        return `${percentagePlayed}%`;
    }
    
    let interval:number;  

    onMounted(() => {
        interval = setInterval(() => {
          elapsed.value++;
        }, 1000);  
    });

    onUnmounted(() => {
        clearInterval(interval);  
    });

</script>
<template>
  <div class="container">
    <div v-if="error" class="error-message">{{error}}</div>
    <div v-if="isLoading" class="loading-message">Loading...</div>
    <Track v-else :nowplaying="sortedNowPlaying">
      <template v-slot:track="{ track }">
        <div class="track-item">
          <img :src="track.imageUrl" alt="Album cover" class="album-cover">
          <div class="track-details">
            <h2>{{ track.title }}</h2>
            <p>{{ track.artist }}</p>
            <div v-if="track.status === 'playing'" class="progress-bar-container">
              <div class="progress-bar" :style="{ width: progressBarWidth(track.time,track.duration) }"></div>
              <div class="time-display">
                {{ secondsToTime(elapsed) }} / {{ track.duration }}
              </div>
            </div>
            <div class="track-info">
              <a :href="track.iTunesTrackUrl" class="itunes-link">Listen on iTunes</a>
              <span>Status: {{ track.status }}</span>
              <time>Starting Time: {{ track.time }}</time>
            </div>
          </div>
        </div>
      </template>
    </Track>
  </div>
</template>
<style lang="scss">
// Variables
$font-primary: 'Arial', sans-serif;
$color-background: #121212;
$color-text: #fff;
$color-subtext: #aaa;
$color-link: #1DB954;  // Spotify green for contrast
$color-youtube-red: #FF0000;
$color-progress-background: #333;

// Mobile First Styles
.container {
  font-family: $font-primary;
  background-color: $color-background;
  color: $color-text;
  padding: 1rem;
  li{
    list-style-type: none;
  }
  .error-message,
  .loading-message {
    padding: 0.5rem;
    border: 1px solid red;
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 0.3rem;
    margin-bottom: 1rem;
  }

  .track-item {
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    .progress-bar {
      height: 100%;
      background-color: #FF0000; /* YouTube Red */
      transition: width 0.5s;
    }
    .album-cover {
      width: 60%;
      max-width: 300px;
      margin-bottom: 1rem;
      border-radius: 0.3rem;
    }

    .track-details h2 {
      margin-bottom: 0.5rem;
      color: $color-text;
    }

    .track-details p {
      margin: 0.5rem 0;
      color: $color-subtext;
    }

    .track-info {
      text-align: center;
      margin-top: 1rem;
    }
  }

  .itunes-link {
    color: $color-link;
    text-decoration: none;
    margin-bottom: 0.5rem;
  }
  .progress-bar-container {
    width: 100%;
    height: 0.2rem;
    background-color: $color-progress-background;
    border-radius: 0.1rem;
    margin-top: 0.5rem;
    position: relative;

    .progress-bar {
      position: absolute;
      height: 100%;
      background-color: $color-youtube-red;
      transition: width 0.5s;
    }

    .time-display {
      margin-top: -1.5rem;
      font-size: 0.8em;
      color: $color-subtext;
      display: flex;
      position: absolute;
      justify-content: flex-end;
      width: 100%;
    }
  }
}

// Desktop Styles
@media (min-width: 600px) {
  .container {
    padding: 2rem;

    .track-item {
      flex-direction: row;
      align-items: flex-start;

      .album-cover {
        width: 80px;
        height: 80px;
        margin-right: 1.5rem;
      }

      .track-details {
        flex: 1;

        .track-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }
      }
    }
    .progress-bar-container {
      height: 0.4rem;
      .time-display {
        margin-top: -2rem;
      }
    }
  }
}

</style>