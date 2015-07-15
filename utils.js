/**
 * Author  : Ramesh R
 * Created : 7/13/2015 5:26 PM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

var constants = require('./constants');

module.exports = {

    byteToHex: function (byteValue) {
        return constants.hexCharacters[(byteValue >> 4) & 0x0f] + constants.hexCharacters[byteValue & 0x0f];
    },

    readString: function (buffer, position, length) {
        //if (!buffer || length == 0) {
        //    /// TODO: Throw err
        //    return '';
        //}
        //
        //if (position + length > buffer.length) {
        //    /// TODO: Throw err
        //    return '';
        //}

        var data = '';

        for (var i = position; i < position + length; i++) {
            data += String.fromCharCode(buffer[i]);
        }

        return data;
    },

    readStringData: function (buffer, position, length) {

        var data = '';

        for (var i = position; i < position + length; i++) {
            if (buffer[i] === 0) {
                break;
            }

            data += String.fromCharCode(buffer[i]);
        }

        return data;
    },

    readBinary: function (buffer, position, length) {
        return buffer.slice(position, position + length);
    },

    readTag: function (buffer, position, isBigEndian) {
        /// First 2 bytes for Group No and second 2 for Element No.
        if (isBigEndian) {
            return this.byteToHex(buffer[position]) + this.byteToHex(buffer[position + 1]) + this.byteToHex(buffer[position + 2]) + this.byteToHex(buffer[position + 3]);
        } else {
            return this.byteToHex(buffer[position + 1]) + this.byteToHex(buffer[position]) + this.byteToHex(buffer[position + 3]) + this.byteToHex(buffer[position + 2]);
        }
    },

    readVr: function (buffer, position) {
        //return this.readString(buffer, position, 2);
        return String.fromCharCode(buffer[position]) + String.fromCharCode(buffer[position + 1]);
    },

    readNumber: function (buffer, position, length, isBigEndian) {
        /// For LE & BE

        var n = 0;
        if (isBigEndian) {
            for (var i = position; i < position + length; i++) {
                n = n * 256 + buffer[i];
            }
        } else {
            for (var i = position + length - 1; i >= position; i--) {
                n = n * 256 + buffer[i];
            }
        }

        return n;
    }
};