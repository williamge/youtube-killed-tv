/* global YT */

import { Stream } from './Stream';

function * videoList() {
    yield {videoId: '1n_LBpCkOjU', startTime: 580 };

    while(true) {
        yield {videoId: 'Cnchea6LHN0', startTime: 0 };
    }
}

const nextVideo = videoList();

function getNextVideo() {
    return nextVideo.next().value;
}

function reportError(event) {
    console.warn('error from youtube player reported:', event);
}

export class YoutubePlayerService {
    constructor() {
        this.isYoutubeApiReady = new Stream(false);
        this._player = null;
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
                    event.target.playVideo();
                },
                onStateChange: ({ data }) => {
                    switch (data) {
                        case YT.PlayerState.ENDED:
                            this.nextVideo();
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

    nextVideo() {
        if (this._player == null) {
            console.warn('Tried to call nextVideo with no player instance');
            return;
        }

        const {videoId, startTime} = getNextVideo();

        this._player.loadVideoById(videoId, startTime)
    }

    _onAPIReady() {
        this.isYoutubeApiReady.set(true);
        console.log('api loaded');
    }
}