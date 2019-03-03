window.util = {
    isInteger: (n) => {
        return n % 1 === 0;
    },
    createEl: ( className, tag="div" ) => {
        let el = document.createElement( tag );
        el.className = className;
        return el;
    },
    findAngle: ([x1,y1], [x2,y2]) => {
        let opposite = y2 - y1;
        let adjacent = x2 - x1;
        let tan = opposite / adjacent;
        let angleRad = Math.atan( tan );
        let angleDeg = angleRad / ( Math.PI / 180 );
        let adjustedAngle = Math.round( angleDeg + 90 );
        return adjustedAngle + "deg";
    },
    findMouseToCenterCloseness( mousePosition, center ) {
        let [x1,y1] = mousePosition;
        let [x2,y2] = center;
        let xClose = util.findPointsCloseness(x1,x2);
        let yClose = util.findPointsCloseness(y1,y2);
        let closeness = ( xClose + yClose ) / 2;
        return closeness.toFixed(3);
    },
    findPointsCloseness( x1, x2 ) {
        let xClose = x1/x2;
        if ( xClose > 1 ) {
            let remainder = xClose % 1;
            xClose = 1 - remainder;
        }
        // console.log({x1,x2,xClose})
        return xClose;
    }
};