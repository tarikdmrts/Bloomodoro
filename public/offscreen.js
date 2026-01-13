chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'PLAY_SOUND') {
        const audio = new Audio(message.soundUrl);
        audio.play().catch(err => console.log('Audio play failed:', err));
    }
});
