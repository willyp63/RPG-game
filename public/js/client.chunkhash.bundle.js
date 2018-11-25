/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"client": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/game/main.ts","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/engine/actors/wall.ts":
/*!***********************************!*\
  !*** ./src/engine/actors/wall.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var actor_1 = __webpack_require__(/*! ../core/actor */ "./src/engine/core/actor.ts");
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
var HPWall = /** @class */ (function (_super) {
    __extends(HPWall, _super);
    function HPWall(position, _size) {
        var _this = 
        // when creating a wall you specify the upper-left point, not the center
        _super.call(this, position.plus(_size.times(0.5))) || this;
        _this._size = _size;
        // paint a red box
        _this._sprite = new pixi_js_1.Graphics();
        _this._sprite.beginFill(0xFF0000);
        _this._sprite.drawRect(_size.x / -2, _size.y / -2, _size.x, _size.y);
        _this._sprite.endFill();
        return _this;
    }
    Object.defineProperty(HPWall, "type", {
        get: function () { return 'Wall'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPWall.prototype, "sprite", {
        get: function () { return this._sprite; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPWall.prototype, "size", {
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPWall.prototype, "isWall", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    return HPWall;
}(actor_1.default));
exports.default = HPWall;


/***/ }),

/***/ "./src/engine/core/actor-factory.ts":
/*!******************************************!*\
  !*** ./src/engine/core/actor-factory.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var wall_1 = __webpack_require__(/*! ../actors/wall */ "./src/engine/actors/wall.ts");
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var HPActorFactory = /** @class */ (function () {
    function HPActorFactory() {
    }
    HPActorFactory.prototype.createFromData = function (data) {
        var actor = this._createFromData(data);
        if (actor === undefined)
            throw new Error("Failed to return actor for data: " + JSON.stringify(data));
        return actor;
    };
    HPActorFactory.prototype._createFromData = function (data) {
        if (data.type === wall_1.default.type) {
            return new wall_1.default(vector_1.default.fromData(data.position), vector_1.default.fromData(data.props['size']));
        }
        return undefined;
    };
    return HPActorFactory;
}());
exports.default = HPActorFactory;


/***/ }),

/***/ "./src/engine/core/actor.ts":
/*!**********************************!*\
  !*** ./src/engine/core/actor.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var wall_contact_map_1 = __webpack_require__(/*! ../physics/wall-contact-map */ "./src/engine/physics/wall-contact-map.ts");
