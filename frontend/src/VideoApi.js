export async function getNextVideoIds(seed) {
    const response = await fetch(`/api/getNextVideo?seed=${seed}`);

    if (!response.ok) {
        throw new Error('whatever', response);
    }

    const json = await response.json();

    // const json = {
    //     data: [{
    //         video_ids: ['asdqd12', 'sd1d12d1d', 'sdfwd_asda', 'asd12d']
    //     }]
    // }

    return json.data.map(videoJson => ({
        videoIds: videoJson.video_ids
    }));
}