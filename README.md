# dicomjs (Alpha) - Work in progress
Nodejs library for DICOM parsing

# Installation
install via [NPM](https://www.npmjs.com/):
> npm install dicomjs

# Usage

```javascript
fs.readFile(sample_file_path, function (err, buffer) {
    dicom.parse(buffer, function (err, dcmData) {
        /// Shows list of elements
    });
});
```
