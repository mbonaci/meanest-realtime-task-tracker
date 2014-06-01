'use strict';

//angular.module('primus', [])
//
//  .factory('socket', function(socketFactory) {
//    return socketFactory({url: 'http://localhost:3000/primus', debug: true});
//  });


/*
 * angular-sockjs v0.0.2
 * (c) 2014 Ben Drucker http://bendrucker.me
 * Based on https://github.com/btford/angular-socket-io
 * License: MIT
 */


//angular.module('bd.sockjs', []).provider('socketFactory', function () {
//
//  // expose to provider
//  this.$get = function ($timeout) {
//
//    var asyncAngularify = function (socket, callback) {
//      return callback ? function () {
//        var args = arguments;
//        $timeout(function () {
//          callback.apply(socket, args);
//        }, 0);
//      } : angular.noop;
//    };
//
//    return function socketFactory (options) {
//      options = options || {};
//      var socket = options.socket || new SockJS(options.url);
//
//      var wrappedSocket = {
//        callbacks: {},
//        setHandler: function (event, callback) {
//          socket['on' + event] = asyncAngularify(socket, callback);
//          return this;
//        },
//        removeHandler: function(event) {
//          delete socket['on' + event];
//          return this;
//        },
//        send: function () {
//          return socket.send.apply(socket, arguments);
//        },
//        close: function () {
//          return socket.close.apply(socket, arguments);
//        }
//      };
//
//      return wrappedSocket;
//    };
//  };
//});



//app.factory('socket', function ($rootScope) {
//  var socket = io.connect();
//  return {
//    on: function (eventName, callback) {
//      socket.on(eventName, function () {
//        var args = arguments;
//        $rootScope.$apply(function () {
//          callback.apply(socket, args);
//        });
//      });
//    },
//    emit: function (eventName, data, callback) {
//      socket.emit(eventName, data, function () {
//        var args = arguments;
//        $rootScope.$apply(function () {
//          if (callback) {
//            callback.apply(socket, args);
//          }
//        });
//      });
//    }
//  };
//});