var HPActor = /** @class */ (function () {
    function HPActor(position) {
        this.position = position;
        this.velocity = vector_1.default.Zero;
        this.acceleration = vector_1.default.Zero;
        this.wallContact = new wall_contact_map_1.default();
        this.isDead = false;
        this.newBornActors = [];
    }
    Object.defineProperty(HPActor.prototype, "isWall", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "isWallBound", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "isGravityBound", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "isAirFrictionBound", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "bounciness", {
        get: function () { return 0.5; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "slipperiness", {
        get: function () { return 0.5; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "weight", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "maxVelocity", {
        get: function () { return 64; },
        enumerable: true,
        configurable: true
    });
    /* @override */
    HPActor.prototype.onTick = function () { };
    HPActor.prototype.onCollision = function (actor, collision) { };
    HPActor.prototype.beforeTick = function () {
        this.velocity = this.velocity.plus(this.acceleration).capped(this.maxVelocity);
        this.position = this.position.plus(this.velocity);
        this.acceleration = vector_1.default.Zero;
        this.wallContact = new wall_contact_map_1.default();
        // align sprite
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    };
    HPActor.prototype.push = function (force) {
        this.acceleration = this.acceleration.plus(force.times(1 / this.weight));
    };
    HPActor.prototype.kill = function () {
        this.isDead = true;
    };
    return HPActor;
}());
exports.default = HPActor;


/***/ }),

/***/ "./src/engine/core/app.ts":
/*!********************************!*\
  !*** ./src/engine/core/app.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
var stage_1 = __webpack_require__(/*! ./stage */ "./src/engine/core/stage.ts");
var area_service_1 = __webpack_require__(/*! ../services/area-service */ "./src/engine/services/area-service.ts");
var HPApp = /** @class */ (function () {
    function HPApp(viewSize, // size of the app view in pixels
    elementSelector, // identifies the DOM element the app should be rendered within
    actorFactory, // function that turns actor data into actors
    assets, // all required assets
    areaFile, // the file name of the starting area
    gravityForce, // universal force applied to all actors each tick
    airFrictionCoefficient) {
        this.actorFactory = actorFactory;
        this.assets = assets;
        this.areaFile = areaFile;
        this.app = new pixi_js_1.Application({
            width: viewSize.x,
            height: viewSize.y,
            transparent: false,
            antialias: false,
            resolution: 3,
        });
        this.element = document.body.querySelector(elementSelector) ||
            (function () { throw new Error("Can't find element with selector: " + elementSelector); })();
        this.stage = new stage_1.default(this.app.stage, gravityForce, airFrictionCoefficient);
        this.addPIXICanvasToScreen();
    }
    HPApp.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadAssets()];
                    case 1:
                        _b.sent();
                        _a = this.setAreaData;
                        return [4 /*yield*/, this.loadAreaData()];
                    case 2:
                        _a.apply(this, [_b.sent()]);
                        this.startGameLoop();
                        return [2 /*return*/];
                }
            });
        });
    };
    HPApp.prototype.addPIXICanvasToScreen = function () {
        this.element.appendChild(this.app.view);
        this.scaleToFitWithinElement();
        window.addEventListener('resize', this.scaleToFitWithinElement.bind(this));
    };
    HPApp.prototype.scaleToFitWithinElement = function () {
        var scaleX = window.innerWidth / this.app.view.offsetWidth;
        var scaleY = window.innerHeight / this.app.view.offsetHeight;
        var scale = Math.min(scaleX, scaleY);
        this.app.view.style.transform = "scale(" + scale + ")";
    };
    HPApp.prototype.loadAssets = function () {
        var _this = this;
        return new Promise(function (resolve) { return pixi_js_1.loader.add(_this.assets).load(resolve); });
    };
    HPApp.prototype.loadAreaData = function () {
        return area_service_1.default.getAreaData(this.areaFile);
    };
    HPApp.prototype.setAreaData = function (areaData) {
        var _this = this;
        this.stage.clearActors();
        areaData.actors.forEach(function (actorData) {
            _this.stage.addActor(_this.actorFactory.createFromData(actorData));
        });
    };
    HPApp.prototype.startGameLoop = function () {
        var _this = this;
        this.app.ticker.add(function () { return _this.stage.onTick(); });
        this.app.start();
    };
    return HPApp;
}());
exports.default = HPApp;


/***/ }),

/***/ "./src/engine/core/stage.ts":
/*!**********************************!*\
  !*** ./src/engine/core/stage.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var collision_detector_1 = __webpack_require__(/*! ../physics/collision-detector */ "./src/engine/physics/collision-detector.ts");
var collision_handler_1 = __webpack_require__(/*! ../physics/collision-handler */ "./src/engine/physics/collision-handler.ts");
var direction_1 = __webpack_require__(/*! ../physics/direction */ "./src/engine/physics/direction.ts");
var HPStage = /** @class */ (function () {
    function HPStage(rootContainer, gravityForce, airFrictionCoefficient) {
        this.rootContainer = rootContainer;
        this.gravityForce = gravityForce;
        this.airFrictionCoefficient = airFrictionCoefficient;
        this.actors = [];
    }
    HPStage.prototype.addActor = function (actor) {
        this.actors.push(actor);
        this.rootContainer.addChild(actor.sprite);
    };
    HPStage.prototype.removeActorAt = function (i) {
        this.rootContainer.removeChild(this.actors[i].sprite);
        this.actors.splice(i, 1);
    };
    HPStage.prototype.clearActors = function () {
        while (this.actors[0])
            this.removeActorAt(0);
    };
    HPStage.prototype.onTick = function () {
        var _this = this;
        this.actors.forEach(function (actor) { return actor.beforeTick(); });
        this.handleCollisions();
        this.actors.forEach(function (actor) {
            _this.killIfSquished(actor);
            _this.applyGravity(actor);
            _this.applyAirFriction(actor);
            actor.onTick();
            _this.addNewBornActors(actor);
        });
        this.removeDeadActors();
    };
    HPStage.prototype.handleCollisions = function () {
        for (var i = 0; i < this.actors.length; i++) {
            for (var j = i + 1; j < this.actors.length; j++) {
                var actor1 = this.actors[i];
                var actor2 = this.actors[j];
                var collision = collision_detector_1.default.detect(actor1, actor2);
                collision_handler_1.default.handle(actor1, actor2, collision);
                actor1.onCollision(actor2, collision);
                actor2.onCollision(actor1, collision.withOppositeDirection());
            }
        }
    };
    HPStage.prototype.killIfSquished = function (actor) {
        if (actor.wallContact.all([direction_1.default.Up, direction_1.default.Down]) ||
            actor.wallContact.all([direction_1.default.Left, direction_1.default.Right])) {
            actor.kill();
        }
    };
    HPStage.prototype.applyGravity = function (actor) {
        if (actor.isGravityBound)
            actor.push(this.gravityForce);
    };
    HPStage.prototype.applyAirFriction = function (actor) {
        if (actor.isAirFrictionBound)
            actor.push(actor.velocity.times(-this.airFrictionCoefficient));
    };
    HPStage.prototype.addNewBornActors = function (actor) {
        var _this = this;
        if (!actor.newBornActors.length)
            return;
        actor.newBornActors.forEach(function (actor) {
            _this.addActor(actor);
        });
        actor.newBornActors = [];
    };
    HPStage.prototype.removeDeadActors = function () {
        for (var i = 0; i < this.actors.length; i++) {
            if (this.actors[i].isDead)
                this.removeActorAt(i--);
        }
    };
    return HPStage;
}());
exports.default = HPStage;


