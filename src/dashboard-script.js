CONSTANTS = {
    copyIconId: "copy-GC",
};

function createClipboardIcon() {
    clipboard_icon = document.createElement("svg");
    clipboard_icon.classList.add("copy-GC", "bi", "bi-clipboard2-fill");
    clipboard_icon.setAttribute("id", CONSTANTS.copyIconId);
    clipboard_icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clipboard_icon.setAttribute("width", "16");
    clipboard_icon.setAttribute("height", "16");
    clipboard_icon.setAttribute("fill", "currentColor");
    clipboard_icon.setAttribute("viewbox", "0 0 16 16");

    path_el_1 = document.createElement("path");
    path_el_1.setAttribute(
        "d",
        "M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"
    );

    path_el_2 = document.createElement("path");
    path_el_2.setAttribute(
        "d",
        "M3.5 1h.585A1.498 1.498 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5c0-.175-.03-.344-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1Z"
    );

    createClipboardCheckIcon.appendChild(path_el_1);
    createClipboardCheckIcon.appendChild(path_el_2);
    return clipboard_icon;
}

function createClipboardCheckIcon() {
    clipboard_check_icon = document.createElement("svg");
    clipboard_check_icon.classList.add(
        "copy-GC",
        "copied",
        "bi",
        "bi-clipboard2-check-fill"
    );
    clipboard_icon.setAttribute("id", CONSTANTS.copyIconId);
    clipboard_check_icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clipboard_check_icon.setAttribute("width", "16");
    clipboard_check_icon.setAttribute("height", "16");
    clipboard_check_icon.setAttribute("fill", "currentColor");
    clipboard_check_icon.setAttribute("viewbox", "0 0 16 16");

    path_el_1 = document.createElement("path");
    path_el_1.setAttribute(
        "d",
        "M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z"
    );

    path_el_2 = document.createElement("path");
    path_el_2.setAttribute(
        "d",
        "M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5Zm6.769 6.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708Z"
    );

    createClipboardCheckIcon.appendChild(path_el_1);
    createClipboardCheckIcon.appendChild(path_el_2);
    return clipboard_check_icon;
}

function createCopyButton(ticketId) {
    new_button = document.createElement("button");
    new_button.appendChild(createClipboardIcon());
    new_button.dataset.ticketId = ticketId;
    new_button.setAttribute("data-before-content", "Copy ID");
    new_button.classList.add("copy-GC");
    return new_button;
}

function generateCopyButtonsOnScreen(event=null) {
    console.log("copy-GC running");
    all_tickets = document.querySelectorAll(".js-issue");

    console.log(all_tickets);

    all_tickets.forEach((ticket) => {
        if (null == ticket.querySelector("button.copy-GC")) {
            ticketId = ticket.dataset.issueKey;
            copy_button = createCopyButton(ticketId);
            ticket.appendChild(copy_button);
        }
    });

    all_btns = document.querySelectorAll(".copy-GC");
    all_btns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();

            ticketId = event.target.dataset.ticketId;
            navigator.clipboard.writeText(ticketId);
            btn.removeChile(btn.getElementById(CONSTANTS.copyIconId));
            btn.appendChild(createClipboardCheckIcon());
            console.log(`copied ${ticketId} to clipboard`);
            btn.classList.add("copied");
            btn.setAttribute("data-before-content", `Copied ${ticketId}`);

            setTimeout(() => {
                btn.removeChile(btn.getElementById(CONSTANTS.copyIconId));
                btn.appendChild(createClipboardIcon());
                btn.setAttribute("data-before-content", "Copy ID");
            }, 700);
        });
    });
}


window.addEventListener("DOMContentLoaded", generateCopyButtonsOnScreen);
window.addEventListener("load", generateCopyButtonsOnScreen);
window.addEventListener("readystatechange", generateCopyButtonsOnScreen);

const observeUrlChange = () => {
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                generateCopyButtonsOnScreen();
            }
        });
    });
    observer.observe(body, { childList: true, subtree: true });
};

window.onload = observeUrlChange;
