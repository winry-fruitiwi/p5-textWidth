/**
 * @author Winry
 * @date 2022-01-18
 *
 * coding plan 🔧
 * ☒ display black background, white text.
 * ☒ write 'i' and 'm' on screen to compare their widths
 *     ☒ check your chrome zoom settings. accurate results only at 100%
 * ☒ measure each character's width by checking pixels in order
 *     ☒ loadpixels in small canvas: 30x50 or so
 *     ☒ iterate through every canvas pixel from left to right
 *     ☒ keep track of the last non-black pixel you saw. that's the width!
 *         ☒ how do you determine "non-black"? there are 4 values per pixel
 * ☐ encapsulate functions
 *     ☐ one using .get to retrieve color 'object'
 *          ☐ see .get() docs https://p5js.org/reference/#/p5/get
 *     ☐ the other using pixels[]
 * ☐ convert to pGraphics object: off-screen buffer with createGraphics
 * ☐ use charWidth to display single words
 * ☐ now use charWidth to make textWidth. exception for gigamaru space char
 * ☐ transfer into p5-dialogsystem!
 *
 */


let font

/**
 * this can't be large because our charWidth graphics buffer is of finite
 * size! note that we must also take into account our webpage scaling in
 * chrome; I have it set at 125%, a significant bump up from default.
 * @type {number}
 */
const FONT_SIZE = 18
const LETTER_SPACING = 1.25
const SPACE_WIDTH = FONT_SIZE / 2


function preload() {
    font = loadFont('data/giga.ttf')
    // font = loadFont("data/meiryo.ttf")
}


function setup() {
    // createCanvas(640, 360) // , WEBGL) // we don't need WEBGL yet
    createCanvas(640, 360);
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, FONT_SIZE)
    // textAlign(CENTER, CENTER)
    background(0, 0, 0)

    fill(0, 0, 100)
    noStroke()

    // codyCharWidth("d")
    // charWidth("d")
    // wordWidth("d")

    displayPassage("abcdefghijklmnopqrstuvwxyz1234567890")

    let input = "I couldn't even get one pixel working because my" +
        " generatePixel function didn't work. I need four nested loops to" +
        " be able to complete my task because I don't know how to do this" +
        " otherwise. It seems like I'm loading just fine."

    // displayPassage(input)
}


function draw() {}


function displayPassage(passage) {
    let cursor = new p5.Vector(0, 100)
    let EXTRA_SPACING = 1
    // loop through every character in passage
    for (let char of passage) {
        text(char, cursor.x, cursor.y)

        cursor.x += charWidth(char) + EXTRA_SPACING
    }
}


/**
 * use charWidth to find the width of more than one character
 *
 * "Hello" → word
 *
 * for letter of word:
 *     call charWidth, add to sum
 * at the end of program, return the sum
 */
function wordWidth(word) {
    let sum = 0

    for (let letter of word) {
        sum += charWidth(letter)
    }

    return sum
}



/*  return the width in pixels of char using the pixels array
 */
function charWidth(char) {
    let g = createGraphics(FONT_SIZE, FONT_SIZE * 1.5)
    g.colorMode(HSB, 360, 100, 100, 100)
    g.textFont(font, FONT_SIZE)
    g.background(0, 0, 0)
    g.fill(0, 0, 100)

    let d = g.pixelDensity()
    g.text(char, 0, textAscent())
    // text(char, 0, textAscent())
    g.loadPixels()
    loadPixels()

    let endX = 0

    // loop through every pixel (column-major)
    for (let x = 0; x < g.width; x++) {
        for (let y = 0; y < g.height; y++) {

            let off = (y * g.width + x) * d * 4 // TODO how does this work? derive
            if (g.pixels[off] !== 0 || g.pixels[off+1] !== 0 ||
                g.pixels[off+2] !== 0) {
                // print("?")
                // endX = max(x, endX)
                endX = x
                // stroke(100, 100, 100)
                // point(x, y)
                // we don't need to search for any more white pixels: break!
                break
            }
        }
    }

    // console.log("endX: " + endX)
    return endX
}


/*  return the width in pixels of char using the pixels array
 */
function codyCharWidth(char) {
    /**
     * create a graphics buffer to display a character. then determine its
     * width by iterating through every pixel. Noting that 'm' in size 18
     * font is only 14 pixels, perhaps setting the buffer to a max width of
     * FONT_SIZE is sufficient. The height needs to be a bit higher to
     * account for textDescent, textAscent. x1.5 is inexact, but should be
     * plenty.
     * @type {p5.Graphics}
     */
    let g = createGraphics(FONT_SIZE, FONT_SIZE * 1.5)
    g.colorMode(HSB, 360, 100, 100, 100)
    g.textFont(font, FONT_SIZE)
    g.background(0, 0, 0)
    g.fill(0, 0, 100)
    g.text(char, 0, 0)
    let maxX = 0; // our maximum x
    let d = g.pixelDensity() // our pixel density

    g.text(char, 0, textAscent())

    g.loadPixels()

    for (let x = 0; x < g.width; x++) {
        for (let y = 0; y < g.height; y++) {
            let i = 4*d*(y*g.width + x)
            let redNotZero = (g.pixels[i] !== 0)
            let greenNotZero = (g.pixels[i+1] !== 0)
            let blueNotZero = (g.pixels[i+2] !== 0)
            /**
             * What does it mean for a pixel to be non-black?
             * It means that one of the red, blue, or green not zeros have
             * to be true.
             */
            let notBlack = redNotZero || greenNotZero || blueNotZero
            if (notBlack) {
                maxX = x
                // stroke(100, 100, 100)
                // point(x, y)
            }
        }
    }
    console.log("cody's letterWidth: " + maxX)
    return maxX
}