/***/ }),

/***/ "./src/engine/physics/collision-detector.ts":
/*!**************************************************!*\
  !*** ./src/engine/physics/collision-detector.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var collision_1 = __webpack_require__(/*! ./collision */ "./src/engine/physics/collision.ts");
var direction_1 = __webpack_require__(/*! ./direction */ "./src/engine/physics/direction.ts");
var vector_1 = __webpack_require__(/*! ./vector */ "./src/engine/physics/vector.ts");
var HPCollisionDetector = /** @class */ (function () {
    function HPCollisionDetector() {
    }
    HPCollisionDetector.detect = function (e1, e2) {
        var combinedHalfSize = e1.size.times(0.5).plus(e2.size.times(0.5));
        var velocityDiff = e1.velocity.minus(e2.velocity);
        var positionDiff = e1.position.minus(e2.position);
        var hit = Math.abs(positionDiff.x) < combinedHalfSize.x &&
            Math.abs(positionDiff.y) < combinedHalfSize.y;
        if (!hit)
            return new collision_1.default();
        var penetration = HPCollisionDetector.getPenetrationVector(positionDiff, velocityDiff, combinedHalfSize);
        var direction = (penetration.x > penetration.y)
            ? velocityDiff.x > 0 ? direction_1.default.Right : direction_1.default.Left
            : velocityDiff.y > 0 ? direction_1.default.Down : direction_1.default.Up;
        return new collision_1.default(direction);
    };
    HPCollisionDetector.getPenetrationVector = function (positionDiff, velocityDiff, combinedHalfSize) {
        return new vector_1.default(HPCollisionDetector.getPenetrationScalar(positionDiff.x, velocityDiff.x, combinedHalfSize.x), HPCollisionDetector.getPenetrationScalar(positionDiff.y, velocityDiff.y, combinedHalfSize.y));
    };
    HPCollisionDetector.getPenetrationScalar = function (positionDiff, velocityDiff, combinedHalfSize) {
        var p = velocityDiff > 0
            ? combinedHalfSize + positionDiff
            : combinedHalfSize - positionDiff;
        return 1 / Math.abs(p - Math.abs(velocityDiff));
    };
    return HPCollisionDetector;
}());
exports.default = HPCollisionDetector;


/***/ }),

/***/ "./src/engine/physics/collision-handler.ts":
/*!*************************************************!*\
  !*** ./src/engine/physics/collision-handler.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var direction_1 = __webpack_require__(/*! ./direction */ "./src/engine/physics/direction.ts");
