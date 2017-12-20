//experimental

export async function getNextVideoIds(currentVideoId, seed) {
    // const response = await fetch(`/api/getNextVideo/${currentVideoId}?seed=${seed}`);
    const response = await fetch(`/api/getNextVideo`);

    if (!response.ok) {
        throw new Error('whatever', response);
    }

    const json = await response.json();

    return json.data.video_ids;

    // const json = {
    //     data: {
    //         ids: ['asdqd12', 'sd1d12d1d', 'sdfwd_asda', 'asd12d']
    //     }
    // }
}