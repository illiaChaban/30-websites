let links = document.querySelectorAll('li');

for ( let link of links) {
    let screenshots = link.querySelector('.screenshots');
    let description = link.querySelector('.description');
    link.addEventListener( 'mouseover', () => {
        if (screenshots) screenshots.style.display = 'inline';
        if (description) description.style.display = 'inline'
    })
    link.addEventListener( 'mouseout', () => {
        if (screenshots) screenshots.style.display = 'none';
        if (description) description.style.display = 'none'
    })
}

