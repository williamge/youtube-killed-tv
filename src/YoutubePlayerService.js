/* global YT */

import { Stream } from './Stream';

function * videoList() {
    yield '1n_LBpCkOjU';

    while(true) {
        yield 'Cnchea6LHN0';
    }
}

const nextVideo = videoList();

function getNextVideoId() {
    return nextVideo.next().value;
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

        this._player.loadVideoById(getNextVideoId())
    }

    _onAPIReady() {
        this.isYoutubeApiReady.set(true);
        console.log('api loaded');
    }
}