var vector_1 = __webpack_require__(/*! ./vector */ "./src/engine/physics/vector.ts");
var HPCollisionHandler = /** @class */ (function () {
    function HPCollisionHandler() {
    }
    HPCollisionHandler.handle = function (e1, e2, collision) {
        HPCollisionHandler.handleWithTargetEntity(e1, e2, collision);
        HPCollisionHandler.handleWithTargetEntity(e2, e1, collision);
    };
    HPCollisionHandler.handleWithTargetEntity = function (targetEntity, otherEntity, collision) {
        HPCollisionHandler.handleWallCollision(targetEntity, otherEntity, collision);
    };
    HPCollisionHandler.handleWallCollision = function (targetEntity, otherEntity, collision) {
        if (!targetEntity.isWallBound || !otherEntity.isWall)
            return;
        HPCollisionHandler.recedeFromWall(targetEntity, otherEntity, collision);
        HPCollisionHandler.bounceOffWall(targetEntity, otherEntity, collision);
        HPCollisionHandler.applyFloorFriction(targetEntity, otherEntity, collision);
        targetEntity.wallContact.setContact(collision.direction);
    };
    HPCollisionHandler.recedeFromWall = function (entity, wall, collision) {
        var combinedHalfSize = entity.size.times(0.5).plus(wall.size.times(0.5));
        if (collision.direction === direction_1.default.Up) {
            entity.position.y = wall.position.y + combinedHalfSize.y;
        }
        else if (collision.direction === direction_1.default.Right) {
            entity.position.x = wall.position.x - combinedHalfSize.x;
        }
        else if (collision.direction === direction_1.default.Down) {
            entity.position.y = wall.position.y - combinedHalfSize.y;
        }
        else if (collision.direction === direction_1.default.Left) {
            entity.position.x = wall.position.x + combinedHalfSize.x;
        }
    };
    HPCollisionHandler.bounceOffWall = function (entity, wall, collision) {
        var combinedBounciness = (wall.bounciness + entity.bounciness) / 2;
        if (collision.direction === direction_1.default.Up) {
            entity.velocity.y = Math.min(wall.velocity.y, entity.velocity.y * -combinedBounciness);
        }
        else if (collision.direction === direction_1.default.Right) {
            entity.velocity.x = Math.max(wall.velocity.x, entity.velocity.x * -combinedBounciness);
        }
        else if (collision.direction === direction_1.default.Down) {
            entity.velocity.y = Math.max(wall.velocity.y, entity.velocity.y * -combinedBounciness);
        }
        else if (collision.direction === direction_1.default.Left) {
            entity.velocity.x = Math.min(wall.velocity.x, entity.velocity.x * -combinedBounciness);
        }
    };
    HPCollisionHandler.applyFloorFriction = function (entity, wall, collision) {
        if (collision.direction !== direction_1.default.Up)
            return;
        var velocityDiff = wall.velocity.minus(entity.velocity);
        entity.push(new vector_1.default(velocityDiff.x * (1 - wall.slipperiness), 0));
        // stick to floor when going down elevators
        if (wall.velocity.y > 0)
            entity.velocity.y = wall.velocity.y;
    };
    return HPCollisionHandler;
}());
exports.default = HPCollisionHandler;


/***/ }),

/***/ "./src/engine/physics/collision.ts":
/*!*****************************************!*\
  !*** ./src/engine/physics/collision.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var direction_1 = __webpack_require__(/*! ./direction */ "./src/engine/physics/direction.ts");
var HPCollision = /** @class */ (function () {
    function HPCollision(_direction) {
        if (_direction === void 0) { _direction = undefined; }
        this.hit = _direction !== undefined;
        this.direction = _direction || direction_1.default.Down;
    }
    HPCollision.prototype.withOppositeDirection = function () {
        return new HPCollision(this.direction ? this.direction * -1 : undefined);
    };
    return HPCollision;
}());
exports.default = HPCollision;


/***/ }),

/***/ "./src/engine/physics/direction.ts":
/*!*****************************************!*\
  !*** ./src/engine/physics/direction.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Axis-aligned directions within the 2D plane
 *
 * To get the opposite direction on the same axis, multiply by -1
 */
var HPDirection;
(function (HPDirection) {
    HPDirection[HPDirection["Down"] = 1] = "Down";
    HPDirection[HPDirection["Up"] = -1] = "Up";
    HPDirection[HPDirection["Right"] = 2] = "Right";
    HPDirection[HPDirection["Left"] = -2] = "Left";
})(HPDirection || (HPDirection = {}));
;
exports.default = HPDirection;


/***/ }),

