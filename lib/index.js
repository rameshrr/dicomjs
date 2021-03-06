/**
 * Author  : Ramesh R
 * Created : 7/12/2015 2:34 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var fs = require('fs'),
    utils = require(__dirname + '/utils'),
    constants = require(__dirname + '/constants'),
    DcmFile = require(__dirname + '/dcmfile'),
    DataElement = require(__dirname + '/dataelement'),
    transferSyntax = require(__dirname + '/transfersyntax'),
    config = require(__dirname + '/config')
    ;

var parseBuffer = function (buffer, options, callback) {

    var filePreamble = utils.readString(buffer, 0, constants.dcmPrefixPosition);
    var dicomPrefix = utils.readString(buffer, constants.dcmPrefixPosition, 4);

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    /// Set User config
    config.setOptions(options);

    var defaultTxProps = null;
    var metaPosition = 0;

    if (dicomPrefix === 'DICM') {
        defaultTxProps = transferSyntax.readProps(constants.groupTransferSyntax);
        metaPosition = constants.metaPosition;
    } else {

        defaultTxProps = transferSyntax.readProps(constants.dicomDefaultTransferSyntax);

        /// Checking for group element
        var groupElement = new DataElement(defaultTxProps);
        groupElement.parse(buffer, metaPosition);

        if (groupElement.tag === constants.groupLengthTag) {
            metaPosition = 0;
        } else {
            console.log('Invalid DICOM data');
            return callback({err: 'Invalid DICOM data'});
        }
    }


    var file = new DcmFile();

    /// Parse meta information
    var groupElement = new DataElement(defaultTxProps);
    var currentPosition = groupElement.parse(buffer, metaPosition);

    var metaEnd = currentPosition + groupElement.value;
    while (currentPosition < metaEnd) {
        var element = new DataElement(defaultTxProps);

        currentPosition = element.parse(buffer, currentPosition);
        file.metaElements[element.id] = element;
    }

    var txProps = null;
    if (file.metaElements[constants.transferSyntaxTag]) {
        var currentTransferSyntax = file.metaElements[constants.transferSyntaxTag].value;
        txProps = transferSyntax[currentTransferSyntax];
    } else {
        txProps = transferSyntax[constants.dicomDefaultTransferSyntax];
    }

    if (!txProps) {
        return callback({err: 'Not supported'});
    }

    (function processElements(innerCallback) {
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
    })(function (err) {

        if (file.dataset['7FE00010']) {
            var pixelData = file.dataset['7FE00010'];

            if (pixelData.vr == 'OW') {
                file.pixelData = file.dataset['7FE00010'].value;
            } else {
                file.pixelData = file.dataset['7FE00010'].pixelDataItems;
            }
        }

        callback(null, file);
    });
};

var parseFile = function (filePath, options, callback) {

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    if (!filePath) {
        return callback({err: 'Invalid arguments for parseFile'});
    }

    fs.readFile(filePath, function (err, buffer) {
        if (err) {
            return callback(err);
        } else {
            parseBuffer(buffer, options, callback);
        }
    });
};

module.exports = {
    parse: parseBuffer,
    parseFile: parseFile
};