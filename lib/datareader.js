/**
 * Author  : Ramesh R
 * Created : 7/14/2015 4:47 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var utils = require(__dirname + '/utils');

module.exports = {

    /// Application Entity
    'AE': utils.readStringData,

    /// Age String
    'AS': utils.readStringData,

    /// Attribute Tag
    'AT': utils.readStringData,

    /// Code String
    'CS': utils.readStringData,

    /// Date(YYYYMMDD)
    'DA': utils.readStringData,

    /// Decimal String
    'DS': utils.readFloat,

    /// DateTime(YYYYMMDDHHMMSS.FFFFFF&ZZXX)
    'DT': utils.readStringData,

    /// Floating Point Single
    'FL': utils.readStringData,

    /// Floating Point Double
    'FD': utils.readStringData,

    /// Integer String
    'IS': utils.readStringData,

    /// Long String
    'LO': utils.readStringData,

    /// Long Text
    'LT': utils.readStringData,

    /// Other Byte String
    'OB': utils.readUInt8Array,

    /// Other Double String
    'OD': utils.readStringData,

    /// Other Float String
    'OF': utils.readStringData,

    /// Other word String
    'OW': utils.readUInt16Array,

    /// Person Name
    'PN': utils.readStringData,

    /// Short String
    'SH': utils.readStringData,

    /// Signed Long
    'SL': utils.readInteger,

    /// Sequence of Items
    'SQ': utils.readBinary,

    /// Signed short
    'SS': utils.readInteger,

    /// Short Text
    'ST': utils.readStringData,

    /// Time
    'TM': utils.readStringData,

    /// Unlimited Characters
    'UC': utils.readStringData,

    /// UID-Unique Identifier
    'UI': utils.readStringData,

    /// Unsigned Long
    'UL': utils.readUnsignedInteger,

    /// Unknown
    'UN': utils.readBinary,

    /// URI/URL
    'UR': utils.readStringData,

    /// Unsigned Short
    'US': utils.readUnsignedInteger,

    /// Unlimited Text
    'UT': utils.readStringData,

    read: function (buffer, position, length, vr, isBigEndian) {
        var reader = this[vr] ? this[vr] : utils.readBinary;
        return reader(buffer, position, length, isBigEndian, utils);
    }
};