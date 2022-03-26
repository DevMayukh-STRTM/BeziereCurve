let x = 0;
let y = 600;

let incrementX = true;
let incrementY = false;

//ociliate between 0 and 600
//their complement must be 600 ( x + y ) = 600

while(true) {

    if ( x == 0 ) {
        incrementX = true
    } else if ( x == 600 ) {
        incrementX = false
    }

    if ( y == 0 ) {
        incrementY = true
    } else if ( y == 600 ) {
        incrementY = false
    }

    if ( incrementX == true ) {
        x += 1
    } else {
        x -= 1
    }

    if ( incrementY == true ) {
        y += 1
    } else {
        y -= 1
    }

    postMessage([ x, y ])

}