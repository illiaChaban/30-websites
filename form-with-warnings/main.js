const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const username = document.getElementById('username')
const email = document.getElementById('email');
const password = document.getElementById('password')
const passwordWeakness = document.getElementById('password-weakness');
const retypePassword = document.getElementById('retype-passw');
const avatar = document.getElementById('avatar');
const progressBar = document.getElementsByClassName('progress-bar')[0].getElementsByTagName('span')[0];


const submitBtn = document.getElementById('submit')

let state = {
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


const passwordStrong = document.getElementById('password-div').getElementsByClassName('correct')[0];
const passwordWeak = document.getElementById('password-div').getElementsByClassName('wrong')[0];
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
    }
})


password.addEventListener('input', (e) => {
    let text = e.target.value;
    let strong = text;
    if (strong) {
        passwordWeakness.style.display = 'none';
        passwordStrong.style.display = 'inline';
        state.strongPassword = true;
    } else {
        passwordWeakness.style.display = 'inline';
        passwordStrong.style.display = 'none';
        state.strongPassword = false;
    }
})


const retypeMatch = document.getElementById('retype-div').getElementsByClassName('correct')[0];
const retypeDontMatch = document.getElementById('retype-div').getElementsByClassName('wrong')[0];
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
        // window.location.href='submitted.html'
    }
})

