const canvas = document.querySelector("canvas"),
      body = document.querySelector("body"),
      mousePlaceholder = document.querySelector(".mousePlaceholder");

let mouseRecordings = [],
    playTimeout = 1000,
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
    let mouseInfo = { x, y, timeDifferenceBetweenRecords, type, e};
    mouseRecordings.push( mouseInfo );
};

function timeoutPlayRecording() {
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
                mousePlaceholder.setAttribute("style", `left: ${x}px; top: ${y}px;`);
                setTimeout( () => playRecording( ++index ), timeDifferenceBetweenRecords );
        }
    } else {
        // hide mouse placeholder if last recording was played
        mousePlaceholder.classList.add("hide");
    }
};

function playMouseClick(x,y) {
    let clickEl = document.createElement("div");
    body.appendChild( clickEl );
    clickEl.className = "mousePlaceholder click";
    clickEl.setAttribute("style", `left: ${x}px; top: ${y}px;`);

    let animationDuration = 700;
    setTimeout( () => clickEl.remove(), animationDuration );
};
