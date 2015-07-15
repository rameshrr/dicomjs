/**
 * Author  : Ramesh R
 * Created : 7/12/2015 2:34 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    constants = require('./constants'),
    DcmFile = require('./dcmfile'),
    DataElement = require('./dataelement'),
    transferSyntax = require('./transfersyntax'),
//sampleDcmPath = 'samples/CR-MONO1-10-chest',
    sampleDcmPath = 'samples/DISCIMG/IMAGES/CRIMAGEA'
    ;

fs.readFile(path.join(__dirname, sampleDcmPath), function (err, buffer) {

    var filePreamble = utils.readString(buffer, 0, 128);
    var dicomPrefix = utils.readString(buffer, constants.dcmPrefixPosition, 4);

    if (dicomPrefix !== 'DICM') {
        /// TODO: throw err
        console.log('Invalid DICOM data');
        return;
    }

    var defaultTxProps = transferSyntax.readProps(constants.groupTransferSyntax);

    var file = new DcmFile();

    /// Parse meta information
    var groupElement = new DataElement(defaultTxProps);
    var currentPosition = groupElement.parse(buffer, constants.metaPosition);

    var metaEnd = currentPosition + groupElement.value;
    while (currentPosition < metaEnd) {
        var element = new DataElement(defaultTxProps);

        currentPosition = element.parse(buffer, currentPosition);
        file.metaElements[element.id] = element;
    }

    var currentTransferSyntax = file.metaElements[constants.transferSyntaxTag].value;
    var txProps = transferSyntax[currentTransferSyntax];

    if (!txProps) {
        throw 'Not supported';
    }

    while(currentPosition+ 6 < buffer.length) {
        var element = new DataElement(txProps);
        currentPosition = element.parse(buffer, currentPosition);
        file.dataset[element.id] = element;
    }

    console.log(buffer);
});