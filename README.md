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

        /// Reading patient name
        var patientName = dcmData.dataset[''00100010].value;

        /// Reading pixel data
        var pixelData = dcmData.pixelData;
    });
});
```

# Documentation
## Reading patient name
```javascript
///
var patientName = dcmData.dataset[''00100010].value;
///
```

## Reading pixel data
```javascript
///
var pixelData = dcmData.pixelData;
///
```


# Contributions
Contributions are welcome
    
# Issues 
Please file issues [here](https://github.com/rameshrr/dicomjs/issues):
    