/* global YT */

import { Stream } from './Stream';
import { VideoBundle } from './VideoBundle';

//TODO: send this data back to the server
function reportError(event) {
    console.warn('error from youtube player reported:', event);
}

export class YoutubePlayerService {
    constructor(videoStore) {
        this.videoStore = videoStore;

        this.isYoutubeApiReady = new Stream(false);
        this._player = null;

        this._currentVideoBundle = null;

        this._playerWidth = 640;
        this._playerHeight = 480;
    }

    loadIframePlayer() {
        if (window.onYouTubeIframeAPIReady != null) {
            throw new Error("A YouTube iframe player was already loaded")
        }

        window.onYouTubeIframeAPIReady = this._onAPIReady.bind(this);

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    createPlayerOn(container) {
        const player = new YT.Player(container, {
            videoId: "ksZh-FHuKpk",
            width: this._playerWidth,
            height: this._playerHeight,
            events: {
                onReady: (event) => {
                    this._currentVideoBundle = new VideoBundle(['ksZh-FHuKpk']);
                    this._currentVideoBundle.nextPartId(); // we're about to play the video at this stage, so go to the next part already
                    event.target.playVideo();
                },
                onStateChange: ({ data }) => {
                    switch (data) {
                        case YT.PlayerState.ENDED:
                            this._playNextYoutubeVideo();
                            break;
                        default:
                    }
                },
                onError: (event) => {
                    reportError(event);
                }
            }
        });

        this._player = player;
    }

    resizePlayer(width, height) {
        this._playerWidth = width;
        this._playerHeight = height;

        if (this._player == null) {            
            console.warn('Tried to call resizePlayer with no player instance');
            return;
        }
        
        this._player.setSize(width, height);
    }

    async skipVideo() {
        if (this._player == null) {
            console.warn('Tried to call skipVideo with no player instance');
            return;
        }

        this._currentVideoBundle = await this.videoStore.nextVideo();

        await this._playNextYoutubeVideo();
    }

    // Note: The next youtube video could be a new video, or the next part of the same 
    // video series (i.e. episode 1 part 1 -> episode 1 part 2)
    async _playNextYoutubeVideo() {
        if (!this._currentVideoBundle.hasMoreParts()) {
            this._currentVideoBundle = await this.videoStore.nextVideo();  
        }

        const { videoId, startTime } = this._currentVideoBundle.nextPartId();
            
        this._player.loadVideoById(videoId, startTime)
    }

    _onAPIReady() {
        this.isYoutubeApiReady.set(true);
        console.log('youtube api loaded');
    }
}