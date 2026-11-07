chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "ask-wombat",
        title: "Ask Wombat",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "ask-wombat") {
        const textToExplain = info.selectionText;

        chrome.tabs.sendMessage(tab.id, {action: "explainText", text: textToExplain });
    }
});