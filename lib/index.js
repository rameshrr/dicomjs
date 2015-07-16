/**
 * Author  : Ramesh R
 * Created : 7/12/2015 2:34 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var utils = require('./utils'),
    constants = require('./constants'),
    DcmFile = require('./dcmfile'),
    DataElement = require('./dataelement'),
    transferSyntax = require('./transfersyntax')
    ;

var parseBuffer = function (buffer, callback) {
    var filePreamble = utils.readString(buffer, 0, 128);
    var dicomPrefix = utils.readString(buffer, constants.dcmPrefixPosition, 4);

    if (dicomPrefix !== 'DICM') {
        console.log('Invalid DICOM data');
        return callback({err: 'Invalid DICOM data'});
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
        return callback({err: 'Not supported'});
    }

    while (currentPosition + 6 < buffer.length) {
        var element = new DataElement(txProps);
        currentPosition = element.parse(buffer, currentPosition);
        file.dataset[element.id] = element;
    }

    var dataElementsLength = 0;
    for (var key in file.dataset) {
        dataElementsLength++;
    }

    //console.log(dataElementsLength);
    callback(null, file);
};

module.exports = {
    parse: parseBuffer
};