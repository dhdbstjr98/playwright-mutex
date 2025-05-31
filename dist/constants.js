"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT = exports.MUTEX_CLIENT_NAME_PREFIX = exports.MUTEX_SERVER_NAME = exports.MUTEX_SERVER_PID_FILE = void 0;
var path_1 = __importDefault(require("path"));
exports.MUTEX_SERVER_PID_FILE = path_1.default.join(__dirname, 'mutex-server.pid');
exports.MUTEX_SERVER_NAME = 'playwright-mutex-server';
exports.MUTEX_CLIENT_NAME_PREFIX = 'playwright-mutex-client-';
exports.EVENT = {
    enter: 'enter',
    entered: 'entered',
    leave: 'leave',
};
