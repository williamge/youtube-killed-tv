export async function getNextVideoIds(seed) {
    const response = await fetch(`/api/getNextVideo?seed=${seed}`);

    if (!response.ok) {
        throw new Error('whatever', response);
    }

    const json = await response.json();

    return json.data.map(videoJson => ({
        videoIds: videoJson.video_ids
    }));
}