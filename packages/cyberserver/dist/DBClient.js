"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const pg_1 = require("pg");
class DBClient {
    constructor(config) {
        this.client = null;
        const { dbname, user, password, host, port, minconn = 10, // Default minimum connections
        maxconn = 100, // Default maximum connections
         } = config;
        this.pool = new pg_1.Pool({
            user,
            host,
            database: dbname,
            password,
            port,
            min: minconn,
            max: maxconn,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 1000,
        });
    }
    static getInstance(config) {
        if (!DBClient.instance) {
            DBClient.instance = new DBClient(config);
        }
        return DBClient.instance;
    }
    initializeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client) {
                    this.client = yield this.pool.connect();
                    console.log('Live connection established');
                }
            }
            catch (error) {
                console.error('Error establishing live connection:', error);
            }
        });
    }
    executeQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                console.error('No live connection available');
                return [];
            }
            try {
                const res = yield this.client.query(query, params);
                return res.rows || [];
            }
            catch (error) {
                console.error('Error executing query with live connection:', error);
                return [];
            }
        });
    }
    closePool() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
            console.log('Connection pool closed');
        });
    }
}
exports.DBClient = DBClient;
DBClient.instance = null;
