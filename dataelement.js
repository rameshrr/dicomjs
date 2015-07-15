/**
 * Author  : Ramesh R
 * Created : 7/13/2015 6:12 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var utils = require('./utils'),
    vr = require('./vr'),
    dataReader = require('./datareader'),
    constants = require('./constants');

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

    currentPosition += constants.tagLength;
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
    this.valueLength = utils.readNumber(buffer, currentPosition, vrProps.length, this.txProps.isBigEndian);

    currentPosition += vrProps.length;
    //this.value = utils.readNumber(buffer, currentPosition, this.valueLength);

    this.value = dataReader.read(buffer, currentPosition, this.valueLength, this.vr, this.txProps.isBigEndian);
    currentPosition += this.valueLength;

    return currentPosition;
};

module.exports = DataElement;