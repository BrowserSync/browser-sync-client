var socket = window.___socket___;

/**
 * Alias for socket.emit
 * @param name
 * @param data
 */
module.exports.emit = function (name, data) {
    if (socket && socket.emit) {
        // send relative path of where the event is sent
        data.url = window.location.pathname;
        socket.emit(name, data);
    }
};

/**
 * Alias for socket.on
 * @param name
 * @param func
 */
module.exports.on = function (name, func) {
    socket.on(name, func);
};