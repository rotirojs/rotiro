"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mappers = void 0;
const mappers_1 = require("../utils/mappers");
class Mappers {
    constructor() {
        this._mappers = {};
        this._locked = false;
        this.registerDefaultMappers();
    }
    get locked() {
        return this._locked;
    }
    lock() {
        this._locked = true;
    }
    mapDataType(data, type) {
        const mapperFunc = this.getMapper(type);
        return mapperFunc(data);
    }
    getMapper(type) {
        let mapper = this._mappers[type];
        if (!mapper) {
            mapper = this._mappers.string;
        }
        return mapper;
    }
    registerMapper(type, mapper) {
        if (this.locked) {
            throw new Error('Api is locked and cannot be updated');
        }
        this._mappers[type] = mapper;
    }
    registerDefaultMappers() {
        this.registerMapper('string', mappers_1.stringMapper);
        this.registerMapper('number', mappers_1.numberMapper);
        this.registerMapper('json', mappers_1.jsonMapper);
    }
}
exports.Mappers = Mappers;
//# sourceMappingURL=mappers.js.map