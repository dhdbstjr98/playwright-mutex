"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_ipc_1 = __importDefault(require("node-ipc"));
var constants_1 = require("./constants");
node_ipc_1.default.config.id = constants_1.MUTEX_SERVER_NAME;
node_ipc_1.default.config.retry = 1500;
node_ipc_1.default.config.silent = true;
if (process.env.DEBUG) {
    node_ipc_1.default.config.silent = false;
    node_ipc_1.default.config.logger = console.log;
}
var lockStatusMap = {};
node_ipc_1.default.serve(function () {
    node_ipc_1.default.server.on(constants_1.EVENT.enter, function (_a, socket) {
        var _b;
        var name = _a.name;
        if (!name) {
            return;
        }
        (_b = lockStatusMap[name]) !== null && _b !== void 0 ? _b : (lockStatusMap[name] = { locked: false, socketQueue: [] });
        var lockStatus = lockStatusMap[name];
        if (!lockStatus.locked) {
            lockStatus.locked = true;
            node_ipc_1.default.server.emit(socket, constants_1.EVENT.entered, { name: name });
            return;
        }
        lockStatus.socketQueue.push(socket);
    });
    node_ipc_1.default.server.on(constants_1.EVENT.leave, function (_a) {
        var name = _a.name;
        if (!name) {
            return;
        }
        var lockStatus = lockStatusMap[name];
        if (!lockStatus) {
            return;
        }
        while (lockStatus.socketQueue.length > 0) {
            var nextSocket = lockStatus.socketQueue.shift();
            if (!nextSocket || nextSocket.destroyed) {
                continue;
            }
            node_ipc_1.default.server.emit(nextSocket, constants_1.EVENT.entered, { name: name });
            return;
        }
        lockStatus.locked = false;
    });
});
node_ipc_1.default.server.start();
