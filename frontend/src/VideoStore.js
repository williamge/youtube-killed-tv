import { getNextVideoIds } from './VideoApi';
import { VideoBundle } from './VideoBundle';

export class VideoStore {
    constructor(seed) {
        this._seed = seed;

        this.videoBundles = [];
        this.currentVideoIndex = -1;
    }

    async nextVideo() {
        await this._ensureWeHaveEnoughVideos();

        this.currentVideoIndex++;
        return this.videoBundles[this.currentVideoIndex];
    }

    async _ensureWeHaveEnoughVideos() {
        if (this.videoBundles.length - this.currentVideoIndex < 5) {
            const newVideos = await getNextVideoIds(this._seed + this.currentVideoIndex);
            const newVideoBundles = newVideos.map(videoJson => new VideoBundle(videoJson.videoIds));
            this.videoBundles = this.videoBundles.concat(newVideoBundles);

            return;
        }
    }
}
