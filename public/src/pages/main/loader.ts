export const MainLoader = async () => {
    await delay(1000);
    return {};
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}
