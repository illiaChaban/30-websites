let links = document.querySelectorAll('li');

// links.forEach(link => link.querySelector('.screenshots').style.display = 'inline');

for ( let link of links) {
    let screenshots = link.querySelector('.screenshots');
    link.addEventListener( 'mouseover', () => {
        if (screenshots) screenshots.style.display = 'inline';
    })
    link.addEventListener( 'mouseout', (e) => {
        if (screenshots) screenshots.style.display = 'none';
    })
}


