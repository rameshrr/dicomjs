/**
 * Author  : Ramesh R
 * Created : 7/13/2015 6:12 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var utils = require(__dirname + '/utils'),
    vr = require(__dirname + '/vr'),
    dataReader = require(__dirname + '/datareader'),
    constants = require(__dirname + '/constants'),
    dataElementsDict = require(__dirname + '/dict').dataElements;

var DataElement = function (txProps) {

    this.txProps = txProps;

    this.id = null;
    this.tag = null;
    this.vr = null;
    this.valueLength = null;
    this.value = null;
};

DataElement.prototype.parse = function (buffer, position) {
    var currentPosition = position;
    this.id = this.tag = utils.readTag(buffer, currentPosition, this.txProps.isBigEndian);

    /// Moving forward "constants.tagLength" bytes
    currentPosition += constants.tagLength;

    /// Check for Tag delimiters
    if (constants.delimiterTags.indexOf(this.id) > -1) {
        this.vr = null;
        this.valueLength = utils.readHex(buffer, currentPosition, 4);
        currentPosition += 4;

        return currentPosition;
    }

    if (this.txProps.isImplicit) {
        var elementInfo = dataElementsDict[this.tag];

        if (elementInfo) {
            this.vr = elementInfo.vr;
        } else {
            this.vr = 'UN';
        }

        this.valueLength = utils.readInteger(buffer, currentPosition, 4, this.txProps.isBigEndian);
        currentPosition += 4;
    } else { /// Explicit VRs
        this.vr = utils.readVr(buffer, currentPosition, constants.vrLength);

        /// for VRs of OB, OW, OF, SQ and UN the 16 bits following the two character VR Field are
        /// reserved for use by later versions of the DICOM Standard. These reserved bytes shall be set
        /// to 0000H and shall not be used or decoded (Table 7.1-1).
        /// for VRs of UT the 16 bits following the two character VR Field are reserved for use by later
        /// versions of the DICOM Standard. These reserved bytes shall be set to 0000H and shall not be
        /// used or decoded.
        /// for all other VRs the Value Length Field is the 16-bit unsigned integer following the two
        /// character VR Field (Table 7.1-2)
        /// ... So adding vrLength(2/4) instead of 2(constants.vrLength)
        var vrProps = vr.getLength(this.vr);
        currentPosition += constants.vrLength;
        currentPosition += vrProps.reserved;

        this.valueLength = utils.readInteger(buffer, currentPosition, vrProps.length, this.txProps.isBigEndian);

        currentPosition += vrProps.length;
    }

    if (this.vr == constants.sequenceVr) {
        this.sequenceItems = [];

        var element = new DataElement(this.txProps);
        var currentPositionSeq = element.parse(buffer, currentPosition);

        if (element.id == constants.sequenceDelimiterTag) {
            this.valueLength = currentPositionSeq - currentPosition;
        } else {
            var isImplicitVr = element.valueLength == 'FFFFFFFF'; // itemStart.valueLength == FFFFFFFF
            if (isImplicitVr) {
                element = new DataElement(this.txProps);
                currentPositionSeq = element.parse(buffer, currentPositionSeq);

                while (element.id != constants.sequenceDelimiterTag) { /// Sequence delimiter
                    if (element.id != constants.itemEndTag) {
                        this.sequenceItems.push(element);
                    }

                    element = new DataElement(this.txProps);
                    currentPositionSeq = element.parse(buffer, currentPositionSeq);
                }

                this.valueLength = currentPositionSeq - currentPosition;
            } else { ///  No sequence delimters
                while (currentPositionSeq < currentPosition + itemStart.valueLength) {
                    var element = new DataElement(this.txProps);
                    currentPositionSeq = element.parse(buffer, currentPositionSeq);

                    this.sequenceItems.push(element);
                }
            }
        }
    }

    this.value = dataReader.read(buffer, currentPosition, this.valueLength, this.vr, this.txProps.isBigEndian);
    currentPosition += this.valueLength;

    return currentPosition;
};

module.exports = DataElement;