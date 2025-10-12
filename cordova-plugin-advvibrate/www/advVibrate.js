var exec = require("cordova/exec");

exports.vibrate = function (pattern, success, error) {
  if (!Array.isArray(pattern)) {
    return error && error("pattern must be an array of numbers");
  }
  exec(success, error, "AdvVibrate", "vibrate", [pattern]);
};
