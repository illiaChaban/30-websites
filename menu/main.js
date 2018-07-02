const getImageName = /([a-z]+-*[" "]*)+[a-z]/i

let focusedElements = [];


// document
//     .querySelectorAll('.menu')
//     .forEach( (menu, i) => {
//         let firstLi = menu.querySelector('li');
//         focusedElements.push(firstLi);
//         let img = document.querySelectorAll('.image > img')[i];
//         img.src = `./images/${firstLi.querySelector('h3').textContent.match(getImageName)[0]}.jpg`;
//         firstLi.className = 'focused whiteText'
//         menu.querySelectorAll('li')
//             .forEach( li => {
//                 li.addEventListener( 'click', () => {
//                     let title = li.querySelector('h3').textContent.match(getImageName)[0];
//                     img.src = `./images/${title}.jpg`;
//                     focusedElements[i].className = '';
//                     focusedElements[i] = li;
//                     focusedElements[i].className = 'focused whiteText'
//                 })
//             })

//     })

