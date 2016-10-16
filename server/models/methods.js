'use strict';

var onyx = require('onyx-node');

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
      nfiqScore: nfiqMetrics.nfiqScore,
      mlpScore: nfiqMetrics.mlpScore
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
    var results = onyx.enhanceFingerprint(srcImage);

    var response = {
      enhanced: onyx.matToWsq(results.enhanced).toString('base64'),
      energyMask: onyx.matToWsq(results.energyMask).toString('base64')
    };
    callback(null, response);
  };

  /**
   * Enrolls a raw fingerprint image into external database.
   * NOTE: Additional fields can be sent from the client with user identifiable data.
   * @param {string} image WSQ formatted image encoded as Base64.
   * @param {Function(Error, object)} callback
   */

  methods.enroll = function(image, callback) {
    // NOTE: Pseudocode below, please modify as needed.
    // TODO: send Base64 encoded WSQ data to enrollment database
    var response = {
      status: "Successfully enrolled fingerprint to AFIS database.",
      enrollQuality: 100.0,
      otherUsefulMetric: 25.0,
      generatedUserId: Math.round(100.0*Math.random()) // replace with database ID for client if needed
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
   * Performs identification with external server.
   * @param {string} image WSQ formatted image with Base64 encoding.
   * @param {Function(Error, object)} callback
   */

  methods.identify = function(image, callback) {
    // NOTE: Pseudocode below, please modify as needed.
    // TODO: send Base64 encoded WSQ data to AFIS database

    var response = {
      status: "Successfully identified fingerprint in AFIS database.",
      score: 100.0,
      userId: Math.round(100.0*Math.random()),
      otherUserInfo: "Relevant data to be shown on the client"
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

    var results = onyx.preprocessFingerprint(srcImage);

    var response = {
      "focusQuality": results.retval,
      "dst": onyx.matToWsq(results.dst).toString('base64')
    };
    callback(null, response);
  };

  /**
   * Pyramids a WSQ formatted image in Base64 encoding to multiple scales.
   * @param {string} image WSQ formatted image encoded as Base64.
   * @param {array} scales An array of numbers defining the pyramid scales (3 is recommended).
   * @param {Function(Error, array)} callback
   */

  methods.pyramidImage = function(image, scales, callback) {
    var srcImage = onyx.wsqToMat(new Buffer(image, 'base64'));

    var imagePyramid = onyx.pyramidImage(srcImage, scales);

    var response = imagePyramid.map(function(mat) {
      return onyx.matToWsq(mat).toString('base64')
    });
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
