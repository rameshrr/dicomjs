/**
 * Author  : Ramesh R
 * Created : 7/16/2015 11:58 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var dicom = require('../index'),
    assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    sampleDcmPath = 'samples/CR-MONO1-10-chest'
//sampleDcmPath = 'samples/DISCIMG/IMAGES/CRIMAGEA'
//    sampleDcmPath = 'samples/DISCIMG/IMAGES/DXIMAGEA'A'
//sampleDcmPath = 'samples/CT-MONO2-16-ort' /// Implicit VR
    ;

fs.readFile(path.join(__dirname, sampleDcmPath), function (err, buffer) {
    dicom.parse(buffer, function (err, dcmData) {
        //console.log(err);
        console.log(dcmData);

        //console.log('No of elements in dataset');
        if (!err) {
            console.log('Parsing successful..');
        }

        assert.ok(err == null, 'Parsed successfully');
    });
});