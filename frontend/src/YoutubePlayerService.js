/* global YT */

import { Stream } from './Stream';
import { getNextVideoIds } from './VideoApi';

let countOfPlayedVideos = 0;
let startupSeed = 5;

async function getNextVideoBundle() {
    const videoIds = await getNextVideoIds(startupSeed + (countOfPlayedVideos++));
    return new VideoBundle(videoIds);
}

function reportError(event) {
    console.warn('error from youtube player reported:', event);
}

class VideoBundle {
    constructor(videoIds) {
        this._videoIds = videoIds;
        this.currentPart = -1;
    }

    hasMoreParts() {
        return this._videoIds.length - 1 !== this.currentPart;
    }

    nextPartId() {
        this.currentPart++;

        if (this.currentPart >= this._videoIds.length) {
            throw new Error("we went too far with nextPartId");
        }

        return {
            videoId: this._videoIds[this.currentPart],
            startTime: 0
        };
    }
}

export class YoutubePlayerService {
    constructor() {
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
                            this._loadNextVideoPart();
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
        if (this._player == null) {
            this._playerWidth = width;
            this._playerHeight = height;
            
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

        this._currentVideoBundle = await getNextVideoBundle();

        this._loadNextVideoPart();
    }

    async _loadNextVideoPart() {
        if (!this._currentVideoBundle.hasMoreParts()) {
            this._currentVideoBundle = await getNextVideoBundle();  
        }

        const { videoId, startTime } = this._currentVideoBundle.nextPartId();
            
        this._player.loadVideoById(videoId, startTime)
    }

    _onAPIReady() {
        this.isYoutubeApiReady.set(true);
        console.log('api loaded');
    }
}