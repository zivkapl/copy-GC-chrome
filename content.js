function copyToClipboard(text) {
    let copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand("copy");
    copyFrom.blur();
    document.body.removeChild(copyFrom);
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
    alert(`Copied ${ticket_id} successfully`);
    return;
})();
