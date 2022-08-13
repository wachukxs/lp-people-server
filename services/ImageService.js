const { parseBitmap, bitmap } = require('jimp');
const Jimp = require('jimp');
/**
 * TODOs:
 * 
 * 1. will use https://github.com/gomfunkel/node-exif
 */
module.exports = {
    create(req, res) {
        // console.log('body', req.body);
        // res.json({message: 'hello there'})

        const printableText = (text) => {

            return text
            .replace(/”/ig, '"')
            .replace(/“/ig, '"')
            .replace(/’/ig, "'")
              .split(' ').map((w, i) => {
                return w.length > 15 ? setCharAt(w, 16, w.charAt(16) + '- ') : w
              }).join(' ');
        }

        const buffer = Buffer.from(req.body.image, "base64");

        Promise.all(
            [Jimp.read(buffer), Jimp.read('assets/images/background-image.png')]
        ).then((images) => {
            // images[1].autocrop()

            images[0].resize(1080, 1080); // resize to fit the placeholder image frame
            images[0].composite(images[1], 0, 0); // 2nd img, starting x cordinate, starting y cordinate
          
            
          
            Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
            .then(font => {
              images[0].print(font, 30, 750, 'MY NAME IS');
              images[0].print(font, 30, 820, (req.body.name ? printableText(req.body.name) : `Hello!!`));
              
              if (process.env.NODE_ENV && process.env.NODE_ENV !== "production") {
                images[0]
                .write('final-image.png', () => {
                  console.log('check it');
                })
              }

              images[0]
              .getBase64Async(Jimp.MIME_PNG)
              .then((img) => { // img has our image in base64

                res.status(200)
                // .type('image/png')
                .send({image: img}) // 


              }).catch((err) => {
                console.error('problem writing text for username', err)
              })
            }).catch((err) => {
              console.error('problem writing text for summary & craft', err)
            })
            
            
          }).catch((err) => {
            console.error('Oops', err); // make default img, maybe with just text!
            res.status(200).type('image/png').send('assets/images/background-image.png')
          })
    },
    test(req, res) {
        res.json({message: 'hello there'})
    }
}