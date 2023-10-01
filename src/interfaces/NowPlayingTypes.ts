export interface NowPlayingItem {
    artist: string;
    duration: string;
    iTunesTrackUrl: string;
    imageUrl: string;
    status: "playing" | "history";
    time: string;
    title: string;
}
  
export interface NowPlayingData {
    nowplaying: NowPlayingItem[];
}
