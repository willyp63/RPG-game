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

/***/ "./src/engine/actors/skeletal-actor.ts":
/*!*********************************************!*\
  !*** ./src/engine/actors/skeletal-actor.ts ***!
  \*********************************************/
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
var set_ticks_out_1 = __webpack_require__(/*! ../util/set-ticks-out */ "./src/engine/util/set-ticks-out.ts");
var HPSkeletalActor = /** @class */ (function (_super) {
    __extends(HPSkeletalActor, _super);
    function HPSkeletalActor(position, bones, restingFrame) {
        var _this = _super.call(this, position, new pixi_js_1.Container()) || this;
        _this.bones = bones;
        _this.restingFrame = restingFrame;
        _this.boneIdToBoneSprite = {};
        return _this;
    }
    HPSkeletalActor.prototype.setTextureMap = function (textureMap) {
        var _this = this;
        Object.keys(textureMap).forEach(function (boneId) {
            _this.getBone(boneId).texture = textureMap[boneId];
        });
    };
    HPSkeletalActor.prototype.setAnchor = function (boneId, anchor) {
        this.getBone(boneId).anchor = { x: anchor.x, y: anchor.y };
    };
    HPSkeletalActor.prototype.playAnimation = function (animation) {
        this._cancelAnimation();
        this._playAnimation(animation);
    };
    HPSkeletalActor.prototype.cancelAnimation = function () {
        this._cancelAnimation();
        this.performPivots(this.restingFrame);
    };
    HPSkeletalActor.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        this.bones.forEach(function (bone) {
            var sprite = _this.initBone(bone);
            _this.sprite.addChild(sprite);
        });
        this.performPivots(this.restingFrame);
    };
    HPSkeletalActor.prototype.onTick = function () {
        _super.prototype.onTick.call(this);
        this.sprite.scale.x = (this.isFacingLeft ? -1 : 1);
    };
    HPSkeletalActor.prototype.getBone = function (id) {
        var bone = this.boneIdToBoneSprite[id];
        if (bone === undefined)
            throw new Error("Can't find bone with id: " + id);
        return bone;
    };
    HPSkeletalActor.prototype.initBone = function (bone) {
        var _this = this;
        var sprite = new pixi_js_1.Sprite();
        sprite.x = bone.position.x;
        sprite.y = bone.position.y;
        sprite.anchor = bone.anchor
            ? { x: bone.anchor.x, y: bone.anchor.y }
            : { x: 0.5, y: 0.5 };
        this.boneIdToBoneSprite[bone.id] = sprite;
        // ensure a pivot value for every bone in resting frame
        if (this.restingFrame.pivots[bone.id] === undefined) {
            this.restingFrame.pivots[bone.id] = 0;
        }
        if (bone.children) {
            bone.children.forEach(function (childBone) {
                var childSprite = _this.initBone(childBone);
                sprite.addChild(childSprite);
            });
        }
        return sprite;
    };
    HPSkeletalActor.prototype._playAnimation = function (animation, i) {
        var _this = this;
        if (i === void 0) { i = 0; }
        this.setFrame(animation.frames[i]);
        var nextIndex = i + 1;
        if (nextIndex >= animation.frames.length)
            nextIndex = 0;
        this.animationTicksOut = set_ticks_out_1.setTicksOut(function () {
            _this._playAnimation(animation, nextIndex);
        }, 1 / animation.speed);
    };
    HPSkeletalActor.prototype._cancelAnimation = function () {
        if (this.animationTicksOut)
            set_ticks_out_1.clearTicksOut(this.animationTicksOut);
    };
    HPSkeletalActor.prototype.setFrame = function (frame) {
        this.performPivots(this.restingFrame);
        this.performPivots(frame);
    };
    HPSkeletalActor.prototype.performPivots = function (frame) {
        var _this = this;
        this.sprite.rotation = frame.rootPivot === undefined ? 0 : frame.rootPivot;
        Object.keys(frame.pivots).forEach(function (boneId) {
            _this.getBone(boneId).rotation = frame.pivots[boneId];
        });
    };
    return HPSkeletalActor;
}(actor_1.default));
exports.default = HPSkeletalActor;


/***/ }),

