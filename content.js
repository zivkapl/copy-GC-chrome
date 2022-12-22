function fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand("copy");
        let msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
}

function copyToClipboard(text) {
    if (!navigator.clipboard || window.isSecureContext) {
        fallbackCopyTextToClipboard(text);
    } else {
        navigator.clipboard.writeText(text).then(
            function () {
                console.log("Async: Copying to clipboard was successful!");
            },
            function (err) {
                console.error("Async: Could not copy text: ", err);
            }
        );
    }
}

function parseQuery(queryStr) {
    res = {};
    queryStr.split("&").forEach((item) => {
        item = item.replace("?", "").split("=");
        res[item[0]] = item[1];
    });
    return res;
}

(function main() {
    console.log("Chrome extension copy-GC running");

    let url = new URL(window.location.href);

    if ("guardicore.atlassian.net" != url.hostname) {
        alert("Not working on this site.");
        return;
    }

    ticket_id = "";
    // if ticket modal view
    if (url.search.startsWith("?modal")) {
        query = parseQuery(url.search);
        ticket_id = query.selectedIssue;
    }
    // if ticket view
    else if (url.pathname.startsWith("/browse/GC-")) {
        ticket_id = url.pathname.replace("/browse/", "");
    } else {
        alert("No issue selected");
        return;
    }

    copyToClipboard(ticket_id);
    alert(`Copied ${ticket_id} to clipbaord`);
})();
