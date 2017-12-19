/* global YT */

import { Stream } from './Stream';

function * videoList() {
    yield ['1n_LBpCkOjU'];

    while(true) {
        yield ['Cnchea6LHN0'];
    }
}

const nextVideo = videoList();

function getNextVideoBundle() {
    const videoIds = nextVideo.next().value;
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

    skipVideo() {
        if (this._player == null) {
            console.warn('Tried to call skipVideo with no player instance');
            return;
        }

        this._currentVideoBundle = getNextVideoBundle();

        this._loadNextVideoPart();
    }

    _loadNextVideoPart() {
        if (!this._currentVideoBundle.hasMoreParts()) {
            this._currentVideoBundle = getNextVideoBundle();  
        }

        const { videoId, startTime } = this._currentVideoBundle.nextPartId();
            
        this._player.loadVideoById(videoId, startTime)
    }

    _onAPIReady() {
        this.isYoutubeApiReady.set(true);
        console.log('api loaded');
    }
}