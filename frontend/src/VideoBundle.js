export class VideoBundle {
    constructor(videoIds) {
        this._videoIds = videoIds;
        this._currentPart = -1;
    }

    hasMoreParts() {
        return this._videoIds.length - 1 !== this._currentPart;
    }

    nextPartId() {
        this._currentPart++;

        if (this._currentPart >= this._videoIds.length) {
            throw new Error("we went too far with nextPartId");
        }

        return {
            videoId: this._videoIds[this._currentPart],
            startTime: 0
        };
    }
}