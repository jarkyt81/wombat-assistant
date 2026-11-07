const doomScrollCheckBox = document.getElementById("toggle-antidoomscroll")

chrome.storage.local.get(["antiDoomScrollEnabled"], (result) => {
    if (result.antiDoomScrollEnabled !== undefined) {
        doomScrollCheckBox.checked = result.antiDoomScrollEnabled;
    } else {
        doomScrollCheckBox.checked = true;
    }
});

doomScrollCheckBox.addEventListener("change", () => {
    const enabled = doomScrollCheckBox.checked;

    chrome.storage.local.set({ antiDoomScrollEnabled: enabled }, () => {
        console.log("antidoomscroll setting: ", enabled);
    });
});

