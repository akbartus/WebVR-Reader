! function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e(require("aframe")) : "function" == typeof define && define.amd ? define(["aframe"], e) : "object" == typeof exports ? exports.Web2VR = e(require("aframe")) : t.Web2VR = e(t.aframe)
}(window, (function (t) {
    return function (t) {
        var e = {};

        function n(i) {
            if (e[i]) return e[i].exports;
            var r = e[i] = {
                i: i,
                l: !1,
                exports: {}
            };
            return t[i].call(r.exports, r, r.exports, n), r.l = !0, r.exports
        }
        return n.m = t, n.c = e, n.d = function (t, e, i) {
            n.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: i
            })
        }, n.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }, n.t = function (t, e) {
            if (1 & e && (t = n(t)), 8 & e) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var i = Object.create(null);
            if (n.r(i), Object.defineProperty(i, "default", {
                    enumerable: !0,
                    value: t
                }), 2 & e && "string" != typeof t)
                for (var r in t) n.d(i, r, function (e) {
                    return t[e]
                }.bind(null, r));
            return i
        }, n.n = function (t) {
            var e = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return n.d(e, "a", e), e
        }, n.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, n.p = "", n(n.s = 21)
    }([function (t, e) {
        t.exports = function () {
            function t(t, e) {
                return 0 === e.length || -1 !== e.indexOf(t.detail.buttonEvent.type)
            }
            return {
                schema: {
                    startButtons: {
                        default: []
                    },
                    endButtons: {
                        default: []
                    }
                },
                startButtonOk: function (e) {
                    return t(e, this.data.startButtons)
                },
                endButtonOk: function (e) {
                    return t(e, this.data.endButtons)
                }
            }
        }()
    }, function (t, e, n) {
        "use strict";
        var i = function (t) {
            return function (t) {
                return !!t && "object" == typeof t
            }(t) && ! function (t) {
                var e = Object.prototype.toString.call(t);
                return "[object RegExp]" === e || "[object Date]" === e || function (t) {
                    return t.$$typeof === r
                }(t)
            }(t)
        };
        var r = "function" == typeof Symbol && Symbol.for ? Symbol.for("react.element") : 60103;

        function s(t, e) {
            return !1 !== e.clone && e.isMergeableObject(t) ? u((n = t, Array.isArray(n) ? [] : {}), t, e) : t;
            var n
        }

        function o(t, e, n) {
            return t.concat(e).map((function (t) {
                return s(t, n)
            }))
        }

        function a(t) {
            return Object.keys(t).concat(function (t) {
                return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(t).filter((function (e) {
                    return t.propertyIsEnumerable(e)
                })) : []
            }(t))
        }

        function l(t, e) {
            try {
                return e in t
            } catch (t) {
                return !1
            }
        }

        function c(t, e, n) {
            var i = {};
            return n.isMergeableObject(t) && a(t).forEach((function (e) {
                i[e] = s(t[e], n)
            })), a(e).forEach((function (r) {
                (function (t, e) {
                    return l(t, e) && !(Object.hasOwnProperty.call(t, e) && Object.propertyIsEnumerable.call(t, e))
                })(t, r) || (l(t, r) && n.isMergeableObject(e[r]) ? i[r] = function (t, e) {
                    if (!e.customMerge) return u;
                    var n = e.customMerge(t);
                    return "function" == typeof n ? n : u
                }(r, n)(t[r], e[r], n) : i[r] = s(e[r], n))
            })), i
        }

        function u(t, e, n) {
            (n = n || {}).arrayMerge = n.arrayMerge || o, n.isMergeableObject = n.isMergeableObject || i, n.cloneUnlessOtherwiseSpecified = s;
            var r = Array.isArray(e);
            return r === Array.isArray(t) ? r ? n.arrayMerge(t, e, n) : c(t, e, n) : s(e, n)
        }
        u.all = function (t, e) {
            if (!Array.isArray(t)) throw new Error("first argument should be an array");
            return t.reduce((function (t, n) {
                return u(t, n, e)
            }), {})
        };
        var h = u;
        t.exports = h
    }, function (t, e) {
        [Element].forEach((function (t) {
            t.prototype._addEventListener = t.prototype.addEventListener, t.prototype.addEventListener = function (t, e, n) {
                this.eventListenerList || (this.eventListenerList = {}), n = void 0 !== n && n;
                var i = this;
                if (i._addEventListener(t, e, n), i.eventListenerList[t] || (i.eventListenerList[t] = []), i.eventListenerList[t].push({
                        type: t,
                        handle: e,
                        useCapture: n,
                        remove: function () {
                            return i.removeEventListener(this.type, this.handle, this.useCapture), i.eventListenerList[t]
                        }
                    }), "eventListenerAdded" != t && "eventListenerRemoved" != t) {
                    var r = new CustomEvent("eventListenerAdded", {
                        detail: {
                            type: t,
                            handle: e,
                            useCapture: n
                        }
                    });
                    this.dispatchEvent(r)
                }
            }, t.prototype._removeEventListener = t.prototype.removeEventListener, t.prototype.removeEventListener = function (t, e, n) {
                this.eventListenerList || (this.eventListenerList = {});
                if (this.eventListenerList[t] && (this._removeEventListener(t, e, n), this.eventListenerList[t] = this.eventListenerList[t].filter((function (t) {
                        return t && t.handle && e && t.handle.toString() !== e.toString()
                    })), 0 === this.eventListenerList[t].length && delete this.eventListenerList[t], "eventListenerAdded" != t && "eventListenerRemoved" != t)) {
                    var i = new CustomEvent("eventListenerRemoved", {
                        detail: {
                            type: t,
                            handle: e,
                            useCapture: n
                        }
                    });
                    this.dispatchEvent(i)
                }
            }
        }))
    }, function (e, n) {
        e.exports = t
    }, function (t, e) {
        ! function (t) {
            var e = {};

            function n(i) {
                if (e[i]) return e[i].exports;
                var r = e[i] = {
                    exports: {},
                    id: i,
                    loaded: !1
                };
                return t[i].call(r.exports, r, r.exports, n), r.loaded = !0, r.exports
            }
            n.m = t, n.c = e, n.p = "", n(0)
        }([function (t, e, n) {
            "use strict";
            var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                    return typeof t
                } : function (t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t
                },
                r = n(1);
            if ("undefined" == typeof AFRAME) throw "Component attempted to register before AFRAME was available.";
            var s = AFRAME.utils.srcLoader.parseUrl,
                o = AFRAME.utils.debug;
            o.enable("shader:gif:warn");
            var a = o("shader:gif:warn"),
                l = o("shader:gif:debug"),
                c = {};

            function u(t, e) {
                return {
                    status: "error",
                    src: e,
                    message: t,
                    timestamp: Date.now()
                }
            }
            AFRAME.registerShader("gif", {
                schema: {
                    color: {
                        type: "color"
                    },
                    fog: {
                        default: !0
                    },
                    src: {
                        default: null
                    },
                    autoplay: {
                        default: !0
                    }
                },
                init: function (t) {
                    return l("init", t), l(this.el.components), this.__cnv = document.createElement("canvas"), this.__cnv.width = 2, this.__cnv.height = 2, this.__ctx = this.__cnv.getContext("2d"), this.__texture = new THREE.Texture(this.__cnv), this.__material = {}, this.__reset(), this.material = new THREE.MeshBasicMaterial({
                        map: this.__texture
                    }), this.el.sceneEl.addBehavior(this), this.__addPublicFunctions(), this.material
                },
                update: function (t) {
                    return l("update", t), this.__updateMaterial(t), this.__updateTexture(t), this.material
                },
                tick: function (t) {
                    this.__frames && !this.paused() && Date.now() - this.__startTime >= this.__nextFrameTime && this.nextFrame()
                },
                __updateMaterial: function (t) {
                    var e = this.material,
                        n = this.__getMaterialData(t);
                    Object.keys(n).forEach((function (t) {
                        e[t] = n[t]
                    }))
                },
                __getMaterialData: function (t) {
                    return {
                        fog: t.fog,
                        color: new THREE.Color(t.color)
                    }
                },
                __setTexure: function (t) {
                    l("__setTexure", t), "error" === t.status ? (a("Error: " + t.message + "\nsrc: " + t.src), this.__reset()) : "success" === t.status && t.src !== this.__textureSrc && (this.__reset(), this.__ready(t))
                },
                __updateTexture: function (t) {
                    var e = t.src,
                        n = t.autoplay;
                    "boolean" == typeof n ? this.__autoplay = n : void 0 === n && (this.__autoplay = !0), this.__autoplay && this.__frames && this.play(), e ? this.__validateSrc(e, this.__setTexure.bind(this)) : this.__reset()
                },
                __validateSrc: function (t, e) {
                    var n = s(t);
                    if (n) this.__getImageSrc(n, e);
                    else {
                        var r = void 0,
                            o = this.__validateAndGetQuerySelector(t);
                        if (o && "object" === (void 0 === o ? "undefined" : i(o))) {
                            if (o.error) r = o.error;
                            else {
                                var a = o.tagName.toLowerCase();
                                if ("video" === a) t = o.src, r = "For video, please use `aframe-video-shader`";
                                else {
                                    if ("img" === a) return void this.__getImageSrc(o.src, e);
                                    r = "For <" + a + "> element, please use `aframe-html-shader`"
                                }
                            }
                            var l, h;
                            r && (l = c[t], h = u(r, t), l && l.callbacks ? l.callbacks.forEach((function (t) {
                                return t(h)
                            })) : e(h), c[t] = h)
                        }
                    }
                },
                __getImageSrc: function (t, e) {
                    var n = this;
                    if (t !== this.__textureSrc) {
                        var i = c[t];
                        if (i && i.callbacks) {
                            if (i.src) return void e(i);
                            if (i.callbacks) return void i.callbacks.push(e)
                        } else(i = c[t] = {
                            callbacks: []
                        }).callbacks.push(e);
                        var s = new Image;
                        s.crossOrigin = "Anonymous", s.addEventListener("load", (function (e) {
                            n.__getUnit8Array(t, (function (e) {
                                e ? (0, r.parseGIF)(e, (function (e, n, r) {
                                    var s = {
                                        status: "success",
                                        src: t,
                                        times: e,
                                        cnt: n,
                                        frames: r,
                                        timestamp: Date.now()
                                    };
                                    i.callbacks && (i.callbacks.forEach((function (t) {
                                        return t(s)
                                    })), c[t] = s)
                                }), (function (t) {
                                    return o(t)
                                })) : o("This is not gif. Please use `shader:flat` instead")
                            }))
                        })), s.addEventListener("error", (function (t) {
                            return o("Could be the following issue\n - Not Image\n - Not Found\n - Server Error\n - Cross-Origin Issue")
                        })), s.src = t
                    }

                    function o(e) {
                        var n = u(e, t);
                        i.callbacks && (i.callbacks.forEach((function (t) {
                            return t(n)
                        })), c[t] = n)
                    }
                },
                __getUnit8Array: function (t, e) {
                    if ("function" == typeof e) {
                        var n = new XMLHttpRequest;
                        n.open("GET", t), n.responseType = "arraybuffer", n.addEventListener("load", (function (t) {
                            for (var n = new Uint8Array(t.target.response), i = n.subarray(0, 4), r = "", s = 0; s < i.length; s++) r += i[s].toString(16);
                            "47494638" === r ? e(n) : e()
                        })), n.addEventListener("error", (function (t) {
                            l(t), e()
                        })), n.send()
                    }
                },
                __validateAndGetQuerySelector: function (t) {
                    try {
                        var e = document.querySelector(t);
                        return e || {
                            error: "No element was found matching the selector"
                        }
                    } catch (t) {
                        return {
                            error: "no valid selector"
                        }
                    }
                },
                __addPublicFunctions: function () {
                    this.el.gif = {
                        play: this.play.bind(this),
                        pause: this.pause.bind(this),
                        togglePlayback: this.togglePlayback.bind(this),
                        paused: this.paused.bind(this),
                        nextFrame: this.nextFrame.bind(this)
                    }
                },
                pause: function () {
                    l("pause"), this.__paused = !0
                },
                play: function () {
                    l("play"), this.__paused = !1
                },
                togglePlayback: function () {
                    this.paused() ? this.play() : this.pause()
                },
                paused: function () {
                    return this.__paused
                },
                nextFrame: function () {
                    for (this.__clearCanvas(), this.__draw(); Date.now() - this.__startTime >= this.__nextFrameTime;) this.__nextFrameTime += this.__delayTimes[this.__frameIdx++], (this.__infinity || this.__loopCnt) && this.__frameCnt <= this.__frameIdx && (this.__frameIdx = 0)
                },
                __clearCanvas: function () {
                    this.__ctx.clearRect(0, 0, this.__width, this.__height), this.__texture.needsUpdate = !0
                },
                __draw: function () {
                    this.__ctx.drawImage(this.__frames[this.__frameIdx], 0, 0, this.__width, this.__height), this.__texture.needsUpdate = !0
                },
                __ready: function (t) {
                    var e = t.src,
                        n = t.times,
                        i = t.cnt,
                        r = t.frames;
                    l("__ready"), this.__textureSrc = e, this.__delayTimes = n, i ? this.__loopCnt = i : this.__infinity = !0, this.__frames = r, this.__frameCnt = n.length, this.__startTime = Date.now(), this.__width = THREE.Math.floorPowerOfTwo(r[0].width), this.__height = THREE.Math.floorPowerOfTwo(r[0].height), this.__cnv.width = this.__width, this.__cnv.height = this.__height, this.__draw(), this.__autoplay ? this.play() : this.pause()
                },
                __reset: function () {
                    this.pause(), this.__clearCanvas(), this.__startTime = 0, this.__nextFrameTime = 0, this.__frameIdx = 0, this.__frameCnt = 0, this.__delayTimes = null, this.__infinity = !1, this.__loopCnt = 0, this.__frames = null, this.__textureSrc = null
                }
            })
        }, function (t, e) {
            "use strict";
            e.parseGIF = function (t, e, n) {
                var i = 0,
                    r = [],
                    s = 0,
                    o = null,
                    a = null,
                    l = [],
                    c = 0;
                if (71 === t[0] && 73 === t[1] && 70 === t[2] && 56 === t[3] && 57 === t[4] && 97 === t[5]) {
                    i += 13 + +!!(128 & t[10]) * Math.pow(2, 1 + (7 & t[10])) * 3;
                    for (var u = t.subarray(0, i); t[i] && 59 !== t[i];) {
                        var h = i,
                            d = t[i];
                        if (33 === d) {
                            var f = t[++i];
                            if (-1 === [1, 254, 249, 255].indexOf(f)) {
                                n && n("parseGIF: unknown label");
                                break
                            }
                            for (249 === f && r.push(10 * (t[i + 3] + (t[i + 4] << 8))), 255 === f && (c = t[i + 15] + (t[i + 16] << 8)); t[++i];) i += t[i];
                            249 === f && (o = t.subarray(h, i + 1))
                        } else {
                            if (44 !== d) {
                                n && n("parseGIF: unknown blockId");
                                break
                            }
                            for (i += 9, i += 1 + +!!(128 & t[i]) * (3 * Math.pow(2, 1 + (7 & t[i]))); t[++i];) i += t[i];
                            a = t.subarray(h, i + 1);
                            l.push(URL.createObjectURL(new Blob([u, o, a])))
                        }
                        i++
                    }
                } else n && n("parseGIF: no GIF89a");
                if (l.length) {
                    var p = document.createElement("canvas"),
                        v = function t(n) {
                            var i = new Image;
                            i.onload = function (n, i) {
                                s++, l[i] = this, s === l.length ? (p = null, e && e(r, c, l)) : t(++i)
                            }.bind(i), i.src = p.toDataURL("image/gif")
                        };
                    l.forEach((function (t, e) {
                        var n = new Image;
                        n.onload = function (t, e) {
                            0 === e && (p.width = n.width, p.height = n.height), s++, l[e] = this, s === l.length && (s = 0, v(1))
                        }.bind(n, null, e), n.src = t
                    }))
                }
            }
        }])
    }, function (t, e) {
        function n(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function i(t, e) {
            var n = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(t);
                e && (i = i.filter((function (e) {
                    return Object.getOwnPropertyDescriptor(t, e).enumerable
                }))), n.push.apply(n, i)
            }
            return n
        }

        function r(t) {
            for (var e = 1; e < arguments.length; e++) {
                var n = null != arguments[e] ? arguments[e] : {};
                e % 2 ? i(Object(n), !0).forEach((function (e) {
                    s(t, e, n[e])
                })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : i(Object(n)).forEach((function (e) {
                    Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                }))
            }
            return t
        }

        function s(t, e, n) {
            return e in t ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[e] = n, t
        }

        function o(t) {
            return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }! function (t) {
            var e = {};

            function n(i) {
                if (e[i]) return e[i].exports;
                var r = e[i] = {
                    i: i,
                    l: !1,
                    exports: {}
                };
                return t[i].call(r.exports, r, r.exports, n), r.l = !0, r.exports
            }
            n.m = t, n.c = e, n.d = function (t, e, i) {
                n.o(t, e) || Object.defineProperty(t, e, {
                    enumerable: !0,
                    get: i
                })
            }, n.r = function (t) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module"
                }), Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            }, n.t = function (t, e) {
                if (1 & e && (t = n(t)), 8 & e) return t;
                if (4 & e && "object" == o(t) && t && t.__esModule) return t;
                var i = Object.create(null);
                if (n.r(i), Object.defineProperty(i, "default", {
                        enumerable: !0,
                        value: t
                    }), 2 & e && "string" != typeof t)
                    for (var r in t) n.d(i, r, function (e) {
                        return t[e]
                    }.bind(null, r));
                return i
            }, n.n = function (t) {
                var e = t && t.__esModule ? function () {
                    return t.default
                } : function () {
                    return t
                };
                return n.d(e, "a", e), e
            }, n.o = function (t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }, n.p = "", n(n.s = 0)
        }([function (t, e, n) {
            n(1), n(3);
            var i = n(4),
                r = {
                    mode: "normal"
                };
            r.template = new i, t.exports = window.AFK = r
        }, function (t, e, n) {
            var i = n(2);
            if ("undefined" == typeof AFRAME) throw new Error("Component attempted to register before AFRAME was available.");
            AFRAME.registerComponent("a-keyboard", {
                schema: {
                    audio: {
                        default: !1
                    },
                    color: {
                        default: "#fff"
                    },
                    highlightColor: {
                        default: "#1a79dc"
                    },
                    dismissable: {
                        default: !0
                    },
                    font: {
                        default: "monoid"
                    },
                    fontSize: {
                        default: "0.39"
                    },
                    locale: {
                        default: "en"
                    },
                    model: {
                        default: ""
                    },
                    baseTexture: {
                        default: ""
                    },
                    keyTexture: {
                        default: ""
                    },
                    verticalAlign: {
                        default: "center"
                    }
                },
                init: function () {
                    AFK.template.draw(r(r({}, this.data), {}, {
                        el: this.el
                    })), this.attachEventListeners()
                },
                attachEventListeners: function () {
                    window.addEventListener("keydown", this.handleKeyboardPress), this.el.addEventListener("click", this.handleKeyboardVR)
                },
                removeEventListeners: function () {
                    window.removeEventListener("keydown", this.handleKeyboardPress), this.el.removeEventListener("click", this.handleKeyboardVR)
                },
                handleKeyboardPress: function (t) {
                    i(t)
                },
                handleKeyboardVR: function (t) {
                    i(t, "vr")
                },
                remove: function () {
                    this.removeEventListeners()
                }
            })
        }, function (t, e) {
            t.exports = function (t, e) {
                var n, i = new Set([16, 17, 18, 20, 33, 34, 35, 36, 45, 46, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]),
                    r = t.key && t.key.charCodeAt(0),
                    s = t.key,
                    o = t.keyCode;
                if ("vr" === e) o = parseInt(document.querySelector("#".concat(t.target.id)).getAttribute("key-code")), s = document.querySelector("#".concat(t.target.id)).getAttribute("value");
                else if (i.has(t.keyCode)) return;
                switch (o) {
                    case 9:
                        n = new CustomEvent("a-keyboard-update", {
                            detail: {
                                code: o,
                                value: "\t"
                            }
                        }), document.dispatchEvent(n);
                        break;
                    case 8:
                        n = new CustomEvent("a-keyboard-update", {
                            detail: {
                                code: o,
                                value: ""
                            }
                        }), document.dispatchEvent(n);
                        break;
                    case 13:
                        n = new CustomEvent("a-keyboard-update", {
                            detail: {
                                code: o,
                                value: "\n"
                            }
                        }), document.dispatchEvent(n);
                        break;
                    case 16:
                        AFK.template.toggleActiveMode("shift");
                        break;
                    case 18:
                        AFK.template.toggleActiveMode("alt");
                        break;
                    case 27:
                        this.dismissable && (n = new CustomEvent("a-keyboard-update", {
                            detail: {
                                code: o,
                                value: ""
                            }
                        }), document.dispatchEvent(n));
                        break;
                    case 32:
                        n = new CustomEvent("a-keyboard-update", {
                            detail: {
                                code: o,
                                value: " "
                            }
                        }), document.dispatchEvent(n);
                        break;
                    default:
                        n = new CustomEvent("a-keyboard-update", {
                            detail: {
                                code: o,
                                value: s
                            }
                        }), document.dispatchEvent(n)
                }
                if ("vr" !== e) {
                    var a = document.querySelector("#a-keyboard-".concat(r)) || document.querySelector("#a-keyboard-".concat(t.keyCode));
                    a && (a.dispatchEvent(new Event("mousedown")), setTimeout((function () {
                        a.dispatchEvent(new Event("mouseleave"))
                    }), 80))
                }
            }
        }, function (t, e) {
            if ("undefined" == typeof AFRAME) throw new Error("Component attempted to register before AFRAME was available.");
            AFRAME.registerComponent("keyboard-button", {
                init: function () {
                    var t = this,
                        e = this.el;
                    e.addEventListener("mousedown", (function () {
                        e.setAttribute("material", "opacity", "0.7")
                    })), e.addEventListener("mouseup", (function () {
                        e.setAttribute("material", "opacity", t.isMouseEnter ? "0.9" : "0")
                    })), e.addEventListener("mouseenter", (function () {
                        e.setAttribute("material", "opacity", "0.9"), self.isMouseEnter = !0
                    })), e.addEventListener("mouseleave", (function () {
                        e.setAttribute("material", "opacity", "0"), self.isMouseEnter = !1
                    }))
                }
            })
        }, function (t, e, i) {
            var r = i(5);
            t.exports = function () {
                function t() {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.keyboardKeys = {}, this.activeMode = "normal"
                }
                var e, i, s;
                return e = t, (i = [{
                    key: "draw",
                    value: function (t) {
                        for (var e in t) this[e] = t[e];
                        this.keyboardKeys = r(t.locale), this.drawKeyboard()
                    }
                }, {
                    key: "drawButton",
                    value: function (t) {
                        var e = t.key,
                            n = e.size.split(" ")[0],
                            i = e.size.split(" ")[1],
                            r = document.createElement("a-entity");
                        r.setAttribute("position", t.position);
                        var s = document.createElement("a-entity");
                        s.setAttribute("geometry", "primitive: plane; width: ".concat(n, "; height: ").concat(i, ";")), this.keyTexture && this.keyTexture.length > 0 ? s.setAttribute("material", "src: ".concat(this.keyTexture)) : s.setAttribute("material", "color: #4a4a4a; opacity: 0.9");
                        var o = document.createElement("a-text");
                        o.id = "a-keyboard-".concat(e.code), o.setAttribute("key-code", e.code), o.setAttribute("value", e.value), o.setAttribute("align", "center"), o.setAttribute("baseline", this.verticalAlign), o.setAttribute("position", "0 0 0.001"), o.setAttribute("width", this.fontSize), o.setAttribute("height", this.fontSize), o.setAttribute("geometry", "primitive: plane; width: ".concat(n, "; height: ").concat(i)), o.setAttribute("material", "opacity: 0.0; transparent: true; color: ".concat(this.highlightColor)), o.setAttribute("color", this.color), o.setAttribute("font", this.font), o.setAttribute("shader", "msdf"), o.setAttribute("negate", "false"), o.setAttribute("keyboard-button", !0), o.setAttribute("class", "navButton"), r.appendChild(s), r.appendChild(o), this.el.appendChild(r)
                    }
                }, {
                    key: "drawKeyboard",
                    value: function () {
                        for (; this.el.firstChild;) this.el.removeChild(this.el.firstChild);
                        if (this.keyboardKeys) {
                            var t = this.keyboardKeys[this.activeMode] || this.keyboardKeys.normal,
                                e = document.createElement("a-entity"),
                                n = .04 * t.length + .004 * (t.length - 1) + .04;
                            e.setAttribute("position", "".concat(.26 - .02, " ").concat(-n / 2 + .02, " -0.01")), e.setAttribute("geometry", "primitive: plane; width: ".concat(.52, "; height: ").concat(n)), this.baseTexture && this.baseTexture.length > 0 ? e.setAttribute("material", "src: ".concat(this.baseTexture)) : e.setAttribute("material", "color: #4a4a4a; side: double; opacity: 0.7"), this.el.appendChild(e);
                            for (var i = 0, r = 0; r < t.length; r++)
                                for (var s = t[r], o = 0, a = 0; a < s.length; a++) {
                                    var l = s[a],
                                        c = this.parseKeyObjects(l);
                                    if (this.dismissable || "cancel" !== l.type) {
                                        var u = c.size.split(" ")[0],
                                            h = c.size.split(" ")[1];
                                        this.drawButton({
                                            key: c,
                                            position: "".concat(o + u / 2, " ").concat(i - h / 2, " 0")
                                        }), o += parseFloat(u) + .004, s.length === a + 1 && (i -= .044)
                                    }
                                }
                        }
                    }
                }, {
                    key: "toggleActiveMode",
                    value: function (t) {
                        t === this.activeMode ? (this.activeMode = "normal", this.drawKeyboard()) : (this.activeMode = t, this.drawKeyboard())
                    }
                }, {
                    key: "parseKeyObjects",
                    value: function (t) {
                        var e = t.type,
                            n = t.value;
                        switch (e) {
                            case "delete":
                                return {
                                    size: "0.04 0.04 0", value: n, code: "8"
                                };
                            case "enter":
                                return {
                                    size: "0.04 0.084 0", value: n, code: "13"
                                };
                            case "shift":
                                return {
                                    size: "0.084 0.04 0", value: n, code: "16"
                                };
                            case "alt":
                                return {
                                    size: "0.084 0.04 0", value: n, code: "18"
                                };
                            case "space":
                                return {
                                    size: "".concat(.2 + .016, " 0.04 0"), value: n, code: "32"
                                };
                            case "cancel":
                                return {
                                    size: "0.084 0.04 0", value: n, code: "24"
                                };
                            case "submit":
                                return {
                                    size: "0.084 0.04 0", value: n, code: "06"
                                };
                            default:
                                return {
                                    size: "0.04 0.04 0", value: n, code: n.charCodeAt(0)
                                }
                        }
                    }
                }]) && n(e.prototype, i), s && n(e, s), t
            }()
        }, function (t, e, n) {
            var i = n(6);
            t.exports = function (t) {
                switch (t) {
                    case "en":
                    default:
                        return i
                }
            }
        }, function (t, e) {
            t.exports = {
                name: "ms-US-International",
                normal: [
                    [{
                        value: "1",
                        type: "standard"
                    }, {
                        value: "2",
                        type: "standard"
                    }, {
                        value: "3",
                        type: "standard"
                    }, {
                        value: "4",
                        type: "standard"
                    }, {
                        value: "5",
                        type: "standard"
                    }, {
                        value: "6",
                        type: "standard"
                    }, {
                        value: "7",
                        type: "standard"
                    }, {
                        value: "8",
                        type: "standard"
                    }, {
                        value: "9",
                        type: "standard"
                    }, {
                        value: "0",
                        type: "standard"
                    }, {
                        value: "<-",
                        type: "delete"
                    }],
                    [{
                        value: "q",
                        type: "standard"
                    }, {
                        value: "w",
                        type: "standard"
                    }, {
                        value: "e",
                        type: "standard"
                    }, {
                        value: "r",
                        type: "standard"
                    }, {
                        value: "t",
                        type: "standard"
                    }, {
                        value: "y",
                        type: "standard"
                    }, {
                        value: "u",
                        type: "standard"
                    }, {
                        value: "i",
                        type: "standard"
                    }, {
                        value: "o",
                        type: "standard"
                    }, {
                        value: "p",
                        type: "standard"
                    }, {
                        value: "Ent",
                        type: "enter"
                    }],
                    [{
                        value: "a",
                        type: "standard"
                    }, {
                        value: "s",
                        type: "standard"
                    }, {
                        value: "d",
                        type: "standard"
                    }, {
                        value: "f",
                        type: "standard"
                    }, {
                        value: "g",
                        type: "standard"
                    }, {
                        value: "h",
                        type: "standard"
                    }, {
                        value: "j",
                        type: "standard"
                    }, {
                        value: "k",
                        type: "standard"
                    }, {
                        value: "l",
                        type: "standard"
                    }, {
                        value: '"',
                        type: "standard"
                    }],
                    [{
                        value: "Shift",
                        type: "shift"
                    }, {
                        value: "z",
                        type: "standard"
                    }, {
                        value: "x",
                        type: "standard"
                    }, {
                        value: "c",
                        type: "standard"
                    }, {
                        value: "v",
                        type: "standard"
                    }, {
                        value: "b",
                        type: "standard"
                    }, {
                        value: "n",
                        type: "standard"
                    }, {
                        value: "m",
                        type: "standard"
                    }, {
                        value: "Alt",
                        type: "alt"
                    }],
                    [{
                        value: "Cancel",
                        type: "cancel"
                    }, {
                        value: "",
                        type: "space"
                    }, {
                        value: ",",
                        type: "standard"
                    }, {
                        value: ".",
                        type: "standard"
                    }, {
                        value: "Submit",
                        type: "submit"
                    }]
                ],
                shift: [
                    [{
                        value: "1",
                        type: "standard"
                    }, {
                        value: "2",
                        type: "standard"
                    }, {
                        value: "3",
                        type: "standard"
                    }, {
                        value: "4",
                        type: "standard"
                    }, {
                        value: "5",
                        type: "standard"
                    }, {
                        value: "6",
                        type: "standard"
                    }, {
                        value: "7",
                        type: "standard"
                    }, {
                        value: "8",
                        type: "standard"
                    }, {
                        value: "9",
                        type: "standard"
                    }, {
                        value: "0",
                        type: "standard"
                    }, {
                        value: "<-",
                        type: "delete"
                    }],
                    [{
                        value: "Q",
                        type: "standard"
                    }, {
                        value: "W",
                        type: "standard"
                    }, {
                        value: "E",
                        type: "standard"
                    }, {
                        value: "R",
                        type: "standard"
                    }, {
                        value: "T",
                        type: "standard"
                    }, {
                        value: "Y",
                        type: "standard"
                    }, {
                        value: "U",
                        type: "standard"
                    }, {
                        value: "I",
                        type: "standard"
                    }, {
                        value: "O",
                        type: "standard"
                    }, {
                        value: "P",
                        type: "standard"
                    }, {
                        value: "Ent",
                        type: "enter"
                    }],
                    [{
                        value: "A",
                        type: "standard"
                    }, {
                        value: "S",
                        type: "standard"
                    }, {
                        value: "D",
                        type: "standard"
                    }, {
                        value: "F",
                        type: "standard"
                    }, {
                        value: "G",
                        type: "standard"
                    }, {
                        value: "H",
                        type: "standard"
                    }, {
                        value: "J",
                        type: "standard"
                    }, {
                        value: "K",
                        type: "standard"
                    }, {
                        value: "L",
                        type: "standard"
                    }, {
                        value: '"',
                        type: "standard"
                    }],
                    [{
                        value: "Shift",
                        type: "shift"
                    }, {
                        value: "Z",
                        type: "standard"
                    }, {
                        value: "X",
                        type: "standard"
                    }, {
                        value: "C",
                        type: "standard"
                    }, {
                        value: "V",
                        type: "standard"
                    }, {
                        value: "B",
                        type: "standard"
                    }, {
                        value: "N",
                        type: "standard"
                    }, {
                        value: "M",
                        type: "standard"
                    }, {
                        value: "Alt",
                        type: "alt"
                    }],
                    [{
                        value: "Cancel",
                        type: "cancel"
                    }, {
                        value: "",
                        type: "space"
                    }, {
                        value: ",",
                        type: "standard"
                    }, {
                        value: ".",
                        type: "standard"
                    }, {
                        value: "Submit",
                        type: "submit"
                    }]
                ],
                alt: [
                    [{
                        value: "1",
                        type: "standard"
                    }, {
                        value: "2",
                        type: "standard"
                    }, {
                        value: "3",
                        type: "standard"
                    }, {
                        value: "4",
                        type: "standard"
                    }, {
                        value: "5",
                        type: "standard"
                    }, {
                        value: "6",
                        type: "standard"
                    }, {
                        value: "7",
                        type: "standard"
                    }, {
                        value: "8",
                        type: "standard"
                    }, {
                        value: "9",
                        type: "standard"
                    }, {
                        value: "0",
                        type: "standard"
                    }, {
                        value: "<-",
                        type: "delete"
                    }],
                    [{
                        value: "~",
                        type: "standard"
                    }, {
                        value: "`",
                        type: "standard"
                    }, {
                        value: "|",
                        type: "standard"
                    }, {
                        value: "(",
                        type: "standard"
                    }, {
                        value: ")",
                        type: "standard"
                    }, {
                        value: "^",
                        type: "standard"
                    }, {
                        value: "_",
                        type: "standard"
                    }, {
                        value: "-",
                        type: "standard"
                    }, {
                        value: "=",
                        type: "standard"
                    }, {
                        value: "!",
                        type: "standard"
                    }, {
                        value: "Ent",
                        type: "enter"
                    }],
                    [{
                        value: "@",
                        type: "standard"
                    }, {
                        value: "#",
                        type: "standard"
                    }, {
                        value: "$",
                        type: "standard"
                    }, {
                        value: "%",
                        type: "standard"
                    }, {
                        value: "*",
                        type: "standard"
                    }, {
                        value: "[",
                        type: "standard"
                    }, {
                        value: "]",
                        type: "standard"
                    }, {
                        value: "#",
                        type: "standard"
                    }, {
                        value: "<",
                        type: "standard"
                    }, {
                        value: "?",
                        type: "standard"
                    }],
                    [{
                        value: "Shift",
                        type: "shift"
                    }, {
                        value: ":",
                        type: "standard"
                    }, {
                        value: ";",
                        type: "standard"
                    }, {
                        value: "{",
                        type: "standard"
                    }, {
                        value: "}",
                        type: "standard"
                    }, {
                        value: "/",
                        type: "standard"
                    }, {
                        value: "\\",
                        type: "standard"
                    }, {
                        value: ">",
                        type: "standard"
                    }, {
                        value: "Alt",
                        type: "alt"
                    }],
                    [{
                        value: "Cancel",
                        type: "cancel"
                    }, {
                        value: "",
                        type: "space"
                    }, {
                        value: ",",
                        type: "standard"
                    }, {
                        value: ".",
                        type: "standard"
                    }, {
                        value: "Submit",
                        type: "submit"
                    }]
                ]
            }
        }])
    }, function (t, e, n) {
        if ("undefined" == typeof AFRAME) throw new Error("Component attempted to register before AFRAME was available.");
        n(7), n(8), n(9), n(11), n(12), n(13), n(14), n(15), AFRAME.registerComponent("super-hands", {
            schema: {
                colliderEvent: {
                    default: "hit"
                },
                colliderEventProperty: {
                    default: "el"
                },
                colliderEndEvent: {
                    default: "hitend"
                },
                colliderEndEventProperty: {
                    default: "el"
                },
                grabStartButtons: {
                    default: ["gripdown", "trackpaddown", "triggerdown", "gripclose", "abuttondown", "bbuttondown", "xbuttondown", "ybuttondown", "pointup", "thumbup", "pointingstart", "pistolstart", "thumbstickdown", "mousedown", "touchstart"]
                },
                grabEndButtons: {
                    default: ["gripup", "trackpadup", "triggerup", "gripopen", "abuttonup", "bbuttonup", "xbuttonup", "ybuttonup", "pointdown", "thumbdown", "pointingend", "pistolend", "thumbstickup", "mouseup", "touchend"]
                },
                stretchStartButtons: {
                    default: ["gripdown", "trackpaddown", "triggerdown", "gripclose", "abuttondown", "bbuttondown", "xbuttondown", "ybuttondown", "pointup", "thumbup", "pointingstart", "pistolstart", "thumbstickdown", "mousedown", "touchstart"]
                },
                stretchEndButtons: {
                    default: ["gripup", "trackpadup", "triggerup", "gripopen", "abuttonup", "bbuttonup", "xbuttonup", "ybuttonup", "pointdown", "thumbdown", "pointingend", "pistolend", "thumbstickup", "mouseup", "touchend"]
                },
                dragDropStartButtons: {
                    default: ["gripdown", "trackpaddown", "triggerdown", "gripclose", "abuttondown", "bbuttondown", "xbuttondown", "ybuttondown", "pointup", "thumbup", "pointingstart", "pistolstart", "thumbstickdown", "mousedown", "touchstart"]
                },
                dragDropEndButtons: {
                    default: ["gripup", "trackpadup", "triggerup", "gripopen", "abuttonup", "bbuttonup", "xbuttonup", "ybuttonup", "pointdown", "thumbdown", "pointingend", "pistolend", "thumbstickup", "mouseup", "touchend"]
                },
                interval: {
                    default: 0
                }
            },
            multiple: !1,
            init: function () {
                this.HOVER_EVENT = "hover-start", this.UNHOVER_EVENT = "hover-end", this.GRAB_EVENT = "grab-start", this.UNGRAB_EVENT = "grab-end", this.STRETCH_EVENT = "stretch-start", this.UNSTRETCH_EVENT = "stretch-end", this.DRAG_EVENT = "drag-start", this.UNDRAG_EVENT = "drag-end", this.DRAGOVER_EVENT = "dragover-start", this.UNDRAGOVER_EVENT = "dragover-end", this.DRAGDROP_EVENT = "drag-drop", this.otherSuperHand = null, this.gehDragged = new Set, this.gehClicking = new Set, this.hoverEls = [], this.hoverElsIntersections = [], this.prevCheckTime = null, this.state = new Map, this.dragging = !1, this.unHover = this.unHover.bind(this), this.unWatch = this.unWatch.bind(this), this.onHit = this.onHit.bind(this), this.onGrabStartButton = this.onGrabStartButton.bind(this), this.onGrabEndButton = this.onGrabEndButton.bind(this), this.onStretchStartButton = this.onStretchStartButton.bind(this), this.onStretchEndButton = this.onStretchEndButton.bind(this), this.onDragDropStartButton = this.onDragDropStartButton.bind(this), this.onDragDropEndButton = this.onDragDropEndButton.bind(this), this.system.registerMe(this)
            },
            update: function (t) {
                this.unRegisterListeners(t), this.registerListeners()
            },
            remove: function () {
                this.system.unregisterMe(this), this.unRegisterListeners(), this.hoverEls.length = 0, this.state.get(this.HOVER_EVENT) && this._unHover(this.state.get(this.HOVER_EVENT)), this.onGrabEndButton(), this.onStretchEndButton(), this.onDragDropEndButton()
            },
            tick: function () {
                function t(t, e) {
                    const n = null == t.distance ? -1 : t.distance,
                        i = null == e.distance ? -1 : e.distance;
                    return n < i ? 1 : i < n ? -1 : 0
                }
                return function (e) {
                    const n = this.data,
                        i = this.prevCheckTime;
                    if (i && e - i < n.interval) return;
                    this.prevCheckTime = e;
                    let r = !1;
                    this.hoverElsIntersections.sort(t);
                    for (let t = 0; t < this.hoverElsIntersections.length; t++) this.hoverEls[t] !== this.hoverElsIntersections[t].object.el && (r = !0, this.hoverEls[t] = this.hoverElsIntersections[t].object.el);
                    r && this.hover()
                }
            }(),
            onGrabStartButton: function (t) {
                let e = this.state.get(this.GRAB_EVENT);
                this.dispatchMouseEventAll("mousedown", this.el), this.gehClicking = new Set(this.hoverEls), e || (e = this.findTarget(this.GRAB_EVENT, {
                    hand: this.el,
                    buttonEvent: t
                }), e && (this.state.set(this.GRAB_EVENT, e), this._unHover(e)))
            },
            onGrabEndButton: function (t) {
                const e = this.hoverEls.filter(t => this.gehClicking.has(t)),
                    n = this.state.get(this.GRAB_EVENT),
                    i = {
                        hand: this.el,
                        buttonEvent: t
                    };
                this.dispatchMouseEventAll("mouseup", this.el);
                for (let t = 0; t < e.length; t++) this.dispatchMouseEvent(e[t], "click", this.el);
                this.gehClicking.clear(), n && !this.emitCancelable(n, this.UNGRAB_EVENT, i) && (this.promoteHoveredEl(this.state.get(this.GRAB_EVENT)), this.state.delete(this.GRAB_EVENT), this.hover())
            },
            onStretchStartButton: function (t) {
                let e = this.state.get(this.STRETCH_EVENT);
                e || (e = this.findTarget(this.STRETCH_EVENT, {
                    hand: this.el,
                    buttonEvent: t
                }), e && (this.state.set(this.STRETCH_EVENT, e), this._unHover(e)))
            },
            onStretchEndButton: function (t) {
                const e = this.state.get(this.STRETCH_EVENT),
                    n = {
                        hand: this.el,
                        buttonEvent: t
                    };
                e && !this.emitCancelable(e, this.UNSTRETCH_EVENT, n) && (this.promoteHoveredEl(e), this.state.delete(this.STRETCH_EVENT), this.hover())
            },
            onDragDropStartButton: function (t) {
                let e = this.state.get(this.DRAG_EVENT);
                this.dragging = !0, this.hoverEls.length && (this.gehDragged = new Set(this.hoverEls), this.dispatchMouseEventAll("dragstart", this.el)), e || (e = this.state.get(this.GRAB_EVENT) && !this.emitCancelable(this.state.get(this.GRAB_EVENT), this.DRAG_EVENT, {
                    hand: this.el,
                    buttonEvent: t
                }) ? this.state.get(this.GRAB_EVENT) : this.findTarget(this.DRAG_EVENT, {
                    hand: this.el,
                    buttonEvent: t
                }), e && (this.state.set(this.DRAG_EVENT, e), this._unHover(e)))
            },
            onDragDropEndButton: function (t) {
                const e = this.state.get(this.DRAG_EVENT);
                if (this.dragging = !1, this.gehDragged.forEach(t => {
                        this.dispatchMouseEvent(t, "dragend", this.el), this.dispatchMouseEventAll("drop", t, !0, !0), this.dispatchMouseEventAll("dragleave", t, !0, !0)
                    }), this.gehDragged.clear(), e) {
                    const n = {
                            hand: this.el,
                            dropped: e,
                            on: null,
                            buttonEvent: t
                        },
                        i = {
                            hand: this.el,
                            buttonEvent: t
                        },
                        r = this.findTarget(this.DRAGDROP_EVENT, n, !0);
                    r && (n.on = r, this.emitCancelable(e, this.DRAGDROP_EVENT, n), this._unHover(r)), this.emitCancelable(e, this.UNDRAG_EVENT, i) || (this.promoteHoveredEl(e), this.state.delete(this.DRAG_EVENT), this.hover())
                }
            },
            processHitEl: function (t, e) {
                const n = e && e.distance,
                    i = this.hoverElsIntersections,
                    r = this.hoverEls;
                let s = !1;
                if (-1 === this.hoverEls.indexOf(t)) {
                    if (s = !0, null != n) {
                        let s = 0;
                        for (; s < i.length && n < i[s].distance;) s++;
                        r.splice(s, 0, t), i.splice(s, 0, e)
                    } else r.push(t), i.push({
                        object: {
                            el: t
                        }
                    });
                    this.dispatchMouseEvent(t, "mouseover", this.el), this.dragging && this.gehDragged.size && this.gehDragged.forEach(t => {
                        this.dispatchMouseEventAll("dragenter", t, !0, !0)
                    })
                }
                return s
            },
            onHit: function (t) {
                const e = t.detail[this.data.colliderEventProperty];
                let n = 0;
                if (e) {
                    if (Array.isArray(e))
                        for (let i, r = 0; r < e.length; r++) i = t.detail.intersections && t.detail.intersections[r], n += this.processHitEl(e[r], i);
                    else n += this.processHitEl(e, null);
                    n && this.hover()
                }
            },
            hover: function () {
                var t, e;
                this.state.has(this.HOVER_EVENT) && this._unHover(this.state.get(this.HOVER_EVENT), !0), this.state.has(this.DRAGOVER_EVENT) && this._unHover(this.state.get(this.DRAGOVER_EVENT), !0), this.dragging && this.state.get(this.DRAG_EVENT) && (t = {
                    hand: this.el,
                    hovered: e,
                    carried: this.state.get(this.DRAG_EVENT)
                }, (e = this.findTarget(this.DRAGOVER_EVENT, t, !0)) && (this.emitCancelable(this.state.get(this.DRAG_EVENT), this.DRAGOVER_EVENT, t), this.state.set(this.DRAGOVER_EVENT, e))), this.state.has(this.DRAGOVER_EVENT) || (e = this.findTarget(this.HOVER_EVENT, {
                    hand: this.el
                }, !0)) && this.state.set(this.HOVER_EVENT, e)
            },
            unHover: function (t) {
                const e = t.detail[this.data.colliderEndEventProperty];
                e && (Array.isArray(e) ? e.forEach(t => this._unHover(t)) : this._unHover(e))
            },
            _unHover: function (t, e) {
                let n, i = !1;
                t === this.state.get(this.DRAGOVER_EVENT) && (this.state.delete(this.DRAGOVER_EVENT), i = !0, n = {
                    hand: this.el,
                    hovered: t,
                    carried: this.state.get(this.DRAG_EVENT)
                }, this.emitCancelable(t, this.UNDRAGOVER_EVENT, n), this.state.has(this.DRAG_EVENT) && this.emitCancelable(this.state.get(this.DRAG_EVENT), this.UNDRAGOVER_EVENT, n)), t === this.state.get(this.HOVER_EVENT) && (this.state.delete(this.HOVER_EVENT), i = !0, this.emitCancelable(t, this.UNHOVER_EVENT, {
                    hand: this.el
                })), i && !e && this.hover()
            },
            unWatch: function (t) {
                const e = t.detail[this.data.colliderEndEventProperty];
                e && (Array.isArray(e) ? e.forEach(t => this._unWatch(t)) : this._unWatch(e))
            },
            _unWatch: function (t) {
                var e = this.hoverEls.indexOf(t); - 1 !== e && (this.hoverEls.splice(e, 1), this.hoverElsIntersections.splice(e, 1)), this.gehDragged.forEach(e => {
                    this.dispatchMouseEvent(t, "dragleave", e), this.dispatchMouseEvent(e, "dragleave", t)
                }), this.dispatchMouseEvent(t, "mouseout", this.el)
            },
            registerListeners: function () {
                this.el.addEventListener(this.data.colliderEvent, this.onHit), this.el.addEventListener(this.data.colliderEndEvent, this.unWatch), this.el.addEventListener(this.data.colliderEndEvent, this.unHover), this.data.grabStartButtons.forEach(t => {
                    this.el.addEventListener(t, this.onGrabStartButton)
                }), this.data.stretchStartButtons.forEach(t => {
                    this.el.addEventListener(t, this.onStretchStartButton)
                }), this.data.dragDropStartButtons.forEach(t => {
                    this.el.addEventListener(t, this.onDragDropStartButton)
                }), this.data.dragDropEndButtons.forEach(t => {
                    this.el.addEventListener(t, this.onDragDropEndButton)
                }), this.data.stretchEndButtons.forEach(t => {
                    this.el.addEventListener(t, this.onStretchEndButton)
                }), this.data.grabEndButtons.forEach(t => {
                    this.el.addEventListener(t, this.onGrabEndButton)
                })
            },
            unRegisterListeners: function (t) {
                t = t || this.data, 0 !== Object.keys(t).length && (this.el.removeEventListener(t.colliderEvent, this.onHit), this.el.removeEventListener(t.colliderEndEvent, this.unHover), this.el.removeEventListener(t.colliderEndEvent, this.unWatch), t.grabStartButtons.forEach(t => {
                    this.el.removeEventListener(t, this.onGrabStartButton)
                }), t.grabEndButtons.forEach(t => {
                    this.el.removeEventListener(t, this.onGrabEndButton)
                }), t.stretchStartButtons.forEach(t => {
                    this.el.removeEventListener(t, this.onStretchStartButton)
                }), t.stretchEndButtons.forEach(t => {
                    this.el.removeEventListener(t, this.onStretchEndButton)
                }), t.dragDropStartButtons.forEach(t => {
                    this.el.removeEventListener(t, this.onDragDropStartButton)
                }), t.dragDropEndButtons.forEach(t => {
                    this.el.removeEventListener(t, this.onDragDropEndButton)
                }))
            },
            emitCancelable: function (t, e, n) {
                var i, r;
                return (i = {
                    bubbles: !0,
                    cancelable: !0,
                    detail: n = n || {}
                }).detail.target = i.detail.target || t, r = new window.CustomEvent(e, i), t.dispatchEvent(r)
            },
            dispatchMouseEvent: function (t, e, n) {
                var i = new window.MouseEvent(e, {
                    relatedTarget: n
                });
                t.dispatchEvent(i)
            },
            dispatchMouseEventAll: function (t, e, n, i) {
                let r = this.hoverEls;
                if (n && (r = r.filter(t => t !== this.state.get(this.GRAB_EVENT) && t !== this.state.get(this.DRAG_EVENT) && t !== this.state.get(this.STRETCH_EVENT) && !this.gehDragged.has(t))), i)
                    for (let n = 0; n < r.length; n++) this.dispatchMouseEvent(r[n], t, e), this.dispatchMouseEvent(e, t, r[n]);
                else
                    for (let n = 0; n < r.length; n++) this.dispatchMouseEvent(r[n], t, e)
            },
            findTarget: function (t, e, n) {
                var i, r = this.hoverEls;
                for (n && (r = r.filter(t => t !== this.state.get(this.GRAB_EVENT) && t !== this.state.get(this.DRAG_EVENT) && t !== this.state.get(this.STRETCH_EVENT))), i = r.length - 1; i >= 0; i--)
                    if (!this.emitCancelable(r[i], t, e)) return r[i];
                return null
            },
            promoteHoveredEl: function (t) {
                var e = this.hoverEls.indexOf(t);
                if (-1 !== e && null == this.hoverElsIntersections[e].distance) {
                    this.hoverEls.splice(e, 1);
                    const n = this.hoverElsIntersections.splice(e, 1);
                    this.hoverEls.push(t), this.hoverElsIntersections.push(n[0])
                }
            }
        })
    }, function (t, e) {
        AFRAME.registerSystem("super-hands", {
            init: function () {
                this.superHands = []
            },
            registerMe: function (t) {
                1 === this.superHands.length && (this.superHands[0].otherSuperHand = t, t.otherSuperHand = this.superHands[0]), this.superHands.push(t)
            },
            unregisterMe: function (t) {
                var e = this.superHands.indexOf(t); - 1 !== e && this.superHands.splice(e, 1), this.superHands.forEach(e => {
                    e.otherSuperHand === t && (e.otherSuperHand = null)
                })
            }
        })
    }, function (t, e) {
        AFRAME.registerComponent("hoverable", {
            init: function () {
                this.HOVERED_STATE = "hovered", this.HOVER_EVENT = "hover-start", this.UNHOVER_EVENT = "hover-end", this.hoverers = [], this.start = this.start.bind(this), this.end = this.end.bind(this), this.el.addEventListener(this.HOVER_EVENT, this.start), this.el.addEventListener(this.UNHOVER_EVENT, this.end)
            },
            remove: function () {
                this.el.removeEventListener(this.HOVER_EVENT, this.start), this.el.removeEventListener(this.UNHOVER_EVENT, this.end)
            },
            start: function (t) {
                t.defaultPrevented || (this.el.addState(this.HOVERED_STATE), -1 === this.hoverers.indexOf(t.detail.hand) && this.hoverers.push(t.detail.hand), t.preventDefault && t.preventDefault())
            },
            end: function (t) {
                if (!t.defaultPrevented) {
                    var e = this.hoverers.indexOf(t.detail.hand); - 1 !== e && this.hoverers.splice(e, 1), this.hoverers.length < 1 && this.el.removeState(this.HOVERED_STATE)
                }
            }
        })
    }, function (t, e, n) {
        const i = AFRAME.utils.extendDeep,
            r = i({}, n(10), n(0));
        var s, o, a, l;
        AFRAME.registerComponent("grabbable", i(r, {
            schema: {
                maxGrabbers: {
                    type: "int",
                    default: NaN
                },
                invert: {
                    default: !1
                },
                suppressY: {
                    default: !1
                }
            },
            init: function () {
                this.GRABBED_STATE = "grabbed", this.GRAB_EVENT = "grab-start", this.UNGRAB_EVENT = "grab-end", this.grabbed = !1, this.grabbers = [], this.constraints = new Map, this.deltaPositionIsValid = !1, this.grabDistance = void 0, this.grabDirection = {
                    x: 0,
                    y: 0,
                    z: -1
                }, this.grabOffset = {
                    x: 0,
                    y: 0,
                    z: 0
                }, this.destPosition = {
                    x: 0,
                    y: 0,
                    z: 0
                }, this.deltaPosition = new THREE.Vector3, this.targetPosition = new THREE.Vector3, this.physicsInit(), this.el.addEventListener(this.GRAB_EVENT, t => this.start(t)), this.el.addEventListener(this.UNGRAB_EVENT, t => this.end(t)), this.el.addEventListener("mouseout", t => this.lostGrabber(t))
            },
            update: function () {
                this.physicsUpdate(), this.xFactor = this.data.invert ? -1 : 1, this.zFactor = this.data.invert ? -1 : 1, this.yFactor = (this.data.invert ? -1 : 1) * !this.data.suppressY
            },
            tick: (a = new THREE.Quaternion, l = new THREE.Vector3, function () {
                var t;
                this.grabber && (this.targetPosition.copy(this.grabDirection), this.targetPosition.applyQuaternion(this.grabber.object3D.getWorldQuaternion(a)).setLength(this.grabDistance).add(this.grabber.object3D.getWorldPosition(l)).add(this.grabOffset), this.deltaPositionIsValid ? (this.deltaPosition.sub(this.targetPosition), t = this.el.getAttribute("position"), this.destPosition.x = t.x - this.deltaPosition.x * this.xFactor, this.destPosition.y = t.y - this.deltaPosition.y * this.yFactor, this.destPosition.z = t.z - this.deltaPosition.z * this.zFactor, this.el.setAttribute("position", this.destPosition)) : this.deltaPositionIsValid = !0, this.deltaPosition.copy(this.targetPosition))
            }),
            remove: function () {
                this.el.removeEventListener(this.GRAB_EVENT, this.start), this.el.removeEventListener(this.UNGRAB_EVENT, this.end), this.physicsRemove()
            },
            start: function (t) {
                if (t.defaultPrevented || !this.startButtonOk(t)) return;
                const e = !Number.isFinite(this.data.maxGrabbers) || this.grabbers.length < this.data.maxGrabbers;
                if (-1 === this.grabbers.indexOf(t.detail.hand) && e) {
                    if (!t.detail.hand.object3D) return void console.warn("grabbable entities must have an object3D");
                    this.grabbers.push(t.detail.hand), this.physicsStart(t) || this.grabber || (this.grabber = t.detail.hand, this.resetGrabber()), t.preventDefault && t.preventDefault(), this.grabbed = !0, this.el.addState(this.GRABBED_STATE)
                }
            },
            end: function (t) {
                const e = this.grabbers.indexOf(t.detail.hand);
                !t.defaultPrevented && this.endButtonOk(t) && (-1 !== e && (this.grabbers.splice(e, 1), this.grabber = this.grabbers[0]), this.physicsEnd(t), this.resetGrabber() || (this.grabbed = !1, this.el.removeState(this.GRABBED_STATE)), t.preventDefault && t.preventDefault())
            },
            resetGrabber: (s = new THREE.Vector3, o = new THREE.Vector3, function () {
                let t;
                return !!this.grabber && (t = this.grabber.getAttribute("raycaster"), this.deltaPositionIsValid = !1, this.grabDistance = this.el.object3D.getWorldPosition(s).distanceTo(this.grabber.object3D.getWorldPosition(o)), t && (this.grabDirection = t.direction, this.grabOffset = t.origin), !0)
            }),
            lostGrabber: function (t) {
                let e = this.grabbers.indexOf(t.relatedTarget); - 1 === e || t.relatedTarget === this.grabber || this.physicsIsConstrained(t.relatedTarget) || this.grabbers.splice(e, 1)
            }
        }))
    }, function (t, e) {
        t.exports = {
            schema: {
                usePhysics: {
                    default: "ifavailable"
                }
            },
            physicsInit: function () {
                this.constraints = new Map
            },
            physicsUpdate: function () {
                "never" === this.data.usePhysics && this.constraints.size && this.physicsClear()
            },
            physicsRemove: function () {
                this.physicsClear()
            },
            physicsStart: function (t) {
                if ("never" !== this.data.usePhysics && this.el.body && t.detail.hand.body && !this.constraints.has(t.detail.hand)) {
                    const e = Math.random().toString(36).substr(2, 9);
                    return this.el.setAttribute("constraint__" + e, {
                        target: t.detail.hand
                    }), this.constraints.set(t.detail.hand, e), !0
                }
                return "only" === this.data.usePhysics
            },
            physicsEnd: function (t) {
                let e = this.constraints.get(t.detail.hand);
                e && (this.el.removeAttribute("constraint__" + e), this.constraints.delete(t.detail.hand))
            },
            physicsClear: function () {
                if (this.el.body)
                    for (let t of this.constraints.values()) this.el.body.world.removeConstraint(t);
                this.constraints.clear()
            },
            physicsIsConstrained: function (t) {
                return this.constraints.has(t)
            },
            physicsIsGrabbing() {
                return this.constraints.size > 0
            }
        }
    }, function (t, e, n) {
        const i = AFRAME.utils.extendDeep,
            r = i({}, n(0));
        AFRAME.registerComponent("stretchable", i(r, {
            schema: {
                usePhysics: {
                    default: "ifavailable"
                },
                invert: {
                    default: !1
                },
                physicsUpdateRate: {
                    default: 100
                }
            },
            init: function () {
                this.STRETCHED_STATE = "stretched", this.STRETCH_EVENT = "stretch-start", this.UNSTRETCH_EVENT = "stretch-end", this.stretched = !1, this.stretchers = [], this.scale = new THREE.Vector3, this.handPos = new THREE.Vector3, this.otherHandPos = new THREE.Vector3, this.start = this.start.bind(this), this.end = this.end.bind(this), this.el.addEventListener(this.STRETCH_EVENT, this.start), this.el.addEventListener(this.UNSTRETCH_EVENT, this.end)
            },
            update: function (t) {
                this.updateBodies = AFRAME.utils.throttleTick(this._updateBodies, this.data.physicsUpdateRate, this)
            },
            tick: function (t, e) {
                if (!this.stretched) return;
                this.scale.copy(this.el.getAttribute("scale")), this.stretchers[0].object3D.getWorldPosition(this.handPos), this.stretchers[1].object3D.getWorldPosition(this.otherHandPos);
                const n = this.handPos.distanceTo(this.otherHandPos);
                let i = 1;
                null !== this.previousStretch && 0 !== n && (i = Math.pow(n / this.previousStretch, this.data.invert ? -1 : 1)), this.previousStretch = n, null == this.previousPhysicsStretch && (this.previousPhysicsStretch = n), this.scale.multiplyScalar(i), this.el.setAttribute("scale", this.scale), this.updateBodies(t, e)
            },
            remove: function () {
                this.el.removeEventListener(this.STRETCH_EVENT, this.start), this.el.removeEventListener(this.UNSTRETCH_EVENT, this.end)
            },
            start: function (t) {
                this.stretched || this.stretchers.includes(t.detail.hand) || !this.startButtonOk(t) || t.defaultPrevented || (this.stretchers.push(t.detail.hand), 2 === this.stretchers.length && (this.stretched = !0, this.previousStretch = null, this.previousPhysicsStretch = null, this.el.addState(this.STRETCHED_STATE)), t.preventDefault && t.preventDefault())
            },
            end: function (t) {
                var e = this.stretchers.indexOf(t.detail.hand);
                !t.defaultPrevented && this.endButtonOk(t) && (-1 !== e && (this.stretchers.splice(e, 1), this.stretched = !1, this.el.removeState(this.STRETCHED_STATE), this._updateBodies()), t.preventDefault && t.preventDefault())
            },
            _updateBodies: function () {
                if (!this.el.body || "never" === this.data.usePhysics) return;
                const t = this.previousStretch;
                let e = 1;
                if (null !== this.previousPhysicsStretch && t > 0 && (e = Math.pow(t / this.previousPhysicsStretch, this.data.invert ? -1 : 1)), this.previousPhysicsStretch = t, 1 !== e) {
                    for (let t of this.el.childNodes) this.stretchBody(t, e);
                    this.stretchBody(this.el, e)
                }
            },
            stretchBody: function (t, e) {
                if (!t.body) return;
                let n, i;
                for (let r = 0; r < t.body.shapes.length; r++) n = t.body.shapes[r], n.halfExtents ? (n.halfExtents.scale(e, n.halfExtents), n.updateConvexPolyhedronRepresentation()) : n.radius ? (n.radius *= e, n.updateBoundingSphereRadius()) : this.shapeWarned || (console.warn("Unable to stretch physics body: unsupported shape"), this.shapeWarned = !0), i = t.body.shapeOffsets[r], i.scale(e, i);
                t.body.updateBoundingRadius()
            }
        }))
    }, function (t, e, n) {
        const i = AFRAME.utils.extendDeep,
            r = n(0);
        AFRAME.registerComponent("drag-droppable", i({}, r, {
            init: function () {
                console.warn("Warning: drag-droppable is deprecated. Use draggable and droppable components instead"), this.HOVERED_STATE = "dragover", this.DRAGGED_STATE = "dragged", this.HOVER_EVENT = "dragover-start", this.UNHOVER_EVENT = "dragover-end", this.DRAG_EVENT = "drag-start", this.UNDRAG_EVENT = "drag-end", this.DRAGDROP_EVENT = "drag-drop", this.hoverStart = this.hoverStart.bind(this), this.dragStart = this.dragStart.bind(this), this.hoverEnd = this.hoverEnd.bind(this), this.dragEnd = this.dragEnd.bind(this), this.dragDrop = this.dragDrop.bind(this), this.el.addEventListener(this.HOVER_EVENT, this.hoverStart), this.el.addEventListener(this.DRAG_EVENT, this.dragStart), this.el.addEventListener(this.UNHOVER_EVENT, this.hoverEnd), this.el.addEventListener(this.UNDRAG_EVENT, this.dragEnd), this.el.addEventListener(this.DRAGDROP_EVENT, this.dragDrop)
            },
            remove: function () {
                this.el.removeEventListener(this.HOVER_EVENT, this.hoverStart), this.el.removeEventListener(this.DRAG_EVENT, this.dragStart), this.el.removeEventListener(this.UNHOVER_EVENT, this.hoverEnd), this.el.removeEventListener(this.UNDRAG_EVENT, this.dragEnd), this.el.removeEventListener(this.DRAGDROP_EVENT, this.dragDrop)
            },
            hoverStart: function (t) {
                this.el.addState(this.HOVERED_STATE), t.preventDefault && t.preventDefault()
            },
            dragStart: function (t) {
                this.startButtonOk(t) && (this.el.addState(this.DRAGGED_STATE), t.preventDefault && t.preventDefault())
            },
            hoverEnd: function (t) {
                this.el.removeState(this.HOVERED_STATE)
            },
            dragEnd: function (t) {
                this.endButtonOk(t) && (this.el.removeState(this.DRAGGED_STATE), t.preventDefault && t.preventDefault())
            },
            dragDrop: function (t) {
                this.endButtonOk(t) && t.preventDefault && t.preventDefault()
            }
        }))
    }, function (t, e, n) {
        const i = AFRAME.utils.extendDeep,
            r = n(0);
        AFRAME.registerComponent("draggable", i({}, r, {
            init: function () {
                this.DRAGGED_STATE = "dragged", this.DRAG_EVENT = "drag-start", this.UNDRAG_EVENT = "drag-end", this.dragStartBound = this.dragStart.bind(this), this.dragEndBound = this.dragEnd.bind(this), this.el.addEventListener(this.DRAG_EVENT, this.dragStartBound), this.el.addEventListener(this.UNDRAG_EVENT, this.dragEndBound)
            },
            remove: function () {
                this.el.removeEventListener(this.DRAG_EVENT, this.dragStart), this.el.removeEventListener(this.UNDRAG_EVENT, this.dragEnd)
            },
            dragStart: function (t) {
                !t.defaultPrevented && this.startButtonOk(t) && (this.el.addState(this.DRAGGED_STATE), t.preventDefault && t.preventDefault())
            },
            dragEnd: function (t) {
                !t.defaultPrevented && this.endButtonOk(t) && (this.el.removeState(this.DRAGGED_STATE), t.preventDefault && t.preventDefault())
            }
        }))
    }, function (t, e) {
        AFRAME.registerComponent("droppable", {
            schema: {
                accepts: {
                    default: ""
                },
                autoUpdate: {
                    default: !0
                },
                acceptEvent: {
                    default: ""
                },
                rejectEvent: {
                    default: ""
                }
            },
            multiple: !0,
            init: function () {
                this.HOVERED_STATE = "dragover", this.HOVER_EVENT = "dragover-start", this.UNHOVER_EVENT = "dragover-end", this.DRAGDROP_EVENT = "drag-drop", this.hoverStartBound = this.hoverStart.bind(this), this.hoverEndBound = this.hoverEnd.bind(this), this.dragDropBound = this.dragDrop.bind(this), this.mutateAcceptsBound = this.mutateAccepts.bind(this), this.acceptableEntities = [], this.observer = new window.MutationObserver(this.mutateAcceptsBound), this.observerOpts = {
                    childList: !0,
                    subtree: !0
                }, this.el.addEventListener(this.HOVER_EVENT, this.hoverStartBound), this.el.addEventListener(this.UNHOVER_EVENT, this.hoverEndBound), this.el.addEventListener(this.DRAGDROP_EVENT, this.dragDropBound)
            },
            update: function () {
                this.data.accepts.length ? this.acceptableEntities = Array.prototype.slice.call(this.el.sceneEl.querySelectorAll(this.data.accepts)) : this.acceptableEntities = null, this.data.autoUpdate && null != this.acceptableEntities ? this.observer.observe(this.el.sceneEl, this.observerOpts) : this.observer.disconnect()
            },
            remove: function () {
                this.el.removeEventListener(this.HOVER_EVENT, this.hoverStartBound), this.el.removeEventListener(this.UNHOVER_EVENT, this.hoverEndBound), this.el.removeEventListener(this.DRAGDROP_EVENT, this.dragDropBound), this.observer.disconnect()
            },
            mutateAccepts: function (t) {
                const e = this.data.accepts;
                t.forEach(t => {
                    t.addedNodes.forEach(t => {
                        var n, i;
                        i = e, ((n = t).matches ? n.matches(i) : n.msMatchesSelector ? n.msMatchesSelector(i) : n.webkitMatchesSelector ? n.webkitMatchesSelector(i) : void 0) && this.acceptableEntities.push(t)
                    })
                })
            },
            entityAcceptable: function (t) {
                const e = this.acceptableEntities;
                if (null == e) return !0;
                for (let n of e)
                    if (n === t) return !0;
                return !1
            },
            hoverStart: function (t) {
                !t.defaultPrevented && this.entityAcceptable(t.detail.carried) && (this.el.addState(this.HOVERED_STATE), t.preventDefault && t.preventDefault())
            },
            hoverEnd: function (t) {
                t.defaultPrevented || this.el.removeState(this.HOVERED_STATE)
            },
            dragDrop: function (t) {
                if (t.defaultPrevented) return;
                const e = t.detail.dropped;
                this.entityAcceptable(e) ? (this.data.acceptEvent.length && this.el.emit(this.data.acceptEvent, {
                    el: e
                }), t.preventDefault && t.preventDefault()) : this.data.rejectEvent.length && this.el.emit(this.data.rejectEvent, {
                    el: e
                })
            }
        })
    }, function (t, e, n) {
        const i = n(0);
        AFRAME.registerComponent("clickable", AFRAME.utils.extendDeep({}, i, {
            schema: {
                onclick: {
                    type: "string"
                }
            },
            init: function () {
                this.CLICKED_STATE = "clicked", this.CLICK_EVENT = "grab-start", this.UNCLICK_EVENT = "grab-end", this.clickers = [], this.start = this.start.bind(this), this.end = this.end.bind(this), this.el.addEventListener(this.CLICK_EVENT, this.start), this.el.addEventListener(this.UNCLICK_EVENT, this.end)
            },
            remove: function () {
                this.el.removeEventListener(this.CLICK_EVENT, this.start), this.el.removeEventListener(this.UNCLICK_EVENT, this.end)
            },
            start: function (t) {
                !t.defaultPrevented && this.startButtonOk(t) && (this.el.addState(this.CLICKED_STATE), -1 === this.clickers.indexOf(t.detail.hand) && (this.clickers.push(t.detail.hand), t.preventDefault && t.preventDefault()))
            },
            end: function (t) {
                const e = this.clickers.indexOf(t.detail.hand);
                !t.defaultPrevented && this.endButtonOk(t) && (-1 !== e && this.clickers.splice(e, 1), this.clickers.length < 1 && this.el.removeState(this.CLICKED_STATE), t.preventDefault && t.preventDefault())
            }
        }))
    }, function (t, e) {
        AFRAME.registerComponent("vr-border", {
            schema: {
                width: {
                    type: "number"
                },
                color: {
                    type: "string"
                }
            },
            init: function () {
                this.running = !0;
                var t = this.el.object3D.children[0],
                    e = new THREE.EdgesGeometry(t.geometry),
                    n = new THREE.LineSegments(e, new THREE.LineBasicMaterial({
                        color: 0,
                        linewidth: this.data.width
                    }));
                this.borderObject = n, this.el.element.web2vr.aframe.container.object3D.add(this.borderObject), this.el.element.clippingContext && (n.material.clippingPlanes = this.el.element.clippingContext.planes, n.material.needsUpdate = !0)
            },
            update: function () {
                var t = this.data.width;
                this.el.element.borderWidth ? this.borderObject.material.linewidth = this.el.element.borderWidth : this.borderObject.material.linewidth = t, this.el.element.borderColor ? this.borderObject.material.color = this.el.element.borderColor : this.borderObject.material.color = new THREE.Color(this.data.color)
            },
            updateBorder: function () {
                this.el.element.visible ? (this.running = !0, this.borderObject.material.visible = !0) : this.borderObject.material.visible = !1
            },
            tick: function () {
                if (this.running) {
                    var t = this.el.object3D.scale,
                        e = this.el.object3D.children[0].geometry.clone();
                    e.scale(t.x, t.y, t.z);
                    var n = new THREE.EdgesGeometry(e),
                        i = this.el.object3D.position;
                    this.borderObject.geometry = n, this.borderObject.position.set(i.x, i.y, i.z + 2 * this.el.element.web2vr.settings.layerStep), this.running = !1
                }
            },
            remove: function () {
                this.el.element.web2vr.aframe.container.object3D.remove(this.borderObject)
            }
        })
    }, function (t, e) {
        AFRAME.registerComponent("vr-animate", {
            init: function () {
                this.running = !1, this.el.element.domElement.addEventListener("animationstart", this.startAnimation.bind(this)), this.el.element.domElement.addEventListener("animationend", this.stopAnimation.bind(this)), this.el.element.domElement.addEventListener("transitionstart", this.startAnimation.bind(this)), this.el.element.domElement.addEventListener("transitionend", this.stopAnimation.bind(this))
            },
            tick: function () {
                this.running && this.el.element.web2vr.update()
            },
            startAnimation: function () {
                this.running = !0
            },
            stopAnimation: function () {
                this.running = !1, this.el.element.web2vr.update()
            }
        })
    }, function (t, e) {
        function n(t, e) {
            var n;
            if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
                if (Array.isArray(t) || (n = function (t, e) {
                        if (!t) return;
                        if ("string" == typeof t) return i(t, e);
                        var n = Object.prototype.toString.call(t).slice(8, -1);
                        "Object" === n && t.constructor && (n = t.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(t);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return i(t, e)
                    }(t)) || e && t && "number" == typeof t.length) {
                    n && (t = n);
                    var r = 0,
                        s = function () {};
                    return {
                        s: s,
                        n: function () {
                            return r >= t.length ? {
                                done: !0
                            } : {
                                done: !1,
                                value: t[r++]
                            }
                        },
                        e: function (t) {
                            throw t
                        },
                        f: s
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }
            var o, a = !0,
                l = !1;
            return {
                s: function () {
                    n = t[Symbol.iterator]()
                },
                n: function () {
                    var t = n.next();
                    return a = t.done, t
                },
                e: function (t) {
                    l = !0, o = t
                },
                f: function () {
                    try {
                        a || null == n.return || n.return()
                    } finally {
                        if (l) throw o
                    }
                }
            }
        }

        function i(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
            return i
        }
        AFRAME.registerComponent("vr-grab-rotate-static", {
            tick: function () {
                if (this.el.components.grabbable.grabbed) {
                    if (this.el.web2vr.scroll.hasScroll) {
                        var t, e = n(this.el.web2vr.elements);
                        try {
                            for (e.s(); !(t = e.n()).done;) {
                                t.value.updateClipping()
                            }
                        } catch (t) {
                            e.e(t)
                        } finally {
                            e.f()
                        }
                    }
                    var i = this.el.object3D,
                        r = this.el.components.grabbable.grabbers[0].object3D;
                    i.rotation.y = Math.atan2(r.position.x - (i.position.x + this.el.children[0].getAttribute("width") / 2), r.position.z - i.position.z)
                }
            }
        })
    }, function (t, e) {
        function n(t) {
            return function (t) {
                if (Array.isArray(t)) return r(t)
            }(t) || function (t) {
                if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t)
            }(t) || i(t) || function () {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function i(t, e) {
            if (t) {
                if ("string" == typeof t) return r(t, e);
                var n = Object.prototype.toString.call(t).slice(8, -1);
                return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? r(t, e) : void 0
            }
        }

        function r(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
            return i
        }
        AFRAME.registerComponent("vr-scrollbar", {
            init: function () {
                this.el.addEventListener("click", function (t) {
                    var e = parseFloat(this.el.web2vr.aframe.container.firstElementChild.element.style.height) - this.el.web2vr.settings.scrollWindowHeight;
                    this.el.web2vr.scroll.scrollContainer == this.el.web2vr.container && (e = this.el.web2vr.scroll.scrollContainer.scrollHeight - this.el.web2vr.scroll.scrollContainer.clientHeight);
                    var r = (1 - t.detail.intersection.uv.y) * e / this.el.web2vr.settings.scale,
                        s = n(this.el.web2vr.elements);
                    s.shift(), this.el.pointer.object3D.position.setY(this.pointEndY + t.detail.intersection.uv.y * (this.pointStartY - this.pointEndY));
                    var o, a = function (t, e) {
                        var n;
                        if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
                            if (Array.isArray(t) || (n = i(t)) || e && t && "number" == typeof t.length) {
                                n && (t = n);
                                var r = 0,
                                    s = function () {};
                                return {
                                    s: s,
                                    n: function () {
                                        return r >= t.length ? {
                                            done: !0
                                        } : {
                                            done: !1,
                                            value: t[r++]
                                        }
                                    },
                                    e: function (t) {
                                        throw t
                                    },
                                    f: s
                                }
                            }
                            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                        }
                        var o, a = !0,
                            l = !1;
                        return {
                            s: function () {
                                n = t[Symbol.iterator]()
                            },
                            n: function () {
                                var t = n.next();
                                return a = t.done, t
                            },
                            e: function (t) {
                                l = !0, o = t
                            },
                            f: function () {
                                try {
                                    a || null == n.return || n.return()
                                } finally {
                                    if (l) throw o
                                }
                            }
                        }
                    }(s);
                    try {
                        for (a.s(); !(o = a.n()).done;) {
                            o.value.position.scrollY = r
                        }
                    } catch (t) {
                        a.e(t)
                    } finally {
                        a.f()
                    }
                    this.el.web2vr.update()
                }.bind(this))
            },
            play: function () {
                var t = parseFloat(this.el.web2vr.aframe.container.firstElementChild.getAttribute("width")),
                    e = parseFloat(this.el.web2vr.aframe.container.firstElementChild.getAttribute("height"));
                this.el.setAttribute("width", t / 20), this.el.setAttribute("height", e), this.el.scrollbar.object3D.position.setX(t + parseFloat(this.el.getAttribute("width") / 2)), this.el.scrollbar.object3D.position.setY(0 - e / 2), this.el.scrollbar.object3D.position.setZ(-4 * this.el.web2vr.settings.layerStep), this.el.pointer.setAttribute("height", t / 20), this.el.pointer.setAttribute("width", t / 20), this.pointStartY = e / 2 - parseFloat(this.el.pointer.getAttribute("height")) / 2, this.pointEndY = this.pointStartY - e + parseFloat(this.el.pointer.getAttribute("height")), this.el.pointer.object3D.position.setY(this.pointStartY), this.el.pointer.object3D.position.setZ(2 * this.el.web2vr.settings.layerStep)
            }
        })
    }, function (t, e) {
        AFRAME.registerComponent("vr-renderer", {
            init: function () {
                this.el.sceneEl.renderer.localClippingEnabled = !0
            }
        })
    }, function (t, e, n) {
        "use strict";
        n.r(e), n.d(e, "default", (function () {
            return Qt
        }));
        n(2);
        var i = n(1),
            r = n.n(i);
        n(3), n(4), n(5), n(6);
        var s = function t() {
            ! function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, t), this.scale = 600, this.position = {
                x: 0,
                y: 2,
                z: -1
            }, this.rotation = {
                x: 0,
                y: 0,
                z: 0
            }, this.layerStep = 5e-4, this.parentSelector = null, this.interactiveTag = "vr-interactable", this.ignoreTags = ["BR", "SOURCE", "SCRIPT", "AUDIO", "NOSCRIPT"], this.debug = !1, this.showClipping = !1, this.forceClipping = !1, this.experimental = !1, this.scroll = !0, this.scrollWindowHeight = 800, this.createControllers = !0, this.raycasterFar = 5, this.skybox = !0, this.border = !0
        };
        n(16), n(17), n(18), n(19);

        function o(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }
        var a = function () {
            function t(e) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.web2vr = e, this.hasScroll = !1, this.scrollBody = !1, this.scrollContainer = null, this.web2vr.settings.scroll && (this.checkScrollbar(), this.hasScroll && this.createScrollbar())
            }
            var e, n, i;
            return e = t, (n = [{
                key: "checkScrollbar",
                value: function () {
                    var t = document.scrollingElement,
                        e = this.web2vr.container;
                    t.scrollHeight > t.clientHeight ? (this.hasScroll = !0, this.scrollContainer = t, this.scrollBody = !0) : "scroll" == e.element.style.overflow && (this.hasScroll = !0, this.scrollContainer = e)
                }
            }, {
                key: "createScrollbar",
                value: function () {
                    this.scrollbar = document.createElement("a-entity"), this.pointer = document.createElement("a-plane"), this.pointer.setAttribute("material", "shader", "flat"), this.pointer.setAttribute("color", "#C1C1C1"), this.plane = document.createElement("a-plane"), this.plane.setAttribute("material", "shader", "flat"), this.plane.setAttribute("material", "side", "double"), this.plane.classList.add(this.web2vr.settings.interactiveTag), this.plane.setAttribute("color", "#F1F1F1"), this.plane.setAttribute("width", 1), this.plane.setAttribute("vr-scrollbar", ""), this.plane.web2vr = this.web2vr, this.plane.pointer = this.pointer, this.plane.scrollbar = this.scrollbar, this.plane.appendChild(this.pointer), this.scrollbar.appendChild(this.plane), this.web2vr.aframe.container.appendChild(this.scrollbar)
                }
            }, {
                key: "update",
                value: function () {
                    this.hasScroll && ("visible" == this.web2vr.container.element.style.visibility ? (this.scrollbar.object3D.visible = !0, this.plane.classList.add(this.web2vr.settings.interactiveTag)) : "hidden" == this.web2vr.container.element.style.visibility && (this.scrollbar.object3D.visible = !1, this.plane.classList.remove(this.web2vr.settings.interactiveTag)))
                }
            }]) && o(e.prototype, n), i && o(e, i), t
        }();

        function l(t, e) {
            var n;
            if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
                if (Array.isArray(t) || (n = function (t, e) {
                        if (!t) return;
                        if ("string" == typeof t) return c(t, e);
                        var n = Object.prototype.toString.call(t).slice(8, -1);
                        "Object" === n && t.constructor && (n = t.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(t);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return c(t, e)
                    }(t)) || e && t && "number" == typeof t.length) {
                    n && (t = n);
                    var i = 0,
                        r = function () {};
                    return {
                        s: r,
                        n: function () {
                            return i >= t.length ? {
                                done: !0
                            } : {
                                done: !1,
                                value: t[i++]
                            }
                        },
                        e: function (t) {
                            throw t
                        },
                        f: r
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }
            var s, o = !0,
                a = !1;
            return {
                s: function () {
                    n = t[Symbol.iterator]()
                },
                n: function () {
                    var t = n.next();
                    return o = t.done, t
                },
                e: function (t) {
                    a = !0, s = t
                },
                f: function () {
                    try {
                        o || null == n.return || n.return()
                    } finally {
                        if (a) throw s
                    }
                }
            }
        }

        function c(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
            return i
        }

        function u(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }
        var h = function () {
            function t(e) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var n = document.getElementsByTagName("a-assets")[0];
                n ? this.assets = n : (this.assets = document.createElement("a-assets"), e.appendChild(this.assets))
            }
            var e, n, i;
            return e = t, (n = [{
                key: "updateCurrentAssetId",
                value: function () {
                    var t = parseInt(this.assets.getAttribute("current-id"));
                    this.assets.getAttribute("current-id") || (this.assets.setAttribute("current-id", 0), t = 0), this.assets.setAttribute("current-id", t + 1)
                }
            }, {
                key: "updateCurrentAssetIdReturn",
                value: function () {
                    return this.updateCurrentAssetId(), "asset-" + this.assets.getAttribute("current-id")
                }
            }, {
                key: "getAsset",
                value: function (t, e) {
                    var n, i = l(this.assets.getChildren());
                    try {
                        for (i.s(); !(n = i.n()).done;) {
                            var r = n.value;
                            if (r.getAttribute("src") === t) return r.getAttribute("id")
                        }
                    } catch (t) {
                        i.e(t)
                    } finally {
                        i.f()
                    }
                    return this.createAsset(t, e)
                }
            }, {
                key: "createAsset",
                value: function (t, e) {
                    var n = document.createElement(e);
                    n.setAttribute("src", t), this.updateCurrentAssetId();
                    var i = "asset-" + this.assets.getAttribute("current-id");
                    return n.setAttribute("id", i), n.setAttribute("crossorigin", "Anonymous"), this.assets.appendChild(n), i
                }
            }, {
                key: "removeAsset",
                value: function (t) {
                    this.assets.querySelector("#" + t).remove()
                }
            }]) && u(e.prototype, n), i && u(e, i), t
        }();
        n(20);

        function d(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }
        var f = function () {
            function t(e) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.inVR = !1, this.settings = e, this.createScene(), this.assetManager = new h(this.scene)
            }
            var e, n, i;
            return e = t, (n = [{
                key: "createScene",
                value: function () {
                    var t = this,
                        e = document.getElementsByTagName("a-scene");
                    e.length > 0 ? this.scene = e[0] : (this.scene = document.createElement("a-scene"), document.body.appendChild(this.scene), this.newScene = !0), this.settings.debug && this.scene.setAttribute("stats", ""), this.scene.setAttribute("vr-renderer", ""), this.scene.addEventListener("enter-vr", function () {
                        t.inVR = !0
                    }.bind(this)), this.scene.addEventListener("exit-vr", function () {
                        t.inVR = !1
                    }.bind(this))
                }
            }, {
                key: "createContainer",
                value: function (t) {
                    this.container = document.createElement("a-entity"), this.container.classList.add("vr-container"), this.container.classList.add(this.settings.interactiveTag);
                    var e = parseFloat(window.getComputedStyle(t.container).width) * (1 / this.settings.scale),
                        n = this.settings.position.x;
                    0 == n && (n -= e / 2), this.container.object3D.position.set(n, this.settings.position.y, this.settings.position.z), this.container.setAttribute("rotation", {
                        x: this.settings.rotation.x,
                        y: this.settings.rotation.y,
                        z: this.settings.rotation.z
                    });
                    var i = document.querySelector(this.settings.parentSelector);
                    i ? i.appendChild(this.container) : (this.container.setAttribute("vr-grab-rotate-static", ""), this.container.setAttribute("grabbable", ""), this.container.setAttribute("stretchable", ""), this.scene.appendChild(this.container)), this.container.web2vr = t
                }
            }, {
                key: "createSky",
                value: function () {
                    0 == document.getElementsByTagName("a-sky").length && this.settings.skybox && (this.sky = document.createElement("a-sky"), this.sky.setAttribute("color", "#a9f8fe"), this.scene.appendChild(this.sky))
                }
            }, {
                key: "createControllers",
                value: function () {
                    var t = this;
                    if (!document.getElementById("mouseCursor")) {
                        var e = document.createElement("a-entity");
                        e.id = "mouseCursor", e.setAttribute("cursor", "rayOrigin", "mouse"), e.setAttribute("raycaster", "objects: .".concat(this.settings.interactiveTag, ", .collidable")), this.scene.appendChild(e)
                    }
                    if (this.settings.createControllers && !document.getElementById("leftHand")) {
                        var n = "objects: .".concat(this.settings.interactiveTag, ", .collidable; far: ").concat(this.settings.raycasterFar),
                            i = "colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent:raycaster-intersection-cleared; colliderEndEventProperty: clearedEls; grabStartButtons: gripdown; grabEndButtons: gripup; stretchStartButtons: gripdown; stretchEndButtons: gripup",
                            r = document.createElement("a-entity");
                        r.id = "leftHand", r.setAttribute("hand-controls", "hand:left; handModelStyle: highPoly; color: #ffcccc"), r.setAttribute("laser-controls", ""), r.setAttribute("raycaster", n), r.setAttribute("super-hands", i);
                        var s = document.createElement("a-entity");
                        s.id = "rightHand", s.setAttribute("hand-controls", "hand:right; handModelStyle: highPoly; color: #ffcccc"), s.setAttribute("laser-controls", ""), s.setAttribute("raycaster", n), s.setAttribute("super-hands", i), this.scene.appendChild(r), this.scene.appendChild(s)
                    }
                    this.keyboard = document.getElementById("vr-keyboard"), this.keyboard || (this.keyboard = document.createElement("a-entity"), this.keyboard.id = "vr-keyboard", this.keyboard.setAttribute("a-keyboard", ""), this.keyboard.setAttribute("grabbable", ""), this.scene.appendChild(this.keyboard), this.keyboard.object3D.visible = !1, this.keyboard.activeInput = null, document.addEventListener("a-keyboard-update", (function (e) {
                        if (t.keyboard.activeInput) {
                            var n = parseInt(e.detail.code),
                                i = t.keyboard.activeInput.value;
                            if (8 == n) i = i.slice(0, -1);
                            else {
                                if (6 == n || 24 == n) return t.keyboard.object3D.visible = !1, t.keyboard.object3D.position.y = 1e4, t.keyboard.activeInput.element.active = !1, t.keyboard.activeInput.element.update(), void(t.keyboard.activeInput = null);
                                [37, 38, 39, 40].includes(n) || (i += e.detail.value)
                            }
                            t.keyboard.activeInput.value = i, t.keyboard.activeInput.element.update()
                        }
                    })))
                }
            }]) && d(e.prototype, n), i && d(e, i), t
        }();

        function p(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }
        var v = function () {
            function t(e, n, i) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.depth = n, this.startDepth = n, this.scale = i, this.scrollY = 0, this.updatePosition(e)
            }
            var e, n, i;
            return e = t, (n = [{
                key: "updatePosition",
                value: function (t) {
                    this.domPosition = t, this.aframePosition = this.calculateAFramePosition(this.domPosition)
                }
            }, {
                key: "calculateAFramePosition",
                value: function (t) {
                    var e = {
                        x: t.x + t.width / 2,
                        y: t.y + t.height / 2,
                        z: this.depth
                    };
                    return e.x *= this.scalingFactor, e.y *= -1 * this.scalingFactor, e.width = t.width * this.scalingFactor, e.height = t.height * this.scalingFactor, e
                }
            }, {
                key: "equalsDOMPosition",
                value: function (t) {
                    return this.domPosition.top == t.top && this.domPosition.bottom == t.bottom && this.domPosition.left == t.left && this.domPosition.right == t.right
                }
            }, {
                key: "scalingFactor",
                get: function () {
                    return 1 / this.scale
                }
            }, {
                key: "x",
                get: function () {
                    return this.aframePosition.x
                }
            }, {
                key: "y",
                get: function () {
                    return this.aframePosition.y + this.scrollY
                }
            }, {
                key: "z",
                get: function () {
                    return this.aframePosition.z
                }
            }, {
                key: "width",
                get: function () {
                    return this.aframePosition.width
                }
            }, {
                key: "height",
                get: function () {
                    return this.aframePosition.height
                }
            }, {
                key: "xyz",
                get: function () {
                    return {
                        x: this.x,
                        y: this.y,
                        z: this.z
                    }
                }
            }, {
                key: "left",
                get: function () {
                    return {
                        x: this.x - this.width / 2,
                        y: this.y,
                        z: this.z
                    }
                }
            }, {
                key: "right",
                get: function () {
                    return {
                        x: this.x + this.width / 2,
                        y: this.y,
                        z: this.z
                    }
                }
            }, {
                key: "top",
                get: function () {
                    return {
                        x: this.x,
                        y: this.y + this.height / 2,
                        z: this.z
                    }
                }
            }, {
                key: "bottom",
                get: function () {
                    return {
                        x: this.x,
                        y: this.y - this.height / 2,
                        z: this.z
                    }
                }
            }]) && p(e.prototype, n), i && p(e, i), t
        }();

        function y(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }
        var b = function () {
            function t(e) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.element = e, this.listeningForMouseEvents = !1, this.resync(), this.checkEntityEvents()
            }
            var e, n, i;
            return e = t, (n = [{
                key: "resync",
                value: function () {
                    for (var t = ["click", "mouseenter", "mouseleave", "mousedown", "mouseup"], e = !1, n = 0, i = t; n < i.length; n++) {
                        var r = i[n];
                        if (this.element.domElement.eventListenerList && this.element.domElement.eventListenerList[r]) {
                            e = !0;
                            break
                        }
                    }
                    for (var s = !1, o = 0, a = ["onclick", "onmouseenter", "onmouseleave", "onmousedown", "onmouseup"]; o < a.length; o++) {
                        var l = a[o];
                        if (this.element.domElement[l]) {
                            s = !0;
                            break
                        }
                    }
                    e || s ? this.listeningForMouseEvents || (this.addMouseListeners(t), this.listeningForMouseEvents = !0) : this.listeningForMouseEvents && (this.removeMouseListeners(t), this.listeningForMouseEvents = !1)
                }
            }, {
                key: "mouseEventHandler",
                value: function (t) {
                    var e = new MouseEvent(t.type, {
                        view: window,
                        bubbles: !0,
                        cancelable: !0,
                        target: this.element.domElement
                    });
                    this.element.domElement.dispatchEvent(e)
                }
            }, {
                key: "addMouseListeners",
                value: function (t) {
                    var e = this;
                    t.forEach((function (t) {
                        e.element.entity.addEventListener(t, e.mouseEventHandler.bind(e))
                    }))
                }
            }, {
                key: "removeMouseListeners",
                value: function (t) {
                    var e = this;
                    t.forEach((function (t) {
                        e.element.entity.removeEventListener(t, e.mouseEventHandler.bind(e))
                    }))
                }
            }, {
                key: "checkEntityEvents",
                value: function () {
                    for (var t = 0, e = ["click", "mouseenter", "mouseleave", "mousedown", "mouseup"]; t < e.length; t++) {
                        var n = e[t];
                        if (this.element.entity.eventListenerList && this.element.entity.eventListenerList[n]) {
                            this.listeningForMouseEvents = !0;
                            break
                        }
                    }
                }
            }]) && y(e.prototype, n), i && y(e, i), t
        }();

        function m(t, e) {
            var n;
            if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
                if (Array.isArray(t) || (n = function (t, e) {
                        if (!t) return;
                        if ("string" == typeof t) return E(t, e);
                        var n = Object.prototype.toString.call(t).slice(8, -1);
                        "Object" === n && t.constructor && (n = t.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(t);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return E(t, e)
                    }(t)) || e && t && "number" == typeof t.length) {
                    n && (t = n);
                    var i = 0,
                        r = function () {};
                    return {
                        s: r,
                        n: function () {
                            return i >= t.length ? {
                                done: !0
                            } : {
                                done: !1,
                                value: t[i++]
                            }
                        },
                        e: function (t) {
                            throw t
                        },
                        f: r
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }
            var s, o = !0,
                a = !1;
            return {
                s: function () {
                    n = t[Symbol.iterator]()
                },
                n: function () {
                    var t = n.next();
                    return o = t.done, t
                },
                e: function (t) {
                    a = !0, s = t
                },
                f: function () {
                    try {
                        o || null == n.return || n.return()
                    } finally {
                        if (a) throw s
                    }
                }
            }
        }

        function E(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
            return i
        }

        function g(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }
        var w = function () {
            function t(e, n, i) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.web2vr = e, this.domElement = n, this.layer = i, this.domElement.element = this, this.childElements = new Set, this.entity = null, this.visible = !0, this.domElement.classList.contains("vr-span") && this.paddingToMargin(), this.position = new v(this.domElement.getBoundingClientRect(), i * this.web2vr.settings.layerStep, e.settings.scale), this.style = window.getComputedStyle(this.domElement), this.parentTransform = "none", this.needsStartingTransformSize = !0
            }
            var e, n, i;
            return e = t, (n = [{
                key: "initEventHandlers",
                value: function () {
                    var t = this;
                    this.initHover(), this.mouseEventHandle = new b(this), this.domElement.addEventListener("eventListenerAdded", (function () {
                        return t.mouseEventHandle.resync()
                    })), this.domElement.addEventListener("eventListenerRemoved", (function () {
                        return t.mouseEventHandle.resync()
                    }))
                }
            }, {
                key: "checkAnimation",
                value: function () {
                    parseFloat(this.style.animationDuration) || parseFloat(this.style.transitionDuration) ? this.entity.setAttribute("vr-animate", "") : this.entity.removeAttribute("vr-animate")
                }
            }, {
                key: "initHover",
                value: function () {
                    var t = this,
                        e = null;
                    this.web2vr.hoverSelectors.has(this.domElement.tagName.toLowerCase()) && (e = this.domElement.tagName.toLowerCase());
                    var n, i = [],
                        r = m(this.domElement.classList);
                    try {
                        for (r.s(); !(n = r.n()).done;) {
                            var s = n.value;
                            this.web2vr.hoverSelectors.has("." + s) && i.push(s)
                        }
                    } catch (t) {
                        r.e(t)
                    } finally {
                        r.f()
                    }
                    var o = null;
                    this.web2vr.hoverSelectors.has("#" + this.domElement.id) && (o = this.domElement.id), (e || i.length > 0 || o) && (this.entity.addEventListener("mouseenter", (function () {
                        if (e && t.domElement.classList.add(e + "hover"), i.length > 0) {
                            var n, r = m(i);
                            try {
                                for (r.s(); !(n = r.n()).done;) {
                                    var s = n.value;
                                    t.domElement.classList.add(s + "hover")
                                }
                            } catch (t) {
                                r.e(t)
                            } finally {
                                r.f()
                            }
                        }
                        o && t.domElement.classList.add(o + "hover"), "none" != t.style.transform && (t.web2vr.update(), t.hoverTransform = !0)
                    })), this.entity.addEventListener("mouseleave", (function () {
                        if (e && t.domElement.classList.remove(e + "hover"), i.length > 0) {
                            var n, r = m(i);
                            try {
                                for (r.s(); !(n = r.n()).done;) {
                                    var s = n.value;
                                    t.domElement.classList.remove(s + "hover")
                                }
                            } catch (t) {
                                r.e(t)
                            } finally {
                                r.f()
                            }
                        }
                        if (o && t.domElement.classList.remove(o + "hover"), t.hoverTransform) {
                            t.position.depth = t.position.startDepth;
                            var a, l = m(t.domElement.querySelectorAll("*"));
                            try {
                                for (l.s(); !(a = l.n()).done;) {
                                    var c = a.value;
                                    c.element && (c.element.parentTransform = "none", c.element.position.depth = c.element.position.startDepth)
                                }
                            } catch (t) {
                                l.e(t)
                            } finally {
                                l.f()
                            }
                        }
                    })))
                }
            }, {
                key: "paddingToMargin",
                value: function () {
                    if (this.domElement.textContent.trim()) {
                        // var t = this.domElement.parentElement.element.style.paddingRight;
                        // parseFloat(t) && (this.domElement.style.marginRight = t, this.domElement.parentElement.style.paddingRight = "0px")
                    }
                }
            }, {
                key: "init",
                value: function () {
                    this.entity.element = this, this.entity.setAttribute("material", "shader", "flat"), this.entity.setAttribute("width", this.position.width), this.entity.setAttribute("height", this.position.height), this.initEventHandlers(), this.setupClipping()
                }
            }, {
                key: "update",
                value: function () {
                    var t = this.domElement.getBoundingClientRect();
                    if (0 == t.width || 0 == t.height) return this.entity.object3D.visible = !1, this.domElement.classList.contains("vr-span") || this.entity.classList.remove(this.web2vr.settings.interactiveTag), void(this.position.aframePosition.y = 1e3);
                    if (this.domElement.classList.contains("vr-span") && (this.entity.classList.remove(this.web2vr.settings.interactiveTag), "BUTTON" != this.domElement.parentElement.tagName && (t.width += 8, t.x -= 2)), this.web2vr.scroll.hasScroll && this.domElement == this.web2vr.container && this.web2vr.scroll.scrollBody && (t.height = this.web2vr.settings.scrollWindowHeight), this.position.updatePosition(t), this.checkVisible(), this.visible) {
                        if (this.style = window.getComputedStyle(this.domElement), "hidden" === this.style.visibility || "none" === this.style.display) return this.entity.object3D.visible = !1, this.domElement.classList.contains("vr-span") || this.entity.classList.remove(this.web2vr.settings.interactiveTag), this.position.aframePosition.y = 1e3, void this.updateBorder();
                        this.entity.object3D.visible = !0, (!this.domElement.classList.contains("vr-span") && (this.mouseEventHandle.listeningForMouseEvents || "INPUT" == this.domElement.tagName && "text" == this.domElement.type) || this.domElement == this.web2vr.container) && this.entity.classList.add(this.web2vr.settings.interactiveTag), ("none" == this.style.transform || this.needsStartingTransformSize) && (this.entity.setAttribute("width", this.position.width), this.entity.setAttribute("height", this.position.height)), this.checkAnimation();
                        var e = this.style.opacity;
                        this.entity.setAttribute("opacity", e), this.specificUpdate(), this.updateTransform(), this.updateClipping()
                    }
                    this.updateBorder()
                }
            }, {
                key: "updateTransform",
                value: function () {
                    var t = this.style.transform;
                    if ("none" == t) t = this.parentTransform;
                    else {
                        var e, n = m(this.domElement.querySelectorAll("*"));
                        try {
                            for (n.s(); !(e = n.n()).done;) {
                                var i = e.value;
                                i.element && (i.element.parentTransform = t)
                            }
                        } catch (t) {
                            n.e(t)
                        } finally {
                            n.f()
                        }
                    }
                    if ("none" != t) {
                        this.needsStartingTransformSize = !1;
                        var r = t.split("(")[0],
                            s = t.split("(")[1];
                        s = (s = (s = s.split(")")[0]).split(",")).map((function (t) {
                            return parseFloat(t)
                        }));
                        var o = null;
                        "matrix" == r ? o = (new THREE.Matrix4).fromArray([s[0], s[1], 0, 0, -s[2], s[3], 0, 0, 0, 0, 1, 0, s[4], s[5], 0, 1]) : "matrix3d" == r && (s[4] *= -1, s[9] *= -1, o = (new THREE.Matrix4).fromArray(s));
                        var a = new THREE.Vector3,
                            l = new THREE.Quaternion,
                            c = new THREE.Vector3;
                        if (o.decompose(a, l, c), this.position.domPosition.x += a.x, this.position.domPosition.y += a.y, 0 != a.z && (this.position.depth = a.z * this.position.scalingFactor + this.position.startDepth), this.entity.object3D.rotation.setFromRotationMatrix(o), "none" == this.parentTransform) {
                            var u = o.elements,
                                h = Math.sqrt(u[0] * u[0] + u[1] * u[1]),
                                d = Math.sqrt(u[5] * u[5] + u[4] * u[4]);
                            "INPUT" != this.domElement.tagName || "radio" != this.domElement.type && "checkbox" != this.domElement.type ? this.entity.object3D.scale.set(h, d, 1) : this.entity.object3D.scale.set(h / 2, d / 2, 1)
                        }
                    }
                    this.entity.object3D.position.set(this.position.x, this.position.y, this.position.z)
                }
            }, {
                key: "specificUpdate",
                value: function () {}
            }, {
                key: "updateBorder",
                value: function () {
                    if (this.web2vr.settings.border) {
                        var t = parseFloat(this.style.borderTopWidth);
                        (t || this.borderWidth) && this.entity.object3D.visible ? (this.entity.setAttribute("vr-border", "width:".concat(t, "; color:").concat(this.style.borderTopColor, ";")), this.entity.components["vr-border"].updateBorder()) : this.entity.components["vr-border"] && this.entity.removeAttribute("vr-border")
                    }
                }
            }, {
                key: "rotateNormal",
                value: function (t) {
                    var e = (new THREE.Matrix3).getNormalMatrix(this.web2vr.aframe.container.object3D.matrixWorld);
                    return t.clone().applyMatrix3(e).normalize()
                }
            }, {
                key: "getClippingContext",
                value: function () {
                    var t = null;
                    if (this.domElement.parentNode && this.domElement.parentNode.element && this.domElement.parentNode.element.clippingContext) t = this.domElement.parentNode.element.clippingContext;
                    else if ((this.style.overflow && "hidden" == this.style.overflow || this.web2vr.scroll.hasScroll && this.domElement == this.web2vr.container || this.web2vr.settings.forceClipping && this.domElement == this.web2vr.container) && "svg" != this.domElement.tagName) {
                        var e = {};
                        e.authority = this, e.bottom = new THREE.Plane(this.rotateNormal(new THREE.Vector3(0, 1, 0))), e.top = new THREE.Plane(this.rotateNormal(new THREE.Vector3(0, -1, 0))), e.left = new THREE.Plane(this.rotateNormal(new THREE.Vector3(1, 0, 0))), e.right = new THREE.Plane(this.rotateNormal(new THREE.Vector3(-1, 0, 0))), e.planes = [e.bottom, e.top, e.left, e.right], t = e
                    }
                    return t
                }
            }, {
                key: "setupClipping",
                value: function () {
                    var t = this,
                        e = this.getClippingContext();
                    if (e) {
                        this.clippingContext = e;
                        var n = this.entity.object3D;
                        if (!n || !n.children || !n.children.length > 0 || !n.children[0].material) return;
                        n.children[0].material.clippingPlanes = e.planes, setTimeout((function () {
                            t.updateClipping()
                        }), 200)
                    }
                }
            }, {
                key: "updateClipping",
                value: function () {
                    if (this.clippingContext && this.clippingContext.authority == this) {
                        var t = this.entity.object3D.position,
                            e = t.clone().add(new THREE.Vector3(0, -1, 0).multiplyScalar(this.position.height / 2)),
                            n = t.clone().add(new THREE.Vector3(0, 1, 0).multiplyScalar(this.position.height / 2)),
                            i = t.clone().add(new THREE.Vector3(-1, 0, 0).multiplyScalar(this.position.width / 2)),
                            r = t.clone().add(new THREE.Vector3(1, 0, 0).multiplyScalar(this.position.width / 2)),
                            s = this.web2vr.aframe.container.object3D.localToWorld(e.clone()),
                            o = this.web2vr.aframe.container.object3D.localToWorld(n.clone()),
                            a = this.web2vr.aframe.container.object3D.localToWorld(i.clone()),
                            l = this.web2vr.aframe.container.object3D.localToWorld(r.clone());
                        if (this.clippingContext.bottom.setFromNormalAndCoplanarPoint(this.rotateNormal(new THREE.Vector3(0, 1, 0)), s).normalize(), this.clippingContext.top.setFromNormalAndCoplanarPoint(this.rotateNormal(new THREE.Vector3(0, -1, 0)), o).normalize(), this.clippingContext.left.setFromNormalAndCoplanarPoint(this.rotateNormal(new THREE.Vector3(1, 0, 0)), a).normalize(), this.clippingContext.right.setFromNormalAndCoplanarPoint(this.rotateNormal(new THREE.Vector3(-1, 0, 0)), l).normalize(), this.web2vr.settings.showClipping) {
                            if (!this.clippingPlaneHelpers) {
                                this.clippingPlaneHelpers = [];
                                var c, u = m(this.clippingContext.planes);
                                try {
                                    for (u.s(); !(c = u.n()).done;) {
                                        var h = c.value,
                                            d = new THREE.MeshBasicMaterial({
                                                color: 58173,
                                                side: THREE.DoubleSide
                                            }),
                                            f = new THREE.PlaneGeometry(200 * this.position.scalingFactor, 200 * this.position.scalingFactor),
                                            p = new THREE.Mesh(f, d);
                                        p.debugPlane = h, this.clippingPlaneHelpers.push(p);
                                        var v = new THREE.AxesHelper(5);
                                        p.add(v)
                                    }
                                } catch (t) {
                                    u.e(t)
                                } finally {
                                    u.f()
                                }
                                var y, b = m(this.clippingPlaneHelpers);
                                try {
                                    for (b.s(); !(y = b.n()).done;) {
                                        var E = y.value;
                                        this.web2vr.aframe.scene.object3D.add(E)
                                    }
                                } catch (t) {
                                    b.e(t)
                                } finally {
                                    b.f()
                                }
                            }
                            var g, w = m(this.clippingPlaneHelpers);
                            try {
                                for (w.s(); !(g = w.n()).done;) {
                                    var _ = g.value;
                                    _.visible = !0;
                                    var A = new THREE.Vector3;
                                    this.entity.object3D.getWorldPosition(A);
                                    var T = new THREE.Vector3;
                                    _.debugPlane.projectPoint(A, T), _.position.set(T.x, T.y, T.z);
                                    var S = T.clone().add(_.debugPlane.normal.clone().multiplyScalar(-1));
                                    _.lookAt(S)
                                }
                            } catch (t) {
                                w.e(t)
                            } finally {
                                w.f()
                            }
                        } else if (this.clippingPlaneHelpers) {
                            var R, O = m(this.clippingPlaneHelpers);
                            try {
                                for (O.s(); !(R = O.n()).done;) R.value.visible = !1
                            } catch (t) {
                                O.e(t)
                            } finally {
                                O.f()
                            }
                        }
                    }
                }
            }, {
                key: "checkVisible",
                value: function () {
                    if (this.clippingContext) {
                        var t = this.clippingContext.authority;
                        this.position.bottom.y > t.position.top.y || this.position.top.y < t.position.bottom.y ? (this.visible = !1, this.entity.object3D.visible = !1, this.domElement.classList.contains("vr-span") || this.entity.classList.remove(this.web2vr.settings.interactiveTag)) : (this.visible = !0, this.entity.object3D.visible = !0, (!this.domElement.classList.contains("vr-span") && this.mouseEventHandle.listeningForMouseEvents || this.domElement == this.web2vr.container) && this.entity.classList.add(this.web2vr.settings.interactiveTag))
                    }
                }
            }]) && g(e.prototype, n), i && g(e, i), t
        }();

        function _(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }
        var A = function () {
            function t() {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t)
            }
            var e, n, i;
            return e = t, i = [{
                key: "isUrl",
                value: function (t) {
                    return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(t)
                }
            }, {
                key: "clamp",
                value: function (t, e, n) {
                    return Math.min(n, Math.max(e, t))
                }
            }], (n = null) && _(e.prototype, n), i && _(e, i), t
        }();

        function T(t) {
            return (T = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function S(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function R(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function O(t, e) {
            return (O = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function k(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = D(t);
                if (e) {
                    var r = D(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return C(this, n)
            }
        }

        function C(t, e) {
            return !e || "object" !== T(e) && "function" != typeof e ? function (t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function D(t) {
            return (D = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var x = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && O(t, e)
            }(s, t);
            var e, n, i, r = k(s);

            function s(t, e, n) {
                var i, o = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                return S(this, s), (i = r.call(this, t, e, n)).textOnly = o, i.entity = document.createElement("a-plane"), "A" == i.domElement.tagName && i.entity.addEventListener("click", (function () {
                    console.log("Link clicked!", i.domElement.click())
                })), i.textOnly || (i.domElement == i.web2vr.container && i.entity.setAttribute("material", "side", "double"), i.expImageId = null, i.oldBackgroundImage = null, i.oldDomPosition = null), i
            }
            return e = s, (n = [{
                key: "specificUpdate",
                value: function () {
                    var t = this;
                    if (!this.textOnly) {
                        var e = this.style.backgroundColor,
                            n = this.style.backgroundImage;
                        if ("none" != n)
                            if (this.web2vr.settings.experimental) {
                                if (n != this.oldBackgroundImage || this.oldDomPosition && !this.position.equalsDOMPosition(this.oldDomPosition)) {
                                    var i = this.domElement.id,
                                        r = !1;
                                    i || (r = !0, i = "html2canvas-" + this.web2vr.html2canvasIDcounter++, this.domElement.id = i), html2canvas(this.domElement, {
                                        onclone: function (e) {
                                            var n = document.createElement("style");
                                            e.head.appendChild(n), n.sheet.insertRule("\n                    #".concat(i, " {\n                        opacity: 1;\n                    }")), n.sheet.insertRule("\n                    #".concat(i, " {\n                        color: transparent;\n                    }")), n.sheet.insertRule("\n                    #".concat(i, " > * {\n                        display:none\n                    }")), n.sheet.insertRule("\n                    #".concat(i, " > .vr-span {\n                        display:block\n                    }")), r && t.domElement.removeAttribute("id")
                                        }
                                    }).then((function (e) {
                                        t.expImageId && t.web2vr.aframe.assetManager.removeAsset(t.expImageId), t.expImageId = t.web2vr.aframe.assetManager.getAsset(e.toDataURL(), "img"), t.entity.setAttribute("material", "src: #" + t.expImageId)
                                    })), this.oldBackgroundImage = n
                                }
                            } else A.isUrl(n) && (n = n.substring(n.lastIndexOf('("') + 2, n.lastIndexOf('")')), this.entity.setAttribute("material", "src: #" + this.web2vr.aframe.assetManager.getAsset(n, "img")), this.entity.setAttribute("material", "transparent", !0));
                        else "rgba(0, 0, 0, 0)" == e ? this.entity.setAttribute("material", "visible", !1) : (this.entity.setAttribute("material", "visible", !0), this.entity.setAttribute("color", e), this.updateOpacity());
                        this.oldDomPosition = this.position.domPosition
                    }
                }
            }, {
                key: "updateOpacity",
                value: function () {
                    var t = parseFloat(this.style.backgroundColor.split(",")[3]);
                    if (t) {
                        var e = t,
                            n = this.style.opacity;
                        e < n && (n = t, e = this.style.opacity), this.entity.setAttribute("opacity", e - (e - n))
                    }
                }
            }]) && R(e.prototype, n), i && R(e, i), s
        }(w);

        function P(t) {
            return (P = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function N(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function L(t, e, n) {
            return (L = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) {
                var i = function (t, e) {
                    for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = B(t)););
                    return t
                }(t, e);
                if (i) {
                    var r = Object.getOwnPropertyDescriptor(i, e);
                    return r.get ? r.get.call(n) : r.value
                }
            })(t, e, n || t)
        }

        function j(t, e) {
            return (j = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function V(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = B(t);
                if (e) {
                    var r = B(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return H(this, n)
            }
        }

        function H(t, e) {
            return !e || "object" !== P(e) && "function" != typeof e ? function (t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function B(t) {
            return (B = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var M = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && j(t, e)
            }(s, t);
            var e, n, i, r = V(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n, !1)).entity.setAttribute("text", "value", ""), i.textValue = null, i
            }
            return e = s, (n = [{
                key: "setupClipping",
                value: function () {
                    var t = this.getClippingContext();
                    if (t) {
                        this.clippingContext = t;
                        var e = this.entity.components.text.material;
                        e.fragmentShader = "#version 300 es\n            precision highp float;\n            uniform bool negate;\n            uniform float alphaTest;\n            uniform float opacity;\n            uniform sampler2D map;\n            uniform vec3 color;\n            in vec2 vUV;\n            out vec4 fragColor;\n            float median(float r, float g, float b) {\n                return max(min(r, g), min(max(r, g), b));\n            }\n            #define BIG_ENOUGH 0.001\n            #define MODIFIED_ALPHATEST (0.02 * isBigEnough / BIG_ENOUGH)\n            \n            // clipping_planes_pars_fragment converted to glsl 3\n            #if NUM_CLIPPING_PLANES > 0\n                in vec3 vClipPosition;\n                uniform vec4 clippingPlanes[NUM_CLIPPING_PLANES];\n            #endif\n            \n            void main() {\n                // compatible with glsl 3\n                #include <clipping_planes_fragment>\n\n                vec3 sampleColor = texture(map, vUV).rgb;\n                if (negate) { sampleColor = 1.0 - sampleColor; }\n                float sigDist = median(sampleColor.r, sampleColor.g, sampleColor.b) - 0.5;\n                float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);\n                float dscale = 0.353505;\n                vec2 duv = dscale * (dFdx(vUV) + dFdy(vUV));\n                float isBigEnough = max(abs(duv.x), abs(duv.y));\n                // Do modified alpha test.\n                if (isBigEnough > BIG_ENOUGH) {\n                    float ratio = BIG_ENOUGH / isBigEnough;\n                    alpha = ratio * alpha + (1.0 - ratio) * (sigDist + 0.5);\n                }\n                // Do modified alpha test.\n                if (alpha < alphaTest * MODIFIED_ALPHATEST) { discard; return; }\n                fragColor = vec4(color.xyz, alpha * opacity);\n            }", e.vertexShader = "#version 300 es\n            in vec2 uv;\n            in vec3 position;\n            uniform mat4 projectionMatrix;\n            uniform mat4 modelViewMatrix;\n            out vec2 vUV;\n\n            // clipping_planes_pars_vertex converted to glsl 3\n            #if NUM_CLIPPING_PLANES > 0\n\t            out vec3 vClipPosition;\n            #endif\n\n            void main(void) {\n                // compatible with glsl 3\n                #include <begin_vertex>\n\n                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                vUV = uv;\n\n                // compatible with glsl 3\n                #include <project_vertex>\n                #include <clipping_planes_vertex>\n\n            }", e.clipping = !0, e.clippingPlanes = t.planes, this.updateClipping()
                    }
                }
            }, {
                key: "updateTextAlignment",
                value: function () {
                    var t = this.style.textAlign;
                    ["left", "right", "center"].includes(t) || (t = "left"), this.entity.setAttribute("text", "align", t);
                    var e = this.entity.components.text;
                    "normal" != this.style.lineHeight && void 0 !== e.currentFont && this.entity.setAttribute("text", "lineHeight", e.currentFont.common.lineHeight + parseFloat(this.style.lineHeight))
                }
            }, {
                key: "updateTextSize",
                value: function () {
                    var t = parseFloat(this.style.fontSize),
                        e = this.position.width,
                        n = e / this.position.scalingFactor * 42 / t;
                    n *= 1.107, this.entity.setAttribute("text", "wrapPixels", n), this.entity.setAttribute("text", "width", e)
                }
            }, {
                key: "updateTextColor",
                value: function () {
                    var t = this.domElement.parentElement.element.style.opacity;
                    this.entity.setAttribute("text", "opacity", t);
                    var e = this.style.color;
                    this.entity.setAttribute("text", "color", e)
                }
            }, {
                key: "updateText",
                value: function () {
                    this.textValue = this.domElement.textContent.replace(/\s{2,}/g, " ")
                }
            }, {
                key: "specificUpdate",
                value: function () {
                    L(B(s.prototype), "specificUpdate", this).call(this), this.updateTextSize(), this.updateTextAlignment(), this.updateText(), this.entity.setAttribute("text", "value", this.textValue), this.updateTextColor()
                }
            }]) && N(e.prototype, n), i && N(e, i), s
        }(x);

        function I(t) {
            return (I = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function G(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function F(t, e) {
            return (F = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function U(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = W(t);
                if (e) {
                    var r = W(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return z(this, n)
            }
        }

        function z(t, e) {
            return !e || "object" !== I(e) && "function" != typeof e ? function (t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function W(t) {
            return (W = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var K = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && F(t, e)
            }(s, t);
            var e, n, i, r = U(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n)).currentSrc = null, i.changed = !1, i.entity = document.createElement("a-image"), i.entity.setAttribute("material", "side", "front"), i.loaded = !1, i.domElement.addEventListener("load", (function () {
                    i.loaded = !0, i.changed && (i.changed = !1, i.web2vr.update())
                })), i
            }
            return e = s, (n = [{
                key: "updateImage",
                value: function (t) {
                    var e = this.web2vr.aframe.assetManager.getAsset(t, "img");
                    this.entity.setAttribute("id", "IMAGE_" + e), /\.(gif)$/i.test(t) ? (this.entity.setAttribute("material", "shader", "gif"), this.entity.setAttribute("material", "src", "#" + e)) : (this.entity.setAttribute("material", "shader", "flat"), this.entity.setAttribute("src", "#" + e))
                }
            }, {
                key: "specificUpdate",
                value: function () {
                    var t = this.domElement.getAttribute("src");
                    t != this.currentSrc && (this.currentSrc && (this.loaded = !1, this.changed = !0), this.currentSrc = t, this.updateImage(this.currentSrc))
                }
            }]) && G(e.prototype, n), i && G(e, i), s
        }(w);

        function q(t) {
            return (q = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function Y(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function $(t, e) {
            return ($ = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function X(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = Z(t);
                if (e) {
                    var r = Z(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return Q(this, n)
            }
        }

        function Q(t, e) {
            return !e || "object" !== q(e) && "function" != typeof e ? function (t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function Z(t) {
            return (Z = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var J = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && $(t, e)
            }(s, t);
            var e, n, i, r = X(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n)).entity = document.createElement("a-video"), i.video360 = document.createElement("a-videosphere"), i.web2vr.aframe.scene.appendChild(i.video360), i.createClickEvent(), i.domElement.addEventListener("play", (function () {
                    i.domElement.hasAttribute("vr") && i.video360.components.material.material.map.image.play()
                })), i.domElement.addEventListener("pause", (function () {
                    i.domElement.hasAttribute("vr") && i.video360.components.material.material.map.image.pause()
                })), i
            }
            return e = s, (n = [{
                key: "createClickEvent",
                value: function () {
                    var t = this;
                    this.domElement.addEventListener("click", (function () {
                        t.domElement.paused ? t.domElement.play() : t.domElement.pause()
                    }))
                }
            }, {
                key: "specificUpdate",
                value: function () {
                    this.domElement.currentSrc;
                    var t = this.domElement.id;
                    if (t || (t = this.web2vr.aframe.assetManager.updateCurrentAssetIdReturn(), this.domElement.id = t), this.domElement.hasAttribute("vr")) {
                        this.video360.object3D.visible = !0, this.video360.classList.add(this.web2vr.settings.interactiveTag), this.entity.object3D.visible = !1, this.entity.classList.remove(this.web2vr.settings.interactiveTag), this.video360.setAttribute("src", "#" + t);
                        var e = this.domElement.getAttribute("vr");
                        this.video360.object3D.rotation.y = e ? THREE.Math.degToRad(e) : 0
                    } else this.video360.object3D.visible = !1, this.video360.classList.remove(this.web2vr.settings.interactiveTag), this.entity.object3D.visible = !0, this.entity.classList.add(this.web2vr.settings.interactiveTag), this.entity.setAttribute("src", "#" + t)
                }
            }]) && Y(e.prototype, n), i && Y(e, i), s
        }(w);

        function tt(t) {
            return (tt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function et(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function nt(t, e) {
            return (nt = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function it(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = ot(t);
                if (e) {
                    var r = ot(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return rt(this, n)
            }
        }

        function rt(t, e) {
            return !e || "object" !== tt(e) && "function" != typeof e ? st(t) : e
        }

        function st(t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }

        function ot(t) {
            return (ot = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var at = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && nt(t, e)
            }(s, t);
            var e, n, i, r = it(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n)).borderColor = new THREE.Color(0), i.borderWidth = 1, i.entity = document.createElement("a-plane"), i.domElement.addEventListener("click", function () {
                    i.specificUpdate()
                }.bind(st(i))), i
            }
            return e = s, (n = [{
                key: "specificUpdate",
                value: function () {
                    this.domElement.checked ? this.entity.setAttribute("color", "#0075FF") : this.entity.setAttribute("color", "#FFFFFF")
                }
            }]) && et(e.prototype, n), i && et(e, i), s
        }(w);

        function lt(t) {
            return (lt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function ct(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function ut(t, e) {
            return (ut = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function ht(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = pt(t);
                if (e) {
                    var r = pt(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return dt(this, n)
            }
        }

        function dt(t, e) {
            return !e || "object" !== lt(e) && "function" != typeof e ? ft(t) : e
        }

        function ft(t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }

        function pt(t) {
            return (pt = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var vt = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && ut(t, e)
            }(s, t);
            var e, n, i, r = ht(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n)).borderColor = new THREE.Color(0), i.borderWidth = 1, i.entity = document.createElement("a-circle"), i.domElement.addEventListener("click", function () {
                    i.web2vr.update()
                }.bind(ft(i))), i
            }
            return e = s, (n = [{
                key: "specificUpdate",
                value: function () {
                    this.entity.setAttribute("radius", this.position.width / 2), this.domElement.checked ? this.entity.setAttribute("color", "#0075FF") : this.entity.setAttribute("color", "#FFFFFF")
                }
            }]) && ct(e.prototype, n), i && ct(e, i), s
        }(w);

        function yt(t) {
            return (yt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function bt(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function mt(t, e, n) {
            return (mt = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) {
                var i = function (t, e) {
                    for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = _t(t)););
                    return t
                }(t, e);
                if (i) {
                    var r = Object.getOwnPropertyDescriptor(i, e);
                    return r.get ? r.get.call(n) : r.value
                }
            })(t, e, n || t)
        }

        function Et(t, e) {
            return (Et = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function gt(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = _t(t);
                if (e) {
                    var r = _t(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return wt(this, n)
            }
        }

        function wt(t, e) {
            return !e || "object" !== yt(e) && "function" != typeof e ? function (t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function _t(t) {
            return (_t = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var At = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && Et(t, e)
            }(s, t);
            var e, n, i, r = gt(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n)).borderColor = new THREE.Color(0), i.borderWidth = 1, i.active = !1, i.domElement.addEventListener("input", (function () {
                    return i.update()
                })), i.entity.addEventListener("click", (function () {
                    var t = i.web2vr.aframe.scene.camera.parent,
                        e = i.web2vr.aframe.keyboard.object3D;
                    e.position.copy(t.position), e.rotation.copy(t.rotation), e.rotation.z = 0, e.rotation.x = THREE.Math.degToRad(-30), e.translateX(-.24), e.translateY(-.1), e.translateZ(-.6), e.visible = !0, i.web2vr.aframe.keyboard.activeInput && (i.web2vr.aframe.keyboard.activeInput.element.active = !1, i.web2vr.aframe.keyboard.activeInput.element.web2vr.update()), i.active = !0, i.web2vr.aframe.keyboard.activeInput = i.domElement, i.web2vr.update()
                })), i
            }
            return e = s, (n = [{
                key: "updateText",
                value: function () {
                    var t = this.domElement.value;
                    this.textValue = t || this.domElement.placeholder
                }
            }, {
                key: "updateTextColor",
                value: function () {
                    this.domElement.value ? mt(_t(s.prototype), "updateTextColor", this).call(this) : this.entity.setAttribute("text", "color", "#999"), this.active && this.entity.setAttribute("color", "#ffffcc")
                }
            }]) && bt(e.prototype, n), i && bt(e, i), s
        }(M);

        function Tt(t) {
            return (Tt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function St(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function Rt(t, e) {
            return (Rt = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function Ot(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = Ct(t);
                if (e) {
                    var r = Ct(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return kt(this, n)
            }
        }

        function kt(t, e) {
            return !e || "object" !== Tt(e) && "function" != typeof e ? function (t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function Ct(t) {
            return (Ct = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var Dt = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && Rt(t, e)
            }(s, t);
            var e, n, i, r = Ot(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n)).borderColor = new THREE.Color(0), i.borderWidth = 1, i
            }
            return e = s, (n = [{
                key: "updateTextPadding",
                value: function () {}
            }, {
                key: "updateText",
                value: function () {
                    "INPUT" == this.domElement.tagName && (this.textValue = this.domElement.value.replace(/\s{2,}/g, " "))
                }
            }]) && St(e.prototype, n), i && St(e, i), s
        }(M);

        function xt(t) {
            return (xt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function Pt(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function Nt(t, e) {
            return (Nt = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function Lt(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = Vt(t);
                if (e) {
                    var r = Vt(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return jt(this, n)
            }
        }

        function jt(t, e) {
            return !e || "object" !== xt(e) && "function" != typeof e ? function (t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function Vt(t) {
            return (Vt = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var Ht = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && Nt(t, e)
            }(s, t);
            var e, n, i, r = Lt(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n)).imageId = null, i.entity = document.createElement("a-image"), i
            }
            return e = s, (n = [{
                key: "svgToImage",
                value: function () {
                    var t = this,
                        e = (new XMLSerializer).serializeToString(this.domElement),
                        n = document.createElement("canvas"),
                        i = n.getContext("2d");
                    n.width = 2 * this.position.domPosition.width, n.height = 2 * this.position.domPosition.height;
                    var r = self.URL || self.webkitURL || self,
                        s = new Image,
                        o = new Blob([e], {
                            type: "image/svg+xml;charset=utf-8"
                        }),
                        a = r.createObjectURL(o);
                    s.onload = function () {
                        t.domElement.style.width ? i.drawImage(s, 0, 0, 2 * n.width, 2 * n.height) : i.drawImage(s, 0, 0, n.width, n.height), r.revokeObjectURL(a), t.updateImage(n.toDataURL()), n.remove()
                    }, s.src = a
                }
            }, {
                key: "updateImage",
                value: function (t) {
                    var e = this.web2vr.aframe.assetManager.getAsset(t, "img");
                    this.imageId && this.imageId != e && this.web2vr.aframe.assetManager.removeAsset(this.imageId), this.entity.setAttribute("id", "IMAGE_" + e), this.entity.setAttribute("src", "#" + e), this.imageId = e
                }
            }, {
                key: "specificUpdate",
                value: function () {
                    this.svgToImage()
                }
            }]) && Pt(e.prototype, n), i && Pt(e, i), s
        }(w);

        function Bt(t) {
            return (Bt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function Mt(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }

        function It(t, e) {
            return (It = Object.setPrototypeOf || function (t, e) {
                return t.__proto__ = e, t
            })(t, e)
        }

        function Gt(t) {
            var e = function () {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
                } catch (t) {
                    return !1
                }
            }();
            return function () {
                var n, i = Ut(t);
                if (e) {
                    var r = Ut(this).constructor;
                    n = Reflect.construct(i, arguments, r)
                } else n = i.apply(this, arguments);
                return Ft(this, n)
            }
        }

        function Ft(t, e) {
            return !e || "object" !== Bt(e) && "function" != typeof e ? function (t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }

        function Ut(t) {
            return (Ut = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            })(t)
        }
        var zt = function (t) {
            ! function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), e && It(t, e)
            }(s, t);
            var e, n, i, r = Gt(s);

            function s(t, e, n) {
                var i;
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, s), (i = r.call(this, t, e, n)).imageId = null, i.entity = document.createElement("a-image"), i
            }
            return e = s, (n = [{
                key: "updateImage",
                value: function (t) {
                    var e = this.web2vr.aframe.assetManager.getAsset(t, "img");
                    this.imageId && this.imageId != e && this.web2vr.aframe.assetManager.removeAsset(this.imageId), this.entity.setAttribute("id", "IMAGE_" + e), this.entity.setAttribute("src", "#" + e), this.imageId = e
                }
            }, {
                key: "specificUpdate",
                value: function () {
                    this.updateImage(this.domElement.toDataURL())
                }
            }]) && Mt(e.prototype, n), i && Mt(e, i), s
        }(w);

        function Wt(t, e) {
            var n;
            if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
                if (Array.isArray(t) || (n = qt(t)) || e && t && "number" == typeof t.length) {
                    n && (t = n);
                    var i = 0,
                        r = function () {};
                    return {
                        s: r,
                        n: function () {
                            return i >= t.length ? {
                                done: !0
                            } : {
                                done: !1,
                                value: t[i++]
                            }
                        },
                        e: function (t) {
                            throw t
                        },
                        f: r
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }
            var s, o = !0,
                a = !1;
            return {
                s: function () {
                    n = t[Symbol.iterator]()
                },
                n: function () {
                    var t = n.next();
                    return o = t.done, t
                },
                e: function (t) {
                    a = !0, s = t
                },
                f: function () {
                    try {
                        o || null == n.return || n.return()
                    } finally {
                        if (a) throw s
                    }
                }
            }
        }

        function Kt(t) {
            return function (t) {
                if (Array.isArray(t)) return Yt(t)
            }(t) || function (t) {
                if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t)
            }(t) || qt(t) || function () {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function qt(t, e) {
            if (t) {
                if ("string" == typeof t) return Yt(t, e);
                var n = Object.prototype.toString.call(t).slice(8, -1);
                return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Yt(t, e) : void 0
            }
        }

        function Yt(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
            return i
        }

        function $t(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function Xt(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
            }
        }
        var Qt = function () {
            function t(e) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                $t(this, t), e.nodeType == Node.ELEMENT_NODE ? this.container = e : this.container = document.querySelector(e), this.settings = r()(new s, n, {
                    arrayMerge: function (t, e) {
                        return [].concat(Kt(t), Kt(e))
                    }
                }), this.aframe = new f(this.settings), this.elements = new Set, this.hoverSelectors = new Set, this.observer = null, this.observerConfig = {
                    childList: !0,
                    subtree: !0,
                    characterData: !0,
                    attributes: !0
                }, this.updating = !1, this.html2canvasIDcounter = 0
            }
            var e, n, i;
            return e = t, (n = [{
                key: "findHoverCss",
                value: function () {
                    try {
                        for (var t = 0, e = Kt(document.styleSheets); t < e.length; t++)
                            for (var n = e[t], i = 0, r = Kt(n.cssRules); i < r.length; i++) {
                                var s = r[i];
                                if (s instanceof CSSStyleRule) {
                                    var o, a = Wt(s.selectorText.split(","));
                                    try {
                                        for (a.s(); !(o = a.n()).done;) {
                                            var l = o.value.split(":");
                                            if ("hover" == l[1]) {
                                                var c = l[0].replace(/\s/g, "");
                                                "." == c[0] ? s.selectorText += ", ".concat(c, "hover") : "#" == c[0] ? s.selectorText += ", .".concat(c.substr(1), "hover") : s.selectorText += ", .".concat(c, "hover"), this.hoverSelectors.add(c)
                                            }
                                        }
                                    } catch (t) {
                                        a.e(t)
                                    } finally {
                                        a.f()
                                    }
                                }
                            }
                    } catch (t) {
                        console.error(t)
                    }
                }
            }, {
                key: "generateStyleDefs",
                value: function (t) {
                    for (var e = "", n = document.styleSheets, i = 0; i < n.length; i++)
                        for (var r = n[i].cssRules, s = 0; s < r.length; s++) {
                            var o = r[s];
                            if (o.style) {
                                var a = o.selectorText;
                                t.querySelectorAll(a).length && (e += a + " { " + o.style.cssText + " }\n")
                            }
                        }
                    var l = document.createElement("style");
                    l.setAttribute("type", "text/css"), l.innerHTML = e;
                    var c = document.createElement("defs");
                    c.appendChild(l), t.insertBefore(c, t.firstChild)
                }
            }, {
                key: "start",
                value: function () {
                    this.findHoverCss(), this.aframe.scene.hasLoaded ? this.init() : this.aframe.scene.addEventListener("loaded", this.init(), {
                        once: !0
                    })
                }
            }, {
                key: "init",
                value: function () {
                    this.aframe.createContainer(this), this.aframe.createSky(), this.aframe.createControllers(), this.convertToVR(), this.scroll = new a(this), this.allLoadedUpdate()
                }
            }, {
                key: "allLoadedUpdate",
                value: function () {
                    var t = this,
                        e = setInterval((function () {
                            var n, i = !0,
                                r = Wt(t.elements);
                            try {
                                for (r.s(); !(n = r.n()).done;) {
                                    var s = n.value;
                                    s instanceof K && !s.loaded && (i = !1)
                                }
                            } catch (t) {
                                r.e(t)
                            } finally {
                                r.f()
                            }
                            i && (t.update(), clearInterval(e))
                        }), 100)
                }
            }, {
                key: "addElement",
                value: function (t, e, n) {
                    if (this.settings.ignoreTags.includes(t.tagName) || t.classList && t.classList.contains("vr-span")) return null;
                    var i = null;
                    if (t.nodeType == Node.TEXT_NODE && t.nodeValue.trim()) {
                        var r = document.createElement("span");
                        r.classList.add("vr-span"), r.textContent = t.textContent, this.observer && this.observer.disconnect(), t.replaceWith(r), this.observer && this.observer.observe(this.container, this.observerConfig), i = new M(this, r, n)
                    } else if ("VIDEO" == t.tagName) i = new J(this, t, n);
                    else if ("IMG" == t.tagName) i = new K(this, t, n);
                    else if ("svg" == t.tagName) i = new Ht(this, t, n);
                    else if ("CANVAS" == t.tagName) i = new zt(this, t, n);
                    else if ("BUTTON" == t.tagName) i = new Dt(this, t, n);
                    else if ("TEXTAREA" == t.tagName) i = new At(this, t, n);
                    else if ("INPUT" == t.tagName) {
                        var s = t.getAttribute("type");
                        if ("checkbox" == s) i = new at(this, t, n);
                        else if ("radio" == s) i = new vt(this, t, n);
                        else if (["text", "email", "number", "password", "search", "tel", "url"].includes(s)) i = new At(this, t, n);
                        else {
                            if (!["button", "submit", "reset"].includes(s)) return;
                            i = new Dt(this, t, n)
                        }
                    } else {
                        if (t.nodeType != Node.ELEMENT_NODE) return;
                        i = new x(this, t, n)
                    }
                    return this.elements.add(i), this.aframe.container.appendChild(i.entity), this.settings.debug && console.log("Added element", i), i.entity.addEventListener("play", (function (t) {
                        e && e.childElements.add(i), i.init(), i.update()
                    }), {
                        once: !0
                    }), i
                }
            }, {
                // key: "removeElement",
                // value: function (t) {
                //     this.aframe.container.removeChild(t.entity), this.elements.delete(t);
                //     var e, n = Wt(t.childElements);
                //     try {
                //         for (n.s(); !(e = n.n()).done;) {
                //             var i = e.value;
                //             this.removeElement(i)
                //         }
                //     } catch (t) {
                //         n.e(t)
                //     } finally {
                //         n.f()
                //     }
                // }
            }, {
                key: "addElementChildren",
                value: function (t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                        n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
                    "svg" == t.tagName && this.generateStyleDefs(t);
                    var i = this.addElement(t, e, n);
                    if (i && !(i instanceof Ht) && t.childNodes && t.childNodes.length > 0) {
                        n++;
                        var r, s = Wt(t.childNodes);
                        try {
                            for (s.s(); !(r = s.n()).done;) {
                                var o = r.value;
                                this.addElementChildren(o, i, n)
                            }
                        } catch (t) {
                            s.e(t)
                        } finally {
                            s.f()
                        }
                    }
                }
            }, {
                key: "convertToVR",
                value: function () {
                    var t = this;
                    this.addElementChildren(this.container), this.observer = new MutationObserver((function (e) {
                        var n, i = Wt(e);
                        try {
                            for (i.s(); !(n = i.n()).done;) {
                                var r, s = n.value,
                                    o = !1,
                                    a = Wt(s.removedNodes);
                                try {
                                    for (a.s(); !(r = a.n()).done;) {
                                        var l = r.value;
                                        //l.nodeType != Node.TEXT_NODE || l.nodeValue.trim() ? t.removeElement(l.element) : o = !0
                                    }
                                } catch (t) {
                                    a.e(t)
                                } finally {
                                    a.f()
                                }
                                var c, u = Wt(s.addedNodes);
                                try {
                                    for (u.s(); !(c = u.n()).done;) {
                                        var h = c.value;
                                        t.addElementChildren(h, s.target.element, s.target.element.layer + 1)
                                    }
                                } catch (t) {
                                    u.e(t)
                                } finally {
                                    u.f()
                                }
                                o || (s.addedNodes.length > 0 ? t.allLoadedUpdate() : t.update())
                            }
                        } catch (t) {
                            i.e(t)
                        } finally {
                            i.f()
                        }
                    })), this.observer.observe(this.container, this.observerConfig)
                }
            }, {
                key: "update",
                value: function () {
                    if (this.updating = !0, this.updating) {
                        try {
                            var t, e = Wt(this.elements);
                            try {
                                for (e.s(); !(t = e.n()).done;) t.value.update()
                            } catch (t) {
                                e.e(t)
                            } finally {
                                e.f()
                            }
                        } catch (t) {
                            console.error(t)
                        }
                        this.scroll.update(), this.updating = !1
                    }
                }
            }]) && Xt(e.prototype, n), i && Xt(e, i), t
        }()
    }]).default
}));