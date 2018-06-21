const email = document.getElementById('email');
const username = document.getElementById('username')
const password = document.getElementById('password')
const passwordWeakness = document.getElementById('password-weakness');

const submitBtn = document.getElementById('submit')

let state = {
    // hasFirstName: false,
    // hasLastName: false,
    hasUserName: false,
    correctEmail: false,
    strongPassword: false,
    retypePasswordMatch: false,
}

const usernameCorrect = document.getElementById('username-div').getElementsByClassName('correct')[0];
const usernameWrong = document.getElementById('username-div').getElementsByClassName('wrong')[0];
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
const emailCorrect = document.getElementById('email-div').getElementsByClassName('correct')[0];
const emailWrong = document.getElementById('email-div').getElementsByClassName('wrong')[0];
email.addEventListener('input', (e) => { 
    let text = e.target.value;
    if (text.match(emailVerifier)) {
        emailCorrect.style.display = 'inline';
        emailWrong.style.display = 'none'
        state.correctEmail = true;
    } else {
        emailCorrect.style.display = 'none';
        emailWrong.style.display = 'inline'
        state.correctEmail = false;
    }
})


password.addEventListener('focus', () => {
    passwordWeakness.style.display = 'inline'
})

password.addEventListener('blur', () => {
    passwordWeakness.style.display = 'none'
})


password.addEventListener('input', (e) => {
    let text = e.target.value;
    if (text) {
        // passwordWeakness.style.display = 'inline'
    }
})


submitBtn.addEventListener('click', () => {
    if ( stateAllTrue(state) ) {
        window.location.href='submitted.html'
    }
})

