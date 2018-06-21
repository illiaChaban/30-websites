
let stateAllTrue = (state) => {
    let allTrue = true;
    for ( let x in state) {
        if ( !state[x] ) allTrue = false;
    }
    // console.log(allTrue)
    return allTrue;
}

