export class VideoBundle {
    constructor(videoIds) {
        this.videoIds = videoIds;
        this.currentPart = -1;
    }

    hasMoreParts() {
        return this.videoIds.length - 1 !== this.currentPart;
    }

    nextPartId() {
        this.currentPart++;

        if (this.currentPart >= this.videoIds.length) {
            throw new Error("we went too far with nextPartId");
        }

        return {
            videoId: this.videoIds[this.currentPart],
            startTime: 0
        };
    }
}