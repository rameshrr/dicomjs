/**
 * Author  : Ramesh R
 * Created : 7/14/2015 4:47 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var utils = require('./utils');

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
    'DS': utils.readStringData,

    /// DateTime(YYYYMMDDHHMMSS.FFFFFF&ZZXX)
    'DT': utils.readStringData,

    /// Floating Point Single
    'FL': utils.readStringData,

    /// Floating Point Double
    'FD': utils.readStringData,

    /// Integer String
    'IS': utils.readNumber,

    /// Long String
    'LO': utils.readNumber,

    /// Long Text
    'LT': utils.readStringData,

    /// Other Byte String
    'OB': utils.readBinary,

    /// Other Double String
    'OD': utils.readStringData,

    /// Other Float String
    'OF': utils.readStringData,

    /// Other word String
    'OW': utils.readStringData,

    /// Person Name
    'PN': utils.readStringData,

    /// Short String
    'SH': utils.readStringData,

    /// Signed Long
    'SL': utils.readNumber,

    /// Sequence of Items
    'SQ': utils.readStringData,

    /// Signed short
    'SS': utils.readNumber,

    /// Short Text
    'ST': utils.readStringData,

    /// Time
    'TM': utils.readStringData,

    /// Unlimited Characters
    'UC': utils.readStringData,

    /// UID-Unique Identifier
    'UI': utils.readStringData,

    /// Unsigned Long
    'UL': utils.readNumber,

    /// Unknown
    'UN': utils.readBinary,

    /// URI/URL
    'UR': utils.readStringData,

    /// Unsigned Short
    'US': utils.readNumber,

    /// Unlimited Text
    'UT': utils.readStringData,

    read: function (buffer, position, length, vr, isBigEndian) {
        var reader = this[vr] ? this[vr] : utils.readBinary;
        return reader(buffer, position, length);
    }
};