function charWidthGet(char) {
    /**
     *
     */
    if (char === ' ') {
        console.log("letterWidth: " + 7/18 * FONT_SIZE)
        return 7/18 * FONT_SIZE // size of the character m divided by 2
    } else {
        let g = createGraphics(FONT_SIZE, FONT_SIZE * 1.5)
        g.colorMode(HSB, 360, 100, 100, 100)
        g.textFont(font, FONT_SIZE)
        g.background(0, 0, 0)
        g.fill(0, 0, 100)

        // let d = gGet.pixelDensity()
        g.text(char, 0, height - textDescent())
        text(char, 0, height - textDescent())
        g.loadPixels()

        let letterWidth = 0

        // loop through every pixel in column-major order (loop through columns)
        for (let x = 0; x < g.width; x++) {
            for (let y = 0; y < g.height; y++) {
                // get the current pixel
                let pixel = g.get(x, y)
                // is the current pixel not black?
                if (pixel[0] !== 0 || pixel[1] !== 0 || pixel[2] !== 0) {
                    // if the current pixel isn't black, set the letterWidth to x
                    letterWidth = x
                }
            }
        }

        console.log("letterWidth: " + letterWidth)
        return letterWidth
    }
}


/**
 * From p5.js documentation, as reference:
 * This function shows how the pixels in pixels[] from loadPixels are
 * organized: they are in groups of 4 in [r,g,b,a] order.
 * @param x
 * @param y
 * @param pixelDensity
 */
function getPixel(x, y, pixelDensity) {
    loadPixels()
    let off = (y * width + x) * pixelDensity * 4;
    let components = [
        pixels[off],
        pixels[off + 1],
        pixels[off + 2],
        pixels[off + 3]
    ]
}


/**
 * Original code from a forum post that inspired this brute-force method of
 * finding a character's textWidth.
 */
function archive() {
    let max_x = 0 // the furthest right this character displays on screen
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            // every pixel is represented as 4 values in pixels[]: rgba
            let p = 4 * (x + y * width)

            if (pixels[p] > 0) {
                debug = max_x
                max_x = Math.max(x, max_x)
            }
        }
    }
}



/*  return the width in pixels of char using the pixels array
 */
function archivedCharWidth(char) {
    /**
     * create a graphics buffer to display a character. then determine its
     * width by iterating through every pixel. Noting that 'm' in size 18
     * font is only 14 pixels, perhaps setting the buffer to a max width of
     * FONT_SIZE is sufficient. The height needs to be a bit higher to
     * account for textDescent, textAscent. x1.5 is inexact, but should be
     * plenty.
     * @type {p5.Graphics}
     */
    let g = createGraphics(FONT_SIZE, FONT_SIZE * 1.5)
    g.colorMode(HSB, 360, 100, 100, 100)
    g.textFont(font, FONT_SIZE)
    g.background(0, 0, 0)
    g.fill(0, 0, 100)

    let d = g.pixelDensity()
    g.text(char, 0, height - textDescent())
    // text(char, 0, height - textDescent())
    g.loadPixels()

    /*
        My log for this program:
            Cody and I both did not iterate when we were doing our
            textWidth project today. The best outcome was that I started by
            iterating with a very simple example on my drawing pad: a 3 by
            3 grid with randomly turned on pixel "characters". This was
            supposed to be a 15-minute project, but it took 60 minutes
            instead. After we completed our basic example, we could iterate
            from there, tracing my code with 4x4 and uneven graphics.
    */

    // define variables: startX is when we first see white, endX is when we
    // stop seeing white
    // let startX = 0
    let endX = 0
    // loop through every pixel, searching for a non-black pixel
    // for (let x = 0; x < width; x++) {
    //     for (let y = 0; y < height; y++) {
    //         let off = (y * width + x) * d * 4
    //         if (pixels[off] !== 0 || pixels[off+1] !== 0 || pixels[off+2] !== 0) {
    //             endX = x
    //             // we've found the white, so we shouldn't search for more.
    //             break
    //         }
    //     }
    // } // code I did not iterate on

    // // loop through every pixel (column-major)
    // for (let x = 0; x < width; x++) {
    //     for (let y = 0; y < height; y++) {
    //         // calculate what index we need
    //         // something is wrong with the offset or the if statement
    //         let off = (y * width + x) * d * 4 // TODO how does this work? derive
    //         if (pixels[off] !== 0 || pixels[off+1] !== 0 || pixels[off+2] !== 0) {
    //             console.log("hey, what is happening here?")
    //             endX = x
    //             // we don't need to search for any more white pixels
    //             break
    //         }
    //     }
    // } // working code, hopefully better comments

    // loop through every pixel (column-major)
    for (let x = 0; x < g.width; x++) {
        for (let y = 0; y < g.height; y++) {
            // calculate what index we need
            // something is wrong with the offset or the if statement
            let off = (y * g.width + x) * d * 4 // TODO how does this work? derive
            if (g.pixels[off] !== 0 || g.pixels[off+1] !== 0 ||
                g.pixels[off+2] !== 0 || g.pixels[off+3] !== 255) {
                // console.log("hey, what is happening here?") // test
                endX = max(x, endX)
                // we don't need to search for any more white pixels
                // break
            }
        }
    } // now we're using a graphics object called g, so we need to add g dot to
    // almost everything! It's the g dot song!

    // console.log("startX: " + startX)
    console.log("endX: " + endX)
    return endX
}