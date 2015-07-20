# dicomjs (Alpha)
Nodejs library for DICOM parsing

# Installation
install via [NPM](https://www.npmjs.com/):
> npm install dicomjs

# Usage

```javascript
var dicomjs = require('dicomjs');

fs.readFile(sample_file_path, function (err, buffer) {
    dicomjs.parse(buffer, function (err, dcmData) {
        /// Shows list of elements

        if (!err) {
            for (var key in dcmData.metaElements) {
                console.log('   tag: ', key, ', value: ', dcmData.metaElements[key].value);
            }

            for (var key in dcmData.dataset) {
                console.log('   tag: ', key, ', value: ', dcmData.dataset[key].value);
            }
        } else {
            console.log(err);
        }
    });
});
```


# Contributions
Contributions are welcome
    
# Issues 
Please file issues [here](https://github.com/rameshrr/dicomjs/issues):
    