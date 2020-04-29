var expect = require('chai').expect;
var io = require('socket.io-client');

var app = require('../index');

var socketUrl = 'http://localhost:3000';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Sockets', function () {
  var user, walker;

  // test walk status
  it('test 1: broadcast/recieve walk status', function (done) {
    // Set up user connection
    user = io.connect(socketUrl, options);

    // Set up event listener
    user.on('walk status', function (status) {
      expect(status).to.equal(1);

      // Disconnect both client connections
      user.disconnect();
      walker.disconnect();
      done();
    });

    user.on('connect', function () {
      // Set up walker connection
      walker = io.connect(socketUrl, options);

      walker.on('connect', function () {
        // Emit event when all clients are connected.
        walker.emit('walk status', 1);
      });
    });
  });

  // test user walk status
  it('test 2: send/recieve user walk status', function (done) {
    // Set up walker connection
    walker = io.connect(socketUrl, options);

    // Set up event listener
    walker.on('user walk status', function (status) {
      expect(status).to.equal(-2);

      // Disconnect both client connections
      walker.disconnect();
      user.disconnect();
      done();
    });

    walker.on('connect', function () {
      // Set up user connection
      user = io.connect(socketUrl, options);

      user.on('connect', function () {
        // Emit event when all clients are connected.
        user.emit("user walk status", {
          walkerId: walker.id,
          status: -2,
        });
      });
    });
  });

  // test walker walk status
  it('test 3: send/recieve walker walk status', function (done) {
    // Set up user connection
    user = io.connect(socketUrl, options);

    // Set up event listener
    user.on('walker walk status', function (status) {
      expect(status).to.equal(2);

      // Disconnect both client connections
      user.disconnect();
      walker.disconnect();
      done();
    });

    user.on('connect', function () {
      // Set up walker connection
      walker = io.connect(socketUrl, options);

      walker.on('connect', function () {
        // Emit event when all clients are connected.
        walker.emit("walker walk status", {
          userId: user.id,
          status: 2,
        });
      });
    });
  });

  // test walker location
  it('test 3: send/recieve walker location', function (done) {
    // Set up user connection
    user = io.connect(socketUrl, options);

    // Set up event listener
    user.on('walker location', function ({ lat, lng }) {
      expect(lat).to.equal(123.42);
      expect(lng).to.equal(983.82);

      // Disconnect both client connections
      user.disconnect();
      walker.disconnect();
      done();
    });

    user.on('connect', function () {
      // Set up walker connection
      walker = io.connect(socketUrl, options);

      walker.on('connect', function () {
        // Emit event when all clients are connected.
        walker.emit("walker location", {
          userId: user.id,
          lat: 123.42,
          lng: 983.82
        });
      });
    });
  });
});