/***/ "./src/engine/actors/static-shape-actor.ts":
/*!*************************************************!*\
  !*** ./src/engine/actors/static-shape-actor.ts ***!
  \*************************************************/
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
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
var HPStaticShapeActor = /** @class */ (function (_super) {
    __extends(HPStaticShapeActor, _super);
    function HPStaticShapeActor(position) {
        return _super.call(this, position, new pixi_js_1.Graphics()) || this;
    }
    Object.defineProperty(HPStaticShapeActor.prototype, "color", {
        /** @override */
        get: function () { return 0xFFFFFF; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPStaticShapeActor.prototype, "borderWidth", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPStaticShapeActor.prototype, "borderColor", {
        get: function () { return 0x000000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPStaticShapeActor.prototype, "cornerRadius", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPStaticShapeActor.prototype, "isRound", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    HPStaticShapeActor.prototype.init = function () {
        _super.prototype.init.call(this);
        this.paint();
    };
    HPStaticShapeActor.prototype.paint = function () {
        this._sprite.clear();
        this._sprite.beginFill(this.color);
        var adjustedSize = this.size;
        if (this.borderWidth > 0) {
            this._sprite.lineStyle(this.borderWidth, this.borderColor);
            var borderSize = new vector_1.default(this.borderWidth, this.borderWidth);
            adjustedSize = this.size.minus(borderSize);
        }
        if (this.isRound) {
            this._sprite.drawEllipse(0, 0, adjustedSize.x / 2, adjustedSize.y / 2);
        }
        else {
            this.cornerRadius > 0
                ? this._sprite.drawRoundedRect(adjustedSize.x / -2, adjustedSize.y / -2, adjustedSize.x, adjustedSize.y, this.cornerRadius)
                : this._sprite.drawRect(adjustedSize.x / -2, adjustedSize.y / -2, adjustedSize.x, adjustedSize.y);
        }
        this._sprite.endFill();
    };
    Object.defineProperty(HPStaticShapeActor.prototype, "_sprite", {
        get: function () { return this.sprite; },
        enumerable: true,
        configurable: true
    });
    return HPStaticShapeActor;
}(actor_1.default));
exports.default = HPStaticShapeActor;


/***/ }),

/***/ "./src/engine/core/actor-type.ts":
/*!***************************************!*\
  !*** ./src/engine/core/actor-type.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HPActorType;
(function (HPActorType) {
    HPActorType[HPActorType["Friendly"] = 0] = "Friendly";
    HPActorType[HPActorType["Unfriendly"] = 1] = "Unfriendly";
    HPActorType[HPActorType["Nuetral"] = 2] = "Nuetral";
})(HPActorType || (HPActorType = {}));
;
exports.default = HPActorType;


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
var actor_type_1 = __webpack_require__(/*! ./actor-type */ "./src/engine/core/actor-type.ts");
var direction_1 = __webpack_require__(/*! ../physics/direction */ "./src/engine/physics/direction.ts");
var health_bar_1 = __webpack_require__(/*! ./health-bar */ "./src/engine/core/health-bar.ts");
var HPActor = /** @class */ (function () {
    function HPActor(position, sprite) {
        this.position = position;
        this.sprite = sprite;
        this.velocity = vector_1.default.Zero;
        this.acceleration = vector_1.default.Zero;
        this.moveForce = vector_1.default.Zero;
        this.facingDirection = direction_1.default.Right;
        this.wallContact = new wall_contact_map_1.default();
        this.isOnGround = false;
        this.isDead = false;
        this.newBornActors = [];
        this.healthBar = new health_bar_1.default();
        this.health = 0;
    }
    Object.defineProperty(HPActor.prototype, "type", {
        /** @override */
        get: function () { return actor_type_1.default.Nuetral; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "bounciness", {
        get: function () { return 0.2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "slipperiness", {
        get: function () { return 0.2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "size", {
        get: function () { return vector_1.default.Zero; },
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
    Object.defineProperty(HPActor.prototype, "isWall", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "isWallBound", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "gravityBoundCoefficient", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "isAirFrictionBound", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "airWalkCoefficient", {
        get: function () { return 0.066; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "hasHealth", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "maxHealth", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPActor.prototype, "hideHealthBar", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    /** @override */
    HPActor.prototype.init = function () {
        this.health = this.maxHealth;
        this.initHealthBar();
    };
    HPActor.prototype.destroy = function () { };
    HPActor.prototype.onCollision = function (actor, collision) { };
    /** @override */
    HPActor.prototype.onTick = function () {
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.isOnGround = this.wallContact.all([direction_1.default.Down]);
        this.push(this.isOnGround ? this.moveForce : this.moveForce.times(this.airWalkCoefficient));
    };
    HPActor.prototype.beforeTick = function () {
        this.velocity = this.velocity.plus(this.acceleration).limit(this.maxVelocity);
        this.position = this.position.plus(this.velocity);
        this.acceleration = vector_1.default.Zero;
        this.wallContact = new wall_contact_map_1.default();
    };
    HPActor.prototype.move = function (moveForce, faceMoveDirection) {
        if (faceMoveDirection === void 0) { faceMoveDirection = true; }
        this.moveForce = moveForce;
        if (faceMoveDirection && moveForce.x !== 0) {
            this.facingDirection = moveForce.x < 0 ? direction_1.default.Left : direction_1.default.Right;
        }
    };
    HPActor.prototype.push = function (force) {
        this.acceleration = this.acceleration.plus(force.times(1 / this.weight));
    };
    HPActor.prototype.damage = function (amount) {
        this.health = Math.max(0, this.health - amount);
        this.healthBar.percent = this.healthPercent;
    };
    HPActor.prototype.heal = function (amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.healthBar.percent = this.healthPercent;
    };
    HPActor.prototype.kill = function () {
        this.isDead = true;
    };
    Object.defineProperty(HPActor.prototype, "isFacingLeft", {
        get: function () { return this.facingDirection === direction_1.default.Left; },
        enumerable: true,
        configurable: true
    });
    HPActor.prototype.initHealthBar = function () {
        if (!this.hasHealth || this.hideHealthBar)
            return;
        this.healthBar.position = new vector_1.default(0, this.size.y * -2 / 3);
        this.sprite.addChild(this.healthBar.sprite);
    };
    Object.defineProperty(HPActor.prototype, "healthPercent", {
        get: function () {
            return this.health / this.maxHealth;
        },
        enumerable: true,
        configurable: true
    });
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
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var stage_1 = __webpack_require__(/*! ./stage */ "./src/engine/core/stage.ts");
var area_service_1 = __webpack_require__(/*! ../services/area-service */ "./src/engine/services/area-service.ts");
var ui_stage_1 = __webpack_require__(/*! ../ui/ui-stage */ "./src/engine/ui/ui-stage.ts");
var mouse_tracker_1 = __webpack_require__(/*! ../interaction/mouse-tracker */ "./src/engine/interaction/mouse-tracker.ts");
var DEFAULTS = {
    viewSize: new vector_1.default(850, 550),
    textures: [],
    uiElements: [],
    heroStart: vector_1.default.Zero,
    gravityForce: new vector_1.default(0, .667),
    airFrictionCoefficient: 0.033,
};
var HPApp = /** @class */ (function () {
    function HPApp(_options) {
        var options = Object.assign({}, DEFAULTS, _options);
        this.actorFactory = options.actorFactory;
        this.textures = options.textures;
        this.areaFile = options.areaFile;
        this.hero = options.hero;
        this.heroStart = options.heroStart;
        // Disable interpolation when scaling, will make texture be pixelated
        pixi_js_1.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.app = new pixi_js_1.Application({
            width: options.viewSize.x,
            height: options.viewSize.y,
            transparent: false,
            backgroundColor: 0xFFFFFF,
            antialias: false,
            resolution: 3,
        });
        this.element = document.body.querySelector(options.elementSelector) ||
            (function () { throw new Error("Can't find element with selector: " + options.elementSelector); })();
        var gameContainer = new pixi_js_1.Container();
        this.app.stage.addChild(gameContainer);
        this.stage = new stage_1.default(options.viewSize, gameContainer, this.hero, options.gravityForce, options.airFrictionCoefficient);
        mouse_tracker_1.HPMouseTracker.setContainer(gameContainer);
        var uiContainer = new pixi_js_1.Sprite(pixi_js_1.RenderTexture.create(options.viewSize.x, options.viewSize.y));
        this.app.stage.addChild(uiContainer);
        new ui_stage_1.default(uiContainer, options.viewSize, options.uiElements);
        this.addPIXICanvasToScreen();
    }
    HPApp.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadTextures()];
                    case 1:
                        _b.sent();
                        _a = this.setAreaData;
                        return [4 /*yield*/, this.loadAreaData()];
                    case 2:
                        _a.apply(this, [_b.sent()]);
                        this.addHero();
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
    HPApp.prototype.loadTextures = function () {
        var _this = this;
        return new Promise(function (resolve) { return pixi_js_1.loader.add(_this.textures).load(resolve); });
    };
    HPApp.prototype.loadAreaData = function () {
        return area_service_1.default.getAreaData(this.areaFile);
    };
    HPApp.prototype.setAreaData = function (areaData) {
        var _this = this;
        this.stage.size = vector_1.default.from(areaData.size);
        this.stage.clearActors();
        areaData.actors.forEach(function (data) {
            var actor = _this.actorFactory[data.id](data);
            if (actor === undefined)
                throw new Error("Actor factory failed to return actor for data: " + JSON.stringify(data));
            _this.stage.addActor(actor);
        });
    };
    HPApp.prototype.addHero = function () {
        this.hero.position = this.heroStart;
        this.stage.addActor(this.hero);
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

/***/ "./src/engine/core/health-bar.ts":
/*!***************************************!*\
  !*** ./src/engine/core/health-bar.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var SIZE = new vector_1.default(36, 6);
var HPHealthBar = /** @class */ (function () {
    function HPHealthBar() {
        this.sprite = new pixi_js_1.Graphics();
        this.paint();
    }
    Object.defineProperty(HPHealthBar.prototype, "position", {
        set: function (position) {
            this.sprite.x = position.x;
            this.sprite.y = position.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPHealthBar.prototype, "percent", {
        set: function (percent) {
            this.paint(percent);
        },
        enumerable: true,
        configurable: true
    });
    HPHealthBar.prototype.paint = function (percent) {
        if (percent === void 0) { percent = 1; }
        this.sprite.clear();
        this.sprite.beginFill(0xFF0000);
        this.sprite.drawRect(SIZE.x / -2, SIZE.y / -2, SIZE.x, SIZE.y);
        this.sprite.endFill();
        this.sprite.beginFill(0x00FF00);
        this.sprite.drawRect(SIZE.x / -2, SIZE.y / -2, SIZE.x * percent, SIZE.y);
        this.sprite.endFill();
        this.sprite.lineStyle(1, 0x000000);
        this.sprite.drawRect(SIZE.x / -2, SIZE.y / -2, SIZE.x, SIZE.y);
        this.sprite.endFill();
    };
    return HPHealthBar;
}());
exports.default = HPHealthBar;


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
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var HPStage = /** @class */ (function () {
    function HPStage(viewSize, rootContainer, actorToFollow, gravityForce, airFrictionCoefficient) {
        this.viewSize = viewSize;
        this.rootContainer = rootContainer;
        this.actorToFollow = actorToFollow;
        this.gravityForce = gravityForce;
        this.airFrictionCoefficient = airFrictionCoefficient;
        this.size = vector_1.default.Zero;
        this.actors = [];
    }
    HPStage.prototype.addActor = function (actor) {
        this.actors.push(actor);
        actor.init();
        this.rootContainer.addChild(actor.sprite);
    };
    HPStage.prototype.removeActorAt = function (i) {
        this.rootContainer.removeChild(this.actors[i].sprite);
        this.actors[i].destroy();
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
        this.followActor();
        this.actors.forEach(function (actor) {
            _this.killIfSquished(actor);
            _this.killIfZeroHealth(actor);
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
    HPStage.prototype.killIfZeroHealth = function (actor) {
        if (actor.hasHealth && actor.health <= 0)
            actor.kill();
    };
    HPStage.prototype.applyGravity = function (actor) {
        actor.push(this.gravityForce.times(actor.gravityBoundCoefficient));
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
    HPStage.prototype.followActor = function () {
        var stageX = this.viewSize.x / 2 - this.actorToFollow.position.x;
        stageX = Math.min(stageX, 0);
        stageX = Math.max(stageX, this.viewSize.x - this.size.x);
        var stageY = this.viewSize.y / 2 - this.actorToFollow.position.y;
        stageY = Math.min(stageY, 0);
        stageY = Math.max(stageY, this.viewSize.y - this.size.y);
        this.rootContainer.x = stageX;
        this.rootContainer.y = stageY;
    };
    return HPStage;
}());
exports.default = HPStage;


/***/ }),

/***/ "./src/engine/interaction/key-listener.ts":
/*!************************************************!*\
  !*** ./src/engine/interaction/key-listener.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HPKeyListener = /** @class */ (function () {
    function HPKeyListener(keyCode, onPress, onRelease) {
        this._isDown = false;
        this._code = keyCode;
        this._onPress = onPress;
        this._onRelease = onRelease;
        this._downHandler = this._downHandler.bind(this);
        this._upHandler = this._upHandler.bind(this);
        window.addEventListener('keydown', this._downHandler, false);
        window.addEventListener('keyup', this._upHandler, false);
    }
    HPKeyListener.prototype.destroy = function () {
        window.removeEventListener('keydown', this._downHandler);
        window.removeEventListener('keyup', this._upHandler);
    };
    HPKeyListener.prototype._downHandler = function (e) {
        if (e.keyCode === this._code) {
            if (!this._isDown && this._onPress)
                this._onPress();
            this._isDown = true;
        }
    };
    HPKeyListener.prototype._upHandler = function (e) {
        if (e.keyCode === this._code) {
            if (this._isDown && this._onRelease)
                this._onRelease();
            this._isDown = false;
        }
    };
    return HPKeyListener;
}());
exports.default = HPKeyListener;


/***/ }),

/***/ "./src/engine/interaction/mouse-tracker.ts":
/*!*************************************************!*\
  !*** ./src/engine/interaction/mouse-tracker.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
var _HPMouseTracker = /** @class */ (function () {
    function _HPMouseTracker() {
        this.container = new pixi_js_1.Container();
        this._position = vector_1.default.Zero;
    }
    Object.defineProperty(_HPMouseTracker.prototype, "position", {
        get: function () { return this._position; },
        enumerable: true,
        configurable: true
    });
    _HPMouseTracker.prototype.setContainer = function (container) {
        container.interactive = true;
        container.on('pointermove', this.onMouseMove.bind(this));
        this.container = container;
    };
    _HPMouseTracker.prototype.onMouseMove = function (event) {
        var point = event.data.getLocalPosition(this.container);
        this._position = new vector_1.default(point.x, point.y);
    };
    return _HPMouseTracker;
}());
exports.HPMouseTracker = new _HPMouseTracker();


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
        if (!collision.hit)
            return;
        HPCollisionHandler.handleWallCollision(targetEntity, otherEntity, collision);
    };
    HPCollisionHandler.handleWallCollision = function (targetEntity, otherEntity, collision) {
        if (!targetEntity.isWallBound || !otherEntity.isWall)
            return;
        HPCollisionHandler.recedeFromWall(targetEntity, otherEntity, collision);
        HPCollisionHandler.bounceOffWall(targetEntity, otherEntity, collision);
        HPCollisionHandler.applyFloorFriction(targetEntity, otherEntity, collision);
        targetEntity.wallContact.setContact(collision.direction * -1);
    };
    HPCollisionHandler.recedeFromWall = function (entity, wall, collision) {
        var combinedHalfSize = entity.size.times(0.5).plus(wall.size.times(0.5));
        if (collision.direction === direction_1.default.Down) {
            entity.position = entity.position.newY(wall.position.y + combinedHalfSize.y);
        }
        else if (collision.direction === direction_1.default.Left) {
            entity.position = entity.position.newX(wall.position.x - combinedHalfSize.x);
        }
        else if (collision.direction === direction_1.default.Up) {
            entity.position = entity.position.newY(wall.position.y - combinedHalfSize.y);
        }
        else if (collision.direction === direction_1.default.Right) {
            entity.position = entity.position.newX(wall.position.x + combinedHalfSize.x);
        }
    };
    HPCollisionHandler.bounceOffWall = function (entity, wall, collision) {
        var combinedBounciness = (wall.bounciness + entity.bounciness) / 2;
        if (collision.direction === direction_1.default.Up) {
            entity.velocity = entity.velocity.newY(Math.min(wall.velocity.y, entity.velocity.y * -combinedBounciness));
        }
        else if (collision.direction === direction_1.default.Right) {
            entity.velocity = entity.velocity.newX(Math.max(wall.velocity.x, entity.velocity.x * -combinedBounciness));
        }
        else if (collision.direction === direction_1.default.Down) {
            entity.velocity = entity.velocity.newY(Math.max(wall.velocity.y, entity.velocity.y * -combinedBounciness));
        }
        else if (collision.direction === direction_1.default.Left) {
            entity.velocity = entity.velocity.newX(Math.min(wall.velocity.x, entity.velocity.x * -combinedBounciness));
        }
    };
    HPCollisionHandler.applyFloorFriction = function (entity, wall, collision) {
        if (collision.direction !== direction_1.default.Up)
            return;
        var velocityDiff = wall.velocity.minus(entity.velocity);
        entity.push(new vector_1.default(velocityDiff.x * (1 - wall.slipperiness), 0));
        // stick to floor when going down elevators
        if (wall.velocity.y > 0)
            entity.velocity = entity.velocity.newY(wall.velocity.y);
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
        this.direction = _direction !== undefined ? _direction : direction_1.default.Down;
    }
    HPCollision.prototype.withOppositeDirection = function () {
        return new HPCollision(this.hit ? this.direction * -1 : undefined);
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
    function HPVector(_x, _y) {
        this._x = _x;
        // if only one arg is provided, use that value for both x and y
        this._y = _y !== undefined ? _y : _x;
    }
    Object.defineProperty(HPVector, "Zero", {
        get: function () { return new HPVector(0); },
        enumerable: true,
        configurable: true
    });
    HPVector.from = function (data) {
        return new HPVector(data.x, data.y);
    };
    Object.defineProperty(HPVector.prototype, "x", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPVector.prototype, "y", {
        get: function () { return this._y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPVector.prototype, "length", {
        get: function () {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPVector.prototype, "angle", {
        get: function () {
            return Math.atan2(this.y, this.x);
        },
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
        return typeof scaleVector === 'number'
            ? new HPVector(this.x * scaleVector, this.y * scaleVector)
            : new HPVector(this.x * scaleVector.x, this.y * scaleVector.y);
    };
    HPVector.prototype.dot = function (scaleVector) {
        return this.x * scaleVector.x + this.y * scaleVector.y;
    };
    HPVector.prototype.limit = function (limitVector) {
        if (typeof limitVector === 'number') {
            limitVector = new HPVector(limitVector);
        }
        var newX = this.x > 0 ? Math.min(this.x, limitVector.x) : Math.max(this.x, -limitVector.x);
        var newY = this.y > 0 ? Math.min(this.y, limitVector.y) : Math.max(this.y, -limitVector.y);
        return new HPVector(newX, newY);
    };
    HPVector.prototype.newX = function (newX) {
        return new HPVector(newX, this.y);
    };
    HPVector.prototype.newY = function (newY) {
        return new HPVector(this.x, newY);
    };
    HPVector.prototype.toUnit = function () {
        return new HPVector(this.x / this.length, this.y / this.length);
    };
    HPVector.prototype.flipHorz = function (isFlipped) {
        if (isFlipped === void 0) { isFlipped = true; }
        return this.times(new HPVector(isFlipped ? -1 : 1, 1));
    };
    HPVector.prototype.flipVert = function (isFlipped) {
        if (isFlipped === void 0) { isFlipped = true; }
        return this.times(new HPVector(1, isFlipped ? -1 : 1));
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

/***/ "./src/engine/ui/elements/ui-graphic-element.ts":
/*!******************************************************!*\
  !*** ./src/engine/ui/elements/ui-graphic-element.ts ***!
  \******************************************************/
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
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
var ui_element_1 = __webpack_require__(/*! ../ui-element */ "./src/engine/ui/ui-element.ts");
var HPUIGraphicElement = /** @class */ (function (_super) {
    __extends(HPUIGraphicElement, _super);
    function HPUIGraphicElement(_options) {
        var _this = this;
        var options = Object.assign({ sprite: new pixi_js_1.Graphics() }, _options);
        _this = _super.call(this, options) || this;
        return _this;
    }
    Object.defineProperty(HPUIGraphicElement.prototype, "sprite", {
        get: function () { return this._sprite; },
        enumerable: true,
        configurable: true
    });
    return HPUIGraphicElement;
}(ui_element_1.default));
exports.default = HPUIGraphicElement;


/***/ }),

/***/ "./src/engine/ui/ui-element.ts":
/*!*************************************!*\
  !*** ./src/engine/ui/ui-element.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
var HPUIElementAlignment;
(function (HPUIElementAlignment) {
    HPUIElementAlignment[HPUIElementAlignment["TopLeft"] = 0] = "TopLeft";
    HPUIElementAlignment[HPUIElementAlignment["TopRight"] = 1] = "TopRight";
    HPUIElementAlignment[HPUIElementAlignment["BottomLeft"] = 2] = "BottomLeft";
    HPUIElementAlignment[HPUIElementAlignment["BottomRight"] = 3] = "BottomRight";
})(HPUIElementAlignment = exports.HPUIElementAlignment || (exports.HPUIElementAlignment = {}));
var HPUIElementLayoutDirection;
(function (HPUIElementLayoutDirection) {
    HPUIElementLayoutDirection[HPUIElementLayoutDirection["Horz"] = 0] = "Horz";
    HPUIElementLayoutDirection[HPUIElementLayoutDirection["Vert"] = 1] = "Vert";
})(HPUIElementLayoutDirection = exports.HPUIElementLayoutDirection || (exports.HPUIElementLayoutDirection = {}));
var HPUIElementPosition;
(function (HPUIElementPosition) {
    HPUIElementPosition[HPUIElementPosition["Static"] = 0] = "Static";
    HPUIElementPosition[HPUIElementPosition["Absolute"] = 1] = "Absolute";
})(HPUIElementPosition = exports.HPUIElementPosition || (exports.HPUIElementPosition = {}));
var DEFAULTS = {
    position: HPUIElementPosition.Static,
    alignment: HPUIElementAlignment.TopLeft,
    layoutDirection: HPUIElementLayoutDirection.Horz,
    margin: vector_1.default.Zero,
    children: [],
};
var HPUIElement = /** @class */ (function () {
    function HPUIElement(_options) {
        this._size = vector_1.default.Zero;
        var options = Object.assign({}, DEFAULTS, _options);
        this.position = options.position;
        this.alignment = options.alignment;
        this.layoutDirection = options.layoutDirection;
        this.margin = options.margin;
        this.children = options.children;
        this._sprite = options.sprite || new pixi_js_1.Container();
    }
    Object.defineProperty(HPUIElement.prototype, "size", {
        get: function () { return this._size.plus(this.margin.times(2)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HPUIElement.prototype, "sprite", {
        get: function () { return this._sprite; },
        enumerable: true,
        configurable: true
    });
    /** @override */
    HPUIElement.prototype.paint = function () { };
    HPUIElement.prototype.destroy = function () { };
    HPUIElement.prototype.init = function (position, parentSize) {
        this.addChildren();
        this.positionSelf(position, parentSize);
        this.paint();
    };
    HPUIElement.prototype.addChildren = function () {
        var _this = this;
        if (!this.children.length)
            return;
        var childOffset = this.margin;
        this.children.forEach(function (child) {
            child.alignment = _this.alignment;
            child.init(childOffset, _this._size);
            _this.sprite.addChild(child.sprite);
            if (_this.layoutDirection === HPUIElementLayoutDirection.Horz) {
                _this._size = _this._size.newX(_this._size.x + child.size.x);
                _this._size = _this._size.newY(Math.max(_this._size.y, child.size.y));
                childOffset = childOffset.newX(childOffset.x + child.size.x);
            }
            else {
                _this._size = _this._size.newX(Math.max(_this._size.x, child.size.x));
                _this._size = _this._size.newY(_this._size.y + child.size.y);
                childOffset = childOffset.newY(childOffset.y + child.size.y);
            }
        });
    };
    HPUIElement.prototype.positionSelf = function (position, parentSize) {
        var spritePosition = position.plus(this.getAlignmentOffset(parentSize));
        this.sprite.x = spritePosition.x;
        this.sprite.y = spritePosition.y;
    };
    HPUIElement.prototype.getAlignmentOffset = function (parentSize) {
        if (this.position !== HPUIElementPosition.Absolute)
            return vector_1.default.Zero;
        if (this.alignment === HPUIElementAlignment.TopRight) {
            return new vector_1.default(parentSize.x - this.size.x, 0);
        }
        else if (this.alignment === HPUIElementAlignment.BottomLeft) {
            return new vector_1.default(0, parentSize.y - this.size.y);
        }
        else if (this.alignment === HPUIElementAlignment.BottomRight) {
            return new vector_1.default(parentSize.x - this.size.x, parentSize.y - this.size.y);
        }
        return vector_1.default.Zero;
    };
    return HPUIElement;
}());
exports.default = HPUIElement;


/***/ }),

/***/ "./src/engine/ui/ui-stage.ts":
/*!***********************************!*\
  !*** ./src/engine/ui/ui-stage.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ui_element_1 = __webpack_require__(/*! ./ui-element */ "./src/engine/ui/ui-element.ts");
var vector_1 = __webpack_require__(/*! ../physics/vector */ "./src/engine/physics/vector.ts");
var HPUIStage = /** @class */ (function () {
    function HPUIStage(rootContainer, size, elements) {
        var _this = this;
        this.rootContainer = rootContainer;
        this.size = size;
        this.elements = elements;
        ([ui_element_1.HPUIElementAlignment.TopLeft, ui_element_1.HPUIElementAlignment.TopRight]);
        elements.forEach(function (element) { return _this.addElement(element); });
    }
    HPUIStage.prototype.addElement = function (element) {
        this.elements.push(element);
        element.init(vector_1.default.Zero, this.size);
        this.rootContainer.addChild(element.sprite);
    };
    HPUIStage.prototype.removeElementAt = function (i) {
        this.rootContainer.removeChild(this.elements[i].sprite);
        this.elements[i].destroy();
        this.elements.splice(i, 1);
    };
    HPUIStage.prototype.clearElements = function () {
        while (this.elements[0])
            this.removeElementAt(0);
    };
    return HPUIStage;
}());
exports.default = HPUIStage;


/***/ }),

/***/ "./src/engine/util/destroyable.ts":
/*!****************************************!*\
  !*** ./src/engine/util/destroyable.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HPDestroyer = /** @class */ (function () {
    function HPDestroyer() {
        this.destroyables = [];
    }
    HPDestroyer.prototype.add = function (destroyable) {
        this.destroyables.push(destroyable);
    };
    HPDestroyer.prototype.destroy = function () {
        this.destroyables.forEach(function (destroyable) { return destroyable.destroy(); });
    };
    return HPDestroyer;
}());
exports.default = HPDestroyer;


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

/***/ "./src/engine/util/random.ts":
/*!***********************************!*\
  !*** ./src/engine/util/random.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HPRandom = /** @class */ (function () {
    function HPRandom() {
    }
    HPRandom.int = function (arg1, arg2) {
        // handle 1 arg case (0 to arg1)
        if (arg2 === undefined) {
            return Math.floor(Math.random() * (arg1 + 1));
        }
        // handle 2 arg case (arg1 to arg2)
        return Math.floor(Math.random() * (arg2 + 1 - arg1)) + arg1;
    };
    HPRandom.chance = function (hitPercent) {
        return Math.random() < hitPercent;
    };
    return HPRandom;
}());
exports.default = HPRandom;


/***/ }),

/***/ "./src/engine/util/set-ticks-out.ts":
/*!******************************************!*\
  !*** ./src/engine/util/set-ticks-out.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
exports.setTicksOut = function (callback, numTicks) {
    var ticks = 0;
    var onTick = function () {
        ticks++;
        if (ticks >= numTicks) {
            pixi_js_1.ticker.shared.remove(onTick);
            callback();
        }
    };
    pixi_js_1.ticker.shared.add(onTick);
    return onTick;
};
exports.clearTicksOut = function (onTick) {
    pixi_js_1.ticker.shared.remove(onTick);
};
exports.setTicksInterval = function (callback, numTicks) {
    var ticks = 0;
    var onTick = function () {
        ticks++;
        if (ticks >= numTicks) {
            ticks = 0;
            callback();
        }
    };
    pixi_js_1.ticker.shared.add(onTick);
    return onTick;
};
exports.clearTicksInterval = exports.clearTicksOut;


/***/ }),

/***/ "./src/engine/util/texture-helper.ts":
/*!*******************************************!*\
  !*** ./src/engine/util/texture-helper.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
var HPTextureHelper = /** @class */ (function () {
    function HPTextureHelper() {
    }
    HPTextureHelper.get = function (sheetName, spriteName) {
        var sheet = pixi_js_1.loader.resources[sheetName];
        if (!sheet || !sheet.textures)
            throw "Error fetching texture: " + sheetName + " -> " + spriteName;
        return sheet.textures[spriteName];
    };
    return HPTextureHelper;
}());
exports.default = HPTextureHelper;


/***/ }),

/***/ "./src/game/actor-factory.ts":
/*!***********************************!*\
  !*** ./src/game/actor-factory.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var wall_1 = __webpack_require__(/*! ./actors/walls/wall */ "./src/game/actors/walls/wall.ts");
var vector_1 = __webpack_require__(/*! ../engine/physics/vector */ "./src/engine/physics/vector.ts");
var wandering_target_1 = __webpack_require__(/*! ./actors/enemies/wandering-target */ "./src/game/actors/enemies/wandering-target.ts");
var TGActorFactory = (_a = {},
    _a[wall_1.default.id] = function (data) {
        return new wall_1.default(vector_1.default.from(data.position), vector_1.default.from(data.props['size']));
    },
    _a[wandering_target_1.default.id] = function (data) {
        return new wandering_target_1.default(vector_1.default.from(data.position));
    },
    _a);
exports.default = TGActorFactory;


/***/ }),

/***/ "./src/game/actors/enemies/wandering-target.ts":
/*!*****************************************************!*\
  !*** ./src/game/actors/enemies/wandering-target.ts ***!
  \*****************************************************/
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
var vector_1 = __webpack_require__(/*! ../../../engine/physics/vector */ "./src/engine/physics/vector.ts");
var set_ticks_out_1 = __webpack_require__(/*! ../../../engine/util/set-ticks-out */ "./src/engine/util/set-ticks-out.ts");
var actor_type_1 = __webpack_require__(/*! ../../../engine/core/actor-type */ "./src/engine/core/actor-type.ts");
var random_1 = __webpack_require__(/*! ../../../engine/util/random */ "./src/engine/util/random.ts");
var static_shape_actor_1 = __webpack_require__(/*! ../../../engine/actors/static-shape-actor */ "./src/engine/actors/static-shape-actor.ts");
var WANDER_FORCE = new vector_1.default(1, 0);
var JUMP_FORCE = new vector_1.default(0, -12);
var TGWanderingTarget = /** @class */ (function (_super) {
    __extends(TGWanderingTarget, _super);
    function TGWanderingTarget(position) {
        return _super.call(this, position) || this;
    }
    Object.defineProperty(TGWanderingTarget, "id", {
        get: function () { return 'WanderingTarget'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWanderingTarget.prototype, "size", {
        get: function () { return new vector_1.default(20, 50); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWanderingTarget.prototype, "type", {
        get: function () { return actor_type_1.default.Unfriendly; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWanderingTarget.prototype, "hasHealth", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWanderingTarget.prototype, "maxHealth", {
        get: function () { return 20; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWanderingTarget.prototype, "color", {
        get: function () { return 0xFF0000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWanderingTarget.prototype, "borderWidth", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWanderingTarget.prototype, "borderColor", {
        get: function () { return 0x000000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWanderingTarget.prototype, "cornerRadius", {
        get: function () { return 2; },
        enumerable: true,
        configurable: true
    });
    TGWanderingTarget.prototype.init = function () {
        _super.prototype.init.call(this);
        this.move(WANDER_FORCE.flipHorz(random_1.default.chance(0.5)));
        this.changeDirection();
    };
    TGWanderingTarget.prototype.onTick = function () {
        _super.prototype.onTick.call(this);
        if (this.isOnGround && random_1.default.chance(0.005))
            this.push(JUMP_FORCE);
    };
    TGWanderingTarget.prototype.changeDirection = function () {
        var _this = this;
        this.move(this.moveForce.flipHorz());
        set_ticks_out_1.setTicksOut(function () { return _this.changeDirection(); }, random_1.default.int(80, 160));
    };
    return TGWanderingTarget;
}(static_shape_actor_1.default));
exports.default = TGWanderingTarget;


/***/ }),

/***/ "./src/game/actors/hero/animations/run.ts":
/*!************************************************!*\
  !*** ./src/game/actors/hero/animations/run.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var run_1_1 = __webpack_require__(/*! ../frames/run-1 */ "./src/game/actors/hero/frames/run-1.ts");
var resting_1 = __webpack_require__(/*! ../frames/resting */ "./src/game/actors/hero/frames/resting.ts");
var run_2_1 = __webpack_require__(/*! ../frames/run-2 */ "./src/game/actors/hero/frames/run-2.ts");
var RUN_ANIMATION = {
    frames: [
        run_1_1.default,
        resting_1.default,
        run_2_1.default,
        resting_1.default,
    ],
    speed: 0.1,
};
exports.default = RUN_ANIMATION;


/***/ }),

/***/ "./src/game/actors/hero/bones.ts":
/*!***************************************!*\
  !*** ./src/game/actors/hero/bones.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(/*! ./constants */ "./src/game/actors/hero/constants.ts");
var vector_1 = __webpack_require__(/*! ../../../engine/physics/vector */ "./src/engine/physics/vector.ts");
var BONES = [
    {
        id: constants_1.BACK_UPPER_ARM_ID,
        anchor: constants_1.LIMB_ANCHOR,
        position: constants_1.BACK_ARM_POSITION,
        children: [
            {
                id: constants_1.BACK_LOWER_ARM_ID,
                anchor: constants_1.LIMB_ANCHOR,
                position: constants_1.LOWER_LIMB_POSITION,
            },
        ]
    },
    {
        id: constants_1.BACK_UPPER_LEG_ID,
        anchor: constants_1.LIMB_ANCHOR,
        position: constants_1.BACK_LEG_POSITION,
        children: [
            {
                id: constants_1.BACK_LOWER_LEG_ID,
                anchor: constants_1.LIMB_ANCHOR,
                position: constants_1.LOWER_LIMB_POSITION,
            },
        ]
    },
    {
        id: constants_1.CHEST_ID,
        anchor: constants_1.CHEST_ANCHOR,
        position: constants_1.CHEST_POSITION,
    },
    {
        id: constants_1.HEAD_ID,
        anchor: constants_1.HEAD_ANCHOR,
        position: constants_1.HEAD_POSITION,
    },
    {
        id: constants_1.FRONT_UPPER_LEG_ID,
        anchor: constants_1.LIMB_ANCHOR,
        position: constants_1.FRONT_LEG_POSITION,
        children: [
            {
                id: constants_1.FRONT_LOWER_LEG_ID,
                anchor: constants_1.LIMB_ANCHOR,
                position: constants_1.LOWER_LIMB_POSITION,
            },
        ]
    },
    {
        id: constants_1.FRONT_UPPER_ARM_ID,
        anchor: constants_1.LIMB_ANCHOR,
        position: constants_1.FRONT_ARM_POSITION,
        children: [
            {
                id: constants_1.FRONT_LOWER_ARM_ID,
                anchor: constants_1.LIMB_ANCHOR,
                position: constants_1.LOWER_LIMB_POSITION,
                children: [
                    {
                        id: constants_1.WEAPON_ID,
                        position: constants_1.WEAPON_POSITION,
                    },
                    {
                        id: constants_1.FRONT_LOWER_ARM_CLONE_ID,
                        anchor: constants_1.LIMB_ANCHOR,
                        position: vector_1.default.Zero,
                    },
                ],
            },
        ]
    },
];
exports.default = BONES;


/***/ }),

/***/ "./src/game/actors/hero/classes/rouge/rouge.ts":
/*!*****************************************************!*\
  !*** ./src/game/actors/hero/classes/rouge/rouge.ts ***!
  \*****************************************************/
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
var hero_1 = __webpack_require__(/*! ../../hero */ "./src/game/actors/hero/hero.ts");
var weapon_1 = __webpack_require__(/*! ../../weapon */ "./src/game/actors/hero/weapon.ts");
var constants_1 = __webpack_require__(/*! ../../constants */ "./src/game/actors/hero/constants.ts");
var TGRouge = /** @class */ (function (_super) {
    __extends(TGRouge, _super);
    function TGRouge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.abilities = [
            function () { return console.log('shoot crossbow'); },
            function () { return console.log('backstab'); },
            function () { return console.log('evasion'); },
            function () { return console.log('idk...'); },
            function () { return console.log('idk...'); },
        ];
        return _this;
    }
    Object.defineProperty(TGRouge, "id", {
        get: function () { return 'Rouge'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGRouge.prototype, "weapon", {
        get: function () { return new weapon_1.default(weapon_1.TGWeaponType.Crossbow); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGRouge.prototype, "jumpForce", {
        get: function () { return constants_1.JUMP_FORCE.times(1.1); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGRouge.prototype, "runForce", {
        get: function () { return constants_1.RUN_FORCE.times(1.2); },
        enumerable: true,
        configurable: true
    });
    TGRouge.prototype.performAbility = function (abilityNum) {
        this.abilities[abilityNum]();
    };
    return TGRouge;
}(hero_1.default));
exports.default = TGRouge;


/***/ }),

/***/ "./src/game/actors/hero/classes/warrior/warrior.ts":
/*!*********************************************************!*\
  !*** ./src/game/actors/hero/classes/warrior/warrior.ts ***!
  \*********************************************************/
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
var hero_1 = __webpack_require__(/*! ../../hero */ "./src/game/actors/hero/hero.ts");
var weapon_1 = __webpack_require__(/*! ../../weapon */ "./src/game/actors/hero/weapon.ts");
var constants_1 = __webpack_require__(/*! ../../constants */ "./src/game/actors/hero/constants.ts");
var TGWarrior = /** @class */ (function (_super) {
    __extends(TGWarrior, _super);
    function TGWarrior() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.abilities = [
            function () { return console.log('slash'); },
            function () { return console.log('whirlwind'); },
            function () { return console.log('jump'); },
            function () { return console.log('shields up'); },
            function () { return console.log('idk...'); },
        ];
        return _this;
    }
    Object.defineProperty(TGWarrior, "id", {
        get: function () { return 'Warrior'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWarrior.prototype, "weapon", {
        get: function () { return new weapon_1.default(weapon_1.TGWeaponType.Sword); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWarrior.prototype, "jumpForce", {
        get: function () { return constants_1.JUMP_FORCE.times(1.0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWarrior.prototype, "runForce", {
        get: function () { return constants_1.RUN_FORCE.times(1.1); },
        enumerable: true,
        configurable: true
    });
    TGWarrior.prototype.performAbility = function (abilityNum) {
        this.abilities[abilityNum]();
    };
    return TGWarrior;
}(hero_1.default));
exports.default = TGWarrior;


/***/ }),

/***/ "./src/game/actors/hero/classes/wizard/animations/channeling-missiles.ts":
/*!*******************************************************************************!*\
  !*** ./src/game/actors/hero/classes/wizard/animations/channeling-missiles.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var channeling_missiles_1_1 = __webpack_require__(/*! ../frames/channeling-missiles-1 */ "./src/game/actors/hero/classes/wizard/frames/channeling-missiles-1.ts");
var channeling_missiles_2_1 = __webpack_require__(/*! ../frames/channeling-missiles-2 */ "./src/game/actors/hero/classes/wizard/frames/channeling-missiles-2.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./src/game/actors/hero/classes/wizard/constants.ts");
var CHANNELING_MISSILES_ANIMATION = {
    frames: [
        channeling_missiles_1_1.default,
        channeling_missiles_2_1.default,
    ],
    speed: 2 / constants_1.ARCANE_MISSILE_SHOOT_INTERVAL,
};
exports.default = CHANNELING_MISSILES_ANIMATION;


/***/ }),

/***/ "./src/game/actors/hero/classes/wizard/constants.ts":
/*!**********************************************************!*\
  !*** ./src/game/actors/hero/classes/wizard/constants.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FIRE_BALL_SHOOT_FORCE = 16;
exports.ARCANE_MISSILE_SHOOT_FORCE = 16;
exports.ARCANE_MISSILE_SHOOT_INTERVAL = 32;


/***/ }),

/***/ "./src/game/actors/hero/classes/wizard/frames/channeling-missiles-1.ts":
/*!*****************************************************************************!*\
  !*** ./src/game/actors/hero/classes/wizard/frames/channeling-missiles-1.ts ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var constants_1 = __webpack_require__(/*! ../../../constants */ "./src/game/actors/hero/constants.ts");
var CHANNELING_MISSILES_1 = {
    pivots: (_a = {},
        _a[constants_1.FRONT_UPPER_ARM_ID] = Math.PI / -6,
        _a[constants_1.FRONT_LOWER_ARM_ID] = Math.PI * -2 / 3,
        _a[constants_1.BACK_UPPER_ARM_ID] = Math.PI / -3,
        _a[constants_1.BACK_LOWER_ARM_ID] = Math.PI / -3,
        _a[constants_1.FRONT_UPPER_LEG_ID] = Math.PI / 6,
        _a[constants_1.FRONT_LOWER_LEG_ID] = Math.PI / -6,
        _a[constants_1.BACK_UPPER_LEG_ID] = Math.PI / -6,
        _a[constants_1.BACK_LOWER_LEG_ID] = Math.PI / 6,
        _a),
};
exports.default = CHANNELING_MISSILES_1;


/***/ }),

/***/ "./src/game/actors/hero/classes/wizard/frames/channeling-missiles-2.ts":
/*!*****************************************************************************!*\
  !*** ./src/game/actors/hero/classes/wizard/frames/channeling-missiles-2.ts ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var constants_1 = __webpack_require__(/*! ../../../constants */ "./src/game/actors/hero/constants.ts");
var CHANNELING_MISSILES_2 = {
    pivots: (_a = {},
        _a[constants_1.FRONT_UPPER_ARM_ID] = Math.PI / -3,
        _a[constants_1.FRONT_LOWER_ARM_ID] = Math.PI / -3,
        _a[constants_1.BACK_UPPER_ARM_ID] = Math.PI / -6,
        _a[constants_1.BACK_LOWER_ARM_ID] = Math.PI * -2 / 3,
        _a[constants_1.FRONT_UPPER_LEG_ID] = Math.PI / 6,
        _a[constants_1.FRONT_LOWER_LEG_ID] = Math.PI / -6,
        _a[constants_1.BACK_UPPER_LEG_ID] = Math.PI / -6,
        _a[constants_1.BACK_LOWER_LEG_ID] = Math.PI / 6,
        _a),
};
exports.default = CHANNELING_MISSILES_2;


/***/ }),

/***/ "./src/game/actors/hero/classes/wizard/projectiles/arcane-missile.ts":
/*!***************************************************************************!*\
  !*** ./src/game/actors/hero/classes/wizard/projectiles/arcane-missile.ts ***!
  \***************************************************************************/
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
var static_shape_actor_1 = __webpack_require__(/*! ../../../../../../engine/actors/static-shape-actor */ "./src/engine/actors/static-shape-actor.ts");
var vector_1 = __webpack_require__(/*! ../../../../../../engine/physics/vector */ "./src/engine/physics/vector.ts");
var set_ticks_out_1 = __webpack_require__(/*! ../../../../../../engine/util/set-ticks-out */ "./src/engine/util/set-ticks-out.ts");
var actor_type_1 = __webpack_require__(/*! ../../../../../../engine/core/actor-type */ "./src/engine/core/actor-type.ts");
var LIFETIME = 20;
var TGArcaneMissile = /** @class */ (function (_super) {
    __extends(TGArcaneMissile, _super);
    function TGArcaneMissile(position) {
        return _super.call(this, position) || this;
    }
    Object.defineProperty(TGArcaneMissile.prototype, "size", {
        get: function () { return new vector_1.default(12, 12); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGArcaneMissile.prototype, "isAirFrictionBound", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGArcaneMissile.prototype, "gravityBoundCoefficient", {
        get: function () { return 0.2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGArcaneMissile.prototype, "color", {
        get: function () { return 0x7509C1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGArcaneMissile.prototype, "borderWidth", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGArcaneMissile.prototype, "borderColor", {
        get: function () { return 0x000000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGArcaneMissile.prototype, "isRound", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    TGArcaneMissile.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        set_ticks_out_1.setTicksOut(function () { return _this.kill(); }, LIFETIME);
    };
    TGArcaneMissile.prototype.onCollision = function (actor, collision) {
        if (!collision.hit)
            return;
        if (actor.isWall) {
            this.kill();
        }
        else if (actor.type === actor_type_1.default.Unfriendly) {
            actor.damage(5);
            this.kill();
        }
    };
    return TGArcaneMissile;
}(static_shape_actor_1.default));
exports.default = TGArcaneMissile;


/***/ }),

/***/ "./src/game/actors/hero/classes/wizard/projectiles/fire-ball.ts":
/*!**********************************************************************!*\
  !*** ./src/game/actors/hero/classes/wizard/projectiles/fire-ball.ts ***!
  \**********************************************************************/
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
var static_shape_actor_1 = __webpack_require__(/*! ../../../../../../engine/actors/static-shape-actor */ "./src/engine/actors/static-shape-actor.ts");
var vector_1 = __webpack_require__(/*! ../../../../../../engine/physics/vector */ "./src/engine/physics/vector.ts");
var set_ticks_out_1 = __webpack_require__(/*! ../../../../../../engine/util/set-ticks-out */ "./src/engine/util/set-ticks-out.ts");
var actor_type_1 = __webpack_require__(/*! ../../../../../../engine/core/actor-type */ "./src/engine/core/actor-type.ts");
var LIFETIME = 40;
var INITIAL_SIZE = new vector_1.default(10, 10);
var MAX_SIZE = new vector_1.default(30, 30);
var TGFireBall = /** @class */ (function (_super) {
    __extends(TGFireBall, _super);
    function TGFireBall(position) {
        var _this = _super.call(this, position) || this;
        _this.isChanneling = false;
        _this._size = INITIAL_SIZE;
        return _this;
    }
    Object.defineProperty(TGFireBall.prototype, "size", {
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGFireBall.prototype, "isAirFrictionBound", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGFireBall.prototype, "gravityBoundCoefficient", {
        get: function () { return this.isChanneling ? 0 : 0.5; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGFireBall.prototype, "color", {
        get: function () { return 0xEF6D09; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGFireBall.prototype, "borderWidth", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGFireBall.prototype, "borderColor", {
        get: function () { return 0x000000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGFireBall.prototype, "isRound", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    TGFireBall.prototype.channel = function () {
        this.isChanneling = true;
    };
    TGFireBall.prototype.stopChanneling = function () {
        var _this = this;
        this.isChanneling = false;
        set_ticks_out_1.setTicksOut(function () { return _this.kill(); }, LIFETIME);
    };
    TGFireBall.prototype.init = function () {
        _super.prototype.init.call(this);
    };
    TGFireBall.prototype.onTick = function () {
        _super.prototype.onTick.call(this);
        if (this.isChanneling) {
            if (this._size.x < MAX_SIZE.x) {
                this._size = this._size.times(1.02);
            }
            else {
                this._size = MAX_SIZE;
            }
            this.paint();
        }
    };
    TGFireBall.prototype.onCollision = function (actor, collision) {
        if (!collision.hit)
            return;
        if (actor.isWall) {
            this.kill();
        }
        else if (actor.type === actor_type_1.default.Unfriendly) {
            actor.kill();
            this.kill();
        }
    };
    return TGFireBall;
}(static_shape_actor_1.default));
exports.default = TGFireBall;


/***/ }),

/***/ "./src/game/actors/hero/classes/wizard/wizard.ts":
/*!*******************************************************!*\
  !*** ./src/game/actors/hero/classes/wizard/wizard.ts ***!
  \*******************************************************/
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
var hero_1 = __webpack_require__(/*! ../../hero */ "./src/game/actors/hero/hero.ts");
var weapon_1 = __webpack_require__(/*! ../../weapon */ "./src/game/actors/hero/weapon.ts");
var constants_1 = __webpack_require__(/*! ../../constants */ "./src/game/actors/hero/constants.ts");
var fire_ball_1 = __webpack_require__(/*! ./projectiles/fire-ball */ "./src/game/actors/hero/classes/wizard/projectiles/fire-ball.ts");
var arcane_missile_1 = __webpack_require__(/*! ./projectiles/arcane-missile */ "./src/game/actors/hero/classes/wizard/projectiles/arcane-missile.ts");
var set_ticks_out_1 = __webpack_require__(/*! ../../../../../engine/util/set-ticks-out */ "./src/engine/util/set-ticks-out.ts");
var channeling_missiles_1 = __webpack_require__(/*! ./animations/channeling-missiles */ "./src/game/actors/hero/classes/wizard/animations/channeling-missiles.ts");
var constants_2 = __webpack_require__(/*! ./constants */ "./src/game/actors/hero/classes/wizard/constants.ts");
var TGWizard = /** @class */ (function (_super) {
    __extends(TGWizard, _super);
    function TGWizard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.performAbilities = [
            function () { return _this.channelArcaneMissiles(); },
            function () { return _this.channelFireBall(); },
            function () { return console.log('blink'); },
            function () { return console.log('frost nova'); },
            function () { return console.log('idk...'); },
        ];
        _this.endAbilities = [
            function () { return _this.stopChannelingArcaneMissiles(); },
            function () { return _this.shootFireBall(); },
            undefined,
            undefined,
            undefined,
        ];
        _this.arcaneMissileTicksOut = undefined;
        return _this;
    }
    Object.defineProperty(TGWizard, "id", {
        get: function () { return 'Wizard'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWizard.prototype, "weapon", {
        get: function () { return new weapon_1.default(weapon_1.TGWeaponType.Staff); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWizard.prototype, "jumpForce", {
        get: function () { return constants_1.JUMP_FORCE.times(1.0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWizard.prototype, "runForce", {
        get: function () { return constants_1.RUN_FORCE.times(0.9); },
        enumerable: true,
        configurable: true
    });
    TGWizard.prototype.performAbility = function (abilityNum) {
        var func = this.performAbilities[abilityNum];
        if (func)
            func();
    };
    TGWizard.prototype.endAbility = function (abilityNum) {
        var func = this.endAbilities[abilityNum];
        if (func)
            func();
    };
    TGWizard.prototype.channelArcaneMissiles = function () {
        var _this = this;
        this.arcaneMissileTicksOut = set_ticks_out_1.setTicksInterval(function () {
            _this.shootArcaneMissile();
        }, constants_2.ARCANE_MISSILE_SHOOT_INTERVAL);
        this.playAnimation(channeling_missiles_1.default);
        this.preventRunning();
    };
    TGWizard.prototype.shootArcaneMissile = function () {
        var missile = new arcane_missile_1.default(this.position);
        missile.push(this.targetUnitVector.times(constants_2.ARCANE_MISSILE_SHOOT_FORCE));
        this.newBornActors.push(missile);
    };
    TGWizard.prototype.stopChannelingArcaneMissiles = function () {
        if (this.arcaneMissileTicksOut)
            set_ticks_out_1.clearTicksInterval(this.arcaneMissileTicksOut);
        this.allowRunning();
    };
    TGWizard.prototype.channelFireBall = function () {
        this.fireBall = new fire_ball_1.default(this.position);
        this.fireBall.channel();
        this.newBornActors.push(this.fireBall);
        this.preventRunning();
    };
    TGWizard.prototype.shootFireBall = function () {
        if (!this.fireBall)
            return;
        this.fireBall.stopChanneling();
        this.fireBall.push(this.targetUnitVector.times(constants_2.FIRE_BALL_SHOOT_FORCE));
        this.allowRunning();
    };
    return TGWizard;
}(hero_1.default));
exports.default = TGWizard;


/***/ }),

/***/ "./src/game/actors/hero/constants.ts":
/*!*******************************************!*\
  !*** ./src/game/actors/hero/constants.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(/*! ../../../engine/physics/vector */ "./src/engine/physics/vector.ts");
exports.SIZE = new vector_1.default(15, 50);
exports.RUN_FORCE = new vector_1.default(2, 0);
exports.JUMP_FORCE = new vector_1.default(0, -13);
exports.BACK_UPPER_ARM_ID = 'back-upper-arm';
exports.BACK_LOWER_ARM_ID = 'back-lower-arm';
exports.BACK_UPPER_LEG_ID = 'back-upper-leg';
exports.BACK_LOWER_LEG_ID = 'back-lower-leg';
exports.CHEST_ID = 'chest';
exports.HEAD_ID = 'head';
exports.FRONT_UPPER_ARM_ID = 'front-upper-arm';
exports.FRONT_LOWER_ARM_ID = 'front-lower-arm';
exports.FRONT_LOWER_ARM_CLONE_ID = 'front-lower-arm-clone';
exports.FRONT_UPPER_LEG_ID = 'front-upper-leg';
exports.FRONT_LOWER_LEG_ID = 'front-lower-leg';
exports.WEAPON_ID = 'weapon';
exports.CHEST_POSITION = new vector_1.default(0, -4);
exports.HEAD_POSITION = new vector_1.default(0, -26);
exports.BACK_LEG_POSITION = new vector_1.default(3, 7);
exports.FRONT_LEG_POSITION = new vector_1.default(-3, 8);
exports.BACK_ARM_POSITION = new vector_1.default(7, -14);
exports.FRONT_ARM_POSITION = new vector_1.default(-7, -13);
exports.LOWER_LIMB_POSITION = new vector_1.default(0, 9);
exports.WEAPON_POSITION = new vector_1.default(0, 9);
exports.CHEST_ANCHOR = new vector_1.default(0.5, 0.5);
exports.HEAD_ANCHOR = new vector_1.default(0.5, 0.5);
exports.LIMB_ANCHOR = new vector_1.default(0.5, 0.2);


/***/ }),

/***/ "./src/game/actors/hero/frames/resting.ts":
/*!************************************************!*\
  !*** ./src/game/actors/hero/frames/resting.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RESTING_FRAME = {
    pivots: {},
};
exports.default = RESTING_FRAME;


/***/ }),

/***/ "./src/game/actors/hero/frames/run-1.ts":
/*!**********************************************!*\
  !*** ./src/game/actors/hero/frames/run-1.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var constants_1 = __webpack_require__(/*! ../constants */ "./src/game/actors/hero/constants.ts");
var RUN_FRAME_1 = {
    pivots: (_a = {},
        _a[constants_1.FRONT_UPPER_ARM_ID] = Math.PI / 3,
        _a[constants_1.FRONT_LOWER_ARM_ID] = Math.PI / -2,
        _a[constants_1.BACK_UPPER_ARM_ID] = Math.PI / -3,
        _a[constants_1.BACK_LOWER_ARM_ID] = Math.PI / -2,
        _a[constants_1.FRONT_UPPER_LEG_ID] = Math.PI / -3,
        _a[constants_1.FRONT_LOWER_LEG_ID] = Math.PI / 3,
        _a[constants_1.BACK_UPPER_LEG_ID] = Math.PI / 3,
        _a[constants_1.BACK_LOWER_LEG_ID] = Math.PI / 3,
        _a),
};
exports.default = RUN_FRAME_1;


/***/ }),

/***/ "./src/game/actors/hero/frames/run-2.ts":
/*!**********************************************!*\
  !*** ./src/game/actors/hero/frames/run-2.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var constants_1 = __webpack_require__(/*! ../constants */ "./src/game/actors/hero/constants.ts");
var RUN_FRAME_2 = {
    pivots: (_a = {},
        _a[constants_1.FRONT_UPPER_ARM_ID] = Math.PI / -3,
        _a[constants_1.FRONT_LOWER_ARM_ID] = Math.PI / -2,
        _a[constants_1.BACK_UPPER_ARM_ID] = Math.PI / 3,
        _a[constants_1.BACK_LOWER_ARM_ID] = Math.PI / -2,
        _a[constants_1.FRONT_UPPER_LEG_ID] = Math.PI / 3,
        _a[constants_1.FRONT_LOWER_LEG_ID] = Math.PI / 3,
        _a[constants_1.BACK_UPPER_LEG_ID] = Math.PI / -3,
        _a[constants_1.BACK_LOWER_LEG_ID] = Math.PI / 3,
        _a),
};
exports.default = RUN_FRAME_2;


/***/ }),

/***/ "./src/game/actors/hero/hero.ts":
/*!**************************************!*\
  !*** ./src/game/actors/hero/hero.ts ***!
  \**************************************/
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
var constants_1 = __webpack_require__(/*! ./constants */ "./src/game/actors/hero/constants.ts");
var vector_1 = __webpack_require__(/*! ../../../engine/physics/vector */ "./src/engine/physics/vector.ts");
var key_listener_1 = __webpack_require__(/*! ../../../engine/interaction/key-listener */ "./src/engine/interaction/key-listener.ts");
var actor_type_1 = __webpack_require__(/*! ../../../engine/core/actor-type */ "./src/engine/core/actor-type.ts");
var destroyable_1 = __webpack_require__(/*! ../../../engine/util/destroyable */ "./src/engine/util/destroyable.ts");
var skeletal_actor_1 = __webpack_require__(/*! ../../../engine/actors/skeletal-actor */ "./src/engine/actors/skeletal-actor.ts");
var texture_helper_1 = __webpack_require__(/*! ../../../engine/util/texture-helper */ "./src/engine/util/texture-helper.ts");
var bones_1 = __webpack_require__(/*! ./bones */ "./src/game/actors/hero/bones.ts");
var resting_1 = __webpack_require__(/*! ./frames/resting */ "./src/game/actors/hero/frames/resting.ts");
var run_1 = __webpack_require__(/*! ./animations/run */ "./src/game/actors/hero/animations/run.ts");
var weapon_1 = __webpack_require__(/*! ./weapon */ "./src/game/actors/hero/weapon.ts");
var mouse_tracker_1 = __webpack_require__(/*! ../../../engine/interaction/mouse-tracker */ "./src/engine/interaction/mouse-tracker.ts");
var TGHero = /** @class */ (function (_super) {
    __extends(TGHero, _super);
    function TGHero() {
        var _this = _super.call(this, vector_1.default.Zero, bones_1.default, resting_1.default) || this;
        _this.destroyer = new destroyable_1.default();
        _this.isLeftKeyDown = false;
        _this.isRightKeyDown = false;
        _this.isUpKeyDown = false;
        _this.canRun = true;
        return _this;
    }
    Object.defineProperty(TGHero, "textureFile", {
        get: function () { return 'public/imgs/person.json'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "weapon", {
        /** @override */
        get: function () { return new weapon_1.default(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "jumpForce", {
        get: function () { return constants_1.JUMP_FORCE; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "runForce", {
        get: function () { return constants_1.RUN_FORCE; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "maxHealth", {
        get: function () { return 100; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "type", {
        get: function () { return actor_type_1.default.Friendly; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "size", {
        get: function () { return constants_1.SIZE; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "hasHealth", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "hideHealthBar", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    /** @override */
    TGHero.prototype.performAbility = function (abilityNum) { };
    TGHero.prototype.endAbility = function (abilityNum) { };
    TGHero.prototype.init = function () {
        _super.prototype.init.call(this);
        this.initSprite();
        this.addKeyListeners();
    };
    TGHero.prototype.onTick = function () {
        _super.prototype.onTick.call(this);
        if (this.isOnGround && this.isUpKeyDown)
            this.jump();
    };
    TGHero.prototype.destroy = function () {
        this.destroyer.destroy();
    };
    Object.defineProperty(TGHero.prototype, "targetPosition", {
        get: function () {
            return mouse_tracker_1.HPMouseTracker.position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero.prototype, "targetUnitVector", {
        get: function () {
            return mouse_tracker_1.HPMouseTracker.position.minus(this.position).toUnit();
        },
        enumerable: true,
        configurable: true
    });
    TGHero.prototype.preventRunning = function () {
        this.canRun = false;
        this.move(vector_1.default.Zero);
    };
    TGHero.prototype.allowRunning = function () {
        this.canRun = true;
        this.isFacingLeft
            ? this.isLeftKeyDown ? this.runLeft() : this.stopRunning()
            : this.isRightKeyDown ? this.runRight() : this.stopRunning();
    };
    Object.defineProperty(TGHero, "headTexture", {
        get: function () { return texture_helper_1.default.get(TGHero.textureFile, 'head.png'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero, "chestTexture", {
        get: function () { return texture_helper_1.default.get(TGHero.textureFile, 'body.png'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero, "limbTexture", {
        get: function () { return texture_helper_1.default.get(TGHero.textureFile, 'limb.png'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGHero, "skeletalTextureMap", {
        get: function () {
            var _a;
            return _a = {},
                _a[constants_1.HEAD_ID] = TGHero.headTexture,
                _a[constants_1.CHEST_ID] = TGHero.chestTexture,
                _a[constants_1.FRONT_UPPER_ARM_ID] = TGHero.limbTexture,
                _a[constants_1.BACK_UPPER_ARM_ID] = TGHero.limbTexture,
                _a[constants_1.FRONT_LOWER_ARM_ID] = TGHero.limbTexture,
                _a[constants_1.FRONT_LOWER_ARM_CLONE_ID] = TGHero.limbTexture,
                _a[constants_1.BACK_LOWER_ARM_ID] = TGHero.limbTexture,
                _a[constants_1.FRONT_UPPER_LEG_ID] = TGHero.limbTexture,
                _a[constants_1.BACK_UPPER_LEG_ID] = TGHero.limbTexture,
                _a[constants_1.FRONT_LOWER_LEG_ID] = TGHero.limbTexture,
                _a[constants_1.BACK_LOWER_LEG_ID] = TGHero.limbTexture,
                _a;
        },
        enumerable: true,
        configurable: true
    });
    TGHero.prototype.initSprite = function () {
        var _a;
        this.setTextureMap(TGHero.skeletalTextureMap);
        this.setTextureMap((_a = {}, _a[constants_1.WEAPON_ID] = this.weapon.getTexture(), _a));
        this.setAnchor(constants_1.WEAPON_ID, this.weapon.getAnchor());
    };
    TGHero.prototype.addKeyListeners = function () {
        var _this = this;
        // move
        this.destroyer.add(new key_listener_1.default(65 /* a */, function () { return _this.onLeftKeyDown(); }, function () { return _this.onLeftKeyUp(); }));
        this.destroyer.add(new key_listener_1.default(68 /* d */, function () { return _this.onRightKeyDown(); }, function () { return _this.onRightKeyUp(); }));
        // jump
        this.destroyer.add(new key_listener_1.default(87 /* w */, function () { return _this.onUpKeyDown(); }, function () { return _this.onUpKeyUp(); }));
        // abilities
        this.destroyer.add(new key_listener_1.default(81 /* q */, function () { return _this.performAbility(0); }, function () { return _this.endAbility(0); }));
        this.destroyer.add(new key_listener_1.default(69 /* e */, function () { return _this.performAbility(1); }, function () { return _this.endAbility(1); }));
        this.destroyer.add(new key_listener_1.default(82 /* r */, function () { return _this.performAbility(2); }, function () { return _this.endAbility(2); }));
        this.destroyer.add(new key_listener_1.default(70 /* f */, function () { return _this.performAbility(3); }, function () { return _this.endAbility(3); }));
        this.destroyer.add(new key_listener_1.default(67 /* c */, function () { return _this.performAbility(4); }, function () { return _this.endAbility(4); }));
    };
    TGHero.prototype.onLeftKeyDown = function () {
        this.isLeftKeyDown = true;
        this.runLeft();
    };
    TGHero.prototype.onLeftKeyUp = function () {
        this.isLeftKeyDown = false;
        this.isRightKeyDown ? this.runRight() : this.stopRunning();
    };
    TGHero.prototype.onRightKeyDown = function () {
        this.isRightKeyDown = true;
        this.runRight();
    };
    TGHero.prototype.onRightKeyUp = function () {
        this.isRightKeyDown = false;
        this.isLeftKeyDown ? this.runLeft() : this.stopRunning();
    };
    TGHero.prototype.onUpKeyDown = function () {
        this.isUpKeyDown = true;
    };
    TGHero.prototype.onUpKeyUp = function () {
        this.isUpKeyDown = false;
    };
    TGHero.prototype.runLeft = function () {
        if (!this.canRun)
            return;
        this.move(this.runForce.flipHorz());
        this.playAnimation(run_1.default);
    };
    TGHero.prototype.runRight = function () {
        if (!this.canRun)
            return;
        this.move(this.runForce);
        this.playAnimation(run_1.default);
    };
    TGHero.prototype.stopRunning = function () {
        if (!this.canRun)
            return;
        this.move(vector_1.default.Zero);
        this.cancelAnimation();
    };
    TGHero.prototype.jump = function () {
        if (!this.isOnGround)
            return;
        this.push(this.jumpForce);
    };
    return TGHero;
}(skeletal_actor_1.default));
exports.default = TGHero;


/***/ }),

/***/ "./src/game/actors/hero/weapon.ts":
/*!****************************************!*\
  !*** ./src/game/actors/hero/weapon.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var texture_helper_1 = __webpack_require__(/*! ../../../engine/util/texture-helper */ "./src/engine/util/texture-helper.ts");
var vector_1 = __webpack_require__(/*! ../../../engine/physics/vector */ "./src/engine/physics/vector.ts");
var TGWeaponType;
(function (TGWeaponType) {
    TGWeaponType[TGWeaponType["Fist"] = 0] = "Fist";
    TGWeaponType[TGWeaponType["Staff"] = 1] = "Staff";
    TGWeaponType[TGWeaponType["Sword"] = 2] = "Sword";
    TGWeaponType[TGWeaponType["Crossbow"] = 3] = "Crossbow";
})(TGWeaponType = exports.TGWeaponType || (exports.TGWeaponType = {}));
var TGWeapon = /** @class */ (function () {
    function TGWeapon(type) {
        if (type === void 0) { type = TGWeaponType.Fist; }
        this.type = type;
    }
    Object.defineProperty(TGWeapon, "textureFile", {
        get: function () { return 'public/imgs/weapons.json'; },
        enumerable: true,
        configurable: true
    });
    TGWeapon.prototype.setType = function (type) {
        this.type = type;
    };
    TGWeapon.prototype.getTexture = function () {
        return TGWeapon.textureMap[this.type];
    };
    TGWeapon.prototype.getAnchor = function () {
        return TGWeapon.anchorMap[this.type];
    };
    Object.defineProperty(TGWeapon, "staffTexture", {
        get: function () { return texture_helper_1.default.get(TGWeapon.textureFile, 'staff.png'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWeapon, "swordTexture", {
        get: function () { return texture_helper_1.default.get(TGWeapon.textureFile, 'sword.png'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWeapon, "crossbowTexture", {
        get: function () { return texture_helper_1.default.get(TGWeapon.textureFile, 'crossbow.png'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWeapon, "textureMap", {
        get: function () {
            var _a;
            return _a = {},
                _a[TGWeaponType.Staff] = TGWeapon.staffTexture,
                _a[TGWeaponType.Sword] = TGWeapon.swordTexture,
                _a[TGWeaponType.Crossbow] = TGWeapon.crossbowTexture,
                _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWeapon, "anchorMap", {
        get: function () {
            var _a;
            return _a = {},
                _a[TGWeaponType.Staff] = new vector_1.default(0.333, 0.5),
                _a[TGWeaponType.Sword] = new vector_1.default(0.0667, 0.5),
                _a[TGWeaponType.Crossbow] = new vector_1.default(0.25, 0.5),
                _a;
        },
        enumerable: true,
        configurable: true
    });
    return TGWeapon;
}());
exports.default = TGWeapon;


/***/ }),

/***/ "./src/game/actors/walls/wall.ts":
/*!***************************************!*\
  !*** ./src/game/actors/walls/wall.ts ***!
  \***************************************/
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
var static_shape_actor_1 = __webpack_require__(/*! ../../../engine/actors/static-shape-actor */ "./src/engine/actors/static-shape-actor.ts");
var TGWall = /** @class */ (function (_super) {
    __extends(TGWall, _super);
    function TGWall(position, _size) {
        var _this = 
        // when creating a wall you specify the upper-left point, not the center
        _super.call(this, position.plus(_size.times(0.5))) || this;
        _this._size = _size;
        return _this;
    }
    Object.defineProperty(TGWall, "id", {
        get: function () { return 'Wall'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWall.prototype, "size", {
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWall.prototype, "isWall", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWall.prototype, "isWallBound", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWall.prototype, "gravityBoundCoefficient", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWall.prototype, "isAirFrictionBound", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWall.prototype, "color", {
        get: function () { return 0x333333; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWall.prototype, "borderWidth", {
        get: function () { return 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TGWall.prototype, "borderColor", {
        get: function () { return 0x757575; },
        enumerable: true,
        configurable: true
    });
    return TGWall;
}(static_shape_actor_1.default));
exports.default = TGWall;


/***/ }),

/***/ "./src/game/main.ts":
/*!**************************!*\
  !*** ./src/game/main.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var app_1 = __webpack_require__(/*! ../engine/core/app */ "./src/engine/core/app.ts");
var vector_1 = __webpack_require__(/*! ../engine/physics/vector */ "./src/engine/physics/vector.ts");
var actor_factory_1 = __webpack_require__(/*! ./actor-factory */ "./src/game/actor-factory.ts");
var hero_1 = __webpack_require__(/*! ./actors/hero/hero */ "./src/game/actors/hero/hero.ts");
var weapon_1 = __webpack_require__(/*! ./actors/hero/weapon */ "./src/game/actors/hero/weapon.ts");
var wizard_1 = __webpack_require__(/*! ./actors/hero/classes/wizard/wizard */ "./src/game/actors/hero/classes/wizard/wizard.ts");
var warrior_1 = __webpack_require__(/*! ./actors/hero/classes/warrior/warrior */ "./src/game/actors/hero/classes/warrior/warrior.ts");
var rouge_1 = __webpack_require__(/*! ./actors/hero/classes/rouge/rouge */ "./src/game/actors/hero/classes/rouge/rouge.ts");
var ability_icon_1 = __webpack_require__(/*! ./ui/ability-icon */ "./src/game/ui/ability-icon.ts");
var status_bar_1 = __webpack_require__(/*! ./ui/status-bar */ "./src/game/ui/status-bar.ts");
var ui_element_1 = __webpack_require__(/*! ../engine/ui/ui-element */ "./src/engine/ui/ui-element.ts");
var urlParams = new URLSearchParams(window.location.search);
var classId = urlParams.get('class') || warrior_1.default.id;
var heroFactory = (_a = {},
    _a[warrior_1.default.id] = function () { return new warrior_1.default(); },
    _a[wizard_1.default.id] = function () { return new wizard_1.default(); },
    _a[rouge_1.default.id] = function () { return new rouge_1.default(); },
    _a);
if (!heroFactory[classId])
    throw new Error("No hero class with id: " + classId);
var hero = heroFactory[classId]();
var textures = [
    hero_1.default.textureFile,
    weapon_1.default.textureFile,
];
var uiElements = [
    new ui_element_1.default({
        position: ui_element_1.HPUIElementPosition.Absolute,
        alignment: ui_element_1.HPUIElementAlignment.BottomLeft,
        layoutDirection: ui_element_1.HPUIElementLayoutDirection.Vert,
        margin: new vector_1.default(6, 0),
        children: [
            new status_bar_1.default(0xFF0000),
            new status_bar_1.default(0x00FF00),
            new ui_element_1.default({
                margin: new vector_1.default(0, 6),
                children: [
                    new ability_icon_1.default(),
                    new ability_icon_1.default(),
                    new ability_icon_1.default(),
                    new ability_icon_1.default(),
                    new ability_icon_1.default(),
                    new ability_icon_1.default(),
                ],
            }),
        ],
    }),
];
var app = new app_1.default({
    elementSelector: '#game-container',
    actorFactory: actor_factory_1.default,
    areaFile: 'public/areas/test-1.json',
    textures: textures,
    uiElements: uiElements,
    hero: hero,
    heroStart: new vector_1.default(200, 700),
});
app.start();


/***/ }),

/***/ "./src/game/ui/ability-icon.ts":
/*!*************************************!*\
  !*** ./src/game/ui/ability-icon.ts ***!
  \*************************************/
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
var vector_1 = __webpack_require__(/*! ../../engine/physics/vector */ "./src/engine/physics/vector.ts");
var ui_graphic_element_1 = __webpack_require__(/*! ../../engine/ui/elements/ui-graphic-element */ "./src/engine/ui/elements/ui-graphic-element.ts");
var RADIUS = 16;
var MARGIN_RIGHT = 4;
var TGAbilityIcon = /** @class */ (function (_super) {
    __extends(TGAbilityIcon, _super);
    function TGAbilityIcon() {
        return _super.call(this, {}) || this;
    }
    Object.defineProperty(TGAbilityIcon.prototype, "size", {
        get: function () { return new vector_1.default(RADIUS * 2 + MARGIN_RIGHT, RADIUS * 2); },
        enumerable: true,
        configurable: true
    });
    TGAbilityIcon.prototype.paint = function () {
        this.sprite.clear();
        this.sprite.beginFill(0xFFFFFF);
        this.sprite.lineStyle(2, 0x000000);
        this.sprite.drawCircle(RADIUS, RADIUS, RADIUS);
        this.sprite.endFill();
    };
    return TGAbilityIcon;
}(ui_graphic_element_1.default));
exports.default = TGAbilityIcon;


/***/ }),

/***/ "./src/game/ui/status-bar.ts":
/*!***********************************!*\
  !*** ./src/game/ui/status-bar.ts ***!
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
var vector_1 = __webpack_require__(/*! ../../engine/physics/vector */ "./src/engine/physics/vector.ts");
var ui_graphic_element_1 = __webpack_require__(/*! ../../engine/ui/elements/ui-graphic-element */ "./src/engine/ui/elements/ui-graphic-element.ts");
var SIZE = new vector_1.default(240, 16);
var MARGIN_TOP = 4;
var TGStatusBar = /** @class */ (function (_super) {
    __extends(TGStatusBar, _super);
    function TGStatusBar(color) {
        var _this = _super.call(this, {}) || this;
        _this.color = color;
        return _this;
    }
    Object.defineProperty(TGStatusBar.prototype, "size", {
        get: function () { return SIZE.plus(new vector_1.default(0, MARGIN_TOP)); },
        enumerable: true,
        configurable: true
    });
    TGStatusBar.prototype.paint = function () {
        this.sprite.clear();
        this.sprite.beginFill(this.color);
        this.sprite.lineStyle(2, 0x000000);
        this.sprite.drawRect(0, MARGIN_TOP, SIZE.x, SIZE.y);
        this.sprite.endFill();
    };
    return TGStatusBar;
}(ui_graphic_element_1.default));
exports.default = TGStatusBar;


/***/ })

/******/ });
//# sourceMappingURL=client.chunkhash.bundle.js.map