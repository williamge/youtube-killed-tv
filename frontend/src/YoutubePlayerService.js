/* global YT */

import { VideoBundle } from './VideoBundle';

function accumulateInLocalStorage(key, itemToAdd) {
    const jsonBlob = localStorage.getItem(key);

    const parsedList = (jsonBlob === null) ? [] : JSON.parse(jsonBlob);

    const newList = parsedList.concat(itemToAdd);

    localStorage.setItem(key, JSON.stringify(newList));
}

//TODO: send this data back to the server
function reportError(event) {
    console.warn('error from youtube player reported:', event);
}

function getCurrentEpochSeconds() {
    return Math.round((new Date()).getTime() / 1000);
}

function reportSkip(videoBundle) {
    const SKIPS_KEY = 'skips';

    const blobToSend = {
        first_video_id: videoBundle.videoIds[0],
        part_skipped_on: videoBundle.currentPart,
        time: getCurrentEpochSeconds()
    };

    fetch(`/api/reportSkip`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blobToSend)
    }).then((response) => {
        if (!response.ok) {
            accumulateInLocalStorage(SKIPS_KEY, blobToSend)
        }
    }).catch(() => {
        accumulateInLocalStorage(SKIPS_KEY, blobToSend)
    });
}

export function loadYoutubeApi(videoStore) {
    return new Promise((resolve, reject) => {
        if (window.onYouTubeIframeAPIReady != null) {
            return reject(new Error("A YouTube iframe player was already loaded"));
        }

        window.onYouTubeIframeAPIReady = () => {
            console.log('youtube api ready');
            resolve(new YoutubePlayerService(videoStore));
        };
    
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
};

export class YoutubePlayerService {
    constructor(videoStore) {
        this.videoStore = videoStore;

        this._player = null;

        this._currentVideoBundle = null;

        this._playerWidth = 640;
        this._playerHeight = 480;
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

        reportSkip(this._currentVideoBundle);

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
}