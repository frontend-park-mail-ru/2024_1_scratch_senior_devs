const DELAY = 0

export const HomeLoader = async () => {
    await delay(DELAY);
    return {};
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}
