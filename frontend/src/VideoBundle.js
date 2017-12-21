export class VideoBundle {
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