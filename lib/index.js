/**
 * Author  : Ramesh R
 * Created : 7/12/2015 2:34 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var utils = require(__dirname + '/utils'),
    constants = require(__dirname + '/constants'),
    DcmFile = require(__dirname + '/dcmfile'),
    DataElement = require(__dirname + '/dataelement'),
    transferSyntax = require(__dirname + '/transfersyntax'),
    config = require(__dirname + '/config')
    ;

var parseBuffer = function (buffer, options, callback) {
    var filePreamble = utils.readString(buffer, 0, 128);
    var dicomPrefix = utils.readString(buffer, constants.dcmPrefixPosition, 4);

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    /// Set User config
    config.setOptions(options);

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

    (function processElements(innerCallback){
        (function parseNext(currentPosition) {
            return process.nextTick(function () {
                if (currentPosition + 6 < buffer.length) {
                    var element = new DataElement(txProps);
                    currentPosition = element.parse(buffer, currentPosition);
                    file.dataset[element.id] = element;

                    parseNext(currentPosition);
                } else {
                    innerCallback();
                }
            });
        })(currentPosition);
    })(function(err) {

        var pixelData = file.dataset['7FE00010'];

        if(pixelData.vr == 'OW') {
            file.pixelData = file.dataset['7FE00010'].value;
        } else {
            file.pixelData = file.dataset['7FE00010'].pixelDataItems;
        }

        callback(null, file);
    });
};

module.exports = {
    parse: parseBuffer
};