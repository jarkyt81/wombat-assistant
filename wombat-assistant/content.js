const wombat = document.createElement('div');
const bubble = document.createElement('div');

const wombatIdle = chrome.runtime.getURL('images/wombat-idle.png');
const wombatBlink = chrome.runtime.getURL('images/wombat-blink.png');
const wombatTalk = chrome.runtime.getURL('images/wombat-talk.png');

wombat.id = 'wombat-assistant';
bubble.id = 'wombat-bubble';
wombat.style.backgroundImage = `url(${wombatIdle})`;

document.body.appendChild(wombat);
document.body.appendChild(bubble);

let state = 'idle';
let mouthOpen = false;
let blinkTimeout = null;
let talkTimeout = null;
let talkTimer = null;
let antiDoomScrollingInterval = null;
let antiDoomScrollingEnabled = false;

function render() {
    let sprite = wombatIdle;
    if (state === 'blink') sprite = wombatBlink;
    if (state === 'talk' && mouthOpen) sprite = wombatTalk;
    wombat.style.backgroundImage = `url(${sprite})`;
}
 
function setState(next) {
    state = next;
    mouthOpen = false;
    render();
}

function updateBubblePosition() {
    const rect = wombat.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let bubbleLeft = rect.right + 10;
    let bubbleTop = rect.top + 10;

    bubble.style.left = bubbleLeft + 'px';
    bubble.style.top = bubbleTop + 'px';

    const bubbleRect = bubble.getBoundingClientRect();

    if (bubbleRect.bottom > viewportHeight) {
    bubbleTop = rect.top - bubbleRect.height - 10;
    }

    if (bubbleRect.right > viewportWidth) {
    bubbleLeft = rect.left - bubbleRect.width - 10;
    }

    bubble.style.left = bubbleLeft + 'px';
    bubble.style.top = bubbleTop + 'px';
}

function blinkWombat() {
    setInterval(() => {
        if (state !== 'idle') return;
 
        setState('blink');
        clearTimeout(blinkTimeout);

        blinkTimeout = setTimeout(() => {
            if (state === 'blink') setState('idle');
        }, 200);
    }, 4000);
}

function moveWombat() {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    wombat.addEventListener('pointerdown', (e) => {
        dragging = true;

        const rect = wombat.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        wombat.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    wombat.addEventListener('pointermove', (e) => {
        if (!dragging) return;

        wombat.style.left = `${e.clientX - offsetX}px`;
        wombat.style.top = `${e.clientY - offsetY}px`;
        updateBubblePosition();
    });

    function stopDragging() {
        dragging = false;
    }

    wombat.addEventListener('pointerup', stopDragging);
    wombat.addEventListener('pointercancel', stopDragging);
}

function toggleWombatVisibility() {
    if (document.fullscreenElement !== null) {
        wombat.classList.add('hidden');
    } else {
        wombat.classList.remove('hidden');
    }
}

function checkVideoStatus() {
    document.addEventListener('fullscreenchange', toggleWombatVisibility);
    toggleWombatVisibility();
}

function talkWombat(text, duration) {
    if (talkTimeout !== null) clearTimeout(talkTimeout);
    if (talkTimer !== null) clearInterval(talkTimer);
    clearTimeout(blinkTimeout);
 
    setState('talk');
    bubble.textContent = text;
    bubble.style.display = 'block';
    updateBubblePosition();
 
    talkTimer = setInterval(() => {
        mouthOpen = !mouthOpen;
        render();
    }, 75);
 
    talkTimeout = setTimeout(() => {
        clearInterval(talkTimer);
        bubble.style.display = 'none';
        talkTimeout = null;
        talkTimer = null;
        setState('idle');
    }, duration);
}

function antiDoomScrolling() {
    const domains = ["instagram.com/reels", "youtube.com/shorts"];
    
    let lastUrl = window.location.href;
    let videosCount = 0;
    
    antiDoomScrollingInterval = setInterval(() => {
        if (!antiDoomScrollingEnabled) return;

        const isDomain = domains.some(feed => window.location.href.includes(feed));

        if (isDomain) {
            const currentUrl = window.location.href;

            if (currentUrl !== lastUrl) {
                videosCount++;
                console.log("Doomscrolling count:", videosCount);
                lastUrl = currentUrl;

                if (videosCount >= 10) {
                    talkWombat("Stop scrolling!", 4000);
                    videosCount = 0;
                }
            }
        } else {
            videosCount = 0;
        }
    }, 1000);
}

chrome.storage.local.get(["antiDoomScrollEnabled"], (result) => {
    antiDoomScrollingEnabled = result.antiDoomScrollEnabled || false;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.antiDoomScrollEnabled) {
        antiDoomScrollingEnabled = changes.antiDoomScrollEnabled.newValue;
    }
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "explainText") {
        talkWombat("Hmm... Let me think...", 2000)

        fetch("http://127.0.0.1:5000/explain", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => response.json())
        .then(data => {
            talkWombat(data.message, 7000)
        })
        .catch(error => {
            console.error("Network error", error)
            talkWombat("Oops, I can't reach my server", 3000)
        })
    }
})

checkVideoStatus();
antiDoomScrolling();
blinkWombat();
moveWombat();
