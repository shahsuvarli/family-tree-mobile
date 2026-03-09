class WebSocketShim {
  constructor() {
    throw new Error("The ws package is not available in React Native.");
  }
}

module.exports = WebSocketShim;
module.exports.WebSocket = WebSocketShim;