/***/ "./src/engine/physics/vector.ts":
/*!**************************************!*\
  !*** ./src/engine/physics/vector.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HPVector = /** @class */ (function () {
    function HPVector(x, y) {
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(HPVector, "Zero", {
        get: function () { return new HPVector(0, 0); },
        enumerable: true,
        configurable: true
    });
    HPVector.fromData = function (data) { return new HPVector(data.x, data.y); };
    Object.defineProperty(HPVector.prototype, "length", {
        get: function () { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPVector.prototype, "angle", {
        get: function () { return Math.atan2(this.y, this.x); },
        enumerable: true,
        configurable: true
    });
    HPVector.prototype.plus = function (otherVector) {
        return new HPVector(this.x + otherVector.x, this.y + otherVector.y);
    };
    HPVector.prototype.minus = function (otherVector) {
        return new HPVector(this.x - otherVector.x, this.y - otherVector.y);
    };
    HPVector.prototype.times = function (scaleVector) {
        if (typeof scaleVector === 'number') {
            scaleVector = new HPVector(scaleVector, scaleVector);
        }
        return new HPVector(this.x * scaleVector.x, this.y * scaleVector.y);
    };
    HPVector.prototype.dot = function (scaleVector) {
        return this.x * scaleVector.x + this.y * scaleVector.y;
    };
    HPVector.prototype.capped = function (capVector) {
        if (typeof capVector === 'number') {
            capVector = new HPVector(capVector, capVector);
        }
        var newX = this.x > 0 ? Math.min(this.x, capVector.x) : Math.max(this.x, -capVector.x);
        var newY = this.y > 0 ? Math.min(this.y, capVector.y) : Math.max(this.y, -capVector.y);
        return new HPVector(newX, newY);
    };
    HPVector.prototype.withNewX = function (newX) {
        return new HPVector(newX, this.y);
    };
    HPVector.prototype.withNewY = function (newY) {
        return new HPVector(this.x, newY);
    };
    HPVector.prototype.toUnitVector = function () {
        return new HPVector(this.x / this.length, this.y / this.length);
    };
    HPVector.prototype.flippedHorizontally = function (isFlipped) {
        if (isFlipped === void 0) { isFlipped = true; }
        return this.times(new HPVector(isFlipped ? -1 : 1, 1));
    };
    return HPVector;
}());
exports.default = HPVector;


/***/ }),

/***/ "./src/engine/physics/wall-contact-map.ts":
/*!************************************************!*\
  !*** ./src/engine/physics/wall-contact-map.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var direction_1 = __webpack_require__(/*! ./direction */ "./src/engine/physics/direction.ts");
var HPWallContactMap = /** @class */ (function () {
    function HPWallContactMap() {
        var _a;
        this.map = (_a = {},
            _a[direction_1.default.Up] = false,
            _a[direction_1.default.Down] = false,
            _a[direction_1.default.Right] = false,
            _a[direction_1.default.Left] = false,
            _a);
    }
    HPWallContactMap.prototype.setContact = function (direction) {
        this.map[direction] = true;
    };
    HPWallContactMap.prototype.all = function (directions) {
        var _this = this;
        return directions.every(function (direction) { return _this.map[direction]; });
    };
    HPWallContactMap.prototype.any = function (directions) {
        var _this = this;
        return directions.some(function (direction) { return _this.map[direction]; });
    };
    return HPWallContactMap;
}());
exports.default = HPWallContactMap;


/***/ }),

/***/ "./src/engine/services/area-service.ts":
/*!*********************************************!*\
  !*** ./src/engine/services/area-service.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_json_1 = __webpack_require__(/*! ../util/get-json */ "./src/engine/util/get-json.ts");
var HPAreaService = /** @class */ (function () {
    function HPAreaService() {
    }
    HPAreaService.getAreaData = function (areaFile) {
        return get_json_1.default(areaFile).then(function (json) { return json; });
    };
    return HPAreaService;
}());
exports.default = HPAreaService;


/***/ }),

/***/ "./src/engine/util/get-json.ts":
/*!*************************************!*\
  !*** ./src/engine/util/get-json.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (url) {
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
            else {
                throw new Error("Error fetching JSON from: " + url);
            }
        };
        xhr.send();
    });
});


/***/ }),

/***/ "./src/game/main.ts":
/*!**************************!*\
  !*** ./src/game/main.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __webpack_require__(/*! ../engine/core/app */ "./src/engine/core/app.ts");
var vector_1 = __webpack_require__(/*! ../engine/physics/vector */ "./src/engine/physics/vector.ts");
var actor_factory_1 = __webpack_require__(/*! ../engine/core/actor-factory */ "./src/engine/core/actor-factory.ts");
var TGActorFactory = /** @class */ (function (_super) {
    __extends(TGActorFactory, _super);
    function TGActorFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TGActorFactory.prototype._createFromData = function (data) {
        return _super.prototype._createFromData.call(this, data) || this.__createFromData(data);
    };
    TGActorFactory.prototype.__createFromData = function (data) {
        return undefined;
    };
    return TGActorFactory;
}(actor_factory_1.default));
var app = new app_1.default(new vector_1.default(825, 525), '#game-container', new TGActorFactory(), [], 'public/areas/test-1.json', new vector_1.default(0, 1), 0.01);
app.start();


/***/ })

/******/ });
//# sourceMappingURL=client.chunkhash.bundle.js.map