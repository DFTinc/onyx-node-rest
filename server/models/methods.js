'use strict';

var onyx = require('onyx-node');

function createEmptyMat(rows, cols, type) {
  var rows = rows || 0;
  var cols = cols || 0;
  var data = new Buffer(rows*cols);

  return {
    rows: rows,
    cols: cols,
    type: type || 0,
    data: data
  };
}

module.exports = function(methods) {
  /**
   * Compute the NFIQ score of the Base64 encoded WSQ image.
   * @param {string} image wsqData provided WSQ image data encoded as a Base64 string.
   * @param {number} ppi ppi specifies the Pixels-per-inch of the capture WSQ image.
   * @param {number} opts opts are additional options to pass to the computation (usually not used).
   * @param {Function(Error, object)} callback
   */

  methods.computeNfiq = function(image, ppi, opts, callback) {
    var mat = onyx.wsqToMat(new Buffer(image, 'base64'));
    var nfiqMetrics = onyx.computeNfiq(mat, ppi || 500, opts || 0);

    var response = {
      "nfiqScore": nfiqMetrics.nfiqScore,
      "mlpScore": nfiqMetrics.mlpScore
    };
    callback(null, response);
  };

  /**
   * Enhanced a WSQ formatted image encoded as Base64.
   * @param {string} src WSQ formatted image encoded as Base64.
   * @param {Function(Error, object)} callback
   */

  methods.enhanceFingerprint = function(src, callback) {
    var srcImage = onyx.wsqToMat(new Buffer(src, 'base64'));
    var enhanced = createEmptyMat(srcImage.rows, srcImage.cols, srcImage.type);
    var energyMask = createEmptyMat(srcImage.rows, srcImage.cols, srcImage.type);
    onyx.enhanceFingerprint(srcImage, enhanced, energyMask);

    var response = {
      "enhanced": onyx.matToWsq(enhanced).toString('base64'),
      "energyMask": onyx.matToWsq(energyMask).toString('base64')
    };
    callback(null, response);
  };

  /**
   * Generates a fingerprint template given a WSQ formatted image encoded as Base64.
   * @param {string} src WSQ formatted image encoded as Base64.
   * @param {Function(Error, string)} callback
   */

  methods.generateFingerprintTemplate = function(src, callback) {
    var srcImage = onyx.wsqToMat(new Buffer(src, 'base64'));
    var ft = onyx.generateFingerprintTemplate(srcImage);

    var response = {
      fingerLocation: ft.getFingerLocation(),
      quality: ft.getQuality(),
      data: ft.getData().toString('base64')
    };
    callback(null, response);
  };

  /**
   * Preprocesses WSQ formatted fingerprint image, and returns result.
   * @param {string} src WSQ formatted image encoded as Base64.
   * @param {Function(Error, string)} callback
   */

  methods.preprocessFingerprint = function(src, callback) {
    var srcImage = onyx.wsqToMat(new Buffer(src, 'base64'));
    var dstImage = createEmptyMat(srcImage.rows, srcImage.cols, srcImage.type);
    var focusQuality = onyx.preprocessFingerprint(srcImage, dstImage);

    var response = {
      "focusQuality": focusQuality,
      "dst": onyx.matToWsq(dstImage).toString('base64')
    };
    callback(null, response);
  };

  /**
   * Verifies two WSQ encoded fingerprint images.
   * @param {string} reference First WSQ fingerprint image encoded as Base64.
   * @param {string} probe Second WSQ fingerprint image encoded as Base64.
   * @param {Function(Error, number)} callback
   */

  methods.verify = function(reference, probe, callback) {
    var image1 = onyx.wsqToMat(new Buffer(reference, 'base64'));
    var image2 = onyx.wsqToMat(new Buffer(probe, 'base64'));

    var ft1 = onyx.generateFingerprintTemplate(image1);
    var ft2 = onyx.generateFingerprintTemplate(image2);

    var response = onyx.verify(ft1, ft2);
    callback(null, response);
  };
};
