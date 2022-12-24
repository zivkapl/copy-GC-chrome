async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.action.onClicked.addListener(async (tab) => {
    currentTab = await getCurrentTab();
    if (currentTab.url.startsWith("chrome://")) {
        console.log("Not running on chrome:// URLs");
        return;
    }

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
    });
});
