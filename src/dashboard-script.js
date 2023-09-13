const UI_v1_handler = {
    selector: ".js-issue",
    get_all_tickets: function(){
        return document.querySelectorAll(this.selector);
    },
    get_ticket_id: function(ticket){
        return ticket.dataset.issueKey;
    },
    appendChild: function(ticket, child){
        ticket.appendChild(child);
    },
    version: "v1",
}

const UI_v2_handler = {
    selector: '[id^="card-GC-"], [id^="card-RCM-"]',
    get_all_tickets: function(){
        return document.querySelectorAll(this.selector);
    },  
    get_ticket_id: function(ticket){
        return ticket.id.replace("card-", "")
    },
    appendChild: function(ticket, child){
        ticket.querySelector('[class$="footer"]').parentElement.appendChild(child)
    },
    version: "v2",
}

function get_ui_handler(){
    // detect new UI
    if (document.querySelector(UI_v1_handler.selector)){
        return UI_v1_handler
    }
    return UI_v2_handler
}

function createCopyButton(ticketId) {
    clipboard_check_icon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="copy-GC copied bi bi-clipboard2-check-fill" viewBox="0 0 16 16"><path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z"/><path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5Zm6.769 6.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708Z"/></svg>'    
    clipboard_icon =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="copy-GC bi bi-clipboard2-fill" viewBox="0 0 16 16"><path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/><path d="M3.5 1h.585A1.498 1.498 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5c0-.175-.03-.344-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1Z"/></svg>'
    new_button = document.createElement("button");
    new_button.innerHTML = clipboard_icon;
    new_button.dataset.ticketId = ticketId;
    new_button.setAttribute('data-before-content','Copy ID')
    new_button.classList.add("copy-GC");
    return new_button;
}

function generateCopyButtonsOnScreen(event) {
    console.log("copy-GC running");
    ui_handler = get_ui_handler()
    all_tickets = ui_handler.get_all_tickets()
    all_tickets.forEach((ticket) => {
        if (null == ticket.querySelector("button.copy-GC")) {
            console.log(`Using handler ${ui_handler.version}`)
            ticketId = ui_handler.get_ticket_id(ticket)        
            copy_button = createCopyButton(ticketId);
            ui_handler.appendChild(ticket, copy_button);
        }
    });

    all_btns = document.querySelectorAll(".copy-GC");
    all_btns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();

            ticketId = event.target.dataset.ticketId;
            navigator.clipboard.writeText(ticketId);
            btn.innerHTML = clipboard_check_icon;
            console.log(`copied ${ticketId} to clipboard`);
            btn.classList.add("copied");
            btn.setAttribute('data-before-content',`Copied ${ticketId}`)

            setTimeout(() => {
                btn.innerHTML = clipboard_icon;
                btn.setAttribute('data-before-content','Copy ID')
            }, 700);
        });
    });
}

let lastInvocationTime = 0;
const DEBOUNCE_DELAY = 300; // milliseconds

function generateCopyButtonsDebounced() {
    const now = Date.now();
    if (now - lastInvocationTime > DEBOUNCE_DELAY) {
        generateCopyButtonsOnScreen();
        lastInvocationTime = now;
    }
}

// Search for card changes. This also allows for site scrolling.
let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            all_tickets = document.querySelectorAll(get_ui_handler().selector);
            if (all_tickets.length){
                generateCopyButtonsDebounced();
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
