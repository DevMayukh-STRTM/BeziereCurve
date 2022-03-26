import './style.css'

function FindSlope(x1: number, y1: number, x2:number, y2:number): number {
    return ( y2 - y1 ) / ( x2 - x1 )
}

let showSupportingLines: boolean = true

function FindIntersection(
    x1: number,
    y1: number,

    x2: number,
    y2: number,

    m1: number,
    m2: number
): [number, number] {

    //m1 and m2 are the slopes for lines ( x1, y1 ) & ( x2, y2 )
    const x = ( y1 - y2 + ( m2 * x2 ) - ( m1 * x1 ) ) / ( m2 - m1 )
    const y = m1 * ( x - x1 ) + y1;

    return [x,y]

}

function FindPointsOnLine(
    x1: number,
    y1: number,

    x2: number,
    y2: number,

    points: number
): [number, number][] {

    //return the coordinates there
    const coordinates: [number, number][] = []
    const ratios = []

    for ( let i: number = 1; i < points + 1; i++ ) {

        ratios.push(
            [ i, (points + 1) - i ]
        )

    }

    for ( let index: number = 0; index < ratios.length; index++ ) {

        coordinates.push([

            (((ratios[index][0] * x2) + (ratios[index][1] * x1))/(ratios[index][0] + ratios[index][1])),
            ((ratios[index][0] * y2) + (ratios[index][1] * y1))/(ratios[index][0] + ratios[index][1])

        ])

    }

    return coordinates

}

let LineCoordinates = []

function QuadradicBeziere(

    //reset this variable

    p1: [number, number], 
    pivot: [number, number], 
    p2: [number, number], 
    smooth: number
): [number, number][] {

    //reset this variable
    LineCoordinates = []
    const curvedCoordinates: [number, number][] = []

    //find all the coordinates on the specific lines
    const pointsFromP1ToPivot = FindPointsOnLine(
        p1[0],
        p1[1],

        pivot[0],
        pivot[1],

        smooth
    )

    const pointsFromPivotToP2 = FindPointsOnLine(
        pivot[0],
        pivot[1],

        p2[0],
        p2[1],

        smooth
    )

    //curved coordinates will include the origin as well
    curvedCoordinates.push([
        p1[0], p1[1]
    ])

    curvedCoordinates.push(pointsFromP1ToPivot[0])

    //find the internal curved points
    
    //if smooth ( points ) = 4, then there will be n - 1 intersection
    for ( let i = 0; i < smooth - 1; i++ ) {

        //first find the slope of the two intersecting points
        let m1 = FindSlope(
            pointsFromP1ToPivot[i][0],
            pointsFromP1ToPivot[i][1],

            pointsFromPivotToP2[i][0],
            pointsFromPivotToP2[i][1]
        )

        //same for the second line we are comparing

        let m2 = FindSlope(
            pointsFromP1ToPivot[i + 1][0],
            pointsFromP1ToPivot[i + 1][1],

            pointsFromPivotToP2[i + 1][0],
            pointsFromPivotToP2[i + 1][1]
        )

        LineCoordinates.push(
            [
                pointsFromP1ToPivot[i][0],
                pointsFromP1ToPivot[i][1],
    
                pointsFromPivotToP2[i][0],
                pointsFromPivotToP2[i][1]
            ], [
                pointsFromP1ToPivot[i + 1][0],
                pointsFromP1ToPivot[i + 1][1],
    
                pointsFromPivotToP2[i + 1][0],
                pointsFromPivotToP2[i + 1][1]
            ]
        )

        //find the intersection
        let curvedCoordinate = FindIntersection(
            pointsFromP1ToPivot[i][0],
            pointsFromP1ToPivot[i][1],


            pointsFromP1ToPivot[i + 1][0],
            pointsFromP1ToPivot[i + 1][1],

            m1, m2
        )

        curvedCoordinates.push(curvedCoordinate)

    }



    curvedCoordinates.push(pointsFromPivotToP2[
        pointsFromP1ToPivot.length - 1
    ])


    curvedCoordinates.push([
        p2[0], p2[1]
    ])

    return curvedCoordinates

}


const P1: [number, number] = [ 0, 600 ]
const Pivot: [number, number] = [ 0, 0 ]
const P2: [number, number] = [ 600, 0 ]

let smoothness = 20 //the number of points to make it smoother

// now we will draw the same in the canvas

const canvas: HTMLCanvasElement | null | undefined
= document.querySelector("canvas")

const canvasContext: CanvasRenderingContext2D | null | undefined
= canvas?.getContext("2d")

function DrawCurve(CurvedPoints: any = QuadradicBeziere(
    P1,
    Pivot,
    P2,
    smoothness
)) {


    canvasContext?.clearRect(0, 0, 600, 600)
    canvasContext.lineWidth = 1

    if ( showSupportingLines == true ) {
        //draw those lines
        for ( let lineIndex = 0; lineIndex < LineCoordinates.length; lineIndex++ ) {


            canvasContext.strokeStyle = `rgb(
                ${Math.floor(Math.random() * 255) + 10},
                ${Math.floor(Math.random() * 255) + 10},
                ${Math.floor(Math.random() * 255) + 10}
            )`

            canvasContext?.beginPath()

            canvasContext?.moveTo(
                P2[0],
                P2[1]
            )

            canvasContext?.lineTo(
                Pivot[0],
                Pivot[1]
            )

            canvasContext?.lineTo(
                P1[0],
                P1[1]
            )

            canvasContext?.stroke()

            canvasContext?.moveTo(
                LineCoordinates[lineIndex][0],
                LineCoordinates[lineIndex][1]
            )

            canvasContext?.lineTo(
                LineCoordinates[lineIndex][2],
                LineCoordinates[lineIndex][3]
            )

            canvasContext?.stroke()


        }

    }

    canvasContext?.moveTo(
        CurvedPoints[0][0],
        CurvedPoints[0][1]
    )

    canvasContext?.beginPath()
    canvasContext.lineWidth = 3
    //now draw the lines
    for ( let i = 0; i < CurvedPoints.length - 1; i++ ) {

        canvasContext?.lineTo(
            CurvedPoints[i + 1][0],
            CurvedPoints[i + 1][1]
        )

    }

    canvasContext?.stroke()

}

DrawCurve()


//now we will implement a loop
// that will animate this particular
// curve

// using setTimeout to make the
// animation as clean as possible

let incrementX: boolean = true;


function AnimateValues() {


    if ( P2[0] == 600 ) {
        incrementX = false
    } else if ( P2[0] == 0 ) {
        incrementX = true
    }

    if ( incrementX == true ) {
        P2[0] += 1
    } else {
        P2[0] -= 1
    }


    P1[0] = 600 - P2[0]
    Pivot[1] = P1[0]

    let CurvedPoints = QuadradicBeziere(
        P1,
        Pivot,
        P2,
        smoothness
    )

    DrawCurve(CurvedPoints)
    window.requestAnimationFrame(AnimateValues)

}

AnimateValues()


const input: HTMLButtonElement | undefined | null = document.querySelector("button")
const value: HTMLInputElement | undefined | null = document.querySelector("input")

input.onclick = (e) => {
    smoothness = parseInt(value.value)
}