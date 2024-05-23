let serverReady = false;

exports.setServerReady = function (value = false) {
  serverReady = Boolean(value);
};

exports.getAllReadyStatus = function () {
  return {
    isReady: serverReady,
    serverReady,
  };
};
