"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
class Error {
    constructor(errCode, message) {
        this.error = {};
        this.error = {
            "code": errCode || 0,
            "message": message || "Internal error"
        };
    }
}
exports.Error = Error;
class Success {
    constructor(data) {
        lodash.extend(this, data);
    }
}
exports.Success = Success;
//# sourceMappingURL=Response.js.map