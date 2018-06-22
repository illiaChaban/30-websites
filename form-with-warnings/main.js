const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const username = document.getElementById('username')
const email = document.getElementById('email');
const password = document.getElementById('password')
const passwordWeakness = document.getElementById('password-weakness');
const retypePassword = document.getElementById('retype-passw');
const avatar = document.getElementById('avatar');
const progressBar = document.querySelector('.progress-bar > span');


const submitBtn = document.getElementById('submit')

let state = {
    hasUserName: false,
    correctEmail: false,
    strongPassword: false,
    retypePasswordMatch: false,
}

const usernameCorrect = document.querySelector('#username-div > .correct');
const usernameWrong = document.querySelector('#username-div > .wrong');
username.addEventListener('input', (e) => {
    let text = e.target.value;
    if (text) {
        usernameCorrect.style.display = 'inline';
        usernameWrong.style.display = 'none';
        state.hasUserName = true;
    } else {
        usernameCorrect.style.display = 'none';
        usernameWrong.style.display = 'inline';
        state.hasUserName = false;
    }
})

const emailVerifier = /(@)(.+)$/;
const emailCorrect = document.querySelector('#email-div > .correct');
const emailWrong = document.querySelector('#email-div > .wrong');
email.addEventListener('input', (e) => { 
    let text = e.target.value;
    if (text.match(emailVerifier)) {
        emailCorrect.style.display = 'inline';
        emailWrong.style.display = 'none';
        state.correctEmail = true;
    } else {
        emailCorrect.style.display = 'none';
        emailWrong.style.display = 'inline';
        state.correctEmail = false;
    }
})


const passwordStrong = document.querySelector('#password-div > .correct');
const passwordWeak = document.querySelector('#password-div > .wrong');
password.addEventListener('focus', () => {
    if (! state.strongPassword ) {
        passwordWeakness.style.display = 'inline';
        passwordStrong.style.display = 'none';
        passwordWeak.style.display = 'none';
    } 
})

password.addEventListener('blur', () => {
    passwordWeakness.style.display = 'none'
    if (! state.strongPassword) {
        passwordWeak.style.display = 'inline';
    } else {
        passwordStrong.style.display = 'inline';        
    }
})

const long = document.querySelector('#characters-long');
const uppercase = document.querySelector('#uppercase');
const lowercase = document.querySelector('#lowercase');
const digits = document.querySelector('#digits');
const nonAlpha = document.querySelector('#non-alpha');
getProgress = () => {
    let p = password.value
    let passwInRange = p.length >= 4 && p.length <= 10;
    let hasUppercase = (/[A-Z]/).test(p);
    let hasLowercase = (/[a-z]/).test(p);
    let hasDigits = (/[0-9]/).test(p);
    let hasNonAlpha = (/[^a-zA-Z\d\s:]/).test(p);

    // get progress and hightlight rules if ok
    let progress = 0;
    if ( passwInRange ) {
        progress += 20/7 * (p.length - 3);
        long.setAttribute('class', 'green');
        long.querySelector('.correct').style.display = 'inline';
    } else {
        long.setAttribute('class', '');
        long.querySelector('.correct').style.display = 'none';
    }
    if ( hasUppercase ) {
        progress += 20;
        uppercase.setAttribute('class', 'green');
        uppercase.querySelector('.correct').style.display = 'inline';
    } else {
        uppercase.setAttribute('class', '');
        uppercase.querySelector('.correct').style.display = 'none';
    }
    if ( hasLowercase ) {
        progress += 20;
        lowercase.setAttribute('class', 'green');
        lowercase.querySelector('.correct').style.display = 'inline';
    } else {
        lowercase.setAttribute('class', '');
        lowercase.querySelector('.correct').style.display = 'none';
    }
    if ( hasDigits ) {
        progress += 20;
        digits.setAttribute('class', 'green');
        digits.querySelector('.correct').style.display = 'inline';
    } else {
        digits.setAttribute('class', '');
        digits.querySelector('.correct').style.display = 'none';
    }
    if ( hasNonAlpha ) {
        progress += 20;
        nonAlpha.setAttribute('class', 'green');
        nonAlpha.querySelector('.correct').style.display = 'inline';
    } else {
        nonAlpha.setAttribute('class', '');
        nonAlpha.querySelector('.correct').style.display = 'none';
    }

    //change color of a progress bar 
    if ( progress <= 40) { progressBar.style.backgroundColor = 'red'; }
    else if ( progress <= 80 ) { progressBar.style.backgroundColor = 'yellow'; }
    else { progressBar.style.backgroundColor = 'rgb(43,194,83)'; }

    progressBar.style.width = `${progress}%`;

    return progress;
}

password.addEventListener('input', () => {
    let progress = getProgress();
    if (progress > 80) {
        // passwordWeakness.style.display = 'none';
        // passwordStrong.style.display = 'inline';
        state.strongPassword = true;
    } else {
        passwordWeakness.style.display = 'inline';
        passwordStrong.style.display = 'none';
        state.strongPassword = false;
    }
})


const retypeMatch = document.querySelector('#retype-div > .correct');
const retypeDontMatch = document.querySelector('#retype-div > .wrong');
retypePassword.addEventListener('input', () => {
    let match = password.value === retypePassword.value;
    if (match) {
        retypeMatch.style.display = 'inline';
        retypeDontMatch.style.display = 'none';
        state.retypePasswordMatch = true;
    } else {
        retypeMatch.style.display = 'none';
        retypeDontMatch.style.display = 'inline';
        state.retypePasswordMatch = false;
    }
})


submitBtn.addEventListener('click', () => {
    if ( stateAllTrue(state) ) {
        localStorage.form = JSON.stringify(
            {
                fname: fname.value,
                lname: lname.value,
                username: username.value,
                email: email.value,
                password: password.value,
                avatar: avatar.value,
            }
        )
        window.location.href='submitted.html'
    } else {
        document.querySelector('#submit + span').style.display = 'inline';
    }
})

