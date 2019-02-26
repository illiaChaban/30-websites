const body = document.querySelector("body"),
      canvas = body.querySelector("canvas"),
      mousePlaceholder = body.querySelector(".mousePlaceholder");

let mouseRecordings = [],
    playTimeout = 500,
    playTimeoutIndex, 
    lastTimeStamp;


window.onload = function() {
    canvas.addEventListener("mouseover", resetRecording);
    canvas.addEventListener("mousemove", recordMouse);
    canvas.addEventListener("click", recordMouse);
    canvas.addEventListener("mouseout", timeoutPlayRecording);
};

function resetRecording(e) {
    clearTimeout( playTimeoutIndex );
    mouseRecordings = [];
    lastTimeStamp = e.timeStamp;
};

function recordMouse(e) {
    let { x, y, type, timeStamp } = e;
    // find relative timeStamp
    let timeDifferenceBetweenRecords = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
    // saving event info to array
    let mouseInfo = { x, y, timeDifferenceBetweenRecords, type};
    mouseRecordings.push( mouseInfo );
};

function timeoutPlayRecording() {
    // playing recording after timeout,
    // saving setTimeuot index to stop recording if 
    // user mouse over canvas while recording is playing
    playTimeoutIndex = setTimeout( () => { 
        mousePlaceholder.classList.remove("hide");
        playRecording(0);
        // console.table( mouseRecordings );
    }, playTimeout );
};

function playRecording(index) {
    let currMouseRecording = mouseRecordings[index];
    if ( currMouseRecording ) {
        let { x, y, timeDifferenceBetweenRecords, type } = currMouseRecording;
        switch (type) {
            case "click":
                playMouseClick(x,y);
            default:
                setPosition( mousePlaceholder, x, y );
                // playing next recording
                setTimeout( () => playRecording( ++index ), timeDifferenceBetweenRecords );
        }
    } else {
        // hide mouse placeholder if last recording was played
        mousePlaceholder.classList.add("hide");
    }
};

function setPosition( el, left, top) {
    el.setAttribute("style", `left: ${left}px; top: ${top}px;`);
};

function playMouseClick(x,y) {
    // creating new element that will play click animation
    let clickEl = document.createElement("div");
    body.appendChild( clickEl );
    clickEl.className = "mousePlaceholder click";
    setPosition( clickEl, x, y );

    // removing the element after the animation
    let animationDuration = 700;
    setTimeout( () => clickEl.remove(), animationDuration );
};
