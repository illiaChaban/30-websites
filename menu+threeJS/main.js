const width = 100;
const height = 100;
const getImageName = /([a-z]+-*[" "]*)+[a-z]/i
let focusedElements = [];


document.querySelectorAll('.menu').forEach( (menu, i) => {
    let firstLi = menu.querySelector('li');
    focusedElements.push(firstLi);
    firstLi.className = 'focused whiteText'

    let initialTitle = getTitle(firstLi);
    let root = getRoot(i);
    let initialSlide = createSlide(initialTitle, true);
    root.scene.add(initialSlide);

    menu.querySelectorAll('li')
        .forEach( li => {
            let title = getTitle(li)
            li.addEventListener( 'click', () => {
                let slide = createSlide(title);
                root.scene.add(slide);
                slide.transition();

                focusedElements[i].className = '';
                focusedElements[i] = li;
                focusedElements[i].className = 'focused whiteText'
            })
        })
})


getRoot = i => {
  let root = new THREERoot({
    createCameraControls: !true,
    antialias: (window.devicePixelRatio === 1),
    fov: 80
  }, i);

  root.renderer.setClearColor(0x000000, 0);
  root.renderer.setPixelRatio(window.devicePixelRatio || 1);
  root.camera.position.set(0, 0, 50);

  return root;
}

getTitle = (liElement) => {
  let title = liElement.querySelector('h3').textContent.match(getImageName)[0];
  return title.split(' ').join('+');
}

createSlide = (imgTitle, initial = false) => {
  let phase = initial ? 'out' : 'in';
  let slide = new Slide(width, height, phase);
  var l1 = new THREE.ImageLoader();
  l1.setCrossOrigin('Anonymous');
  l1.load(`https://s3.us-east-2.amazonaws.com/30-websites-menu/menu-threeJS/${imgTitle}.jpg`, function(img) {
      slide.setImage(img);
  })
  return slide;
}


