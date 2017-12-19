//experimental

async function getNextVideo(currentVideoId, seed) {
    const response = await fetch(`/getNextVideo/${currentVideoId}?seed=${seed}`);

    if (!response.ok) {
        throw new Error('whatever', response);
    }

    const json = await response.json();

    // const json = {
    //     ids: ['asdqd12', 'sd1d12d1d', 'sdfwd_asda', 'asd12d']
    // }

    return json;
}