var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CANVAS_ID = "myCanvas";
var BG_RECT = { x: 0, y: 0, w: 1050, h: 1050 };
var FPS = 30;
var FRAME_INTERVAL = 1000 / FPS;
var WAIT_TIME = 300;
var PROCESSING = false;
var GLOBAL_PROCESSING = false;
var LEARNING = false;
var canvas = document.getElementById(CANVAS_ID);
var ctx = canvas.getContext("2d");
canvas.width = BG_RECT.w;
canvas.height = BG_RECT.h;
var staticCanvas = document.createElement('canvas');
var staticCtx = staticCanvas.getContext("2d");
staticCanvas.width = BG_RECT.w;
staticCanvas.height = BG_RECT.h;
var animationFrameId;
var lastFrameTime = 0;
var callbacks = [];
var Pile = /** @class */ (function () {
    function Pile() {
        this.length = 0;
        this.mem = [];
    }
    Pile.prototype.push = function (e) {
        this.length++;
        this.mem.push(e);
    };
    Pile.prototype.pop = function () {
        this.length = this.length > 0 ? this.length - 1 : 0;
        return this.mem.pop();
    };
    Pile.prototype.empty = function () {
        this.mem = [];
        this.length = 0;
    };
    Pile.prototype.draw = function (x, y) {
        var w = 150;
        var h = 200;
        var e = 10;
        var eh = 10;
        // container
        staticCtx.fillStyle = "#000000";
        staticCtx.fillRect(x - w / 2, y - h, w, h);
        staticCtx.fillStyle = "#ffffff";
        staticCtx.fillRect(x - w / 2 + e, y - h, w - 2 * e, h - e);
        // element
        var ye = y - e - eh / 2;
        for (var i = 0; i < this.length; i++) {
            var ew = this.mem[i].value / 10 * (w - 2 * e);
            staticCtx.fillStyle = this.mem[i].color;
            staticCtx.fillRect(x - ew / 2, ye - i * eh - eh / 2, ew, eh);
        }
    };
    return Pile;
}());
var File_t = /** @class */ (function () {
    function File_t() {
        this.head = new Pile();
        this.b_head = new Pile();
        this.tail = new Pile();
        this.c_tail = new Pile();
        this.b_1 = new Pile();
        this.b_2 = new Pile();
        this.stepLevel = 0;
        this.count = 0;
    }
    File_t.prototype.emptyAll = function () {
        this.b_head.empty();
        this.b_1.empty();
        this.b_2.empty();
        this.c_tail.empty();
        while (this.tail.length > 0) {
            this.b_1.push(this.tail.pop());
        }
        while (this.b_1.length > 0) {
            var e = this.b_1.pop();
            this.tail.push(e);
            this.c_tail.push(e);
        }
    };
    File_t.prototype.push = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Current step:", this.stepLevel, "\n");
                        if (!(this.head.length === 0 && this.tail.length === 0)) return [3 /*break*/, 1];
                        this.tail.push(e);
                        this.c_tail.push(e);
                        return [3 /*break*/, 5];
                    case 1:
                        if (!(this.stepLevel > 0)) return [3 /*break*/, 3];
                        this.head.push(e);
                        GLOBAL_PROCESSING = true;
                        return [4 /*yield*/, this.step()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this.head.push(e);
                        if (!(this.head.length === this.tail.length)) return [3 /*break*/, 5];
                        console.log("Begin Transfert\n");
                        this.stepLevel = 1;
                        GLOBAL_PROCESSING = true;
                        return [4 /*yield*/, this.step()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    File_t.prototype.pop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.stepLevel > 2)) return [3 /*break*/, 2];
                        this.count++;
                        this.tail.pop();
                        GLOBAL_PROCESSING = true;
                        return [4 /*yield*/, this.step()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        this.c_tail.pop();
                        this.tail.pop();
                        if (!(this.stepLevel > 0)) return [3 /*break*/, 4];
                        GLOBAL_PROCESSING = true;
                        return [4 /*yield*/, this.step()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(this.head.length === this.tail.length)) return [3 /*break*/, 6];
                        console.log("Begin Transfert\n");
                        this.stepLevel = 1;
                        return [4 /*yield*/, this.step()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    File_t.prototype.step = function () {
        return __awaiter(this, arguments, void 0, function (n) {
            var e, e, e;
            var _a, _b, _c, _d, _e, _f;
            if (n === void 0) { n = 5; }
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (n <= 0) { // finit le nombre d'étape pour le moment
                            GLOBAL_PROCESSING = false;
                            return [2 /*return*/];
                        }
                        if (!!LEARNING) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, WAIT_TIME); })];
                    case 1:
                        _g.sent();
                        _g.label = 2;
                    case 2:
                        this.draw();
                        console.log("Transfer step:", this.stepLevel, "\n");
                        if (!(this.stepLevel === 1)) return [3 /*break*/, 5];
                        _a = [this.b_head, this.head], this.head = _a[0], this.b_head = _a[1];
                        this.stepLevel++;
                        if (!!LEARNING) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.step(n)];
                    case 3:
                        _g.sent();
                        _g.label = 4;
                    case 4: return [3 /*break*/, 34];
                    case 5:
                        if (!(this.stepLevel === 2)) return [3 /*break*/, 13];
                        e = this.b_head.pop();
                        if (!(e === undefined)) return [3 /*break*/, 8];
                        this.stepLevel++;
                        if (!!LEARNING) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.step(n)];
                    case 6:
                        _g.sent();
                        _g.label = 7;
                    case 7: return [3 /*break*/, 12];
                    case 8:
                        this.b_1.push(e);
                        this.b_2.push(e);
                        if (!!LEARNING) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.step(n - 2)];
                    case 9:
                        _g.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.step(n)];
                    case 11:
                        _g.sent();
                        _g.label = 12;
                    case 12: return [3 /*break*/, 34];
                    case 13:
                        if (!(this.stepLevel === 3)) return [3 /*break*/, 16];
                        _b = [this.b_2, this.b_head], this.b_head = _b[0], this.b_2 = _b[1];
                        this.stepLevel++;
                        if (!!LEARNING) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.step(n)];
                    case 14:
                        _g.sent();
                        _g.label = 15;
                    case 15: return [3 /*break*/, 34];
                    case 16:
                        if (!(this.stepLevel === 4)) return [3 /*break*/, 24];
                        e = this.c_tail.pop();
                        if (!(e === undefined)) return [3 /*break*/, 19];
                        this.stepLevel++;
                        if (!!LEARNING) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.step(n)];
                    case 17:
                        _g.sent();
                        _g.label = 18;
                    case 18: return [3 /*break*/, 23];
                    case 19:
                        this.b_2.push(e);
                        if (!!LEARNING) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.step(n - 1)];
                    case 20:
                        _g.sent();
                        return [3 /*break*/, 23];
                    case 21: return [4 /*yield*/, this.step(n)];
                    case 22:
                        _g.sent();
                        _g.label = 23;
                    case 23: return [3 /*break*/, 34];
                    case 24:
                        if (!(this.stepLevel === 5)) return [3 /*break*/, 33];
                        if (this.b_2.length === this.count) { // ne pas compter les éléments déjà retirés
                            _c = [this.c_tail, this.b_1], this.b_1 = _c[0], this.c_tail = _c[1];
                            _d = [this.tail, this.b_head], this.b_head = _d[0], this.tail = _d[1];
                            this.stepLevel = 0;
                            this.emptyAll();
                            GLOBAL_PROCESSING = false;
                            this.count = 0;
                            return [2 /*return*/];
                        }
                        e = this.b_2.pop();
                        if (!(e === undefined)) return [3 /*break*/, 25];
                        this.stepLevel++;
                        if (!LEARNING) {
                            this.step(n);
                        }
                        return [3 /*break*/, 32];
                    case 25:
                        this.b_head.push(e);
                        this.b_1.push(e);
                        if (!(this.b_2.length === 0)) return [3 /*break*/, 28];
                        this.stepLevel++;
                        if (!!LEARNING) return [3 /*break*/, 27];
                        return [4 /*yield*/, this.step(n)];
                    case 26:
                        _g.sent();
                        _g.label = 27;
                    case 27: return [3 /*break*/, 32];
                    case 28:
                        if (!!LEARNING) return [3 /*break*/, 30];
                        return [4 /*yield*/, this.step(n - 2)];
                    case 29:
                        _g.sent();
                        return [3 /*break*/, 32];
                    case 30: return [4 /*yield*/, this.step(n)];
                    case 31:
                        _g.sent();
                        _g.label = 32;
                    case 32: return [3 /*break*/, 34];
                    case 33:
                        if (this.stepLevel === 6) { // dernier échange
                            _e = [this.c_tail, this.b_1], this.b_1 = _e[0], this.c_tail = _e[1];
                            _f = [this.tail, this.b_head], this.b_head = _f[0], this.tail = _f[1];
                            this.stepLevel = 0;
                            this.emptyAll();
                            GLOBAL_PROCESSING = false;
                            this.count = 0;
                            return [2 /*return*/];
                        }
                        _g.label = 34;
                    case 34: return [2 /*return*/];
                }
            });
        });
    };
    File_t.prototype.draw = function () {
        var ofs = 200;
        var c = 525;
        staticCtx.clearRect(0, 0, BG_RECT.w, BG_RECT.h);
        // processing
        if (PROCESSING) {
            staticCtx.fillStyle = "#000000";
            staticCtx.font = "40px garamond";
            staticCtx.fillText("Échanges en cours", 390, 50);
        }
        // piles
        this.head.draw(c - ofs, 300);
        this.tail.draw(c + ofs, 300);
        this.b_head.draw(c - ofs, 600);
        this.c_tail.draw(c + ofs, 600);
        this.b_1.draw(c - ofs, 900);
        this.b_2.draw(c + ofs, 900);
        // flèches entrée/sortie
        var R = 80;
        var ox = c - ofs - 150 / 2 - 5;
        var oy = 100;
        staticCtx.strokeStyle = "#000000";
        staticCtx.beginPath();
        staticCtx.moveTo(ox - R, oy);
        staticCtx.quadraticCurveTo(ox, oy - R, ox + R, oy);
        staticCtx.lineTo(ox + R, oy - 10);
        staticCtx.moveTo(ox + R, oy);
        staticCtx.lineTo(ox + R - 10, oy);
        staticCtx.stroke();
        ox = c + ofs + 150 / 2 + 5;
        staticCtx.beginPath();
        staticCtx.moveTo(ox - R, oy);
        staticCtx.quadraticCurveTo(ox, oy - R, ox + R, oy);
        staticCtx.lineTo(ox + R, oy - 10);
        staticCtx.moveTo(ox + R, oy);
        staticCtx.lineTo(ox + R - 10, oy);
        staticCtx.stroke();
        // explication touches
        staticCtx.fillStyle = "#000000";
        staticCtx.font = "40px garamond";
        if (!LEARNING) {
            if (!PROCESSING) {
                staticCtx.fillText("'+' : empiler", c - ofs - 300, 150);
                staticCtx.fillText("'-' : dépiler", c - ofs - 300, 242);
                staticCtx.fillText("'a' : mode apprentissage (off)", c - ofs - 300, 335);
            }
        }
        else {
            if (!GLOBAL_PROCESSING) {
                staticCtx.fillText("'+' : empiler", c - ofs - 300, 150);
                staticCtx.fillText("'-' : dépiler", c - ofs - 300, 242);
                staticCtx.fillText("'a' : mode apprentissage (on)", c - ofs - 300, 335);
            }
            else {
                staticCtx.fillText("'Entrée' :", c - ofs - 300, 150);
                staticCtx.fillText("      suivant", c - ofs - 300, 200);
                staticCtx.fillText("'a' : mode apprentissage (on)", c - ofs - 300, 335);
            }
        }
        // séparation
        staticCtx.strokeStyle = "#ff0000";
        staticCtx.beginPath();
        staticCtx.moveTo(c - ofs - 200, 350);
        staticCtx.lineTo(c + ofs + 200, 350);
        staticCtx.stroke();
        // flèches
        console.log("step:", this.stepLevel, "\n");
        staticCtx.strokeStyle = "#000000";
        if (this.stepLevel === 2 || this.stepLevel === 3) {
            this.drawArrow(c - ofs, 610, c - ofs, 700);
            this.drawArrow(c - ofs, 610, c + ofs, 700);
        }
        else if (this.stepLevel == 5) {
            this.drawArrow(c + ofs, 610, c + ofs, 700);
        }
        else if (this.stepLevel === 6) {
            this.drawArrow(c + 100, 800, c - 100, 800);
            this.drawArrow(c + 100, 800, c - ofs, 610);
        }
        ctx.clearRect(0, 0, BG_RECT.w, BG_RECT.h);
        ctx.drawImage(staticCanvas, 0, 0);
    };
    File_t.prototype.drawArrow = function (x0, y0, x1, y1) {
        staticCtx.beginPath();
        staticCtx.moveTo(x0, y0);
        staticCtx.lineTo(x1, y1);
        var vx = x1 - x0;
        var vy = y1 - y0;
        var n = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
        if (n !== 0) {
            var s2 = Math.sqrt(2) / 2;
            vx /= -n;
            vy /= -n;
            var vx1 = s2 * vx + s2 * vy;
            var vy1 = -s2 * vx + s2 * vy;
            staticCtx.lineTo(x1 + vx1 * 10, y1 + vy1 * 10);
            staticCtx.moveTo(x1, y1);
            var vx2 = s2 * vx - s2 * vy;
            var vy2 = s2 * vx + s2 * vy;
            staticCtx.lineTo(x1 + vx2 * 10, y1 + vy2 * 10);
        }
        staticCtx.stroke();
    };
    return File_t;
}());
//animation de la file
var FILE = new File_t();
function drawFrame() {
    FILE.draw();
}
function animationLoop(currentTime) {
    animationFrameId = requestAnimationFrame(animationLoop);
    var delaTime = currentTime - lastFrameTime;
    if (delaTime < FRAME_INTERVAL)
        return;
    lastFrameTime = currentTime - (delaTime % FRAME_INTERVAL);
    drawFrame();
}
function initEventListener() {
    var _this = this;
    var handlers = {
        handleKeyDown: function (e) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(e.key === '+')) return [3 /*break*/, 3];
                        if (!(!PROCESSING && !GLOBAL_PROCESSING)) return [3 /*break*/, 2];
                        PROCESSING = true;
                        return [4 /*yield*/, FILE.push({
                                value: Math.floor(Math.random() * 10) + 1,
                                color: getRandomColor()
                            })];
                    case 1:
                        _a.sent();
                        PROCESSING = false;
                        _a.label = 2;
                    case 2: return [3 /*break*/, 10];
                    case 3:
                        if (!(e.key === "-")) return [3 /*break*/, 6];
                        if (!(!PROCESSING && !GLOBAL_PROCESSING)) return [3 /*break*/, 5];
                        PROCESSING = true;
                        return [4 /*yield*/, FILE.pop()];
                    case 4:
                        _a.sent();
                        PROCESSING = false;
                        _a.label = 5;
                    case 5: return [3 /*break*/, 10];
                    case 6:
                        if (!(e.key === "Enter")) return [3 /*break*/, 9];
                        if (!(LEARNING && !PROCESSING)) return [3 /*break*/, 8];
                        PROCESSING = true;
                        return [4 /*yield*/, FILE.step()];
                    case 7:
                        _a.sent();
                        PROCESSING = false;
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (e.key === "a") {
                            LEARNING = !LEARNING;
                            FILE.emptyAll();
                            FILE.stepLevel = 0;
                            FILE.count = 0;
                            PROCESSING = false;
                            GLOBAL_PROCESSING = false;
                        }
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        }); }
    };
    document.addEventListener('keydown', handlers.handleKeyDown);
    callbacks.push(function () {
        document.removeEventListener('keydown', handlers.handleKeyDown);
    });
}
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
function initDisplay() {
    initEventListener();
    requestAnimationFrame(animationLoop);
    window.cleanup = cleanup;
}
function cleanup() {
    cancelAnimationFrame(animationFrameId);
    callbacks.forEach(function (fn) { return fn(); });
}
if (typeof window !== 'undefined') {
    initDisplay();
}
