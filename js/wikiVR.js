function wikiRefer(speechSummaryText) {
    // Check if speechSummarText is requested, then load content of the speech, else load typed content
    if(speechSummaryText){
       var summaryText = speechSummaryText;
    } else {
        // Value typed using VR keyboard 
        var summaryText = x.components.text.attrValue.value;
    }

    
    (function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
        1: [function (require, module, exports) {
            'use strict'

            exports.byteLength = byteLength
            exports.toByteArray = toByteArray
            exports.fromByteArray = fromByteArray

            var lookup = []
            var revLookup = []
            var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

            var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
            for (var i = 0, len = code.length; i < len; ++i) {
                lookup[i] = code[i]
                revLookup[code.charCodeAt(i)] = i
            }

            // Support decoding URL-safe base64 strings, as Node.js does.
            // See: https://en.wikipedia.org/wiki/Base64#URL_applications
            revLookup['-'.charCodeAt(0)] = 62
            revLookup['_'.charCodeAt(0)] = 63

            function getLens(b64) {
                var len = b64.length

                if (len % 4 > 0) {
                    throw new Error('Invalid string. Length must be a multiple of 4')
                }

                // Trim off extra bytes after placeholder bytes are found
                // See: https://github.com/beatgammit/base64-js/issues/42
                var validLen = b64.indexOf('=')
                if (validLen === -1) validLen = len

                var placeHoldersLen = validLen === len
                    ? 0
                    : 4 - (validLen % 4)

                return [validLen, placeHoldersLen]
            }

            // base64 is 4/3 + up to two characters of the original data
            function byteLength(b64) {
                var lens = getLens(b64)
                var validLen = lens[0]
                var placeHoldersLen = lens[1]
                return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
            }

            function _byteLength(b64, validLen, placeHoldersLen) {
                return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
            }

            function toByteArray(b64) {
                var tmp
                var lens = getLens(b64)
                var validLen = lens[0]
                var placeHoldersLen = lens[1]

                var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

                var curByte = 0

                // if there are placeholders, only get up to the last complete 4 chars
                var len = placeHoldersLen > 0
                    ? validLen - 4
                    : validLen

                var i
                for (i = 0; i < len; i += 4) {
                    tmp =
                        (revLookup[b64.charCodeAt(i)] << 18) |
                        (revLookup[b64.charCodeAt(i + 1)] << 12) |
                        (revLookup[b64.charCodeAt(i + 2)] << 6) |
                        revLookup[b64.charCodeAt(i + 3)]
                    arr[curByte++] = (tmp >> 16) & 0xFF
                    arr[curByte++] = (tmp >> 8) & 0xFF
                    arr[curByte++] = tmp & 0xFF
                }

                if (placeHoldersLen === 2) {
                    tmp =
                        (revLookup[b64.charCodeAt(i)] << 2) |
                        (revLookup[b64.charCodeAt(i + 1)] >> 4)
                    arr[curByte++] = tmp & 0xFF
                }

                if (placeHoldersLen === 1) {
                    tmp =
                        (revLookup[b64.charCodeAt(i)] << 10) |
                        (revLookup[b64.charCodeAt(i + 1)] << 4) |
                        (revLookup[b64.charCodeAt(i + 2)] >> 2)
                    arr[curByte++] = (tmp >> 8) & 0xFF
                    arr[curByte++] = tmp & 0xFF
                }

                return arr
            }

            function tripletToBase64(num) {
                return lookup[num >> 18 & 0x3F] +
                    lookup[num >> 12 & 0x3F] +
                    lookup[num >> 6 & 0x3F] +
                    lookup[num & 0x3F]
            }

            function encodeChunk(uint8, start, end) {
                var tmp
                var output = []
                for (var i = start; i < end; i += 3) {
                    tmp =
                        ((uint8[i] << 16) & 0xFF0000) +
                        ((uint8[i + 1] << 8) & 0xFF00) +
                        (uint8[i + 2] & 0xFF)
                    output.push(tripletToBase64(tmp))
                }
                return output.join('')
            }

            function fromByteArray(uint8) {
                var tmp
                var len = uint8.length
                var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
                var parts = []
                var maxChunkLength = 16383 // must be multiple of 3

                // go through the array every three bytes, we'll deal with trailing stuff later
                for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
                }

                // pad the end with zeros, but make sure to not forget the extra bytes
                if (extraBytes === 1) {
                    tmp = uint8[len - 1]
                    parts.push(
                        lookup[tmp >> 2] +
                        lookup[(tmp << 4) & 0x3F] +
                        '=='
                    )
                } else if (extraBytes === 2) {
                    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
                    parts.push(
                        lookup[tmp >> 10] +
                        lookup[(tmp >> 4) & 0x3F] +
                        lookup[(tmp << 2) & 0x3F] +
                        '='
                    )
                }

                return parts.join('')
            }

        }, {}], 2: [function (require, module, exports) {

        }, {}], 3: [function (require, module, exports) {
            (function (Buffer) {
                (function () {
                    /*!
                     * The buffer module from node.js, for the browser.
                     *
                     * @author   Feross Aboukhadijeh <https://feross.org>
                     * @license  MIT
                     */
                    /* eslint-disable no-proto */

                    'use strict'

                    var base64 = require('base64-js')
                    var ieee754 = require('ieee754')

                    exports.Buffer = Buffer
                    exports.SlowBuffer = SlowBuffer
                    exports.INSPECT_MAX_BYTES = 50

                    var K_MAX_LENGTH = 0x7fffffff
                    exports.kMaxLength = K_MAX_LENGTH

                    /**
                     * If `Buffer.TYPED_ARRAY_SUPPORT`:
                     *   === true    Use Uint8Array implementation (fastest)
                     *   === false   Print warning and recommend using `buffer` v4.x which has an Object
                     *               implementation (most compatible, even IE6)
                     *
                     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
                     * Opera 11.6+, iOS 4.2+.
                     *
                     * We report that the browser does not support typed arrays if the are not subclassable
                     * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
                     * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
                     * for __proto__ and has a buggy typed array implementation.
                     */
                    Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

                    if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
                        typeof console.error === 'function') {
                        console.error(
                            'This browser lacks typed array (Uint8Array) support which is required by ' +
                            '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
                        )
                    }

                    function typedArraySupport() {
                        // Can typed array instances can be augmented?
                        try {
                            var arr = new Uint8Array(1)
                            arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
                            return arr.foo() === 42
                        } catch (e) {
                            return false
                        }
                    }

                    Object.defineProperty(Buffer.prototype, 'parent', {
                        enumerable: true,
                        get: function () {
                            if (!Buffer.isBuffer(this)) return undefined
                            return this.buffer
                        }
                    })

                    Object.defineProperty(Buffer.prototype, 'offset', {
                        enumerable: true,
                        get: function () {
                            if (!Buffer.isBuffer(this)) return undefined
                            return this.byteOffset
                        }
                    })

                    function createBuffer(length) {
                        if (length > K_MAX_LENGTH) {
                            throw new RangeError('The value "' + length + '" is invalid for option "size"')
                        }
                        // Return an augmented `Uint8Array` instance
                        var buf = new Uint8Array(length)
                        buf.__proto__ = Buffer.prototype
                        return buf
                    }

                    /**
                     * The Buffer constructor returns instances of `Uint8Array` that have their
                     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
                     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
                     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
                     * returns a single octet.
                     *
                     * The `Uint8Array` prototype remains unmodified.
                     */

                    function Buffer(arg, encodingOrOffset, length) {
                        // Common case.
                        if (typeof arg === 'number') {
                            if (typeof encodingOrOffset === 'string') {
                                throw new TypeError(
                                    'The "string" argument must be of type string. Received type number'
                                )
                            }
                            return allocUnsafe(arg)
                        }
                        return from(arg, encodingOrOffset, length)
                    }

                    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
                    if (typeof Symbol !== 'undefined' && Symbol.species != null &&
                        Buffer[Symbol.species] === Buffer) {
                        Object.defineProperty(Buffer, Symbol.species, {
                            value: null,
                            configurable: true,
                            enumerable: false,
                            writable: false
                        })
                    }

                    Buffer.poolSize = 8192 // not used by this implementation

                    function from(value, encodingOrOffset, length) {
                        if (typeof value === 'string') {
                            return fromString(value, encodingOrOffset)
                        }

                        if (ArrayBuffer.isView(value)) {
                            return fromArrayLike(value)
                        }

                        if (value == null) {
                            throw TypeError(
                                'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
                                'or Array-like Object. Received type ' + (typeof value)
                            )
                        }

                        if (isInstance(value, ArrayBuffer) ||
                            (value && isInstance(value.buffer, ArrayBuffer))) {
                            return fromArrayBuffer(value, encodingOrOffset, length)
                        }

                        if (typeof value === 'number') {
                            throw new TypeError(
                                'The "value" argument must not be of type number. Received type number'
                            )
                        }

                        var valueOf = value.valueOf && value.valueOf()
                        if (valueOf != null && valueOf !== value) {
                            return Buffer.from(valueOf, encodingOrOffset, length)
                        }

                        var b = fromObject(value)
                        if (b) return b

                        if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
                            typeof value[Symbol.toPrimitive] === 'function') {
                            return Buffer.from(
                                value[Symbol.toPrimitive]('string'), encodingOrOffset, length
                            )
                        }

                        throw new TypeError(
                            'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
                            'or Array-like Object. Received type ' + (typeof value)
                        )
                    }

                    /**
                     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
                     * if value is a number.
                     * Buffer.from(str[, encoding])
                     * Buffer.from(array)
                     * Buffer.from(buffer)
                     * Buffer.from(arrayBuffer[, byteOffset[, length]])
                     **/
                    Buffer.from = function (value, encodingOrOffset, length) {
                        return from(value, encodingOrOffset, length)
                    }

                    // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
                    // https://github.com/feross/buffer/pull/148
                    Buffer.prototype.__proto__ = Uint8Array.prototype
                    Buffer.__proto__ = Uint8Array

                    function assertSize(size) {
                        if (typeof size !== 'number') {
                            throw new TypeError('"size" argument must be of type number')
                        } else if (size < 0) {
                            throw new RangeError('The value "' + size + '" is invalid for option "size"')
                        }
                    }

                    function alloc(size, fill, encoding) {
                        assertSize(size)
                        if (size <= 0) {
                            return createBuffer(size)
                        }
                        if (fill !== undefined) {
                            // Only pay attention to encoding if it's a string. This
                            // prevents accidentally sending in a number that would
                            // be interpretted as a start offset.
                            return typeof encoding === 'string'
                                ? createBuffer(size).fill(fill, encoding)
                                : createBuffer(size).fill(fill)
                        }
                        return createBuffer(size)
                    }

                    /**
                     * Creates a new filled Buffer instance.
                     * alloc(size[, fill[, encoding]])
                     **/
                    Buffer.alloc = function (size, fill, encoding) {
                        return alloc(size, fill, encoding)
                    }

                    function allocUnsafe(size) {
                        assertSize(size)
                        return createBuffer(size < 0 ? 0 : checked(size) | 0)
                    }

                    /**
                     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
                     * */
                    Buffer.allocUnsafe = function (size) {
                        return allocUnsafe(size)
                    }
                    /**
                     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
                     */
                    Buffer.allocUnsafeSlow = function (size) {
                        return allocUnsafe(size)
                    }

                    function fromString(string, encoding) {
                        if (typeof encoding !== 'string' || encoding === '') {
                            encoding = 'utf8'
                        }

                        if (!Buffer.isEncoding(encoding)) {
                            throw new TypeError('Unknown encoding: ' + encoding)
                        }

                        var length = byteLength(string, encoding) | 0
                        var buf = createBuffer(length)

                        var actual = buf.write(string, encoding)

                        if (actual !== length) {
                            // Writing a hex string, for example, that contains invalid characters will
                            // cause everything after the first invalid character to be ignored. (e.g.
                            // 'abxxcd' will be treated as 'ab')
                            buf = buf.slice(0, actual)
                        }

                        return buf
                    }

                    function fromArrayLike(array) {
                        var length = array.length < 0 ? 0 : checked(array.length) | 0
                        var buf = createBuffer(length)
                        for (var i = 0; i < length; i += 1) {
                            buf[i] = array[i] & 255
                        }
                        return buf
                    }

                    function fromArrayBuffer(array, byteOffset, length) {
                        if (byteOffset < 0 || array.byteLength < byteOffset) {
                            throw new RangeError('"offset" is outside of buffer bounds')
                        }

                        if (array.byteLength < byteOffset + (length || 0)) {
                            throw new RangeError('"length" is outside of buffer bounds')
                        }

                        var buf
                        if (byteOffset === undefined && length === undefined) {
                            buf = new Uint8Array(array)
                        } else if (length === undefined) {
                            buf = new Uint8Array(array, byteOffset)
                        } else {
                            buf = new Uint8Array(array, byteOffset, length)
                        }

                        // Return an augmented `Uint8Array` instance
                        buf.__proto__ = Buffer.prototype
                        return buf
                    }

                    function fromObject(obj) {
                        if (Buffer.isBuffer(obj)) {
                            var len = checked(obj.length) | 0
                            var buf = createBuffer(len)

                            if (buf.length === 0) {
                                return buf
                            }

                            obj.copy(buf, 0, 0, len)
                            return buf
                        }

                        if (obj.length !== undefined) {
                            if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
                                return createBuffer(0)
                            }
                            return fromArrayLike(obj)
                        }

                        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
                            return fromArrayLike(obj.data)
                        }
                    }

                    function checked(length) {
                        // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
                        // length is NaN (which is otherwise coerced to zero.)
                        if (length >= K_MAX_LENGTH) {
                            throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                                'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
                        }
                        return length | 0
                    }

                    function SlowBuffer(length) {
                        if (+length != length) { // eslint-disable-line eqeqeq
                            length = 0
                        }
                        return Buffer.alloc(+length)
                    }

                    Buffer.isBuffer = function isBuffer(b) {
                        return b != null && b._isBuffer === true &&
                            b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
                    }

                    Buffer.compare = function compare(a, b) {
                        if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
                        if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
                        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                            throw new TypeError(
                                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
                            )
                        }

                        if (a === b) return 0

                        var x = a.length
                        var y = b.length

                        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                            if (a[i] !== b[i]) {
                                x = a[i]
                                y = b[i]
                                break
                            }
                        }

                        if (x < y) return -1
                        if (y < x) return 1
                        return 0
                    }

                    Buffer.isEncoding = function isEncoding(encoding) {
                        switch (String(encoding).toLowerCase()) {
                            case 'hex':
                            case 'utf8':
                            case 'utf-8':
                            case 'ascii':
                            case 'latin1':
                            case 'binary':
                            case 'base64':
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return true
                            default:
                                return false
                        }
                    }

                    Buffer.concat = function concat(list, length) {
                        if (!Array.isArray(list)) {
                            throw new TypeError('"list" argument must be an Array of Buffers')
                        }

                        if (list.length === 0) {
                            return Buffer.alloc(0)
                        }

                        var i
                        if (length === undefined) {
                            length = 0
                            for (i = 0; i < list.length; ++i) {
                                length += list[i].length
                            }
                        }

                        var buffer = Buffer.allocUnsafe(length)
                        var pos = 0
                        for (i = 0; i < list.length; ++i) {
                            var buf = list[i]
                            if (isInstance(buf, Uint8Array)) {
                                buf = Buffer.from(buf)
                            }
                            if (!Buffer.isBuffer(buf)) {
                                throw new TypeError('"list" argument must be an Array of Buffers')
                            }
                            buf.copy(buffer, pos)
                            pos += buf.length
                        }
                        return buffer
                    }

                    function byteLength(string, encoding) {
                        if (Buffer.isBuffer(string)) {
                            return string.length
                        }
                        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
                            return string.byteLength
                        }
                        if (typeof string !== 'string') {
                            throw new TypeError(
                                'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
                                'Received type ' + typeof string
                            )
                        }

                        var len = string.length
                        var mustMatch = (arguments.length > 2 && arguments[2] === true)
                        if (!mustMatch && len === 0) return 0

                        // Use a for loop to avoid recursion
                        var loweredCase = false
                        for (; ;) {
                            switch (encoding) {
                                case 'ascii':
                                case 'latin1':
                                case 'binary':
                                    return len
                                case 'utf8':
                                case 'utf-8':
                                    return utf8ToBytes(string).length
                                case 'ucs2':
                                case 'ucs-2':
                                case 'utf16le':
                                case 'utf-16le':
                                    return len * 2
                                case 'hex':
                                    return len >>> 1
                                case 'base64':
                                    return base64ToBytes(string).length
                                default:
                                    if (loweredCase) {
                                        return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
                                    }
                                    encoding = ('' + encoding).toLowerCase()
                                    loweredCase = true
                            }
                        }
                    }
                    Buffer.byteLength = byteLength

                    function slowToString(encoding, start, end) {
                        var loweredCase = false

                        // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
                        // property of a typed array.

                        // This behaves neither like String nor Uint8Array in that we set start/end
                        // to their upper/lower bounds if the value passed is out of range.
                        // undefined is handled specially as per ECMA-262 6th Edition,
                        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
                        if (start === undefined || start < 0) {
                            start = 0
                        }
                        // Return early if start > this.length. Done here to prevent potential uint32
                        // coercion fail below.
                        if (start > this.length) {
                            return ''
                        }

                        if (end === undefined || end > this.length) {
                            end = this.length
                        }

                        if (end <= 0) {
                            return ''
                        }

                        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
                        end >>>= 0
                        start >>>= 0

                        if (end <= start) {
                            return ''
                        }

                        if (!encoding) encoding = 'utf8'

                        while (true) {
                            switch (encoding) {
                                case 'hex':
                                    return hexSlice(this, start, end)

                                case 'utf8':
                                case 'utf-8':
                                    return utf8Slice(this, start, end)

                                case 'ascii':
                                    return asciiSlice(this, start, end)

                                case 'latin1':
                                case 'binary':
                                    return latin1Slice(this, start, end)

                                case 'base64':
                                    return base64Slice(this, start, end)

                                case 'ucs2':
                                case 'ucs-2':
                                case 'utf16le':
                                case 'utf-16le':
                                    return utf16leSlice(this, start, end)

                                default:
                                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                                    encoding = (encoding + '').toLowerCase()
                                    loweredCase = true
                            }
                        }
                    }

                    // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
                    // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
                    // reliably in a browserify context because there could be multiple different
                    // copies of the 'buffer' package in use. This method works even for Buffer
                    // instances that were created from another copy of the `buffer` package.
                    // See: https://github.com/feross/buffer/issues/154
                    Buffer.prototype._isBuffer = true

                    function swap(b, n, m) {
                        var i = b[n]
                        b[n] = b[m]
                        b[m] = i
                    }

                    Buffer.prototype.swap16 = function swap16() {
                        var len = this.length
                        if (len % 2 !== 0) {
                            throw new RangeError('Buffer size must be a multiple of 16-bits')
                        }
                        for (var i = 0; i < len; i += 2) {
                            swap(this, i, i + 1)
                        }
                        return this
                    }

                    Buffer.prototype.swap32 = function swap32() {
                        var len = this.length
                        if (len % 4 !== 0) {
                            throw new RangeError('Buffer size must be a multiple of 32-bits')
                        }
                        for (var i = 0; i < len; i += 4) {
                            swap(this, i, i + 3)
                            swap(this, i + 1, i + 2)
                        }
                        return this
                    }

                    Buffer.prototype.swap64 = function swap64() {
                        var len = this.length
                        if (len % 8 !== 0) {
                            throw new RangeError('Buffer size must be a multiple of 64-bits')
                        }
                        for (var i = 0; i < len; i += 8) {
                            swap(this, i, i + 7)
                            swap(this, i + 1, i + 6)
                            swap(this, i + 2, i + 5)
                            swap(this, i + 3, i + 4)
                        }
                        return this
                    }

                    Buffer.prototype.toString = function toString() {
                        var length = this.length
                        if (length === 0) return ''
                        if (arguments.length === 0) return utf8Slice(this, 0, length)
                        return slowToString.apply(this, arguments)
                    }

                    Buffer.prototype.toLocaleString = Buffer.prototype.toString

                    Buffer.prototype.equals = function equals(b) {
                        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
                        if (this === b) return true
                        return Buffer.compare(this, b) === 0
                    }

                    Buffer.prototype.inspect = function inspect() {
                        var str = ''
                        var max = exports.INSPECT_MAX_BYTES
                        str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
                        if (this.length > max) str += ' ... '
                        return '<Buffer ' + str + '>'
                    }

                    Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
                        if (isInstance(target, Uint8Array)) {
                            target = Buffer.from(target, target.offset, target.byteLength)
                        }
                        if (!Buffer.isBuffer(target)) {
                            throw new TypeError(
                                'The "target" argument must be one of type Buffer or Uint8Array. ' +
                                'Received type ' + (typeof target)
                            )
                        }

                        if (start === undefined) {
                            start = 0
                        }
                        if (end === undefined) {
                            end = target ? target.length : 0
                        }
                        if (thisStart === undefined) {
                            thisStart = 0
                        }
                        if (thisEnd === undefined) {
                            thisEnd = this.length
                        }

                        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                            throw new RangeError('out of range index')
                        }

                        if (thisStart >= thisEnd && start >= end) {
                            return 0
                        }
                        if (thisStart >= thisEnd) {
                            return -1
                        }
                        if (start >= end) {
                            return 1
                        }

                        start >>>= 0
                        end >>>= 0
                        thisStart >>>= 0
                        thisEnd >>>= 0

                        if (this === target) return 0

                        var x = thisEnd - thisStart
                        var y = end - start
                        var len = Math.min(x, y)

                        var thisCopy = this.slice(thisStart, thisEnd)
                        var targetCopy = target.slice(start, end)

                        for (var i = 0; i < len; ++i) {
                            if (thisCopy[i] !== targetCopy[i]) {
                                x = thisCopy[i]
                                y = targetCopy[i]
                                break
                            }
                        }

                        if (x < y) return -1
                        if (y < x) return 1
                        return 0
                    }

                    // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
                    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
                    //
                    // Arguments:
                    // - buffer - a Buffer to search
                    // - val - a string, Buffer, or number
                    // - byteOffset - an index into `buffer`; will be clamped to an int32
                    // - encoding - an optional encoding, relevant is val is a string
                    // - dir - true for indexOf, false for lastIndexOf
                    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                        // Empty buffer means no match
                        if (buffer.length === 0) return -1

                        // Normalize byteOffset
                        if (typeof byteOffset === 'string') {
                            encoding = byteOffset
                            byteOffset = 0
                        } else if (byteOffset > 0x7fffffff) {
                            byteOffset = 0x7fffffff
                        } else if (byteOffset < -0x80000000) {
                            byteOffset = -0x80000000
                        }
                        byteOffset = +byteOffset // Coerce to Number.
                        if (numberIsNaN(byteOffset)) {
                            // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                            byteOffset = dir ? 0 : (buffer.length - 1)
                        }

                        // Normalize byteOffset: negative offsets start from the end of the buffer
                        if (byteOffset < 0) byteOffset = buffer.length + byteOffset
                        if (byteOffset >= buffer.length) {
                            if (dir) return -1
                            else byteOffset = buffer.length - 1
                        } else if (byteOffset < 0) {
                            if (dir) byteOffset = 0
                            else return -1
                        }

                        // Normalize val
                        if (typeof val === 'string') {
                            val = Buffer.from(val, encoding)
                        }

                        // Finally, search either indexOf (if dir is true) or lastIndexOf
                        if (Buffer.isBuffer(val)) {
                            // Special case: looking for empty string/buffer always fails
                            if (val.length === 0) {
                                return -1
                            }
                            return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
                        } else if (typeof val === 'number') {
                            val = val & 0xFF // Search for a byte value [0-255]
                            if (typeof Uint8Array.prototype.indexOf === 'function') {
                                if (dir) {
                                    return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                                } else {
                                    return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                                }
                            }
                            return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
                        }

                        throw new TypeError('val must be string, number or Buffer')
                    }

                    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                        var indexSize = 1
                        var arrLength = arr.length
                        var valLength = val.length

                        if (encoding !== undefined) {
                            encoding = String(encoding).toLowerCase()
                            if (encoding === 'ucs2' || encoding === 'ucs-2' ||
                                encoding === 'utf16le' || encoding === 'utf-16le') {
                                if (arr.length < 2 || val.length < 2) {
                                    return -1
                                }
                                indexSize = 2
                                arrLength /= 2
                                valLength /= 2
                                byteOffset /= 2
                            }
                        }

                        function read(buf, i) {
                            if (indexSize === 1) {
                                return buf[i]
                            } else {
                                return buf.readUInt16BE(i * indexSize)
                            }
                        }

                        var i
                        if (dir) {
                            var foundIndex = -1
                            for (i = byteOffset; i < arrLength; i++) {
                                if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                                    if (foundIndex === -1) foundIndex = i
                                    if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
                                } else {
                                    if (foundIndex !== -1) i -= i - foundIndex
                                    foundIndex = -1
                                }
                            }
                        } else {
                            if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
                            for (i = byteOffset; i >= 0; i--) {
                                var found = true
                                for (var j = 0; j < valLength; j++) {
                                    if (read(arr, i + j) !== read(val, j)) {
                                        found = false
                                        break
                                    }
                                }
                                if (found) return i
                            }
                        }

                        return -1
                    }

                    Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
                        return this.indexOf(val, byteOffset, encoding) !== -1
                    }

                    Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
                        return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
                    }

                    Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
                        return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
                    }

                    function hexWrite(buf, string, offset, length) {
                        offset = Number(offset) || 0
                        var remaining = buf.length - offset
                        if (!length) {
                            length = remaining
                        } else {
                            length = Number(length)
                            if (length > remaining) {
                                length = remaining
                            }
                        }

                        var strLen = string.length

                        if (length > strLen / 2) {
                            length = strLen / 2
                        }
                        for (var i = 0; i < length; ++i) {
                            var parsed = parseInt(string.substr(i * 2, 2), 16)
                            if (numberIsNaN(parsed)) return i
                            buf[offset + i] = parsed
                        }
                        return i
                    }

                    function utf8Write(buf, string, offset, length) {
                        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
                    }

                    function asciiWrite(buf, string, offset, length) {
                        return blitBuffer(asciiToBytes(string), buf, offset, length)
                    }

                    function latin1Write(buf, string, offset, length) {
                        return asciiWrite(buf, string, offset, length)
                    }

                    function base64Write(buf, string, offset, length) {
                        return blitBuffer(base64ToBytes(string), buf, offset, length)
                    }

                    function ucs2Write(buf, string, offset, length) {
                        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
                    }

                    Buffer.prototype.write = function write(string, offset, length, encoding) {
                        // Buffer#write(string)
                        if (offset === undefined) {
                            encoding = 'utf8'
                            length = this.length
                            offset = 0
                            // Buffer#write(string, encoding)
                        } else if (length === undefined && typeof offset === 'string') {
                            encoding = offset
                            length = this.length
                            offset = 0
                            // Buffer#write(string, offset[, length][, encoding])
                        } else if (isFinite(offset)) {
                            offset = offset >>> 0
                            if (isFinite(length)) {
                                length = length >>> 0
                                if (encoding === undefined) encoding = 'utf8'
                            } else {
                                encoding = length
                                length = undefined
                            }
                        } else {
                            throw new Error(
                                'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                            )
                        }

                        var remaining = this.length - offset
                        if (length === undefined || length > remaining) length = remaining

                        if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
                            throw new RangeError('Attempt to write outside buffer bounds')
                        }

                        if (!encoding) encoding = 'utf8'

                        var loweredCase = false
                        for (; ;) {
                            switch (encoding) {
                                case 'hex':
                                    return hexWrite(this, string, offset, length)

                                case 'utf8':
                                case 'utf-8':
                                    return utf8Write(this, string, offset, length)

                                case 'ascii':
                                    return asciiWrite(this, string, offset, length)

                                case 'latin1':
                                case 'binary':
                                    return latin1Write(this, string, offset, length)

                                case 'base64':
                                    // Warning: maxLength not taken into account in base64Write
                                    return base64Write(this, string, offset, length)

                                case 'ucs2':
                                case 'ucs-2':
                                case 'utf16le':
                                case 'utf-16le':
                                    return ucs2Write(this, string, offset, length)

                                default:
                                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                                    encoding = ('' + encoding).toLowerCase()
                                    loweredCase = true
                            }
                        }
                    }

                    Buffer.prototype.toJSON = function toJSON() {
                        return {
                            type: 'Buffer',
                            data: Array.prototype.slice.call(this._arr || this, 0)
                        }
                    }

                    function base64Slice(buf, start, end) {
                        if (start === 0 && end === buf.length) {
                            return base64.fromByteArray(buf)
                        } else {
                            return base64.fromByteArray(buf.slice(start, end))
                        }
                    }

                    function utf8Slice(buf, start, end) {
                        end = Math.min(buf.length, end)
                        var res = []

                        var i = start
                        while (i < end) {
                            var firstByte = buf[i]
                            var codePoint = null
                            var bytesPerSequence = (firstByte > 0xEF) ? 4
                                : (firstByte > 0xDF) ? 3
                                    : (firstByte > 0xBF) ? 2
                                        : 1

                            if (i + bytesPerSequence <= end) {
                                var secondByte, thirdByte, fourthByte, tempCodePoint

                                switch (bytesPerSequence) {
                                    case 1:
                                        if (firstByte < 0x80) {
                                            codePoint = firstByte
                                        }
                                        break
                                    case 2:
                                        secondByte = buf[i + 1]
                                        if ((secondByte & 0xC0) === 0x80) {
                                            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                                            if (tempCodePoint > 0x7F) {
                                                codePoint = tempCodePoint
                                            }
                                        }
                                        break
                                    case 3:
                                        secondByte = buf[i + 1]
                                        thirdByte = buf[i + 2]
                                        if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                                            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                                            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                                                codePoint = tempCodePoint
                                            }
                                        }
                                        break
                                    case 4:
                                        secondByte = buf[i + 1]
                                        thirdByte = buf[i + 2]
                                        fourthByte = buf[i + 3]
                                        if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                                            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                                            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                                                codePoint = tempCodePoint
                                            }
                                        }
                                }
                            }

                            if (codePoint === null) {
                                // we did not generate a valid codePoint so insert a
                                // replacement char (U+FFFD) and advance only 1 byte
                                codePoint = 0xFFFD
                                bytesPerSequence = 1
                            } else if (codePoint > 0xFFFF) {
                                // encode to utf16 (surrogate pair dance)
                                codePoint -= 0x10000
                                res.push(codePoint >>> 10 & 0x3FF | 0xD800)
                                codePoint = 0xDC00 | codePoint & 0x3FF
                            }

                            res.push(codePoint)
                            i += bytesPerSequence
                        }

                        return decodeCodePointsArray(res)
                    }

                    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
                    // the lowest limit is Chrome, with 0x10000 args.
                    // We go 1 magnitude less, for safety
                    var MAX_ARGUMENTS_LENGTH = 0x1000

                    function decodeCodePointsArray(codePoints) {
                        var len = codePoints.length
                        if (len <= MAX_ARGUMENTS_LENGTH) {
                            return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
                        }

                        // Decode in chunks to avoid "call stack size exceeded".
                        var res = ''
                        var i = 0
                        while (i < len) {
                            res += String.fromCharCode.apply(
                                String,
                                codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
                            )
                        }
                        return res
                    }

                    function asciiSlice(buf, start, end) {
                        var ret = ''
                        end = Math.min(buf.length, end)

                        for (var i = start; i < end; ++i) {
                            ret += String.fromCharCode(buf[i] & 0x7F)
                        }
                        return ret
                    }

                    function latin1Slice(buf, start, end) {
                        var ret = ''
                        end = Math.min(buf.length, end)

                        for (var i = start; i < end; ++i) {
                            ret += String.fromCharCode(buf[i])
                        }
                        return ret
                    }

                    function hexSlice(buf, start, end) {
                        var len = buf.length

                        if (!start || start < 0) start = 0
                        if (!end || end < 0 || end > len) end = len

                        var out = ''
                        for (var i = start; i < end; ++i) {
                            out += toHex(buf[i])
                        }
                        return out
                    }

                    function utf16leSlice(buf, start, end) {
                        var bytes = buf.slice(start, end)
                        var res = ''
                        for (var i = 0; i < bytes.length; i += 2) {
                            res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
                        }
                        return res
                    }

                    Buffer.prototype.slice = function slice(start, end) {
                        var len = this.length
                        start = ~~start
                        end = end === undefined ? len : ~~end

                        if (start < 0) {
                            start += len
                            if (start < 0) start = 0
                        } else if (start > len) {
                            start = len
                        }

                        if (end < 0) {
                            end += len
                            if (end < 0) end = 0
                        } else if (end > len) {
                            end = len
                        }

                        if (end < start) end = start

                        var newBuf = this.subarray(start, end)
                        // Return an augmented `Uint8Array` instance
                        newBuf.__proto__ = Buffer.prototype
                        return newBuf
                    }

                    /*
                     * Need to make sure that buffer isn't trying to write out of bounds.
                     */
                    function checkOffset(offset, ext, length) {
                        if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
                        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
                    }

                    Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                        offset = offset >>> 0
                        byteLength = byteLength >>> 0
                        if (!noAssert) checkOffset(offset, byteLength, this.length)

                        var val = this[offset]
                        var mul = 1
                        var i = 0
                        while (++i < byteLength && (mul *= 0x100)) {
                            val += this[offset + i] * mul
                        }

                        return val
                    }

                    Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                        offset = offset >>> 0
                        byteLength = byteLength >>> 0
                        if (!noAssert) {
                            checkOffset(offset, byteLength, this.length)
                        }

                        var val = this[offset + --byteLength]
                        var mul = 1
                        while (byteLength > 0 && (mul *= 0x100)) {
                            val += this[offset + --byteLength] * mul
                        }

                        return val
                    }

                    Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 1, this.length)
                        return this[offset]
                    }

                    Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 2, this.length)
                        return this[offset] | (this[offset + 1] << 8)
                    }

                    Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 2, this.length)
                        return (this[offset] << 8) | this[offset + 1]
                    }

                    Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 4, this.length)

                        return ((this[offset]) |
                            (this[offset + 1] << 8) |
                            (this[offset + 2] << 16)) +
                            (this[offset + 3] * 0x1000000)
                    }

                    Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 4, this.length)

                        return (this[offset] * 0x1000000) +
                            ((this[offset + 1] << 16) |
                                (this[offset + 2] << 8) |
                                this[offset + 3])
                    }

                    Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                        offset = offset >>> 0
                        byteLength = byteLength >>> 0
                        if (!noAssert) checkOffset(offset, byteLength, this.length)

                        var val = this[offset]
                        var mul = 1
                        var i = 0
                        while (++i < byteLength && (mul *= 0x100)) {
                            val += this[offset + i] * mul
                        }
                        mul *= 0x80

                        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                        return val
                    }

                    Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                        offset = offset >>> 0
                        byteLength = byteLength >>> 0
                        if (!noAssert) checkOffset(offset, byteLength, this.length)

                        var i = byteLength
                        var mul = 1
                        var val = this[offset + --i]
                        while (i > 0 && (mul *= 0x100)) {
                            val += this[offset + --i] * mul
                        }
                        mul *= 0x80

                        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                        return val
                    }

                    Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 1, this.length)
                        if (!(this[offset] & 0x80)) return (this[offset])
                        return ((0xff - this[offset] + 1) * -1)
                    }

                    Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 2, this.length)
                        var val = this[offset] | (this[offset + 1] << 8)
                        return (val & 0x8000) ? val | 0xFFFF0000 : val
                    }

                    Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 2, this.length)
                        var val = this[offset + 1] | (this[offset] << 8)
                        return (val & 0x8000) ? val | 0xFFFF0000 : val
                    }

                    Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 4, this.length)

                        return (this[offset]) |
                            (this[offset + 1] << 8) |
                            (this[offset + 2] << 16) |
                            (this[offset + 3] << 24)
                    }

                    Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 4, this.length)

                        return (this[offset] << 24) |
                            (this[offset + 1] << 16) |
                            (this[offset + 2] << 8) |
                            (this[offset + 3])
                    }

                    Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 4, this.length)
                        return ieee754.read(this, offset, true, 23, 4)
                    }

                    Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 4, this.length)
                        return ieee754.read(this, offset, false, 23, 4)
                    }

                    Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 8, this.length)
                        return ieee754.read(this, offset, true, 52, 8)
                    }

                    Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                        offset = offset >>> 0
                        if (!noAssert) checkOffset(offset, 8, this.length)
                        return ieee754.read(this, offset, false, 52, 8)
                    }

                    function checkInt(buf, value, offset, ext, max, min) {
                        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
                        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
                        if (offset + ext > buf.length) throw new RangeError('Index out of range')
                    }

                    Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        byteLength = byteLength >>> 0
                        if (!noAssert) {
                            var maxBytes = Math.pow(2, 8 * byteLength) - 1
                            checkInt(this, value, offset, byteLength, maxBytes, 0)
                        }

                        var mul = 1
                        var i = 0
                        this[offset] = value & 0xFF
                        while (++i < byteLength && (mul *= 0x100)) {
                            this[offset + i] = (value / mul) & 0xFF
                        }

                        return offset + byteLength
                    }

                    Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        byteLength = byteLength >>> 0
                        if (!noAssert) {
                            var maxBytes = Math.pow(2, 8 * byteLength) - 1
                            checkInt(this, value, offset, byteLength, maxBytes, 0)
                        }

                        var i = byteLength - 1
                        var mul = 1
                        this[offset + i] = value & 0xFF
                        while (--i >= 0 && (mul *= 0x100)) {
                            this[offset + i] = (value / mul) & 0xFF
                        }

                        return offset + byteLength
                    }

                    Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
                        this[offset] = (value & 0xff)
                        return offset + 1
                    }

                    Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                        this[offset] = (value & 0xff)
                        this[offset + 1] = (value >>> 8)
                        return offset + 2
                    }

                    Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                        this[offset] = (value >>> 8)
                        this[offset + 1] = (value & 0xff)
                        return offset + 2
                    }

                    Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                        this[offset + 3] = (value >>> 24)
                        this[offset + 2] = (value >>> 16)
                        this[offset + 1] = (value >>> 8)
                        this[offset] = (value & 0xff)
                        return offset + 4
                    }

                    Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                        this[offset] = (value >>> 24)
                        this[offset + 1] = (value >>> 16)
                        this[offset + 2] = (value >>> 8)
                        this[offset + 3] = (value & 0xff)
                        return offset + 4
                    }

                    Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) {
                            var limit = Math.pow(2, (8 * byteLength) - 1)

                            checkInt(this, value, offset, byteLength, limit - 1, -limit)
                        }

                        var i = 0
                        var mul = 1
                        var sub = 0
                        this[offset] = value & 0xFF
                        while (++i < byteLength && (mul *= 0x100)) {
                            if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                                sub = 1
                            }
                            this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                        }

                        return offset + byteLength
                    }

                    Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) {
                            var limit = Math.pow(2, (8 * byteLength) - 1)

                            checkInt(this, value, offset, byteLength, limit - 1, -limit)
                        }

                        var i = byteLength - 1
                        var mul = 1
                        var sub = 0
                        this[offset + i] = value & 0xFF
                        while (--i >= 0 && (mul *= 0x100)) {
                            if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                                sub = 1
                            }
                            this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                        }

                        return offset + byteLength
                    }

                    Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
                        if (value < 0) value = 0xff + value + 1
                        this[offset] = (value & 0xff)
                        return offset + 1
                    }

                    Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                        this[offset] = (value & 0xff)
                        this[offset + 1] = (value >>> 8)
                        return offset + 2
                    }

                    Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                        this[offset] = (value >>> 8)
                        this[offset + 1] = (value & 0xff)
                        return offset + 2
                    }

                    Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                        this[offset] = (value & 0xff)
                        this[offset + 1] = (value >>> 8)
                        this[offset + 2] = (value >>> 16)
                        this[offset + 3] = (value >>> 24)
                        return offset + 4
                    }

                    Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                        if (value < 0) value = 0xffffffff + value + 1
                        this[offset] = (value >>> 24)
                        this[offset + 1] = (value >>> 16)
                        this[offset + 2] = (value >>> 8)
                        this[offset + 3] = (value & 0xff)
                        return offset + 4
                    }

                    function checkIEEE754(buf, value, offset, ext, max, min) {
                        if (offset + ext > buf.length) throw new RangeError('Index out of range')
                        if (offset < 0) throw new RangeError('Index out of range')
                    }

                    function writeFloat(buf, value, offset, littleEndian, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) {
                            checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
                        }
                        ieee754.write(buf, value, offset, littleEndian, 23, 4)
                        return offset + 4
                    }

                    Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                        return writeFloat(this, value, offset, true, noAssert)
                    }

                    Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                        return writeFloat(this, value, offset, false, noAssert)
                    }

                    function writeDouble(buf, value, offset, littleEndian, noAssert) {
                        value = +value
                        offset = offset >>> 0
                        if (!noAssert) {
                            checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
                        }
                        ieee754.write(buf, value, offset, littleEndian, 52, 8)
                        return offset + 8
                    }

                    Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                        return writeDouble(this, value, offset, true, noAssert)
                    }

                    Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                        return writeDouble(this, value, offset, false, noAssert)
                    }

                    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
                    Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                        if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
                        if (!start) start = 0
                        if (!end && end !== 0) end = this.length
                        if (targetStart >= target.length) targetStart = target.length
                        if (!targetStart) targetStart = 0
                        if (end > 0 && end < start) end = start

                        // Copy 0 bytes; we're done
                        if (end === start) return 0
                        if (target.length === 0 || this.length === 0) return 0

                        // Fatal error conditions
                        if (targetStart < 0) {
                            throw new RangeError('targetStart out of bounds')
                        }
                        if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
                        if (end < 0) throw new RangeError('sourceEnd out of bounds')

                        // Are we oob?
                        if (end > this.length) end = this.length
                        if (target.length - targetStart < end - start) {
                            end = target.length - targetStart + start
                        }

                        var len = end - start

                        if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
                            // Use built-in when available, missing from IE11
                            this.copyWithin(targetStart, start, end)
                        } else if (this === target && start < targetStart && targetStart < end) {
                            // descending copy from end
                            for (var i = len - 1; i >= 0; --i) {
                                target[i + targetStart] = this[i + start]
                            }
                        } else {
                            Uint8Array.prototype.set.call(
                                target,
                                this.subarray(start, end),
                                targetStart
                            )
                        }

                        return len
                    }

                    // Usage:
                    //    buffer.fill(number[, offset[, end]])
                    //    buffer.fill(buffer[, offset[, end]])
                    //    buffer.fill(string[, offset[, end]][, encoding])
                    Buffer.prototype.fill = function fill(val, start, end, encoding) {
                        // Handle string cases:
                        if (typeof val === 'string') {
                            if (typeof start === 'string') {
                                encoding = start
                                start = 0
                                end = this.length
                            } else if (typeof end === 'string') {
                                encoding = end
                                end = this.length
                            }
                            if (encoding !== undefined && typeof encoding !== 'string') {
                                throw new TypeError('encoding must be a string')
                            }
                            if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                                throw new TypeError('Unknown encoding: ' + encoding)
                            }
                            if (val.length === 1) {
                                var code = val.charCodeAt(0)
                                if ((encoding === 'utf8' && code < 128) ||
                                    encoding === 'latin1') {
                                    // Fast path: If `val` fits into a single byte, use that numeric value.
                                    val = code
                                }
                            }
                        } else if (typeof val === 'number') {
                            val = val & 255
                        }

                        // Invalid ranges are not set to a default, so can range check early.
                        if (start < 0 || this.length < start || this.length < end) {
                            throw new RangeError('Out of range index')
                        }

                        if (end <= start) {
                            return this
                        }

                        start = start >>> 0
                        end = end === undefined ? this.length : end >>> 0

                        if (!val) val = 0

                        var i
                        if (typeof val === 'number') {
                            for (i = start; i < end; ++i) {
                                this[i] = val
                            }
                        } else {
                            var bytes = Buffer.isBuffer(val)
                                ? val
                                : Buffer.from(val, encoding)
                            var len = bytes.length
                            if (len === 0) {
                                throw new TypeError('The value "' + val +
                                    '" is invalid for argument "value"')
                            }
                            for (i = 0; i < end - start; ++i) {
                                this[i + start] = bytes[i % len]
                            }
                        }

                        return this
                    }

                    // HELPER FUNCTIONS
                    // ================

                    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

                    function base64clean(str) {
                        // Node takes equal signs as end of the Base64 encoding
                        str = str.split('=')[0]
                        // Node strips out invalid characters like \n and \t from the string, base64-js does not
                        str = str.trim().replace(INVALID_BASE64_RE, '')
                        // Node converts strings with length < 2 to ''
                        if (str.length < 2) return ''
                        // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                        while (str.length % 4 !== 0) {
                            str = str + '='
                        }
                        return str
                    }

                    function toHex(n) {
                        if (n < 16) return '0' + n.toString(16)
                        return n.toString(16)
                    }

                    function utf8ToBytes(string, units) {
                        units = units || Infinity
                        var codePoint
                        var length = string.length
                        var leadSurrogate = null
                        var bytes = []

                        for (var i = 0; i < length; ++i) {
                            codePoint = string.charCodeAt(i)

                            // is surrogate component
                            if (codePoint > 0xD7FF && codePoint < 0xE000) {
                                // last char was a lead
                                if (!leadSurrogate) {
                                    // no lead yet
                                    if (codePoint > 0xDBFF) {
                                        // unexpected trail
                                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                        continue
                                    } else if (i + 1 === length) {
                                        // unpaired lead
                                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                        continue
                                    }

                                    // valid lead
                                    leadSurrogate = codePoint

                                    continue
                                }

                                // 2 leads in a row
                                if (codePoint < 0xDC00) {
                                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                    leadSurrogate = codePoint
                                    continue
                                }

                                // valid surrogate pair
                                codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
                            } else if (leadSurrogate) {
                                // valid bmp char, but last char was a lead
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                            }

                            leadSurrogate = null

                            // encode utf8
                            if (codePoint < 0x80) {
                                if ((units -= 1) < 0) break
                                bytes.push(codePoint)
                            } else if (codePoint < 0x800) {
                                if ((units -= 2) < 0) break
                                bytes.push(
                                    codePoint >> 0x6 | 0xC0,
                                    codePoint & 0x3F | 0x80
                                )
                            } else if (codePoint < 0x10000) {
                                if ((units -= 3) < 0) break
                                bytes.push(
                                    codePoint >> 0xC | 0xE0,
                                    codePoint >> 0x6 & 0x3F | 0x80,
                                    codePoint & 0x3F | 0x80
                                )
                            } else if (codePoint < 0x110000) {
                                if ((units -= 4) < 0) break
                                bytes.push(
                                    codePoint >> 0x12 | 0xF0,
                                    codePoint >> 0xC & 0x3F | 0x80,
                                    codePoint >> 0x6 & 0x3F | 0x80,
                                    codePoint & 0x3F | 0x80
                                )
                            } else {
                                throw new Error('Invalid code point')
                            }
                        }

                        return bytes
                    }

                    function asciiToBytes(str) {
                        var byteArray = []
                        for (var i = 0; i < str.length; ++i) {
                            // Node's code seems to be doing this and not & 0x7F..
                            byteArray.push(str.charCodeAt(i) & 0xFF)
                        }
                        return byteArray
                    }

                    function utf16leToBytes(str, units) {
                        var c, hi, lo
                        var byteArray = []
                        for (var i = 0; i < str.length; ++i) {
                            if ((units -= 2) < 0) break

                            c = str.charCodeAt(i)
                            hi = c >> 8
                            lo = c % 256
                            byteArray.push(lo)
                            byteArray.push(hi)
                        }

                        return byteArray
                    }

                    function base64ToBytes(str) {
                        return base64.toByteArray(base64clean(str))
                    }

                    function blitBuffer(src, dst, offset, length) {
                        for (var i = 0; i < length; ++i) {
                            if ((i + offset >= dst.length) || (i >= src.length)) break
                            dst[i + offset] = src[i]
                        }
                        return i
                    }

                    // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
                    // the `instanceof` check but they should be treated as of that type.
                    // See: https://github.com/feross/buffer/issues/166
                    function isInstance(obj, type) {
                        return obj instanceof type ||
                            (obj != null && obj.constructor != null && obj.constructor.name != null &&
                                obj.constructor.name === type.name)
                    }
                    function numberIsNaN(obj) {
                        // For IE11 support
                        return obj !== obj // eslint-disable-line no-self-compare
                    }

                }).call(this)
            }).call(this, require("buffer").Buffer)
        }, { "base64-js": 1, "buffer": 3, "ieee754": 5 }], 4: [function (require, module, exports) {
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.

            'use strict';

            var R = typeof Reflect === 'object' ? Reflect : null
            var ReflectApply = R && typeof R.apply === 'function'
                ? R.apply
                : function ReflectApply(target, receiver, args) {
                    return Function.prototype.apply.call(target, receiver, args);
                }

            var ReflectOwnKeys
            if (R && typeof R.ownKeys === 'function') {
                ReflectOwnKeys = R.ownKeys
            } else if (Object.getOwnPropertySymbols) {
                ReflectOwnKeys = function ReflectOwnKeys(target) {
                    return Object.getOwnPropertyNames(target)
                        .concat(Object.getOwnPropertySymbols(target));
                };
            } else {
                ReflectOwnKeys = function ReflectOwnKeys(target) {
                    return Object.getOwnPropertyNames(target);
                };
            }

            function ProcessEmitWarning(warning) {
                if (console && console.warn) console.warn(warning);
            }

            var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
                return value !== value;
            }

            function EventEmitter() {
                EventEmitter.init.call(this);
            }
            module.exports = EventEmitter;
            module.exports.once = once;

            // Backwards-compat with node 0.10.x
            EventEmitter.EventEmitter = EventEmitter;

            EventEmitter.prototype._events = undefined;
            EventEmitter.prototype._eventsCount = 0;
            EventEmitter.prototype._maxListeners = undefined;

            // By default EventEmitters will print a warning if more than 10 listeners are
            // added to it. This is a useful default which helps finding memory leaks.
            var defaultMaxListeners = 10;

            function checkListener(listener) {
                if (typeof listener !== 'function') {
                    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
                }
            }

            Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
                enumerable: true,
                get: function () {
                    return defaultMaxListeners;
                },
                set: function (arg) {
                    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
                        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
                    }
                    defaultMaxListeners = arg;
                }
            });

            EventEmitter.init = function () {

                if (this._events === undefined ||
                    this._events === Object.getPrototypeOf(this)._events) {
                    this._events = Object.create(null);
                    this._eventsCount = 0;
                }

                this._maxListeners = this._maxListeners || undefined;
            };

            // Obviously not all Emitters should be limited to 10. This function allows
            // that to be increased. Set to zero for unlimited.
            EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
                if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
                    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
                }
                this._maxListeners = n;
                return this;
            };

            function _getMaxListeners(that) {
                if (that._maxListeners === undefined)
                    return EventEmitter.defaultMaxListeners;
                return that._maxListeners;
            }

            EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
                return _getMaxListeners(this);
            };

            EventEmitter.prototype.emit = function emit(type) {
                var args = [];
                for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
                var doError = (type === 'error');

                var events = this._events;
                if (events !== undefined)
                    doError = (doError && events.error === undefined);
                else if (!doError)
                    return false;

                // If there is no 'error' event listener then throw.
                if (doError) {
                    var er;
                    if (args.length > 0)
                        er = args[0];
                    if (er instanceof Error) {
                        // Note: The comments on the `throw` lines are intentional, they show
                        // up in Node's output if this results in an unhandled exception.
                        throw er; // Unhandled 'error' event
                    }
                    // At least give some kind of context to the user
                    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
                    err.context = er;
                    throw err; // Unhandled 'error' event
                }

                var handler = events[type];

                if (handler === undefined)
                    return false;

                if (typeof handler === 'function') {
                    ReflectApply(handler, this, args);
                } else {
                    var len = handler.length;
                    var listeners = arrayClone(handler, len);
                    for (var i = 0; i < len; ++i)
                        ReflectApply(listeners[i], this, args);
                }

                return true;
            };

            function _addListener(target, type, listener, prepend) {
                var m;
                var events;
                var existing;

                checkListener(listener);

                events = target._events;
                if (events === undefined) {
                    events = target._events = Object.create(null);
                    target._eventsCount = 0;
                } else {
                    // To avoid recursion in the case that type === "newListener"! Before
                    // adding it to the listeners, first emit "newListener".
                    if (events.newListener !== undefined) {
                        target.emit('newListener', type,
                            listener.listener ? listener.listener : listener);

                        // Re-assign `events` because a newListener handler could have caused the
                        // this._events to be assigned to a new object
                        events = target._events;
                    }
                    existing = events[type];
                }

                if (existing === undefined) {
                    // Optimize the case of one listener. Don't need the extra array object.
                    existing = events[type] = listener;
                    ++target._eventsCount;
                } else {
                    if (typeof existing === 'function') {
                        // Adding the second element, need to change to array.
                        existing = events[type] =
                            prepend ? [listener, existing] : [existing, listener];
                        // If we've already got an array, just append.
                    } else if (prepend) {
                        existing.unshift(listener);
                    } else {
                        existing.push(listener);
                    }

                    // Check for listener leak
                    m = _getMaxListeners(target);
                    if (m > 0 && existing.length > m && !existing.warned) {
                        existing.warned = true;
                        // No error code for this since it is a Warning
                        // eslint-disable-next-line no-restricted-syntax
                        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + String(type) + ' listeners ' +
                            'added. Use emitter.setMaxListeners() to ' +
                            'increase limit');
                        w.name = 'MaxListenersExceededWarning';
                        w.emitter = target;
                        w.type = type;
                        w.count = existing.length;
                        ProcessEmitWarning(w);
                    }
                }

                return target;
            }

            EventEmitter.prototype.addListener = function addListener(type, listener) {
                return _addListener(this, type, listener, false);
            };

            EventEmitter.prototype.on = EventEmitter.prototype.addListener;

            EventEmitter.prototype.prependListener =
                function prependListener(type, listener) {
                    return _addListener(this, type, listener, true);
                };

            function onceWrapper() {
                if (!this.fired) {
                    this.target.removeListener(this.type, this.wrapFn);
                    this.fired = true;
                    if (arguments.length === 0)
                        return this.listener.call(this.target);
                    return this.listener.apply(this.target, arguments);
                }
            }

            function _onceWrap(target, type, listener) {
                var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
                var wrapped = onceWrapper.bind(state);
                wrapped.listener = listener;
                state.wrapFn = wrapped;
                return wrapped;
            }

            EventEmitter.prototype.once = function once(type, listener) {
                checkListener(listener);
                this.on(type, _onceWrap(this, type, listener));
                return this;
            };

            EventEmitter.prototype.prependOnceListener =
                function prependOnceListener(type, listener) {
                    checkListener(listener);
                    this.prependListener(type, _onceWrap(this, type, listener));
                    return this;
                };

            // Emits a 'removeListener' event if and only if the listener was removed.
            EventEmitter.prototype.removeListener =
                function removeListener(type, listener) {
                    var list, events, position, i, originalListener;

                    checkListener(listener);

                    events = this._events;
                    if (events === undefined)
                        return this;

                    list = events[type];
                    if (list === undefined)
                        return this;

                    if (list === listener || list.listener === listener) {
                        if (--this._eventsCount === 0)
                            this._events = Object.create(null);
                        else {
                            delete events[type];
                            if (events.removeListener)
                                this.emit('removeListener', type, list.listener || listener);
                        }
                    } else if (typeof list !== 'function') {
                        position = -1;

                        for (i = list.length - 1; i >= 0; i--) {
                            if (list[i] === listener || list[i].listener === listener) {
                                originalListener = list[i].listener;
                                position = i;
                                break;
                            }
                        }

                        if (position < 0)
                            return this;

                        if (position === 0)
                            list.shift();
                        else {
                            spliceOne(list, position);
                        }

                        if (list.length === 1)
                            events[type] = list[0];

                        if (events.removeListener !== undefined)
                            this.emit('removeListener', type, originalListener || listener);
                    }

                    return this;
                };

            EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

            EventEmitter.prototype.removeAllListeners =
                function removeAllListeners(type) {
                    var listeners, events, i;

                    events = this._events;
                    if (events === undefined)
                        return this;

                    // not listening for removeListener, no need to emit
                    if (events.removeListener === undefined) {
                        if (arguments.length === 0) {
                            this._events = Object.create(null);
                            this._eventsCount = 0;
                        } else if (events[type] !== undefined) {
                            if (--this._eventsCount === 0)
                                this._events = Object.create(null);
                            else
                                delete events[type];
                        }
                        return this;
                    }

                    // emit removeListener for all listeners on all events
                    if (arguments.length === 0) {
                        var keys = Object.keys(events);
                        var key;
                        for (i = 0; i < keys.length; ++i) {
                            key = keys[i];
                            if (key === 'removeListener') continue;
                            this.removeAllListeners(key);
                        }
                        this.removeAllListeners('removeListener');
                        this._events = Object.create(null);
                        this._eventsCount = 0;
                        return this;
                    }

                    listeners = events[type];

                    if (typeof listeners === 'function') {
                        this.removeListener(type, listeners);
                    } else if (listeners !== undefined) {
                        // LIFO order
                        for (i = listeners.length - 1; i >= 0; i--) {
                            this.removeListener(type, listeners[i]);
                        }
                    }

                    return this;
                };

            function _listeners(target, type, unwrap) {
                var events = target._events;

                if (events === undefined)
                    return [];

                var evlistener = events[type];
                if (evlistener === undefined)
                    return [];

                if (typeof evlistener === 'function')
                    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

                return unwrap ?
                    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
            }

            EventEmitter.prototype.listeners = function listeners(type) {
                return _listeners(this, type, true);
            };

            EventEmitter.prototype.rawListeners = function rawListeners(type) {
                return _listeners(this, type, false);
            };

            EventEmitter.listenerCount = function (emitter, type) {
                if (typeof emitter.listenerCount === 'function') {
                    return emitter.listenerCount(type);
                } else {
                    return listenerCount.call(emitter, type);
                }
            };

            EventEmitter.prototype.listenerCount = listenerCount;
            function listenerCount(type) {
                var events = this._events;

                if (events !== undefined) {
                    var evlistener = events[type];

                    if (typeof evlistener === 'function') {
                        return 1;
                    } else if (evlistener !== undefined) {
                        return evlistener.length;
                    }
                }

                return 0;
            }

            EventEmitter.prototype.eventNames = function eventNames() {
                return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
            };

            function arrayClone(arr, n) {
                var copy = new Array(n);
                for (var i = 0; i < n; ++i)
                    copy[i] = arr[i];
                return copy;
            }

            function spliceOne(list, index) {
                for (; index + 1 < list.length; index++)
                    list[index] = list[index + 1];
                list.pop();
            }

            function unwrapListeners(arr) {
                var ret = new Array(arr.length);
                for (var i = 0; i < ret.length; ++i) {
                    ret[i] = arr[i].listener || arr[i];
                }
                return ret;
            }

            function once(emitter, name) {
                return new Promise(function (resolve, reject) {
                    function errorListener(err) {
                        emitter.removeListener(name, resolver);
                        reject(err);
                    }

                    function resolver() {
                        if (typeof emitter.removeListener === 'function') {
                            emitter.removeListener('error', errorListener);
                        }
                        resolve([].slice.call(arguments));
                    };

                    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
                    if (name !== 'error') {
                        addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
                    }
                });
            }

            function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
                if (typeof emitter.on === 'function') {
                    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
                }
            }

            function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
                if (typeof emitter.on === 'function') {
                    if (flags.once) {
                        emitter.once(name, listener);
                    } else {
                        emitter.on(name, listener);
                    }
                } else if (typeof emitter.addEventListener === 'function') {
                    // EventTarget does not have `error` event semantics like Node
                    // EventEmitters, we do not listen for `error` events here.
                    emitter.addEventListener(name, function wrapListener(arg) {
                        // IE does not have builtin `{ once: true }` support so we
                        // have to do it manually.
                        if (flags.once) {
                            emitter.removeEventListener(name, wrapListener);
                        }
                        listener(arg);
                    });
                } else {
                    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
                }
            }

        }, {}], 5: [function (require, module, exports) {
            /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
            exports.read = function (buffer, offset, isLE, mLen, nBytes) {
                var e, m
                var eLen = (nBytes * 8) - mLen - 1
                var eMax = (1 << eLen) - 1
                var eBias = eMax >> 1
                var nBits = -7
                var i = isLE ? (nBytes - 1) : 0
                var d = isLE ? -1 : 1
                var s = buffer[offset + i]

                i += d

                e = s & ((1 << (-nBits)) - 1)
                s >>= (-nBits)
                nBits += eLen
                for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) { }

                m = e & ((1 << (-nBits)) - 1)
                e >>= (-nBits)
                nBits += mLen
                for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) { }

                if (e === 0) {
                    e = 1 - eBias
                } else if (e === eMax) {
                    return m ? NaN : ((s ? -1 : 1) * Infinity)
                } else {
                    m = m + Math.pow(2, mLen)
                    e = e - eBias
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
            }

            exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c
                var eLen = (nBytes * 8) - mLen - 1
                var eMax = (1 << eLen) - 1
                var eBias = eMax >> 1
                var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
                var i = isLE ? 0 : (nBytes - 1)
                var d = isLE ? 1 : -1
                var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

                value = Math.abs(value)

                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0
                    e = eMax
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2)
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--
                        c *= 2
                    }
                    if (e + eBias >= 1) {
                        value += rt / c
                    } else {
                        value += rt * Math.pow(2, 1 - eBias)
                    }
                    if (value * c >= 2) {
                        e++
                        c /= 2
                    }

                    if (e + eBias >= eMax) {
                        m = 0
                        e = eMax
                    } else if (e + eBias >= 1) {
                        m = ((value * c) - 1) * Math.pow(2, mLen)
                        e = e + eBias
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
                        e = 0
                    }
                }

                for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) { }

                e = (e << mLen) | m
                eLen += mLen
                for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) { }

                buffer[offset + i - d] |= s * 128
            }

        }, {}], 6: [function (require, module, exports) {
            if (typeof Object.create === 'function') {
                // implementation from standard node.js 'util' module
                module.exports = function inherits(ctor, superCtor) {
                    if (superCtor) {
                        ctor.super_ = superCtor
                        ctor.prototype = Object.create(superCtor.prototype, {
                            constructor: {
                                value: ctor,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        })
                    }
                };
            } else {
                // old school shim for old browsers
                module.exports = function inherits(ctor, superCtor) {
                    if (superCtor) {
                        ctor.super_ = superCtor
                        var TempCtor = function () { }
                        TempCtor.prototype = superCtor.prototype
                        ctor.prototype = new TempCtor()
                        ctor.prototype.constructor = ctor
                    }
                }
            }

        }, {}], 7: [function (require, module, exports) {
            /*!
             * Determine if an object is a Buffer
             *
             * @author   Feross Aboukhadijeh <https://feross.org>
             * @license  MIT
             */

            // The _isBuffer check is for Safari 5-7 support, because it's missing
            // Object.prototype.constructor. Remove this eventually
            module.exports = function (obj) {
                return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
            }

            function isBuffer(obj) {
                return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
            }

            // For Node v0.10 support. Remove this eventually.
            function isSlowBuffer(obj) {
                return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
            }

        }, {}], 8: [function (require, module, exports) {
            // shim for using process in browser
            var process = module.exports = {};

            // cached from whatever global is present so that test runners that stub it
            // don't break things.  But we need to wrap it in a try catch in case it is
            // wrapped in strict mode code which doesn't define any globals.  It's inside a
            // function because try/catches deoptimize in certain engines.

            var cachedSetTimeout;
            var cachedClearTimeout;

            function defaultSetTimout() {
                throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout() {
                throw new Error('clearTimeout has not been defined');
            }
            (function () {
                try {
                    if (typeof setTimeout === 'function') {
                        cachedSetTimeout = setTimeout;
                    } else {
                        cachedSetTimeout = defaultSetTimout;
                    }
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout;
                }
                try {
                    if (typeof clearTimeout === 'function') {
                        cachedClearTimeout = clearTimeout;
                    } else {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                } catch (e) {
                    cachedClearTimeout = defaultClearTimeout;
                }
            }())
            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    //normal enviroments in sane situations
                    return setTimeout(fun, 0);
                }
                // if setTimeout wasn't available but was latter defined
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedSetTimeout(fun, 0);
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch (e) {
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }


            }
            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    //normal enviroments in sane situations
                    return clearTimeout(marker);
                }
                // if clearTimeout wasn't available but was latter defined
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedClearTimeout(marker);
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                        return cachedClearTimeout.call(null, marker);
                    } catch (e) {
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                        return cachedClearTimeout.call(this, marker);
                    }
                }



            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;

            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return;
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }

            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;

                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
            }

            process.nextTick = function (fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue);
                }
            };

            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = ''; // empty string to avoid regexp issues
            process.versions = {};

            function noop() { }

            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.prependListener = noop;
            process.prependOnceListener = noop;

            process.listeners = function (name) { return [] }

            process.binding = function (name) {
                throw new Error('process.binding is not supported');
            };

            process.cwd = function () { return '/' };
            process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function () { return 0; };

        }, {}], 9: [function (require, module, exports) {
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.

            'use strict';

            // If obj.hasOwnProperty has been overridden, then calling
            // obj.hasOwnProperty(prop) will break.
            // See: https://github.com/joyent/node/issues/1707
            function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }

            module.exports = function (qs, sep, eq, options) {
                sep = sep || '&';
                eq = eq || '=';
                var obj = {};

                if (typeof qs !== 'string' || qs.length === 0) {
                    return obj;
                }

                var regexp = /\+/g;
                qs = qs.split(sep);

                var maxKeys = 1000;
                if (options && typeof options.maxKeys === 'number') {
                    maxKeys = options.maxKeys;
                }

                var len = qs.length;
                // maxKeys <= 0 means that we should not limit keys count
                if (maxKeys > 0 && len > maxKeys) {
                    len = maxKeys;
                }

                for (var i = 0; i < len; ++i) {
                    var x = qs[i].replace(regexp, '%20'),
                        idx = x.indexOf(eq),
                        kstr, vstr, k, v;

                    if (idx >= 0) {
                        kstr = x.substr(0, idx);
                        vstr = x.substr(idx + 1);
                    } else {
                        kstr = x;
                        vstr = '';
                    }

                    k = decodeURIComponent(kstr);
                    v = decodeURIComponent(vstr);

                    if (!hasOwnProperty(obj, k)) {
                        obj[k] = v;
                    } else if (isArray(obj[k])) {
                        obj[k].push(v);
                    } else {
                        obj[k] = [obj[k], v];
                    }
                }

                return obj;
            };

            var isArray = Array.isArray || function (xs) {
                return Object.prototype.toString.call(xs) === '[object Array]';
            };

        }, {}], 10: [function (require, module, exports) {
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.

            'use strict';

            var stringifyPrimitive = function (v) {
                switch (typeof v) {
                    case 'string':
                        return v;

                    case 'boolean':
                        return v ? 'true' : 'false';

                    case 'number':
                        return isFinite(v) ? v : '';

                    default:
                        return '';
                }
            };

            module.exports = function (obj, sep, eq, name) {
                sep = sep || '&';
                eq = eq || '=';
                if (obj === null) {
                    obj = undefined;
                }

                if (typeof obj === 'object') {
                    return map(objectKeys(obj), function (k) {
                        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                        if (isArray(obj[k])) {
                            return map(obj[k], function (v) {
                                return ks + encodeURIComponent(stringifyPrimitive(v));
                            }).join(sep);
                        } else {
                            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                        }
                    }).join(sep);

                }

                if (!name) return '';
                return encodeURIComponent(stringifyPrimitive(name)) + eq +
                    encodeURIComponent(stringifyPrimitive(obj));
            };

            var isArray = Array.isArray || function (xs) {
                return Object.prototype.toString.call(xs) === '[object Array]';
            };

            function map(xs, f) {
                if (xs.map) return xs.map(f);
                var res = [];
                for (var i = 0; i < xs.length; i++) {
                    res.push(f(xs[i], i));
                }
                return res;
            }

            var objectKeys = Object.keys || function (obj) {
                var res = [];
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
                }
                return res;
            };

        }, {}], 11: [function (require, module, exports) {
            'use strict';

            exports.decode = exports.parse = require('./decode');
            exports.encode = exports.stringify = require('./encode');

        }, { "./decode": 9, "./encode": 10 }], 12: [function (require, module, exports) {
            /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
            /* eslint-disable node/no-deprecated-api */
            var buffer = require('buffer')
            var Buffer = buffer.Buffer

            // alternative to using Object.keys for old browsers
            function copyProps(src, dst) {
                for (var key in src) {
                    dst[key] = src[key]
                }
            }
            if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
                module.exports = buffer
            } else {
                // Copy properties from require('buffer')
                copyProps(buffer, exports)
                exports.Buffer = SafeBuffer
            }

            function SafeBuffer(arg, encodingOrOffset, length) {
                return Buffer(arg, encodingOrOffset, length)
            }

            SafeBuffer.prototype = Object.create(Buffer.prototype)

            // Copy static methods from Buffer
            copyProps(Buffer, SafeBuffer)

            SafeBuffer.from = function (arg, encodingOrOffset, length) {
                if (typeof arg === 'number') {
                    throw new TypeError('Argument must not be a number')
                }
                return Buffer(arg, encodingOrOffset, length)
            }

            SafeBuffer.alloc = function (size, fill, encoding) {
                if (typeof size !== 'number') {
                    throw new TypeError('Argument must be a number')
                }
                var buf = Buffer(size)
                if (fill !== undefined) {
                    if (typeof encoding === 'string') {
                        buf.fill(fill, encoding)
                    } else {
                        buf.fill(fill)
                    }
                } else {
                    buf.fill(0)
                }
                return buf
            }

            SafeBuffer.allocUnsafe = function (size) {
                if (typeof size !== 'number') {
                    throw new TypeError('Argument must be a number')
                }
                return Buffer(size)
            }

            SafeBuffer.allocUnsafeSlow = function (size) {
                if (typeof size !== 'number') {
                    throw new TypeError('Argument must be a number')
                }
                return buffer.SlowBuffer(size)
            }

        }, { "buffer": 3 }], 13: [function (require, module, exports) {
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.

            module.exports = Stream;

            var EE = require('events').EventEmitter;
            var inherits = require('inherits');

            inherits(Stream, EE);
            Stream.Readable = require('readable-stream/lib/_stream_readable.js');
            Stream.Writable = require('readable-stream/lib/_stream_writable.js');
            Stream.Duplex = require('readable-stream/lib/_stream_duplex.js');
            Stream.Transform = require('readable-stream/lib/_stream_transform.js');
            Stream.PassThrough = require('readable-stream/lib/_stream_passthrough.js');
            Stream.finished = require('readable-stream/lib/internal/streams/end-of-stream.js')
            Stream.pipeline = require('readable-stream/lib/internal/streams/pipeline.js')

            // Backwards-compat with node 0.4.x
            Stream.Stream = Stream;



            // old-style streams.  Note that the pipe method (the only relevant
            // part of this class) is overridden in the Readable class.

            function Stream() {
                EE.call(this);
            }

            Stream.prototype.pipe = function (dest, options) {
                var source = this;

                function ondata(chunk) {
                    if (dest.writable) {
                        if (false === dest.write(chunk) && source.pause) {
                            source.pause();
                        }
                    }
                }

                source.on('data', ondata);

                function ondrain() {
                    if (source.readable && source.resume) {
                        source.resume();
                    }
                }

                dest.on('drain', ondrain);

                // If the 'end' option is not supplied, dest.end() will be called when
                // source gets the 'end' or 'close' events.  Only dest.end() once.
                if (!dest._isStdio && (!options || options.end !== false)) {
                    source.on('end', onend);
                    source.on('close', onclose);
                }

                var didOnEnd = false;
                function onend() {
                    if (didOnEnd) return;
                    didOnEnd = true;

                    dest.end();
                }


                function onclose() {
                    if (didOnEnd) return;
                    didOnEnd = true;

                    if (typeof dest.destroy === 'function') dest.destroy();
                }

                // don't leave dangling pipes when there are errors.
                function onerror(er) {
                    cleanup();
                    if (EE.listenerCount(this, 'error') === 0) {
                        throw er; // Unhandled stream error in pipe.
                    }
                }

                source.on('error', onerror);
                dest.on('error', onerror);

                // remove all the event listeners that were added.
                function cleanup() {
                    source.removeListener('data', ondata);
                    dest.removeListener('drain', ondrain);

                    source.removeListener('end', onend);
                    source.removeListener('close', onclose);

                    source.removeListener('error', onerror);
                    dest.removeListener('error', onerror);

                    source.removeListener('end', cleanup);
                    source.removeListener('close', cleanup);

                    dest.removeListener('close', cleanup);
                }

                source.on('end', cleanup);
                source.on('close', cleanup);

                dest.on('close', cleanup);

                dest.emit('pipe', source);

                // Allow for unix-like usage: A.pipe(B).pipe(C)
                return dest;
            };

        }, { "events": 4, "inherits": 6, "readable-stream/lib/_stream_duplex.js": 15, "readable-stream/lib/_stream_passthrough.js": 16, "readable-stream/lib/_stream_readable.js": 17, "readable-stream/lib/_stream_transform.js": 18, "readable-stream/lib/_stream_writable.js": 19, "readable-stream/lib/internal/streams/end-of-stream.js": 23, "readable-stream/lib/internal/streams/pipeline.js": 25 }], 14: [function (require, module, exports) {
            'use strict';

            function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

            var codes = {};

            function createErrorType(code, message, Base) {
                if (!Base) {
                    Base = Error;
                }

                function getMessage(arg1, arg2, arg3) {
                    if (typeof message === 'string') {
                        return message;
                    } else {
                        return message(arg1, arg2, arg3);
                    }
                }

                var NodeError =
                    /*#__PURE__*/
                    function (_Base) {
                        _inheritsLoose(NodeError, _Base);

                        function NodeError(arg1, arg2, arg3) {
                            return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
                        }

                        return NodeError;
                    }(Base);

                NodeError.prototype.name = Base.name;
                NodeError.prototype.code = code;
                codes[code] = NodeError;
            } // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


            function oneOf(expected, thing) {
                if (Array.isArray(expected)) {
                    var len = expected.length;
                    expected = expected.map(function (i) {
                        return String(i);
                    });

                    if (len > 2) {
                        return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
                    } else if (len === 2) {
                        return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
                    } else {
                        return "of ".concat(thing, " ").concat(expected[0]);
                    }
                } else {
                    return "of ".concat(thing, " ").concat(String(expected));
                }
            } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


            function startsWith(str, search, pos) {
                return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
            } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


            function endsWith(str, search, this_len) {
                if (this_len === undefined || this_len > str.length) {
                    this_len = str.length;
                }

                return str.substring(this_len - search.length, this_len) === search;
            } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


            function includes(str, search, start) {
                if (typeof start !== 'number') {
                    start = 0;
                }

                if (start + search.length > str.length) {
                    return false;
                } else {
                    return str.indexOf(search, start) !== -1;
                }
            }

            createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
                return 'The value "' + value + '" is invalid for option "' + name + '"';
            }, TypeError);
            createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
                // determiner: 'must be' or 'must not be'
                var determiner;

                if (typeof expected === 'string' && startsWith(expected, 'not ')) {
                    determiner = 'must not be';
                    expected = expected.replace(/^not /, '');
                } else {
                    determiner = 'must be';
                }

                var msg;

                if (endsWith(name, ' argument')) {
                    // For cases like 'first argument'
                    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
                } else {
                    var type = includes(name, '.') ? 'property' : 'argument';
                    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
                }

                msg += ". Received type ".concat(typeof actual);
                return msg;
            }, TypeError);
            createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
            createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
                return 'The ' + name + ' method is not implemented';
            });
            createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
            createErrorType('ERR_STREAM_DESTROYED', function (name) {
                return 'Cannot call ' + name + ' after a stream was destroyed';
            });
            createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
            createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
            createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
            createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
            createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
                return 'Unknown encoding: ' + arg;
            }, TypeError);
            createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
            module.exports.codes = codes;

        }, {}], 15: [function (require, module, exports) {
            (function (process) {
                (function () {
                    // Copyright Joyent, Inc. and other Node contributors.
                    //
                    // Permission is hereby granted, free of charge, to any person obtaining a
                    // copy of this software and associated documentation files (the
                    // "Software"), to deal in the Software without restriction, including
                    // without limitation the rights to use, copy, modify, merge, publish,
                    // distribute, sublicense, and/or sell copies of the Software, and to permit
                    // persons to whom the Software is furnished to do so, subject to the
                    // following conditions:
                    //
                    // The above copyright notice and this permission notice shall be included
                    // in all copies or substantial portions of the Software.
                    //
                    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                    // USE OR OTHER DEALINGS IN THE SOFTWARE.
                    // a duplex stream is just a stream that is both readable and writable.
                    // Since JS doesn't have multiple prototypal inheritance, this class
                    // prototypally inherits from Readable, and then parasitically from
                    // Writable.
                    'use strict';
                    /*<replacement>*/

                    var objectKeys = Object.keys || function (obj) {
                        var keys = [];

                        for (var key in obj) {
                            keys.push(key);
                        }

                        return keys;
                    };
                    /*</replacement>*/


                    module.exports = Duplex;

                    var Readable = require('./_stream_readable');

                    var Writable = require('./_stream_writable');

                    require('inherits')(Duplex, Readable);

                    {
                        // Allow the keys array to be GC'ed.
                        var keys = objectKeys(Writable.prototype);

                        for (var v = 0; v < keys.length; v++) {
                            var method = keys[v];
                            if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
                        }
                    }

                    function Duplex(options) {
                        if (!(this instanceof Duplex)) return new Duplex(options);
                        Readable.call(this, options);
                        Writable.call(this, options);
                        this.allowHalfOpen = true;

                        if (options) {
                            if (options.readable === false) this.readable = false;
                            if (options.writable === false) this.writable = false;

                            if (options.allowHalfOpen === false) {
                                this.allowHalfOpen = false;
                                this.once('end', onend);
                            }
                        }
                    }

                    Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._writableState.highWaterMark;
                        }
                    });
                    Object.defineProperty(Duplex.prototype, 'writableBuffer', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._writableState && this._writableState.getBuffer();
                        }
                    });
                    Object.defineProperty(Duplex.prototype, 'writableLength', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._writableState.length;
                        }
                    }); // the no-half-open enforcer

                    function onend() {
                        // If the writable side ended, then we're ok.
                        if (this._writableState.ended) return; // no more data can be written.
                        // But allow more writes to happen in this tick.

                        process.nextTick(onEndNT, this);
                    }

                    function onEndNT(self) {
                        self.end();
                    }

                    Object.defineProperty(Duplex.prototype, 'destroyed', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            if (this._readableState === undefined || this._writableState === undefined) {
                                return false;
                            }

                            return this._readableState.destroyed && this._writableState.destroyed;
                        },
                        set: function set(value) {
                            // we ignore the value if the stream
                            // has not been initialized yet
                            if (this._readableState === undefined || this._writableState === undefined) {
                                return;
                            } // backward compatibility, the user is explicitly
                            // managing destroyed


                            this._readableState.destroyed = value;
                            this._writableState.destroyed = value;
                        }
                    });
                }).call(this)
            }).call(this, require('_process'))
        }, { "./_stream_readable": 17, "./_stream_writable": 19, "_process": 8, "inherits": 6 }], 16: [function (require, module, exports) {
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.
            // a passthrough stream.
            // basically just the most minimal sort of Transform stream.
            // Every written chunk gets output as-is.
            'use strict';

            module.exports = PassThrough;

            var Transform = require('./_stream_transform');

            require('inherits')(PassThrough, Transform);

            function PassThrough(options) {
                if (!(this instanceof PassThrough)) return new PassThrough(options);
                Transform.call(this, options);
            }

            PassThrough.prototype._transform = function (chunk, encoding, cb) {
                cb(null, chunk);
            };
        }, { "./_stream_transform": 18, "inherits": 6 }], 17: [function (require, module, exports) {
            (function (process, global) {
                (function () {
                    // Copyright Joyent, Inc. and other Node contributors.
                    //
                    // Permission is hereby granted, free of charge, to any person obtaining a
                    // copy of this software and associated documentation files (the
                    // "Software"), to deal in the Software without restriction, including
                    // without limitation the rights to use, copy, modify, merge, publish,
                    // distribute, sublicense, and/or sell copies of the Software, and to permit
                    // persons to whom the Software is furnished to do so, subject to the
                    // following conditions:
                    //
                    // The above copyright notice and this permission notice shall be included
                    // in all copies or substantial portions of the Software.
                    //
                    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                    // USE OR OTHER DEALINGS IN THE SOFTWARE.
                    'use strict';

                    module.exports = Readable;
                    /*<replacement>*/

                    var Duplex;
                    /*</replacement>*/

                    Readable.ReadableState = ReadableState;
                    /*<replacement>*/

                    var EE = require('events').EventEmitter;

                    var EElistenerCount = function EElistenerCount(emitter, type) {
                        return emitter.listeners(type).length;
                    };
                    /*</replacement>*/

                    /*<replacement>*/


                    var Stream = require('./internal/streams/stream');
                    /*</replacement>*/


                    var Buffer = require('buffer').Buffer;

                    var OurUint8Array = global.Uint8Array || function () { };

                    function _uint8ArrayToBuffer(chunk) {
                        return Buffer.from(chunk);
                    }

                    function _isUint8Array(obj) {
                        return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
                    }
                    /*<replacement>*/


                    var debugUtil = require('util');

                    var debug;

                    if (debugUtil && debugUtil.debuglog) {
                        debug = debugUtil.debuglog('stream');
                    } else {
                        debug = function debug() { };
                    }
                    /*</replacement>*/


                    var BufferList = require('./internal/streams/buffer_list');

                    var destroyImpl = require('./internal/streams/destroy');

                    var _require = require('./internal/streams/state'),
                        getHighWaterMark = _require.getHighWaterMark;

                    var _require$codes = require('../errors').codes,
                        ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
                        ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
                        ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
                        ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.


                    var StringDecoder;
                    var createReadableStreamAsyncIterator;
                    var from;

                    require('inherits')(Readable, Stream);

                    var errorOrDestroy = destroyImpl.errorOrDestroy;
                    var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

                    function prependListener(emitter, event, fn) {
                        // Sadly this is not cacheable as some libraries bundle their own
                        // event emitter implementation with them.
                        if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
                        // userland ones.  NEVER DO THIS. This is here only because this code needs
                        // to continue to work with older versions of Node.js that do not include
                        // the prependListener() method. The goal is to eventually remove this hack.

                        if (!emitter._events || !emitter._events[event]) emitter.on(event, fn); else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn); else emitter._events[event] = [fn, emitter._events[event]];
                    }

                    function ReadableState(options, stream, isDuplex) {
                        Duplex = Duplex || require('./_stream_duplex');
                        options = options || {}; // Duplex streams are both readable and writable, but share
                        // the same options object.
                        // However, some cases require setting options to different
                        // values for the readable and the writable sides of the duplex stream.
                        // These options can be provided separately as readableXXX and writableXXX.

                        if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
                        // make all the buffer merging and length checks go away

                        this.objectMode = !!options.objectMode;
                        if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
                        // Note: 0 is a valid value, means "don't call _read preemptively ever"

                        this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
                        // linked list can remove elements from the beginning faster than
                        // array.shift()

                        this.buffer = new BufferList();
                        this.length = 0;
                        this.pipes = null;
                        this.pipesCount = 0;
                        this.flowing = null;
                        this.ended = false;
                        this.endEmitted = false;
                        this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
                        // immediately, or on a later tick.  We set this to true at first, because
                        // any actions that shouldn't happen until "later" should generally also
                        // not happen before the first read call.

                        this.sync = true; // whenever we return null, then we set a flag to say
                        // that we're awaiting a 'readable' event emission.

                        this.needReadable = false;
                        this.emittedReadable = false;
                        this.readableListening = false;
                        this.resumeScheduled = false;
                        this.paused = true; // Should close be emitted on destroy. Defaults to true.

                        this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

                        this.autoDestroy = !!options.autoDestroy; // has it been destroyed

                        this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
                        // encoding is 'binary' so we have to make this configurable.
                        // Everything else in the universe uses 'utf8', though.

                        this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

                        this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

                        this.readingMore = false;
                        this.decoder = null;
                        this.encoding = null;

                        if (options.encoding) {
                            if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
                            this.decoder = new StringDecoder(options.encoding);
                            this.encoding = options.encoding;
                        }
                    }

                    function Readable(options) {
                        Duplex = Duplex || require('./_stream_duplex');
                        if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
                        // the ReadableState constructor, at least with V8 6.5

                        var isDuplex = this instanceof Duplex;
                        this._readableState = new ReadableState(options, this, isDuplex); // legacy

                        this.readable = true;

                        if (options) {
                            if (typeof options.read === 'function') this._read = options.read;
                            if (typeof options.destroy === 'function') this._destroy = options.destroy;
                        }

                        Stream.call(this);
                    }

                    Object.defineProperty(Readable.prototype, 'destroyed', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            if (this._readableState === undefined) {
                                return false;
                            }

                            return this._readableState.destroyed;
                        },
                        set: function set(value) {
                            // we ignore the value if the stream
                            // has not been initialized yet
                            if (!this._readableState) {
                                return;
                            } // backward compatibility, the user is explicitly
                            // managing destroyed


                            this._readableState.destroyed = value;
                        }
                    });
                    Readable.prototype.destroy = destroyImpl.destroy;
                    Readable.prototype._undestroy = destroyImpl.undestroy;

                    Readable.prototype._destroy = function (err, cb) {
                        cb(err);
                    }; // Manually shove something into the read() buffer.
                    // This returns true if the highWaterMark has not been hit yet,
                    // similar to how Writable.write() returns true if you should
                    // write() some more.


                    Readable.prototype.push = function (chunk, encoding) {
                        var state = this._readableState;
                        var skipChunkCheck;

                        if (!state.objectMode) {
                            if (typeof chunk === 'string') {
                                encoding = encoding || state.defaultEncoding;

                                if (encoding !== state.encoding) {
                                    chunk = Buffer.from(chunk, encoding);
                                    encoding = '';
                                }

                                skipChunkCheck = true;
                            }
                        } else {
                            skipChunkCheck = true;
                        }

                        return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
                    }; // Unshift should *always* be something directly out of read()


                    Readable.prototype.unshift = function (chunk) {
                        return readableAddChunk(this, chunk, null, true, false);
                    };

                    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
                        debug('readableAddChunk', chunk);
                        var state = stream._readableState;

                        if (chunk === null) {
                            state.reading = false;
                            onEofChunk(stream, state);
                        } else {
                            var er;
                            if (!skipChunkCheck) er = chunkInvalid(state, chunk);

                            if (er) {
                                errorOrDestroy(stream, er);
                            } else if (state.objectMode || chunk && chunk.length > 0) {
                                if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
                                    chunk = _uint8ArrayToBuffer(chunk);
                                }

                                if (addToFront) {
                                    if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT()); else addChunk(stream, state, chunk, true);
                                } else if (state.ended) {
                                    errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
                                } else if (state.destroyed) {
                                    return false;
                                } else {
                                    state.reading = false;

                                    if (state.decoder && !encoding) {
                                        chunk = state.decoder.write(chunk);
                                        if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false); else maybeReadMore(stream, state);
                                    } else {
                                        addChunk(stream, state, chunk, false);
                                    }
                                }
                            } else if (!addToFront) {
                                state.reading = false;
                                maybeReadMore(stream, state);
                            }
                        } // We can push more data if we are below the highWaterMark.
                        // Also, if we have no data yet, we can stand some more bytes.
                        // This is to work around cases where hwm=0, such as the repl.


                        return !state.ended && (state.length < state.highWaterMark || state.length === 0);
                    }

                    function addChunk(stream, state, chunk, addToFront) {
                        if (state.flowing && state.length === 0 && !state.sync) {
                            state.awaitDrain = 0;
                            stream.emit('data', chunk);
                        } else {
                            // update the buffer info.
                            state.length += state.objectMode ? 1 : chunk.length;
                            if (addToFront) state.buffer.unshift(chunk); else state.buffer.push(chunk);
                            if (state.needReadable) emitReadable(stream);
                        }

                        maybeReadMore(stream, state);
                    }

                    function chunkInvalid(state, chunk) {
                        var er;

                        if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
                            er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
                        }

                        return er;
                    }

                    Readable.prototype.isPaused = function () {
                        return this._readableState.flowing === false;
                    }; // backwards compatibility.


                    Readable.prototype.setEncoding = function (enc) {
                        if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
                        var decoder = new StringDecoder(enc);
                        this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

                        this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

                        var p = this._readableState.buffer.head;
                        var content = '';

                        while (p !== null) {
                            content += decoder.write(p.data);
                            p = p.next;
                        }

                        this._readableState.buffer.clear();

                        if (content !== '') this._readableState.buffer.push(content);
                        this._readableState.length = content.length;
                        return this;
                    }; // Don't raise the hwm > 1GB


                    var MAX_HWM = 0x40000000;

                    function computeNewHighWaterMark(n) {
                        if (n >= MAX_HWM) {
                            // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
                            n = MAX_HWM;
                        } else {
                            // Get the next highest power of 2 to prevent increasing hwm excessively in
                            // tiny amounts
                            n--;
                            n |= n >>> 1;
                            n |= n >>> 2;
                            n |= n >>> 4;
                            n |= n >>> 8;
                            n |= n >>> 16;
                            n++;
                        }

                        return n;
                    } // This function is designed to be inlinable, so please take care when making
                    // changes to the function body.


                    function howMuchToRead(n, state) {
                        if (n <= 0 || state.length === 0 && state.ended) return 0;
                        if (state.objectMode) return 1;

                        if (n !== n) {
                            // Only flow one buffer at a time
                            if (state.flowing && state.length) return state.buffer.head.data.length; else return state.length;
                        } // If we're asking for more than the current hwm, then raise the hwm.


                        if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
                        if (n <= state.length) return n; // Don't have enough

                        if (!state.ended) {
                            state.needReadable = true;
                            return 0;
                        }

                        return state.length;
                    } // you can override either this method, or the async _read(n) below.


                    Readable.prototype.read = function (n) {
                        debug('read', n);
                        n = parseInt(n, 10);
                        var state = this._readableState;
                        var nOrig = n;
                        if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
                        // already have a bunch of data in the buffer, then just trigger
                        // the 'readable' event and move on.

                        if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
                            debug('read: emitReadable', state.length, state.ended);
                            if (state.length === 0 && state.ended) endReadable(this); else emitReadable(this);
                            return null;
                        }

                        n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

                        if (n === 0 && state.ended) {
                            if (state.length === 0) endReadable(this);
                            return null;
                        } // All the actual chunk generation logic needs to be
                        // *below* the call to _read.  The reason is that in certain
                        // synthetic stream cases, such as passthrough streams, _read
                        // may be a completely synchronous operation which may change
                        // the state of the read buffer, providing enough data when
                        // before there was *not* enough.
                        //
                        // So, the steps are:
                        // 1. Figure out what the state of things will be after we do
                        // a read from the buffer.
                        //
                        // 2. If that resulting state will trigger a _read, then call _read.
                        // Note that this may be asynchronous, or synchronous.  Yes, it is
                        // deeply ugly to write APIs this way, but that still doesn't mean
                        // that the Readable class should behave improperly, as streams are
                        // designed to be sync/async agnostic.
                        // Take note if the _read call is sync or async (ie, if the read call
                        // has returned yet), so that we know whether or not it's safe to emit
                        // 'readable' etc.
                        //
                        // 3. Actually pull the requested chunks out of the buffer and return.
                        // if we need a readable event, then we need to do some reading.


                        var doRead = state.needReadable;
                        debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

                        if (state.length === 0 || state.length - n < state.highWaterMark) {
                            doRead = true;
                            debug('length less than watermark', doRead);
                        } // however, if we've ended, then there's no point, and if we're already
                        // reading, then it's unnecessary.


                        if (state.ended || state.reading) {
                            doRead = false;
                            debug('reading or ended', doRead);
                        } else if (doRead) {
                            debug('do read');
                            state.reading = true;
                            state.sync = true; // if the length is currently zero, then we *need* a readable event.

                            if (state.length === 0) state.needReadable = true; // call internal read method

                            this._read(state.highWaterMark);

                            state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
                            // and we need to re-evaluate how much data we can return to the user.

                            if (!state.reading) n = howMuchToRead(nOrig, state);
                        }

                        var ret;
                        if (n > 0) ret = fromList(n, state); else ret = null;

                        if (ret === null) {
                            state.needReadable = state.length <= state.highWaterMark;
                            n = 0;
                        } else {
                            state.length -= n;
                            state.awaitDrain = 0;
                        }

                        if (state.length === 0) {
                            // If we have nothing in the buffer, then we want to know
                            // as soon as we *do* get something into the buffer.
                            if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

                            if (nOrig !== n && state.ended) endReadable(this);
                        }

                        if (ret !== null) this.emit('data', ret);
                        return ret;
                    };

                    function onEofChunk(stream, state) {
                        debug('onEofChunk');
                        if (state.ended) return;

                        if (state.decoder) {
                            var chunk = state.decoder.end();

                            if (chunk && chunk.length) {
                                state.buffer.push(chunk);
                                state.length += state.objectMode ? 1 : chunk.length;
                            }
                        }

                        state.ended = true;

                        if (state.sync) {
                            // if we are sync, wait until next tick to emit the data.
                            // Otherwise we risk emitting data in the flow()
                            // the readable code triggers during a read() call
                            emitReadable(stream);
                        } else {
                            // emit 'readable' now to make sure it gets picked up.
                            state.needReadable = false;

                            if (!state.emittedReadable) {
                                state.emittedReadable = true;
                                emitReadable_(stream);
                            }
                        }
                    } // Don't emit readable right away in sync mode, because this can trigger
                    // another read() call => stack overflow.  This way, it might trigger
                    // a nextTick recursion warning, but that's not so bad.


                    function emitReadable(stream) {
                        var state = stream._readableState;
                        debug('emitReadable', state.needReadable, state.emittedReadable);
                        state.needReadable = false;

                        if (!state.emittedReadable) {
                            debug('emitReadable', state.flowing);
                            state.emittedReadable = true;
                            process.nextTick(emitReadable_, stream);
                        }
                    }

                    function emitReadable_(stream) {
                        var state = stream._readableState;
                        debug('emitReadable_', state.destroyed, state.length, state.ended);

                        if (!state.destroyed && (state.length || state.ended)) {
                            stream.emit('readable');
                            state.emittedReadable = false;
                        } // The stream needs another readable event if
                        // 1. It is not flowing, as the flow mechanism will take
                        //    care of it.
                        // 2. It is not ended.
                        // 3. It is below the highWaterMark, so we can schedule
                        //    another readable later.


                        state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
                        flow(stream);
                    } // at this point, the user has presumably seen the 'readable' event,
                    // and called read() to consume some data.  that may have triggered
                    // in turn another _read(n) call, in which case reading = true if
                    // it's in progress.
                    // However, if we're not ended, or reading, and the length < hwm,
                    // then go ahead and try to read some more preemptively.


                    function maybeReadMore(stream, state) {
                        if (!state.readingMore) {
                            state.readingMore = true;
                            process.nextTick(maybeReadMore_, stream, state);
                        }
                    }

                    function maybeReadMore_(stream, state) {
                        // Attempt to read more data if we should.
                        //
                        // The conditions for reading more data are (one of):
                        // - Not enough data buffered (state.length < state.highWaterMark). The loop
                        //   is responsible for filling the buffer with enough data if such data
                        //   is available. If highWaterMark is 0 and we are not in the flowing mode
                        //   we should _not_ attempt to buffer any extra data. We'll get more data
                        //   when the stream consumer calls read() instead.
                        // - No data in the buffer, and the stream is in flowing mode. In this mode
                        //   the loop below is responsible for ensuring read() is called. Failing to
                        //   call read here would abort the flow and there's no other mechanism for
                        //   continuing the flow if the stream consumer has just subscribed to the
                        //   'data' event.
                        //
                        // In addition to the above conditions to keep reading data, the following
                        // conditions prevent the data from being read:
                        // - The stream has ended (state.ended).
                        // - There is already a pending 'read' operation (state.reading). This is a
                        //   case where the the stream has called the implementation defined _read()
                        //   method, but they are processing the call asynchronously and have _not_
                        //   called push() with new data. In this case we skip performing more
                        //   read()s. The execution ends in this method again after the _read() ends
                        //   up calling push() with more data.
                        while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
                            var len = state.length;
                            debug('maybeReadMore read 0');
                            stream.read(0);
                            if (len === state.length) // didn't get any data, stop spinning.
                                break;
                        }

                        state.readingMore = false;
                    } // abstract method.  to be overridden in specific implementation classes.
                    // call cb(er, data) where data is <= n in length.
                    // for virtual (non-string, non-buffer) streams, "length" is somewhat
                    // arbitrary, and perhaps not very meaningful.


                    Readable.prototype._read = function (n) {
                        errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
                    };

                    Readable.prototype.pipe = function (dest, pipeOpts) {
                        var src = this;
                        var state = this._readableState;

                        switch (state.pipesCount) {
                            case 0:
                                state.pipes = dest;
                                break;

                            case 1:
                                state.pipes = [state.pipes, dest];
                                break;

                            default:
                                state.pipes.push(dest);
                                break;
                        }

                        state.pipesCount += 1;
                        debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
                        var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
                        var endFn = doEnd ? onend : unpipe;
                        if (state.endEmitted) process.nextTick(endFn); else src.once('end', endFn);
                        dest.on('unpipe', onunpipe);

                        function onunpipe(readable, unpipeInfo) {
                            debug('onunpipe');

                            if (readable === src) {
                                if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                                    unpipeInfo.hasUnpiped = true;
                                    cleanup();
                                }
                            }
                        }

                        function onend() {
                            debug('onend');
                            dest.end();
                        } // when the dest drains, it reduces the awaitDrain counter
                        // on the source.  This would be more elegant with a .once()
                        // handler in flow(), but adding and removing repeatedly is
                        // too slow.


                        var ondrain = pipeOnDrain(src);
                        dest.on('drain', ondrain);
                        var cleanedUp = false;

                        function cleanup() {
                            debug('cleanup'); // cleanup event handlers once the pipe is broken

                            dest.removeListener('close', onclose);
                            dest.removeListener('finish', onfinish);
                            dest.removeListener('drain', ondrain);
                            dest.removeListener('error', onerror);
                            dest.removeListener('unpipe', onunpipe);
                            src.removeListener('end', onend);
                            src.removeListener('end', unpipe);
                            src.removeListener('data', ondata);
                            cleanedUp = true; // if the reader is waiting for a drain event from this
                            // specific writer, then it would cause it to never start
                            // flowing again.
                            // So, if this is awaiting a drain, then we just call it now.
                            // If we don't know, then assume that we are waiting for one.

                            if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
                        }

                        src.on('data', ondata);

                        function ondata(chunk) {
                            debug('ondata');
                            var ret = dest.write(chunk);
                            debug('dest.write', ret);

                            if (ret === false) {
                                // If the user unpiped during `dest.write()`, it is possible
                                // to get stuck in a permanently paused state if that write
                                // also returned false.
                                // => Check whether `dest` is still a piping destination.
                                if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
                                    debug('false write response, pause', state.awaitDrain);
                                    state.awaitDrain++;
                                }

                                src.pause();
                            }
                        } // if the dest has an error, then stop piping into it.
                        // however, don't suppress the throwing behavior for this.


                        function onerror(er) {
                            debug('onerror', er);
                            unpipe();
                            dest.removeListener('error', onerror);
                            if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
                        } // Make sure our error handler is attached before userland ones.


                        prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

                        function onclose() {
                            dest.removeListener('finish', onfinish);
                            unpipe();
                        }

                        dest.once('close', onclose);

                        function onfinish() {
                            debug('onfinish');
                            dest.removeListener('close', onclose);
                            unpipe();
                        }

                        dest.once('finish', onfinish);

                        function unpipe() {
                            debug('unpipe');
                            src.unpipe(dest);
                        } // tell the dest that it's being piped to


                        dest.emit('pipe', src); // start the flow if it hasn't been started already.

                        if (!state.flowing) {
                            debug('pipe resume');
                            src.resume();
                        }

                        return dest;
                    };

                    function pipeOnDrain(src) {
                        return function pipeOnDrainFunctionResult() {
                            var state = src._readableState;
                            debug('pipeOnDrain', state.awaitDrain);
                            if (state.awaitDrain) state.awaitDrain--;

                            if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
                                state.flowing = true;
                                flow(src);
                            }
                        };
                    }

                    Readable.prototype.unpipe = function (dest) {
                        var state = this._readableState;
                        var unpipeInfo = {
                            hasUnpiped: false
                        }; // if we're not piping anywhere, then do nothing.

                        if (state.pipesCount === 0) return this; // just one destination.  most common case.

                        if (state.pipesCount === 1) {
                            // passed in one, but it's not the right one.
                            if (dest && dest !== state.pipes) return this;
                            if (!dest) dest = state.pipes; // got a match.

                            state.pipes = null;
                            state.pipesCount = 0;
                            state.flowing = false;
                            if (dest) dest.emit('unpipe', this, unpipeInfo);
                            return this;
                        } // slow case. multiple pipe destinations.


                        if (!dest) {
                            // remove all.
                            var dests = state.pipes;
                            var len = state.pipesCount;
                            state.pipes = null;
                            state.pipesCount = 0;
                            state.flowing = false;

                            for (var i = 0; i < len; i++) {
                                dests[i].emit('unpipe', this, {
                                    hasUnpiped: false
                                });
                            }

                            return this;
                        } // try to find the right one.


                        var index = indexOf(state.pipes, dest);
                        if (index === -1) return this;
                        state.pipes.splice(index, 1);
                        state.pipesCount -= 1;
                        if (state.pipesCount === 1) state.pipes = state.pipes[0];
                        dest.emit('unpipe', this, unpipeInfo);
                        return this;
                    }; // set up data events if they are asked for
                    // Ensure readable listeners eventually get something


                    Readable.prototype.on = function (ev, fn) {
                        var res = Stream.prototype.on.call(this, ev, fn);
                        var state = this._readableState;

                        if (ev === 'data') {
                            // update readableListening so that resume() may be a no-op
                            // a few lines down. This is needed to support once('readable').
                            state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

                            if (state.flowing !== false) this.resume();
                        } else if (ev === 'readable') {
                            if (!state.endEmitted && !state.readableListening) {
                                state.readableListening = state.needReadable = true;
                                state.flowing = false;
                                state.emittedReadable = false;
                                debug('on readable', state.length, state.reading);

                                if (state.length) {
                                    emitReadable(this);
                                } else if (!state.reading) {
                                    process.nextTick(nReadingNextTick, this);
                                }
                            }
                        }

                        return res;
                    };

                    Readable.prototype.addListener = Readable.prototype.on;

                    Readable.prototype.removeListener = function (ev, fn) {
                        var res = Stream.prototype.removeListener.call(this, ev, fn);

                        if (ev === 'readable') {
                            // We need to check if there is someone still listening to
                            // readable and reset the state. However this needs to happen
                            // after readable has been emitted but before I/O (nextTick) to
                            // support once('readable', fn) cycles. This means that calling
                            // resume within the same tick will have no
                            // effect.
                            process.nextTick(updateReadableListening, this);
                        }

                        return res;
                    };

                    Readable.prototype.removeAllListeners = function (ev) {
                        var res = Stream.prototype.removeAllListeners.apply(this, arguments);

                        if (ev === 'readable' || ev === undefined) {
                            // We need to check if there is someone still listening to
                            // readable and reset the state. However this needs to happen
                            // after readable has been emitted but before I/O (nextTick) to
                            // support once('readable', fn) cycles. This means that calling
                            // resume within the same tick will have no
                            // effect.
                            process.nextTick(updateReadableListening, this);
                        }

                        return res;
                    };

                    function updateReadableListening(self) {
                        var state = self._readableState;
                        state.readableListening = self.listenerCount('readable') > 0;

                        if (state.resumeScheduled && !state.paused) {
                            // flowing needs to be set to true now, otherwise
                            // the upcoming resume will not flow.
                            state.flowing = true; // crude way to check if we should resume
                        } else if (self.listenerCount('data') > 0) {
                            self.resume();
                        }
                    }

                    function nReadingNextTick(self) {
                        debug('readable nexttick read 0');
                        self.read(0);
                    } // pause() and resume() are remnants of the legacy readable stream API
                    // If the user uses them, then switch into old mode.


                    Readable.prototype.resume = function () {
                        var state = this._readableState;

                        if (!state.flowing) {
                            debug('resume'); // we flow only if there is no one listening
                            // for readable, but we still have to call
                            // resume()

                            state.flowing = !state.readableListening;
                            resume(this, state);
                        }

                        state.paused = false;
                        return this;
                    };

                    function resume(stream, state) {
                        if (!state.resumeScheduled) {
                            state.resumeScheduled = true;
                            process.nextTick(resume_, stream, state);
                        }
                    }

                    function resume_(stream, state) {
                        debug('resume', state.reading);

                        if (!state.reading) {
                            stream.read(0);
                        }

                        state.resumeScheduled = false;
                        stream.emit('resume');
                        flow(stream);
                        if (state.flowing && !state.reading) stream.read(0);
                    }

                    Readable.prototype.pause = function () {
                        debug('call pause flowing=%j', this._readableState.flowing);

                        if (this._readableState.flowing !== false) {
                            debug('pause');
                            this._readableState.flowing = false;
                            this.emit('pause');
                        }

                        this._readableState.paused = true;
                        return this;
                    };

                    function flow(stream) {
                        var state = stream._readableState;
                        debug('flow', state.flowing);

                        while (state.flowing && stream.read() !== null) {
                            ;
                        }
                    } // wrap an old-style stream as the async data source.
                    // This is *not* part of the readable stream interface.
                    // It is an ugly unfortunate mess of history.


                    Readable.prototype.wrap = function (stream) {
                        var _this = this;

                        var state = this._readableState;
                        var paused = false;
                        stream.on('end', function () {
                            debug('wrapped end');

                            if (state.decoder && !state.ended) {
                                var chunk = state.decoder.end();
                                if (chunk && chunk.length) _this.push(chunk);
                            }

                            _this.push(null);
                        });
                        stream.on('data', function (chunk) {
                            debug('wrapped data');
                            if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

                            if (state.objectMode && (chunk === null || chunk === undefined)) return; else if (!state.objectMode && (!chunk || !chunk.length)) return;

                            var ret = _this.push(chunk);

                            if (!ret) {
                                paused = true;
                                stream.pause();
                            }
                        }); // proxy all the other methods.
                        // important when wrapping filters and duplexes.

                        for (var i in stream) {
                            if (this[i] === undefined && typeof stream[i] === 'function') {
                                this[i] = function methodWrap(method) {
                                    return function methodWrapReturnFunction() {
                                        return stream[method].apply(stream, arguments);
                                    };
                                }(i);
                            }
                        } // proxy certain important events.


                        for (var n = 0; n < kProxyEvents.length; n++) {
                            stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
                        } // when we try to consume some more bytes, simply unpause the
                        // underlying stream.


                        this._read = function (n) {
                            debug('wrapped _read', n);

                            if (paused) {
                                paused = false;
                                stream.resume();
                            }
                        };

                        return this;
                    };

                    if (typeof Symbol === 'function') {
                        Readable.prototype[Symbol.asyncIterator] = function () {
                            if (createReadableStreamAsyncIterator === undefined) {
                                createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
                            }

                            return createReadableStreamAsyncIterator(this);
                        };
                    }

                    Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._readableState.highWaterMark;
                        }
                    });
                    Object.defineProperty(Readable.prototype, 'readableBuffer', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._readableState && this._readableState.buffer;
                        }
                    });
                    Object.defineProperty(Readable.prototype, 'readableFlowing', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._readableState.flowing;
                        },
                        set: function set(state) {
                            if (this._readableState) {
                                this._readableState.flowing = state;
                            }
                        }
                    }); // exposed for testing purposes only.

                    Readable._fromList = fromList;
                    Object.defineProperty(Readable.prototype, 'readableLength', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._readableState.length;
                        }
                    }); // Pluck off n bytes from an array of buffers.
                    // Length is the combined lengths of all the buffers in the list.
                    // This function is designed to be inlinable, so please take care when making
                    // changes to the function body.

                    function fromList(n, state) {
                        // nothing buffered
                        if (state.length === 0) return null;
                        var ret;
                        if (state.objectMode) ret = state.buffer.shift(); else if (!n || n >= state.length) {
                            // read it all, truncate the list
                            if (state.decoder) ret = state.buffer.join(''); else if (state.buffer.length === 1) ret = state.buffer.first(); else ret = state.buffer.concat(state.length);
                            state.buffer.clear();
                        } else {
                            // read part of list
                            ret = state.buffer.consume(n, state.decoder);
                        }
                        return ret;
                    }

                    function endReadable(stream) {
                        var state = stream._readableState;
                        debug('endReadable', state.endEmitted);

                        if (!state.endEmitted) {
                            state.ended = true;
                            process.nextTick(endReadableNT, state, stream);
                        }
                    }

                    function endReadableNT(state, stream) {
                        debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

                        if (!state.endEmitted && state.length === 0) {
                            state.endEmitted = true;
                            stream.readable = false;
                            stream.emit('end');

                            if (state.autoDestroy) {
                                // In case of duplex streams we need a way to detect
                                // if the writable side is ready for autoDestroy as well
                                var wState = stream._writableState;

                                if (!wState || wState.autoDestroy && wState.finished) {
                                    stream.destroy();
                                }
                            }
                        }
                    }

                    if (typeof Symbol === 'function') {
                        Readable.from = function (iterable, opts) {
                            if (from === undefined) {
                                from = require('./internal/streams/from');
                            }

                            return from(Readable, iterable, opts);
                        };
                    }

                    function indexOf(xs, x) {
                        for (var i = 0, l = xs.length; i < l; i++) {
                            if (xs[i] === x) return i;
                        }

                        return -1;
                    }
                }).call(this)
            }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, { "../errors": 14, "./_stream_duplex": 15, "./internal/streams/async_iterator": 20, "./internal/streams/buffer_list": 21, "./internal/streams/destroy": 22, "./internal/streams/from": 24, "./internal/streams/state": 26, "./internal/streams/stream": 27, "_process": 8, "buffer": 3, "events": 4, "inherits": 6, "string_decoder/": 28, "util": 2 }], 18: [function (require, module, exports) {
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.
            // a transform stream is a readable/writable stream where you do
            // something with the data.  Sometimes it's called a "filter",
            // but that's not a great name for it, since that implies a thing where
            // some bits pass through, and others are simply ignored.  (That would
            // be a valid example of a transform, of course.)
            //
            // While the output is causally related to the input, it's not a
            // necessarily symmetric or synchronous transformation.  For example,
            // a zlib stream might take multiple plain-text writes(), and then
            // emit a single compressed chunk some time in the future.
            //
            // Here's how this works:
            //
            // The Transform stream has all the aspects of the readable and writable
            // stream classes.  When you write(chunk), that calls _write(chunk,cb)
            // internally, and returns false if there's a lot of pending writes
            // buffered up.  When you call read(), that calls _read(n) until
            // there's enough pending readable data buffered up.
            //
            // In a transform stream, the written data is placed in a buffer.  When
            // _read(n) is called, it transforms the queued up data, calling the
            // buffered _write cb's as it consumes chunks.  If consuming a single
            // written chunk would result in multiple output chunks, then the first
            // outputted bit calls the readcb, and subsequent chunks just go into
            // the read buffer, and will cause it to emit 'readable' if necessary.
            //
            // This way, back-pressure is actually determined by the reading side,
            // since _read has to be called to start processing a new chunk.  However,
            // a pathological inflate type of transform can cause excessive buffering
            // here.  For example, imagine a stream where every byte of input is
            // interpreted as an integer from 0-255, and then results in that many
            // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
            // 1kb of data being output.  In this case, you could write a very small
            // amount of input, and end up with a very large amount of output.  In
            // such a pathological inflating mechanism, there'd be no way to tell
            // the system to stop doing the transform.  A single 4MB write could
            // cause the system to run out of memory.
            //
            // However, even in such a pathological case, only a single written chunk
            // would be consumed, and then the rest would wait (un-transformed) until
            // the results of the previous transformed chunk were consumed.
            'use strict';

            module.exports = Transform;

            var _require$codes = require('../errors').codes,
                ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
                ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
                ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
                ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;

            var Duplex = require('./_stream_duplex');

            require('inherits')(Transform, Duplex);

            function afterTransform(er, data) {
                var ts = this._transformState;
                ts.transforming = false;
                var cb = ts.writecb;

                if (cb === null) {
                    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
                }

                ts.writechunk = null;
                ts.writecb = null;
                if (data != null) // single equals check for both `null` and `undefined`
                    this.push(data);
                cb(er);
                var rs = this._readableState;
                rs.reading = false;

                if (rs.needReadable || rs.length < rs.highWaterMark) {
                    this._read(rs.highWaterMark);
                }
            }

            function Transform(options) {
                if (!(this instanceof Transform)) return new Transform(options);
                Duplex.call(this, options);
                this._transformState = {
                    afterTransform: afterTransform.bind(this),
                    needTransform: false,
                    transforming: false,
                    writecb: null,
                    writechunk: null,
                    writeencoding: null
                }; // start out asking for a readable event once data is transformed.

                this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
                // that Readable wants before the first _read call, so unset the
                // sync guard flag.

                this._readableState.sync = false;

                if (options) {
                    if (typeof options.transform === 'function') this._transform = options.transform;
                    if (typeof options.flush === 'function') this._flush = options.flush;
                } // When the writable side finishes, then flush out anything remaining.


                this.on('prefinish', prefinish);
            }

            function prefinish() {
                var _this = this;

                if (typeof this._flush === 'function' && !this._readableState.destroyed) {
                    this._flush(function (er, data) {
                        done(_this, er, data);
                    });
                } else {
                    done(this, null, null);
                }
            }

            Transform.prototype.push = function (chunk, encoding) {
                this._transformState.needTransform = false;
                return Duplex.prototype.push.call(this, chunk, encoding);
            }; // This is the part where you do stuff!
            // override this function in implementation classes.
            // 'chunk' is an input chunk.
            //
            // Call `push(newChunk)` to pass along transformed output
            // to the readable side.  You may call 'push' zero or more times.
            //
            // Call `cb(err)` when you are done with this chunk.  If you pass
            // an error, then that'll put the hurt on the whole operation.  If you
            // never call cb(), then you'll never get another chunk.


            Transform.prototype._transform = function (chunk, encoding, cb) {
                cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
            };

            Transform.prototype._write = function (chunk, encoding, cb) {
                var ts = this._transformState;
                ts.writecb = cb;
                ts.writechunk = chunk;
                ts.writeencoding = encoding;

                if (!ts.transforming) {
                    var rs = this._readableState;
                    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
                }
            }; // Doesn't matter what the args are here.
            // _transform does all the work.
            // That we got here means that the readable side wants more data.


            Transform.prototype._read = function (n) {
                var ts = this._transformState;

                if (ts.writechunk !== null && !ts.transforming) {
                    ts.transforming = true;

                    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
                } else {
                    // mark that we need a transform, so that any data that comes in
                    // will get processed, now that we've asked for it.
                    ts.needTransform = true;
                }
            };

            Transform.prototype._destroy = function (err, cb) {
                Duplex.prototype._destroy.call(this, err, function (err2) {
                    cb(err2);
                });
            };

            function done(stream, er, data) {
                if (er) return stream.emit('error', er);
                if (data != null) // single equals check for both `null` and `undefined`
                    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
                // if there's nothing in the write buffer, then that means
                // that nothing more will ever be provided

                if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
                if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
                return stream.push(null);
            }
        }, { "../errors": 14, "./_stream_duplex": 15, "inherits": 6 }], 19: [function (require, module, exports) {
            (function (process, global) {
                (function () {
                    // Copyright Joyent, Inc. and other Node contributors.
                    //
                    // Permission is hereby granted, free of charge, to any person obtaining a
                    // copy of this software and associated documentation files (the
                    // "Software"), to deal in the Software without restriction, including
                    // without limitation the rights to use, copy, modify, merge, publish,
                    // distribute, sublicense, and/or sell copies of the Software, and to permit
                    // persons to whom the Software is furnished to do so, subject to the
                    // following conditions:
                    //
                    // The above copyright notice and this permission notice shall be included
                    // in all copies or substantial portions of the Software.
                    //
                    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                    // USE OR OTHER DEALINGS IN THE SOFTWARE.
                    // A bit simpler than readable streams.
                    // Implement an async ._write(chunk, encoding, cb), and it'll handle all
                    // the drain event emission and buffering.
                    'use strict';

                    module.exports = Writable;
                    /* <replacement> */

                    function WriteReq(chunk, encoding, cb) {
                        this.chunk = chunk;
                        this.encoding = encoding;
                        this.callback = cb;
                        this.next = null;
                    } // It seems a linked list but it is not
                    // there will be only 2 of these for each stream


                    function CorkedRequest(state) {
                        var _this = this;

                        this.next = null;
                        this.entry = null;

                        this.finish = function () {
                            onCorkedFinish(_this, state);
                        };
                    }
                    /* </replacement> */

                    /*<replacement>*/


                    var Duplex;
                    /*</replacement>*/

                    Writable.WritableState = WritableState;
                    /*<replacement>*/

                    var internalUtil = {
                        deprecate: require('util-deprecate')
                    };
                    /*</replacement>*/

                    /*<replacement>*/

                    var Stream = require('./internal/streams/stream');
                    /*</replacement>*/


                    var Buffer = require('buffer').Buffer;

                    var OurUint8Array = global.Uint8Array || function () { };

                    function _uint8ArrayToBuffer(chunk) {
                        return Buffer.from(chunk);
                    }

                    function _isUint8Array(obj) {
                        return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
                    }

                    var destroyImpl = require('./internal/streams/destroy');

                    var _require = require('./internal/streams/state'),
                        getHighWaterMark = _require.getHighWaterMark;

                    var _require$codes = require('../errors').codes,
                        ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
                        ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
                        ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
                        ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
                        ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
                        ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
                        ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
                        ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;

                    var errorOrDestroy = destroyImpl.errorOrDestroy;

                    require('inherits')(Writable, Stream);

                    function nop() { }

                    function WritableState(options, stream, isDuplex) {
                        Duplex = Duplex || require('./_stream_duplex');
                        options = options || {}; // Duplex streams are both readable and writable, but share
                        // the same options object.
                        // However, some cases require setting options to different
                        // values for the readable and the writable sides of the duplex stream,
                        // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

                        if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
                        // contains buffers or objects.

                        this.objectMode = !!options.objectMode;
                        if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
                        // Note: 0 is a valid value, means that we always return false if
                        // the entire buffer is not flushed immediately on write()

                        this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

                        this.finalCalled = false; // drain event flag.

                        this.needDrain = false; // at the start of calling end()

                        this.ending = false; // when end() has been called, and returned

                        this.ended = false; // when 'finish' is emitted

                        this.finished = false; // has it been destroyed

                        this.destroyed = false; // should we decode strings into buffers before passing to _write?
                        // this is here so that some node-core streams can optimize string
                        // handling at a lower level.

                        var noDecode = options.decodeStrings === false;
                        this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
                        // encoding is 'binary' so we have to make this configurable.
                        // Everything else in the universe uses 'utf8', though.

                        this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
                        // of how much we're waiting to get pushed to some underlying
                        // socket or file.

                        this.length = 0; // a flag to see when we're in the middle of a write.

                        this.writing = false; // when true all writes will be buffered until .uncork() call

                        this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
                        // or on a later tick.  We set this to true at first, because any
                        // actions that shouldn't happen until "later" should generally also
                        // not happen before the first write call.

                        this.sync = true; // a flag to know if we're processing previously buffered items, which
                        // may call the _write() callback in the same tick, so that we don't
                        // end up in an overlapped onwrite situation.

                        this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

                        this.onwrite = function (er) {
                            onwrite(stream, er);
                        }; // the callback that the user supplies to write(chunk,encoding,cb)


                        this.writecb = null; // the amount that is being written when _write is called.

                        this.writelen = 0;
                        this.bufferedRequest = null;
                        this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
                        // this must be 0 before 'finish' can be emitted

                        this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
                        // This is relevant for synchronous Transform streams

                        this.prefinished = false; // True if the error was already emitted and should not be thrown again

                        this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

                        this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

                        this.autoDestroy = !!options.autoDestroy; // count buffered requests

                        this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
                        // one allocated and free to use, and we maintain at most two

                        this.corkedRequestsFree = new CorkedRequest(this);
                    }

                    WritableState.prototype.getBuffer = function getBuffer() {
                        var current = this.bufferedRequest;
                        var out = [];

                        while (current) {
                            out.push(current);
                            current = current.next;
                        }

                        return out;
                    };

                    (function () {
                        try {
                            Object.defineProperty(WritableState.prototype, 'buffer', {
                                get: internalUtil.deprecate(function writableStateBufferGetter() {
                                    return this.getBuffer();
                                }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
                            });
                        } catch (_) { }
                    })(); // Test _writableState for inheritance to account for Duplex streams,
                    // whose prototype chain only points to Readable.


                    var realHasInstance;

                    if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
                        realHasInstance = Function.prototype[Symbol.hasInstance];
                        Object.defineProperty(Writable, Symbol.hasInstance, {
                            value: function value(object) {
                                if (realHasInstance.call(this, object)) return true;
                                if (this !== Writable) return false;
                                return object && object._writableState instanceof WritableState;
                            }
                        });
                    } else {
                        realHasInstance = function realHasInstance(object) {
                            return object instanceof this;
                        };
                    }

                    function Writable(options) {
                        Duplex = Duplex || require('./_stream_duplex'); // Writable ctor is applied to Duplexes, too.
                        // `realHasInstance` is necessary because using plain `instanceof`
                        // would return false, as no `_writableState` property is attached.
                        // Trying to use the custom `instanceof` for Writable here will also break the
                        // Node.js LazyTransform implementation, which has a non-trivial getter for
                        // `_writableState` that would lead to infinite recursion.
                        // Checking for a Stream.Duplex instance is faster here instead of inside
                        // the WritableState constructor, at least with V8 6.5

                        var isDuplex = this instanceof Duplex;
                        if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
                        this._writableState = new WritableState(options, this, isDuplex); // legacy.

                        this.writable = true;

                        if (options) {
                            if (typeof options.write === 'function') this._write = options.write;
                            if (typeof options.writev === 'function') this._writev = options.writev;
                            if (typeof options.destroy === 'function') this._destroy = options.destroy;
                            if (typeof options.final === 'function') this._final = options.final;
                        }

                        Stream.call(this);
                    } // Otherwise people can pipe Writable streams, which is just wrong.


                    Writable.prototype.pipe = function () {
                        errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
                    };

                    function writeAfterEnd(stream, cb) {
                        var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

                        errorOrDestroy(stream, er);
                        process.nextTick(cb, er);
                    } // Checks that a user-supplied chunk is valid, especially for the particular
                    // mode the stream is in. Currently this means that `null` is never accepted
                    // and undefined/non-string values are only allowed in object mode.


                    function validChunk(stream, state, chunk, cb) {
                        var er;

                        if (chunk === null) {
                            er = new ERR_STREAM_NULL_VALUES();
                        } else if (typeof chunk !== 'string' && !state.objectMode) {
                            er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
                        }

                        if (er) {
                            errorOrDestroy(stream, er);
                            process.nextTick(cb, er);
                            return false;
                        }

                        return true;
                    }

                    Writable.prototype.write = function (chunk, encoding, cb) {
                        var state = this._writableState;
                        var ret = false;

                        var isBuf = !state.objectMode && _isUint8Array(chunk);

                        if (isBuf && !Buffer.isBuffer(chunk)) {
                            chunk = _uint8ArrayToBuffer(chunk);
                        }

                        if (typeof encoding === 'function') {
                            cb = encoding;
                            encoding = null;
                        }

                        if (isBuf) encoding = 'buffer'; else if (!encoding) encoding = state.defaultEncoding;
                        if (typeof cb !== 'function') cb = nop;
                        if (state.ending) writeAfterEnd(this, cb); else if (isBuf || validChunk(this, state, chunk, cb)) {
                            state.pendingcb++;
                            ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
                        }
                        return ret;
                    };

                    Writable.prototype.cork = function () {
                        this._writableState.corked++;
                    };

                    Writable.prototype.uncork = function () {
                        var state = this._writableState;

                        if (state.corked) {
                            state.corked--;
                            if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
                        }
                    };

                    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
                        // node::ParseEncoding() requires lower case.
                        if (typeof encoding === 'string') encoding = encoding.toLowerCase();
                        if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
                        this._writableState.defaultEncoding = encoding;
                        return this;
                    };

                    Object.defineProperty(Writable.prototype, 'writableBuffer', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._writableState && this._writableState.getBuffer();
                        }
                    });

                    function decodeChunk(state, chunk, encoding) {
                        if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
                            chunk = Buffer.from(chunk, encoding);
                        }

                        return chunk;
                    }

                    Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._writableState.highWaterMark;
                        }
                    }); // if we're already writing something, then just put this
                    // in the queue, and wait our turn.  Otherwise, call _write
                    // If we return false, then we need a drain event, so set that flag.

                    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
                        if (!isBuf) {
                            var newChunk = decodeChunk(state, chunk, encoding);

                            if (chunk !== newChunk) {
                                isBuf = true;
                                encoding = 'buffer';
                                chunk = newChunk;
                            }
                        }

                        var len = state.objectMode ? 1 : chunk.length;
                        state.length += len;
                        var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

                        if (!ret) state.needDrain = true;

                        if (state.writing || state.corked) {
                            var last = state.lastBufferedRequest;
                            state.lastBufferedRequest = {
                                chunk: chunk,
                                encoding: encoding,
                                isBuf: isBuf,
                                callback: cb,
                                next: null
                            };

                            if (last) {
                                last.next = state.lastBufferedRequest;
                            } else {
                                state.bufferedRequest = state.lastBufferedRequest;
                            }

                            state.bufferedRequestCount += 1;
                        } else {
                            doWrite(stream, state, false, len, chunk, encoding, cb);
                        }

                        return ret;
                    }

                    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
                        state.writelen = len;
                        state.writecb = cb;
                        state.writing = true;
                        state.sync = true;
                        if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write')); else if (writev) stream._writev(chunk, state.onwrite); else stream._write(chunk, encoding, state.onwrite);
                        state.sync = false;
                    }

                    function onwriteError(stream, state, sync, er, cb) {
                        --state.pendingcb;

                        if (sync) {
                            // defer the callback if we are being called synchronously
                            // to avoid piling up things on the stack
                            process.nextTick(cb, er); // this can emit finish, and it will always happen
                            // after error

                            process.nextTick(finishMaybe, stream, state);
                            stream._writableState.errorEmitted = true;
                            errorOrDestroy(stream, er);
                        } else {
                            // the caller expect this to happen before if
                            // it is async
                            cb(er);
                            stream._writableState.errorEmitted = true;
                            errorOrDestroy(stream, er); // this can emit finish, but finish must
                            // always follow error

                            finishMaybe(stream, state);
                        }
                    }

                    function onwriteStateUpdate(state) {
                        state.writing = false;
                        state.writecb = null;
                        state.length -= state.writelen;
                        state.writelen = 0;
                    }

                    function onwrite(stream, er) {
                        var state = stream._writableState;
                        var sync = state.sync;
                        var cb = state.writecb;
                        if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
                        onwriteStateUpdate(state);
                        if (er) onwriteError(stream, state, sync, er, cb); else {
                            // Check if we're actually ready to finish, but don't emit yet
                            var finished = needFinish(state) || stream.destroyed;

                            if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
                                clearBuffer(stream, state);
                            }

                            if (sync) {
                                process.nextTick(afterWrite, stream, state, finished, cb);
                            } else {
                                afterWrite(stream, state, finished, cb);
                            }
                        }
                    }

                    function afterWrite(stream, state, finished, cb) {
                        if (!finished) onwriteDrain(stream, state);
                        state.pendingcb--;
                        cb();
                        finishMaybe(stream, state);
                    } // Must force callback to be called on nextTick, so that we don't
                    // emit 'drain' before the write() consumer gets the 'false' return
                    // value, and has a chance to attach a 'drain' listener.


                    function onwriteDrain(stream, state) {
                        if (state.length === 0 && state.needDrain) {
                            state.needDrain = false;
                            stream.emit('drain');
                        }
                    } // if there's something in the buffer waiting, then process it


                    function clearBuffer(stream, state) {
                        state.bufferProcessing = true;
                        var entry = state.bufferedRequest;

                        if (stream._writev && entry && entry.next) {
                            // Fast case, write everything using _writev()
                            var l = state.bufferedRequestCount;
                            var buffer = new Array(l);
                            var holder = state.corkedRequestsFree;
                            holder.entry = entry;
                            var count = 0;
                            var allBuffers = true;

                            while (entry) {
                                buffer[count] = entry;
                                if (!entry.isBuf) allBuffers = false;
                                entry = entry.next;
                                count += 1;
                            }

                            buffer.allBuffers = allBuffers;
                            doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
                            // as the hot path ends with doWrite

                            state.pendingcb++;
                            state.lastBufferedRequest = null;

                            if (holder.next) {
                                state.corkedRequestsFree = holder.next;
                                holder.next = null;
                            } else {
                                state.corkedRequestsFree = new CorkedRequest(state);
                            }

                            state.bufferedRequestCount = 0;
                        } else {
                            // Slow case, write chunks one-by-one
                            while (entry) {
                                var chunk = entry.chunk;
                                var encoding = entry.encoding;
                                var cb = entry.callback;
                                var len = state.objectMode ? 1 : chunk.length;
                                doWrite(stream, state, false, len, chunk, encoding, cb);
                                entry = entry.next;
                                state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
                                // it means that we need to wait until it does.
                                // also, that means that the chunk and cb are currently
                                // being processed, so move the buffer counter past them.

                                if (state.writing) {
                                    break;
                                }
                            }

                            if (entry === null) state.lastBufferedRequest = null;
                        }

                        state.bufferedRequest = entry;
                        state.bufferProcessing = false;
                    }

                    Writable.prototype._write = function (chunk, encoding, cb) {
                        cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
                    };

                    Writable.prototype._writev = null;

                    Writable.prototype.end = function (chunk, encoding, cb) {
                        var state = this._writableState;

                        if (typeof chunk === 'function') {
                            cb = chunk;
                            chunk = null;
                            encoding = null;
                        } else if (typeof encoding === 'function') {
                            cb = encoding;
                            encoding = null;
                        }

                        if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

                        if (state.corked) {
                            state.corked = 1;
                            this.uncork();
                        } // ignore unnecessary end() calls.


                        if (!state.ending) endWritable(this, state, cb);
                        return this;
                    };

                    Object.defineProperty(Writable.prototype, 'writableLength', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            return this._writableState.length;
                        }
                    });

                    function needFinish(state) {
                        return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
                    }

                    function callFinal(stream, state) {
                        stream._final(function (err) {
                            state.pendingcb--;

                            if (err) {
                                errorOrDestroy(stream, err);
                            }

                            state.prefinished = true;
                            stream.emit('prefinish');
                            finishMaybe(stream, state);
                        });
                    }

                    function prefinish(stream, state) {
                        if (!state.prefinished && !state.finalCalled) {
                            if (typeof stream._final === 'function' && !state.destroyed) {
                                state.pendingcb++;
                                state.finalCalled = true;
                                process.nextTick(callFinal, stream, state);
                            } else {
                                state.prefinished = true;
                                stream.emit('prefinish');
                            }
                        }
                    }

                    function finishMaybe(stream, state) {
                        var need = needFinish(state);

                        if (need) {
                            prefinish(stream, state);

                            if (state.pendingcb === 0) {
                                state.finished = true;
                                stream.emit('finish');

                                if (state.autoDestroy) {
                                    // In case of duplex streams we need a way to detect
                                    // if the readable side is ready for autoDestroy as well
                                    var rState = stream._readableState;

                                    if (!rState || rState.autoDestroy && rState.endEmitted) {
                                        stream.destroy();
                                    }
                                }
                            }
                        }

                        return need;
                    }

                    function endWritable(stream, state, cb) {
                        state.ending = true;
                        finishMaybe(stream, state);

                        if (cb) {
                            if (state.finished) process.nextTick(cb); else stream.once('finish', cb);
                        }

                        state.ended = true;
                        stream.writable = false;
                    }

                    function onCorkedFinish(corkReq, state, err) {
                        var entry = corkReq.entry;
                        corkReq.entry = null;

                        while (entry) {
                            var cb = entry.callback;
                            state.pendingcb--;
                            cb(err);
                            entry = entry.next;
                        } // reuse the free corkReq.


                        state.corkedRequestsFree.next = corkReq;
                    }

                    Object.defineProperty(Writable.prototype, 'destroyed', {
                        // making it explicit this property is not enumerable
                        // because otherwise some prototype manipulation in
                        // userland will fail
                        enumerable: false,
                        get: function get() {
                            if (this._writableState === undefined) {
                                return false;
                            }

                            return this._writableState.destroyed;
                        },
                        set: function set(value) {
                            // we ignore the value if the stream
                            // has not been initialized yet
                            if (!this._writableState) {
                                return;
                            } // backward compatibility, the user is explicitly
                            // managing destroyed


                            this._writableState.destroyed = value;
                        }
                    });
                    Writable.prototype.destroy = destroyImpl.destroy;
                    Writable.prototype._undestroy = destroyImpl.undestroy;

                    Writable.prototype._destroy = function (err, cb) {
                        cb(err);
                    };
                }).call(this)
            }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, { "../errors": 14, "./_stream_duplex": 15, "./internal/streams/destroy": 22, "./internal/streams/state": 26, "./internal/streams/stream": 27, "_process": 8, "buffer": 3, "inherits": 6, "util-deprecate": 29 }], 20: [function (require, module, exports) {
            (function (process) {
                (function () {
                    'use strict';

                    var _Object$setPrototypeO;

                    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

                    var finished = require('./end-of-stream');

                    var kLastResolve = Symbol('lastResolve');
                    var kLastReject = Symbol('lastReject');
                    var kError = Symbol('error');
                    var kEnded = Symbol('ended');
                    var kLastPromise = Symbol('lastPromise');
                    var kHandlePromise = Symbol('handlePromise');
                    var kStream = Symbol('stream');

                    function createIterResult(value, done) {
                        return {
                            value: value,
                            done: done
                        };
                    }

                    function readAndResolve(iter) {
                        var resolve = iter[kLastResolve];

                        if (resolve !== null) {
                            var data = iter[kStream].read(); // we defer if data is null
                            // we can be expecting either 'end' or
                            // 'error'

                            if (data !== null) {
                                iter[kLastPromise] = null;
                                iter[kLastResolve] = null;
                                iter[kLastReject] = null;
                                resolve(createIterResult(data, false));
                            }
                        }
                    }

                    function onReadable(iter) {
                        // we wait for the next tick, because it might
                        // emit an error with process.nextTick
                        process.nextTick(readAndResolve, iter);
                    }

                    function wrapForNext(lastPromise, iter) {
                        return function (resolve, reject) {
                            lastPromise.then(function () {
                                if (iter[kEnded]) {
                                    resolve(createIterResult(undefined, true));
                                    return;
                                }

                                iter[kHandlePromise](resolve, reject);
                            }, reject);
                        };
                    }

                    var AsyncIteratorPrototype = Object.getPrototypeOf(function () { });
                    var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
                        get stream() {
                            return this[kStream];
                        },

                        next: function next() {
                            var _this = this;

                            // if we have detected an error in the meanwhile
                            // reject straight away
                            var error = this[kError];

                            if (error !== null) {
                                return Promise.reject(error);
                            }

                            if (this[kEnded]) {
                                return Promise.resolve(createIterResult(undefined, true));
                            }

                            if (this[kStream].destroyed) {
                                // We need to defer via nextTick because if .destroy(err) is
                                // called, the error will be emitted via nextTick, and
                                // we cannot guarantee that there is no error lingering around
                                // waiting to be emitted.
                                return new Promise(function (resolve, reject) {
                                    process.nextTick(function () {
                                        if (_this[kError]) {
                                            reject(_this[kError]);
                                        } else {
                                            resolve(createIterResult(undefined, true));
                                        }
                                    });
                                });
                            } // if we have multiple next() calls
                            // we will wait for the previous Promise to finish
                            // this logic is optimized to support for await loops,
                            // where next() is only called once at a time


                            var lastPromise = this[kLastPromise];
                            var promise;

                            if (lastPromise) {
                                promise = new Promise(wrapForNext(lastPromise, this));
                            } else {
                                // fast path needed to support multiple this.push()
                                // without triggering the next() queue
                                var data = this[kStream].read();

                                if (data !== null) {
                                    return Promise.resolve(createIterResult(data, false));
                                }

                                promise = new Promise(this[kHandlePromise]);
                            }

                            this[kLastPromise] = promise;
                            return promise;
                        }
                    }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
                        return this;
                    }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
                        var _this2 = this;

                        // destroy(err, cb) is a private API
                        // we can guarantee we have that here, because we control the
                        // Readable class this is attached to
                        return new Promise(function (resolve, reject) {
                            _this2[kStream].destroy(null, function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                resolve(createIterResult(undefined, true));
                            });
                        });
                    }), _Object$setPrototypeO), AsyncIteratorPrototype);

                    var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
                        var _Object$create;

                        var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
                            value: stream,
                            writable: true
                        }), _defineProperty(_Object$create, kLastResolve, {
                            value: null,
                            writable: true
                        }), _defineProperty(_Object$create, kLastReject, {
                            value: null,
                            writable: true
                        }), _defineProperty(_Object$create, kError, {
                            value: null,
                            writable: true
                        }), _defineProperty(_Object$create, kEnded, {
                            value: stream._readableState.endEmitted,
                            writable: true
                        }), _defineProperty(_Object$create, kHandlePromise, {
                            value: function value(resolve, reject) {
                                var data = iterator[kStream].read();

                                if (data) {
                                    iterator[kLastPromise] = null;
                                    iterator[kLastResolve] = null;
                                    iterator[kLastReject] = null;
                                    resolve(createIterResult(data, false));
                                } else {
                                    iterator[kLastResolve] = resolve;
                                    iterator[kLastReject] = reject;
                                }
                            },
                            writable: true
                        }), _Object$create));
                        iterator[kLastPromise] = null;
                        finished(stream, function (err) {
                            if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
                                var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
                                // returned by next() and store the error

                                if (reject !== null) {
                                    iterator[kLastPromise] = null;
                                    iterator[kLastResolve] = null;
                                    iterator[kLastReject] = null;
                                    reject(err);
                                }

                                iterator[kError] = err;
                                return;
                            }

                            var resolve = iterator[kLastResolve];

                            if (resolve !== null) {
                                iterator[kLastPromise] = null;
                                iterator[kLastResolve] = null;
                                iterator[kLastReject] = null;
                                resolve(createIterResult(undefined, true));
                            }

                            iterator[kEnded] = true;
                        });
                        stream.on('readable', onReadable.bind(null, iterator));
                        return iterator;
                    };

                    module.exports = createReadableStreamAsyncIterator;
                }).call(this)
            }).call(this, require('_process'))
        }, { "./end-of-stream": 23, "_process": 8 }], 21: [function (require, module, exports) {
            'use strict';

            function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

            function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

            function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

            function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

            function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

            function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

            var _require = require('buffer'),
                Buffer = _require.Buffer;

            var _require2 = require('util'),
                inspect = _require2.inspect;

            var custom = inspect && inspect.custom || 'inspect';

            function copyBuffer(src, target, offset) {
                Buffer.prototype.copy.call(src, target, offset);
            }

            module.exports =
                /*#__PURE__*/
                function () {
                    function BufferList() {
                        _classCallCheck(this, BufferList);

                        this.head = null;
                        this.tail = null;
                        this.length = 0;
                    }

                    _createClass(BufferList, [{
                        key: "push",
                        value: function push(v) {
                            var entry = {
                                data: v,
                                next: null
                            };
                            if (this.length > 0) this.tail.next = entry; else this.head = entry;
                            this.tail = entry;
                            ++this.length;
                        }
                    }, {
                        key: "unshift",
                        value: function unshift(v) {
                            var entry = {
                                data: v,
                                next: this.head
                            };
                            if (this.length === 0) this.tail = entry;
                            this.head = entry;
                            ++this.length;
                        }
                    }, {
                        key: "shift",
                        value: function shift() {
                            if (this.length === 0) return;
                            var ret = this.head.data;
                            if (this.length === 1) this.head = this.tail = null; else this.head = this.head.next;
                            --this.length;
                            return ret;
                        }
                    }, {
                        key: "clear",
                        value: function clear() {
                            this.head = this.tail = null;
                            this.length = 0;
                        }
                    }, {
                        key: "join",
                        value: function join(s) {
                            if (this.length === 0) return '';
                            var p = this.head;
                            var ret = '' + p.data;

                            while (p = p.next) {
                                ret += s + p.data;
                            }

                            return ret;
                        }
                    }, {
                        key: "concat",
                        value: function concat(n) {
                            if (this.length === 0) return Buffer.alloc(0);
                            var ret = Buffer.allocUnsafe(n >>> 0);
                            var p = this.head;
                            var i = 0;

                            while (p) {
                                copyBuffer(p.data, ret, i);
                                i += p.data.length;
                                p = p.next;
                            }

                            return ret;
                        } // Consumes a specified amount of bytes or characters from the buffered data.

                    }, {
                        key: "consume",
                        value: function consume(n, hasStrings) {
                            var ret;

                            if (n < this.head.data.length) {
                                // `slice` is the same for buffers and strings.
                                ret = this.head.data.slice(0, n);
                                this.head.data = this.head.data.slice(n);
                            } else if (n === this.head.data.length) {
                                // First chunk is a perfect match.
                                ret = this.shift();
                            } else {
                                // Result spans more than one buffer.
                                ret = hasStrings ? this._getString(n) : this._getBuffer(n);
                            }

                            return ret;
                        }
                    }, {
                        key: "first",
                        value: function first() {
                            return this.head.data;
                        } // Consumes a specified amount of characters from the buffered data.

                    }, {
                        key: "_getString",
                        value: function _getString(n) {
                            var p = this.head;
                            var c = 1;
                            var ret = p.data;
                            n -= ret.length;

                            while (p = p.next) {
                                var str = p.data;
                                var nb = n > str.length ? str.length : n;
                                if (nb === str.length) ret += str; else ret += str.slice(0, n);
                                n -= nb;

                                if (n === 0) {
                                    if (nb === str.length) {
                                        ++c;
                                        if (p.next) this.head = p.next; else this.head = this.tail = null;
                                    } else {
                                        this.head = p;
                                        p.data = str.slice(nb);
                                    }

                                    break;
                                }

                                ++c;
                            }

                            this.length -= c;
                            return ret;
                        } // Consumes a specified amount of bytes from the buffered data.

                    }, {
                        key: "_getBuffer",
                        value: function _getBuffer(n) {
                            var ret = Buffer.allocUnsafe(n);
                            var p = this.head;
                            var c = 1;
                            p.data.copy(ret);
                            n -= p.data.length;

                            while (p = p.next) {
                                var buf = p.data;
                                var nb = n > buf.length ? buf.length : n;
                                buf.copy(ret, ret.length - n, 0, nb);
                                n -= nb;

                                if (n === 0) {
                                    if (nb === buf.length) {
                                        ++c;
                                        if (p.next) this.head = p.next; else this.head = this.tail = null;
                                    } else {
                                        this.head = p;
                                        p.data = buf.slice(nb);
                                    }

                                    break;
                                }

                                ++c;
                            }

                            this.length -= c;
                            return ret;
                        } // Make sure the linked list only shows the minimal necessary information.

                    }, {
                        key: custom,
                        value: function value(_, options) {
                            return inspect(this, _objectSpread({}, options, {
                                // Only inspect one level.
                                depth: 0,
                                // It should not recurse.
                                customInspect: false
                            }));
                        }
                    }]);

                    return BufferList;
                }();
        }, { "buffer": 3, "util": 2 }], 22: [function (require, module, exports) {
            (function (process) {
                (function () {
                    'use strict'; // undocumented cb() API, needed for core, not for public API

                    function destroy(err, cb) {
                        var _this = this;

                        var readableDestroyed = this._readableState && this._readableState.destroyed;
                        var writableDestroyed = this._writableState && this._writableState.destroyed;

                        if (readableDestroyed || writableDestroyed) {
                            if (cb) {
                                cb(err);
                            } else if (err) {
                                if (!this._writableState) {
                                    process.nextTick(emitErrorNT, this, err);
                                } else if (!this._writableState.errorEmitted) {
                                    this._writableState.errorEmitted = true;
                                    process.nextTick(emitErrorNT, this, err);
                                }
                            }

                            return this;
                        } // we set destroyed to true before firing error callbacks in order
                        // to make it re-entrance safe in case destroy() is called within callbacks


                        if (this._readableState) {
                            this._readableState.destroyed = true;
                        } // if this is a duplex stream mark the writable part as destroyed as well


                        if (this._writableState) {
                            this._writableState.destroyed = true;
                        }

                        this._destroy(err || null, function (err) {
                            if (!cb && err) {
                                if (!_this._writableState) {
                                    process.nextTick(emitErrorAndCloseNT, _this, err);
                                } else if (!_this._writableState.errorEmitted) {
                                    _this._writableState.errorEmitted = true;
                                    process.nextTick(emitErrorAndCloseNT, _this, err);
                                } else {
                                    process.nextTick(emitCloseNT, _this);
                                }
                            } else if (cb) {
                                process.nextTick(emitCloseNT, _this);
                                cb(err);
                            } else {
                                process.nextTick(emitCloseNT, _this);
                            }
                        });

                        return this;
                    }

                    function emitErrorAndCloseNT(self, err) {
                        emitErrorNT(self, err);
                        emitCloseNT(self);
                    }

                    function emitCloseNT(self) {
                        if (self._writableState && !self._writableState.emitClose) return;
                        if (self._readableState && !self._readableState.emitClose) return;
                        self.emit('close');
                    }

                    function undestroy() {
                        if (this._readableState) {
                            this._readableState.destroyed = false;
                            this._readableState.reading = false;
                            this._readableState.ended = false;
                            this._readableState.endEmitted = false;
                        }

                        if (this._writableState) {
                            this._writableState.destroyed = false;
                            this._writableState.ended = false;
                            this._writableState.ending = false;
                            this._writableState.finalCalled = false;
                            this._writableState.prefinished = false;
                            this._writableState.finished = false;
                            this._writableState.errorEmitted = false;
                        }
                    }

                    function emitErrorNT(self, err) {
                        self.emit('error', err);
                    }

                    function errorOrDestroy(stream, err) {
                        // We have tests that rely on errors being emitted
                        // in the same tick, so changing this is semver major.
                        // For now when you opt-in to autoDestroy we allow
                        // the error to be emitted nextTick. In a future
                        // semver major update we should change the default to this.
                        var rState = stream._readableState;
                        var wState = stream._writableState;
                        if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err); else stream.emit('error', err);
                    }

                    module.exports = {
                        destroy: destroy,
                        undestroy: undestroy,
                        errorOrDestroy: errorOrDestroy
                    };
                }).call(this)
            }).call(this, require('_process'))
        }, { "_process": 8 }], 23: [function (require, module, exports) {
            // Ported from https://github.com/mafintosh/end-of-stream with
            // permission from the author, Mathias Buus (@mafintosh).
            'use strict';

            var ERR_STREAM_PREMATURE_CLOSE = require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE;

            function once(callback) {
                var called = false;
                return function () {
                    if (called) return;
                    called = true;

                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    callback.apply(this, args);
                };
            }

            function noop() { }

            function isRequest(stream) {
                return stream.setHeader && typeof stream.abort === 'function';
            }

            function eos(stream, opts, callback) {
                if (typeof opts === 'function') return eos(stream, null, opts);
                if (!opts) opts = {};
                callback = once(callback || noop);
                var readable = opts.readable || opts.readable !== false && stream.readable;
                var writable = opts.writable || opts.writable !== false && stream.writable;

                var onlegacyfinish = function onlegacyfinish() {
                    if (!stream.writable) onfinish();
                };

                var writableEnded = stream._writableState && stream._writableState.finished;

                var onfinish = function onfinish() {
                    writable = false;
                    writableEnded = true;
                    if (!readable) callback.call(stream);
                };

                var readableEnded = stream._readableState && stream._readableState.endEmitted;

                var onend = function onend() {
                    readable = false;
                    readableEnded = true;
                    if (!writable) callback.call(stream);
                };

                var onerror = function onerror(err) {
                    callback.call(stream, err);
                };

                var onclose = function onclose() {
                    var err;

                    if (readable && !readableEnded) {
                        if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
                        return callback.call(stream, err);
                    }

                    if (writable && !writableEnded) {
                        if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
                        return callback.call(stream, err);
                    }
                };

                var onrequest = function onrequest() {
                    stream.req.on('finish', onfinish);
                };

                if (isRequest(stream)) {
                    stream.on('complete', onfinish);
                    stream.on('abort', onclose);
                    if (stream.req) onrequest(); else stream.on('request', onrequest);
                } else if (writable && !stream._writableState) {
                    // legacy streams
                    stream.on('end', onlegacyfinish);
                    stream.on('close', onlegacyfinish);
                }

                stream.on('end', onend);
                stream.on('finish', onfinish);
                if (opts.error !== false) stream.on('error', onerror);
                stream.on('close', onclose);
                return function () {
                    stream.removeListener('complete', onfinish);
                    stream.removeListener('abort', onclose);
                    stream.removeListener('request', onrequest);
                    if (stream.req) stream.req.removeListener('finish', onfinish);
                    stream.removeListener('end', onlegacyfinish);
                    stream.removeListener('close', onlegacyfinish);
                    stream.removeListener('finish', onfinish);
                    stream.removeListener('end', onend);
                    stream.removeListener('error', onerror);
                    stream.removeListener('close', onclose);
                };
            }

            module.exports = eos;
        }, { "../../../errors": 14 }], 24: [function (require, module, exports) {
            module.exports = function () {
                throw new Error('Readable.from is not available in the browser')
            };

        }, {}], 25: [function (require, module, exports) {
            // Ported from https://github.com/mafintosh/pump with
            // permission from the author, Mathias Buus (@mafintosh).
            'use strict';

            var eos;

            function once(callback) {
                var called = false;
                return function () {
                    if (called) return;
                    called = true;
                    callback.apply(void 0, arguments);
                };
            }

            var _require$codes = require('../../../errors').codes,
                ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
                ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;

            function noop(err) {
                // Rethrow the error if it exists to avoid swallowing it
                if (err) throw err;
            }

            function isRequest(stream) {
                return stream.setHeader && typeof stream.abort === 'function';
            }

            function destroyer(stream, reading, writing, callback) {
                callback = once(callback);
                var closed = false;
                stream.on('close', function () {
                    closed = true;
                });
                if (eos === undefined) eos = require('./end-of-stream');
                eos(stream, {
                    readable: reading,
                    writable: writing
                }, function (err) {
                    if (err) return callback(err);
                    closed = true;
                    callback();
                });
                var destroyed = false;
                return function (err) {
                    if (closed) return;
                    if (destroyed) return;
                    destroyed = true; // request.destroy just do .end - .abort is what we want

                    if (isRequest(stream)) return stream.abort();
                    if (typeof stream.destroy === 'function') return stream.destroy();
                    callback(err || new ERR_STREAM_DESTROYED('pipe'));
                };
            }

            function call(fn) {
                fn();
            }

            function pipe(from, to) {
                return from.pipe(to);
            }

            function popCallback(streams) {
                if (!streams.length) return noop;
                if (typeof streams[streams.length - 1] !== 'function') return noop;
                return streams.pop();
            }

            function pipeline() {
                for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
                    streams[_key] = arguments[_key];
                }

                var callback = popCallback(streams);
                if (Array.isArray(streams[0])) streams = streams[0];

                if (streams.length < 2) {
                    throw new ERR_MISSING_ARGS('streams');
                }

                var error;
                var destroys = streams.map(function (stream, i) {
                    var reading = i < streams.length - 1;
                    var writing = i > 0;
                    return destroyer(stream, reading, writing, function (err) {
                        if (!error) error = err;
                        if (err) destroys.forEach(call);
                        if (reading) return;
                        destroys.forEach(call);
                        callback(error);
                    });
                });
                return streams.reduce(pipe);
            }

            module.exports = pipeline;
        }, { "../../../errors": 14, "./end-of-stream": 23 }], 26: [function (require, module, exports) {
            'use strict';

            var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;

            function highWaterMarkFrom(options, isDuplex, duplexKey) {
                return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
            }

            function getHighWaterMark(state, options, duplexKey, isDuplex) {
                var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

                if (hwm != null) {
                    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
                        var name = isDuplex ? duplexKey : 'highWaterMark';
                        throw new ERR_INVALID_OPT_VALUE(name, hwm);
                    }

                    return Math.floor(hwm);
                } // Default value


                return state.objectMode ? 16 : 16 * 1024;
            }

            module.exports = {
                getHighWaterMark: getHighWaterMark
            };
        }, { "../../../errors": 14 }], 27: [function (require, module, exports) {
            module.exports = require('events').EventEmitter;

        }, { "events": 4 }], 28: [function (require, module, exports) {
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.

            'use strict';

            /*<replacement>*/

            var Buffer = require('safe-buffer').Buffer;
            /*</replacement>*/

            var isEncoding = Buffer.isEncoding || function (encoding) {
                encoding = '' + encoding;
                switch (encoding && encoding.toLowerCase()) {
                    case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw':
                        return true;
                    default:
                        return false;
                }
            };

            function _normalizeEncoding(enc) {
                if (!enc) return 'utf8';
                var retried;
                while (true) {
                    switch (enc) {
                        case 'utf8':
                        case 'utf-8':
                            return 'utf8';
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return 'utf16le';
                        case 'latin1':
                        case 'binary':
                            return 'latin1';
                        case 'base64':
                        case 'ascii':
                        case 'hex':
                            return enc;
                        default:
                            if (retried) return; // undefined
                            enc = ('' + enc).toLowerCase();
                            retried = true;
                    }
                }
            };

            // Do not cache `Buffer.isEncoding` when checking encoding names as some
            // modules monkey-patch it to support additional encodings
            function normalizeEncoding(enc) {
                var nenc = _normalizeEncoding(enc);
                if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
                return nenc || enc;
            }

            // StringDecoder provides an interface for efficiently splitting a series of
            // buffers into a series of JS strings without breaking apart multi-byte
            // characters.
            exports.StringDecoder = StringDecoder;
            function StringDecoder(encoding) {
                this.encoding = normalizeEncoding(encoding);
                var nb;
                switch (this.encoding) {
                    case 'utf16le':
                        this.text = utf16Text;
                        this.end = utf16End;
                        nb = 4;
                        break;
                    case 'utf8':
                        this.fillLast = utf8FillLast;
                        nb = 4;
                        break;
                    case 'base64':
                        this.text = base64Text;
                        this.end = base64End;
                        nb = 3;
                        break;
                    default:
                        this.write = simpleWrite;
                        this.end = simpleEnd;
                        return;
                }
                this.lastNeed = 0;
                this.lastTotal = 0;
                this.lastChar = Buffer.allocUnsafe(nb);
            }

            StringDecoder.prototype.write = function (buf) {
                if (buf.length === 0) return '';
                var r;
                var i;
                if (this.lastNeed) {
                    r = this.fillLast(buf);
                    if (r === undefined) return '';
                    i = this.lastNeed;
                    this.lastNeed = 0;
                } else {
                    i = 0;
                }
                if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
                return r || '';
            };

            StringDecoder.prototype.end = utf8End;

            // Returns only complete characters in a Buffer
            StringDecoder.prototype.text = utf8Text;

            // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
            StringDecoder.prototype.fillLast = function (buf) {
                if (this.lastNeed <= buf.length) {
                    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
                this.lastNeed -= buf.length;
            };

            // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
            // continuation byte. If an invalid byte is detected, -2 is returned.
            function utf8CheckByte(byte) {
                if (byte <= 0x7F) return 0; else if (byte >> 5 === 0x06) return 2; else if (byte >> 4 === 0x0E) return 3; else if (byte >> 3 === 0x1E) return 4;
                return byte >> 6 === 0x02 ? -1 : -2;
            }

            // Checks at most 3 bytes at the end of a Buffer in order to detect an
            // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
            // needed to complete the UTF-8 character (if applicable) are returned.
            function utf8CheckIncomplete(self, buf, i) {
                var j = buf.length - 1;
                if (j < i) return 0;
                var nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0) self.lastNeed = nb - 1;
                    return nb;
                }
                if (--j < i || nb === -2) return 0;
                nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0) self.lastNeed = nb - 2;
                    return nb;
                }
                if (--j < i || nb === -2) return 0;
                nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0) {
                        if (nb === 2) nb = 0; else self.lastNeed = nb - 3;
                    }
                    return nb;
                }
                return 0;
            }

            // Validates as many continuation bytes for a multi-byte UTF-8 character as
            // needed or are available. If we see a non-continuation byte where we expect
            // one, we "replace" the validated continuation bytes we've seen so far with
            // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
            // behavior. The continuation byte check is included three times in the case
            // where all of the continuation bytes for a character exist in the same buffer.
            // It is also done this way as a slight performance increase instead of using a
            // loop.
            function utf8CheckExtraBytes(self, buf, p) {
                if ((buf[0] & 0xC0) !== 0x80) {
                    self.lastNeed = 0;
                    return '\ufffd';
                }
                if (self.lastNeed > 1 && buf.length > 1) {
                    if ((buf[1] & 0xC0) !== 0x80) {
                        self.lastNeed = 1;
                        return '\ufffd';
                    }
                    if (self.lastNeed > 2 && buf.length > 2) {
                        if ((buf[2] & 0xC0) !== 0x80) {
                            self.lastNeed = 2;
                            return '\ufffd';
                        }
                    }
                }
            }

            // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
            function utf8FillLast(buf) {
                var p = this.lastTotal - this.lastNeed;
                var r = utf8CheckExtraBytes(this, buf, p);
                if (r !== undefined) return r;
                if (this.lastNeed <= buf.length) {
                    buf.copy(this.lastChar, p, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                buf.copy(this.lastChar, p, 0, buf.length);
                this.lastNeed -= buf.length;
            }

            // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
            // partial character, the character's bytes are buffered until the required
            // number of bytes are available.
            function utf8Text(buf, i) {
                var total = utf8CheckIncomplete(this, buf, i);
                if (!this.lastNeed) return buf.toString('utf8', i);
                this.lastTotal = total;
                var end = buf.length - (total - this.lastNeed);
                buf.copy(this.lastChar, 0, end);
                return buf.toString('utf8', i, end);
            }

            // For UTF-8, a replacement character is added when ending on a partial
            // character.
            function utf8End(buf) {
                var r = buf && buf.length ? this.write(buf) : '';
                if (this.lastNeed) return r + '\ufffd';
                return r;
            }

            // UTF-16LE typically needs two bytes per character, but even if we have an even
            // number of bytes available, we need to check if we end on a leading/high
            // surrogate. In that case, we need to wait for the next two bytes in order to
            // decode the last character properly.
            function utf16Text(buf, i) {
                if ((buf.length - i) % 2 === 0) {
                    var r = buf.toString('utf16le', i);
                    if (r) {
                        var c = r.charCodeAt(r.length - 1);
                        if (c >= 0xD800 && c <= 0xDBFF) {
                            this.lastNeed = 2;
                            this.lastTotal = 4;
                            this.lastChar[0] = buf[buf.length - 2];
                            this.lastChar[1] = buf[buf.length - 1];
                            return r.slice(0, -1);
                        }
                    }
                    return r;
                }
                this.lastNeed = 1;
                this.lastTotal = 2;
                this.lastChar[0] = buf[buf.length - 1];
                return buf.toString('utf16le', i, buf.length - 1);
            }

            // For UTF-16LE we do not explicitly append special replacement characters if we
            // end on a partial character, we simply let v8 handle that.
            function utf16End(buf) {
                var r = buf && buf.length ? this.write(buf) : '';
                if (this.lastNeed) {
                    var end = this.lastTotal - this.lastNeed;
                    return r + this.lastChar.toString('utf16le', 0, end);
                }
                return r;
            }

            function base64Text(buf, i) {
                var n = (buf.length - i) % 3;
                if (n === 0) return buf.toString('base64', i);
                this.lastNeed = 3 - n;
                this.lastTotal = 3;
                if (n === 1) {
                    this.lastChar[0] = buf[buf.length - 1];
                } else {
                    this.lastChar[0] = buf[buf.length - 2];
                    this.lastChar[1] = buf[buf.length - 1];
                }
                return buf.toString('base64', i, buf.length - n);
            }

            function base64End(buf) {
                var r = buf && buf.length ? this.write(buf) : '';
                if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
                return r;
            }

            // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
            function simpleWrite(buf) {
                return buf.toString(this.encoding);
            }

            function simpleEnd(buf) {
                return buf && buf.length ? this.write(buf) : '';
            }
        }, { "safe-buffer": 12 }], 29: [function (require, module, exports) {
            (function (global) {
                (function () {

                    /**
                     * Module exports.
                     */

                    module.exports = deprecate;

                    /**
                     * Mark that a method should not be used.
                     * Returns a modified function which warns once by default.
                     *
                     * If `localStorage.noDeprecation = true` is set, then it is a no-op.
                     *
                     * If `localStorage.throwDeprecation = true` is set, then deprecated functions
                     * will throw an Error when invoked.
                     *
                     * If `localStorage.traceDeprecation = true` is set, then deprecated functions
                     * will invoke `console.trace()` instead of `console.error()`.
                     *
                     * @param {Function} fn - the function to deprecate
                     * @param {String} msg - the string to print to the console when `fn` is invoked
                     * @returns {Function} a new "deprecated" version of `fn`
                     * @api public
                     */

                    function deprecate(fn, msg) {
                        if (config('noDeprecation')) {
                            return fn;
                        }

                        var warned = false;
                        function deprecated() {
                            if (!warned) {
                                if (config('throwDeprecation')) {
                                    throw new Error(msg);
                                } else if (config('traceDeprecation')) {
                                    console.trace(msg);
                                } else {
                                    console.warn(msg);
                                }
                                warned = true;
                            }
                            return fn.apply(this, arguments);
                        }

                        return deprecated;
                    }

                    /**
                     * Checks `localStorage` for boolean values for the given `name`.
                     *
                     * @param {String} name
                     * @returns {Boolean}
                     * @api private
                     */

                    function config(name) {
                        // accessing global.localStorage can trigger a DOMException in sandboxed iframes
                        try {
                            if (!global.localStorage) return false;
                        } catch (_) {
                            return false;
                        }
                        var val = global.localStorage[name];
                        if (null == val) return false;
                        return String(val).toLowerCase() === 'true';
                    }

                }).call(this)
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {}], 30: [function (require, module, exports) {
            const wiki = require('wikijs').default;
            //console.log(summaryText);
            wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
                .page(summaryText)
                .then(page =>
                    page
                        .chain()
                        .summary()
                        .image()
                        .request()
                )
                // .then(page => page.summary())
                // .then(console.log) //.summary() .info() .html() etc
                .then(data => showSummary(data))

        }, { "wikijs": 77 }], 31: [function (require, module, exports) {
            'use strict';

            function preserveCamelCase(str) {
                let isLastCharLower = false;
                let isLastCharUpper = false;
                let isLastLastCharUpper = false;

                for (let i = 0; i < str.length; i++) {
                    const c = str[i];

                    if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
                        str = str.substr(0, i) + '-' + str.substr(i);
                        isLastCharLower = false;
                        isLastLastCharUpper = isLastCharUpper;
                        isLastCharUpper = true;
                        i++;
                    } else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
                        str = str.substr(0, i - 1) + '-' + str.substr(i - 1);
                        isLastLastCharUpper = isLastCharUpper;
                        isLastCharUpper = false;
                        isLastCharLower = true;
                    } else {
                        isLastCharLower = c.toLowerCase() === c;
                        isLastLastCharUpper = isLastCharUpper;
                        isLastCharUpper = c.toUpperCase() === c;
                    }
                }

                return str;
            }

            module.exports = function (str) {
                if (arguments.length > 1) {
                    str = Array.from(arguments)
                        .map(x => x.trim())
                        .filter(x => x.length)
                        .join('-');
                } else {
                    str = str.trim();
                }

                if (str.length === 0) {
                    return '';
                }

                if (str.length === 1) {
                    return str.toLowerCase();
                }

                if (/^[a-z0-9]+$/.test(str)) {
                    return str;
                }

                const hasUpperCase = str !== str.toLowerCase();

                if (hasUpperCase) {
                    str = preserveCamelCase(str);
                }

                return str
                    .replace(/^[_.\- ]+/, '')
                    .toLowerCase()
                    .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
            };

        }, {}], 32: [function (require, module, exports) {
            var global = typeof self !== 'undefined' ? self : this;
            var __self__ = (function () {
                function F() {
                    this.fetch = false;
                    this.DOMException = global.DOMException
                }
                F.prototype = global;
                return new F();
            })();
            (function (self) {

                var irrelevant = (function (exports) {

                    var support = {
                        searchParams: 'URLSearchParams' in self,
                        iterable: 'Symbol' in self && 'iterator' in Symbol,
                        blob:
                            'FileReader' in self &&
                            'Blob' in self &&
                            (function () {
                                try {
                                    new Blob();
                                    return true
                                } catch (e) {
                                    return false
                                }
                            })(),
                        formData: 'FormData' in self,
                        arrayBuffer: 'ArrayBuffer' in self
                    };

                    function isDataView(obj) {
                        return obj && DataView.prototype.isPrototypeOf(obj)
                    }

                    if (support.arrayBuffer) {
                        var viewClasses = [
                            '[object Int8Array]',
                            '[object Uint8Array]',
                            '[object Uint8ClampedArray]',
                            '[object Int16Array]',
                            '[object Uint16Array]',
                            '[object Int32Array]',
                            '[object Uint32Array]',
                            '[object Float32Array]',
                            '[object Float64Array]'
                        ];

                        var isArrayBufferView =
                            ArrayBuffer.isView ||
                            function (obj) {
                                return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
                            };
                    }

                    function normalizeName(name) {
                        if (typeof name !== 'string') {
                            name = String(name);
                        }
                        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
                            throw new TypeError('Invalid character in header field name')
                        }
                        return name.toLowerCase()
                    }

                    function normalizeValue(value) {
                        if (typeof value !== 'string') {
                            value = String(value);
                        }
                        return value
                    }

                    // Build a destructive iterator for the value list
                    function iteratorFor(items) {
                        var iterator = {
                            next: function () {
                                var value = items.shift();
                                return { done: value === undefined, value: value }
                            }
                        };

                        if (support.iterable) {
                            iterator[Symbol.iterator] = function () {
                                return iterator
                            };
                        }

                        return iterator
                    }

                    function Headers(headers) {
                        this.map = {};

                        if (headers instanceof Headers) {
                            headers.forEach(function (value, name) {
                                this.append(name, value);
                            }, this);
                        } else if (Array.isArray(headers)) {
                            headers.forEach(function (header) {
                                this.append(header[0], header[1]);
                            }, this);
                        } else if (headers) {
                            Object.getOwnPropertyNames(headers).forEach(function (name) {
                                this.append(name, headers[name]);
                            }, this);
                        }
                    }

                    Headers.prototype.append = function (name, value) {
                        name = normalizeName(name);
                        value = normalizeValue(value);
                        var oldValue = this.map[name];
                        this.map[name] = oldValue ? oldValue + ', ' + value : value;
                    };

                    Headers.prototype['delete'] = function (name) {
                        delete this.map[normalizeName(name)];
                    };

                    Headers.prototype.get = function (name) {
                        name = normalizeName(name);
                        return this.has(name) ? this.map[name] : null
                    };

                    Headers.prototype.has = function (name) {
                        return this.map.hasOwnProperty(normalizeName(name))
                    };

                    Headers.prototype.set = function (name, value) {
                        this.map[normalizeName(name)] = normalizeValue(value);
                    };

                    Headers.prototype.forEach = function (callback, thisArg) {
                        for (var name in this.map) {
                            if (this.map.hasOwnProperty(name)) {
                                callback.call(thisArg, this.map[name], name, this);
                            }
                        }
                    };

                    Headers.prototype.keys = function () {
                        var items = [];
                        this.forEach(function (value, name) {
                            items.push(name);
                        });
                        return iteratorFor(items)
                    };

                    Headers.prototype.values = function () {
                        var items = [];
                        this.forEach(function (value) {
                            items.push(value);
                        });
                        return iteratorFor(items)
                    };

                    Headers.prototype.entries = function () {
                        var items = [];
                        this.forEach(function (value, name) {
                            items.push([name, value]);
                        });
                        return iteratorFor(items)
                    };

                    if (support.iterable) {
                        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
                    }

                    function consumed(body) {
                        if (body.bodyUsed) {
                            return Promise.reject(new TypeError('Already read'))
                        }
                        body.bodyUsed = true;
                    }

                    function fileReaderReady(reader) {
                        return new Promise(function (resolve, reject) {
                            reader.onload = function () {
                                resolve(reader.result);
                            };
                            reader.onerror = function () {
                                reject(reader.error);
                            };
                        })
                    }

                    function readBlobAsArrayBuffer(blob) {
                        var reader = new FileReader();
                        var promise = fileReaderReady(reader);
                        reader.readAsArrayBuffer(blob);
                        return promise
                    }

                    function readBlobAsText(blob) {
                        var reader = new FileReader();
                        var promise = fileReaderReady(reader);
                        reader.readAsText(blob);
                        return promise
                    }

                    function readArrayBufferAsText(buf) {
                        var view = new Uint8Array(buf);
                        var chars = new Array(view.length);

                        for (var i = 0; i < view.length; i++) {
                            chars[i] = String.fromCharCode(view[i]);
                        }
                        return chars.join('')
                    }

                    function bufferClone(buf) {
                        if (buf.slice) {
                            return buf.slice(0)
                        } else {
                            var view = new Uint8Array(buf.byteLength);
                            view.set(new Uint8Array(buf));
                            return view.buffer
                        }
                    }

                    function Body() {
                        this.bodyUsed = false;

                        this._initBody = function (body) {
                            this._bodyInit = body;
                            if (!body) {
                                this._bodyText = '';
                            } else if (typeof body === 'string') {
                                this._bodyText = body;
                            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                                this._bodyBlob = body;
                            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                                this._bodyFormData = body;
                            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                                this._bodyText = body.toString();
                            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                                this._bodyArrayBuffer = bufferClone(body.buffer);
                                // IE 10-11 can't handle a DataView body.
                                this._bodyInit = new Blob([this._bodyArrayBuffer]);
                            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                                this._bodyArrayBuffer = bufferClone(body);
                            } else {
                                this._bodyText = body = Object.prototype.toString.call(body);
                            }

                            if (!this.headers.get('content-type')) {
                                if (typeof body === 'string') {
                                    this.headers.set('content-type', 'text/plain;charset=UTF-8');
                                } else if (this._bodyBlob && this._bodyBlob.type) {
                                    this.headers.set('content-type', this._bodyBlob.type);
                                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                                    this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                                }
                            }
                        };

                        if (support.blob) {
                            this.blob = function () {
                                var rejected = consumed(this);
                                if (rejected) {
                                    return rejected
                                }

                                if (this._bodyBlob) {
                                    return Promise.resolve(this._bodyBlob)
                                } else if (this._bodyArrayBuffer) {
                                    return Promise.resolve(new Blob([this._bodyArrayBuffer]))
                                } else if (this._bodyFormData) {
                                    throw new Error('could not read FormData body as blob')
                                } else {
                                    return Promise.resolve(new Blob([this._bodyText]))
                                }
                            };

                            this.arrayBuffer = function () {
                                if (this._bodyArrayBuffer) {
                                    return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
                                } else {
                                    return this.blob().then(readBlobAsArrayBuffer)
                                }
                            };
                        }

                        this.text = function () {
                            var rejected = consumed(this);
                            if (rejected) {
                                return rejected
                            }

                            if (this._bodyBlob) {
                                return readBlobAsText(this._bodyBlob)
                            } else if (this._bodyArrayBuffer) {
                                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
                            } else if (this._bodyFormData) {
                                throw new Error('could not read FormData body as text')
                            } else {
                                return Promise.resolve(this._bodyText)
                            }
                        };

                        if (support.formData) {
                            this.formData = function () {
                                return this.text().then(decode)
                            };
                        }

                        this.json = function () {
                            return this.text().then(JSON.parse)
                        };

                        return this
                    }

                    // HTTP methods whose capitalization should be normalized
                    var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

                    function normalizeMethod(method) {
                        var upcased = method.toUpperCase();
                        return methods.indexOf(upcased) > -1 ? upcased : method
                    }

                    function Request(input, options) {
                        options = options || {};
                        var body = options.body;

                        if (input instanceof Request) {
                            if (input.bodyUsed) {
                                throw new TypeError('Already read')
                            }
                            this.url = input.url;
                            this.credentials = input.credentials;
                            if (!options.headers) {
                                this.headers = new Headers(input.headers);
                            }
                            this.method = input.method;
                            this.mode = input.mode;
                            this.signal = input.signal;
                            if (!body && input._bodyInit != null) {
                                body = input._bodyInit;
                                input.bodyUsed = true;
                            }
                        } else {
                            this.url = String(input);
                        }

                        this.credentials = options.credentials || this.credentials || 'same-origin';
                        if (options.headers || !this.headers) {
                            this.headers = new Headers(options.headers);
                        }
                        this.method = normalizeMethod(options.method || this.method || 'GET');
                        this.mode = options.mode || this.mode || null;
                        this.signal = options.signal || this.signal;
                        this.referrer = null;

                        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
                            throw new TypeError('Body not allowed for GET or HEAD requests')
                        }
                        this._initBody(body);
                    }

                    Request.prototype.clone = function () {
                        return new Request(this, { body: this._bodyInit })
                    };

                    function decode(body) {
                        var form = new FormData();
                        body
                            .trim()
                            .split('&')
                            .forEach(function (bytes) {
                                if (bytes) {
                                    var split = bytes.split('=');
                                    var name = split.shift().replace(/\+/g, ' ');
                                    var value = split.join('=').replace(/\+/g, ' ');
                                    form.append(decodeURIComponent(name), decodeURIComponent(value));
                                }
                            });
                        return form
                    }

                    function parseHeaders(rawHeaders) {
                        var headers = new Headers();
                        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
                        // https://tools.ietf.org/html/rfc7230#section-3.2
                        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
                        preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
                            var parts = line.split(':');
                            var key = parts.shift().trim();
                            if (key) {
                                var value = parts.join(':').trim();
                                headers.append(key, value);
                            }
                        });
                        return headers
                    }

                    Body.call(Request.prototype);

                    function Response(bodyInit, options) {
                        if (!options) {
                            options = {};
                        }

                        this.type = 'default';
                        this.status = options.status === undefined ? 200 : options.status;
                        this.ok = this.status >= 200 && this.status < 300;
                        this.statusText = 'statusText' in options ? options.statusText : 'OK';
                        this.headers = new Headers(options.headers);
                        this.url = options.url || '';
                        this._initBody(bodyInit);
                    }

                    Body.call(Response.prototype);

                    Response.prototype.clone = function () {
                        return new Response(this._bodyInit, {
                            status: this.status,
                            statusText: this.statusText,
                            headers: new Headers(this.headers),
                            url: this.url
                        })
                    };

                    Response.error = function () {
                        var response = new Response(null, { status: 0, statusText: '' });
                        response.type = 'error';
                        return response
                    };

                    var redirectStatuses = [301, 302, 303, 307, 308];

                    Response.redirect = function (url, status) {
                        if (redirectStatuses.indexOf(status) === -1) {
                            throw new RangeError('Invalid status code')
                        }

                        return new Response(null, { status: status, headers: { location: url } })
                    };

                    exports.DOMException = self.DOMException;
                    try {
                        new exports.DOMException();
                    } catch (err) {
                        exports.DOMException = function (message, name) {
                            this.message = message;
                            this.name = name;
                            var error = Error(message);
                            this.stack = error.stack;
                        };
                        exports.DOMException.prototype = Object.create(Error.prototype);
                        exports.DOMException.prototype.constructor = exports.DOMException;
                    }

                    function fetch(input, init) {
                        return new Promise(function (resolve, reject) {
                            var request = new Request(input, init);

                            if (request.signal && request.signal.aborted) {
                                return reject(new exports.DOMException('Aborted', 'AbortError'))
                            }

                            var xhr = new XMLHttpRequest();

                            function abortXhr() {
                                xhr.abort();
                            }

                            xhr.onload = function () {
                                var options = {
                                    status: xhr.status,
                                    statusText: xhr.statusText,
                                    headers: parseHeaders(xhr.getAllResponseHeaders() || '')
                                };
                                options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
                                var body = 'response' in xhr ? xhr.response : xhr.responseText;
                                resolve(new Response(body, options));
                            };

                            xhr.onerror = function () {
                                reject(new TypeError('Network request failed'));
                            };

                            xhr.ontimeout = function () {
                                reject(new TypeError('Network request failed'));
                            };

                            xhr.onabort = function () {
                                reject(new exports.DOMException('Aborted', 'AbortError'));
                            };

                            xhr.open(request.method, request.url, true);

                            if (request.credentials === 'include') {
                                xhr.withCredentials = true;
                            } else if (request.credentials === 'omit') {
                                xhr.withCredentials = false;
                            }

                            if ('responseType' in xhr && support.blob) {
                                xhr.responseType = 'blob';
                            }

                            request.headers.forEach(function (value, name) {

                            });

                            if (request.signal) {
                                request.signal.addEventListener('abort', abortXhr);

                                xhr.onreadystatechange = function () {
                                    // DONE (success or failure)
                                    if (xhr.readyState === 4) {
                                        request.signal.removeEventListener('abort', abortXhr);
                                    }
                                };
                            }

                            xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
                        })
                    }

                    fetch.polyfill = true;

                    if (!self.fetch) {
                        self.fetch = fetch;
                        self.Headers = Headers;
                        self.Request = Request;
                        self.Response = Response;
                    }

                    exports.Headers = Headers;
                    exports.Request = Request;
                    exports.Response = Response;
                    exports.fetch = fetch;

                    Object.defineProperty(exports, '__esModule', { value: true });

                    return exports;

                }({}));
            })(__self__);
            __self__.fetch.ponyfill = true;
            // Remove "polyfill" property added by whatwg-fetch
            delete __self__.fetch.polyfill;
            // Choose between native implementation (global) or custom implementation (__self__)
            // var ctx = global.fetch ? global : __self__;
            var ctx = __self__; // this line disable service worker support temporarily
            exports = ctx.fetch // To enable: import fetch from 'cross-fetch'
            exports.default = ctx.fetch // For TypeScript consumers without esModuleInterop.
            exports.fetch = ctx.fetch // To enable: import {fetch} from 'cross-fetch'
            exports.Headers = ctx.Headers
            exports.Request = ctx.Request
            exports.Response = ctx.Response
            module.exports = exports

        }, {}], 33: [function (require, module, exports) {
            const tokenize = require('./lib/tokenize')
            const constructTree = require('./lib/construct-tree')
            const StreamTokenizer = require('./lib/stream-tokenizer')
            const StreamTreeConstructor = require('./lib/stream-tree-constructor')

            // Need to be separate exports
            // in order to be properly bundled
            // and recognised by Rollup as named
            // exports
            module.exports.tokenize = tokenize
            module.exports.constructTree = constructTree
            module.exports.StreamTokenizer = StreamTokenizer
            module.exports.StreamTreeConstructor = StreamTreeConstructor

        }, { "./lib/construct-tree": 38, "./lib/stream-tokenizer": 40, "./lib/stream-tree-constructor": 41, "./lib/tokenize": 42 }], 34: [function (require, module, exports) {
            module.exports = {
                NODE_DOCUMENT: 'document',
                NODE_TAG: 'tag',
                NODE_TEXT: 'text',
                NODE_DOCTYPE: 'doctype',
                NODE_COMMENT: 'comment',
                NODE_SCRIPT: 'script',
                NODE_STYLE: 'style'
            }

        }, {}], 35: [function (require, module, exports) {
            module.exports = {
                TOKEN_TEXT: 'token:text',

                TOKEN_OPEN_TAG_START: 'token:open-tag-start',

                TOKEN_ATTRIBUTE_KEY: 'token:attribute-key',
                TOKEN_ATTRIBUTE_ASSIGNMENT: 'token:attribute-assignment',
                TOKEN_ATTRIBUTE_VALUE_WRAPPER_START: 'token:attribute-value-wrapper-start',
                TOKEN_ATTRIBUTE_VALUE: 'token:attribute-value',
                TOKEN_ATTRIBUTE_VALUE_WRAPPER_END: 'token:attribute-value-wrapper-end',

                TOKEN_OPEN_TAG_END: 'token:open-tag-end',
                TOKEN_CLOSE_TAG: 'token:close-tag',

                TOKEN_OPEN_TAG_START_SCRIPT: 'token:open-tag-start-script',
                TOKEN_SCRIPT_TAG_CONTENT: 'token:script-tag-content',
                TOKEN_OPEN_TAG_END_SCRIPT: 'token:open-tag-end-script',
                TOKEN_CLOSE_TAG_SCRIPT: 'token:close-tag-script',

                TOKEN_OPEN_TAG_START_STYLE: 'token:open-tag-start-style',
                TOKEN_STYLE_TAG_CONTENT: 'token:style-tag-content',
                TOKEN_OPEN_TAG_END_STYLE: 'token:open-tag-end-style',
                TOKEN_CLOSE_TAG_STYLE: 'token:close-tag-style',

                TOKEN_DOCTYPE_START: 'token:doctype-start',
                TOKEN_DOCTYPE_END: 'token:doctype-end',
                TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START: 'token:doctype-attribute-wrapper-start',
                TOKEN_DOCTYPE_ATTRIBUTE: 'token:doctype-attribute',
                TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_END: 'token:doctype-attribute-wrapper-end',

                TOKEN_COMMENT_START: 'token:comment-start',
                TOKEN_COMMENT_CONTENT: 'token:comment-content',
                TOKEN_COMMENT_END: 'token:comment-end'
            }


        }, {}], 36: [function (require, module, exports) {
            module.exports = {
                DATA_CONTEXT: 'tokenizer-context:data',
                OPEN_TAG_START_CONTEXT: 'tokenizer-context:open-tag-start',
                CLOSE_TAG_CONTEXT: 'tokenizer-context:close-tag',
                ATTRIBUTES_CONTEXT: 'tokenizer-context:attributes',
                OPEN_TAG_END_CONTEXT: 'tokenizer-context:open-tag-end',
                ATTRIBUTE_KEY_CONTEXT: 'tokenizer-context:attribute-key',
                ATTRIBUTE_VALUE_CONTEXT: 'tokenizer-context:attribute-value',
                ATTRIBUTE_VALUE_BARE_CONTEXT: 'tokenizer-context:attribute-value-bare',
                ATTRIBUTE_VALUE_WRAPPED_CONTEXT: 'tokenizer-context:attribute-value-wrapped',
                SCRIPT_CONTENT_CONTEXT: 'tokenizer-context:script-content',
                STYLE_CONTENT_CONTEXT: 'tokenizer-context:style-content',
                DOCTYPE_START_CONTEXT: 'tokenizer-context:doctype-start',
                DOCTYPE_END_CONTEXT: 'tokenizer-context:doctype-end',
                DOCTYPE_ATTRIBUTES_CONTEXT: 'tokenizer-context:doctype-attributes',
                DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT: 'tokenizer-context:doctype-attribute-wrapped',
                DOCTYPE_ATTRIBUTE_BARE_CONTEXT: 'tokenizer-context:doctype-attribute-bare',
                COMMENT_START_CONTEXT: 'tokenizer-context:comment-start',
                COMMENT_CONTENT_CONTEXT: 'tokenizer-context:comment-content',
                COMMENT_END_CONTEXT: 'tokenizer-context:comment-end'
            }

        }, {}], 37: [function (require, module, exports) {
            module.exports = {
                TAG_CONTENT_CONTEXT: 'tree-constructor-context:tag-content',
                TAG_CONTEXT: 'tree-constructor-context:tag',
                TAG_NAME_CONTEXT: 'tree-constructor-context:tag-name',
                ATTRIBUTES_CONTEXT: 'tree-constructor-context:attributes',
                ATTRIBUTE_CONTEXT: 'tree-constructor-context:attribute',
                ATTRIBUTE_VALUE_CONTEXT: 'tree-constructor-context:attribute-value',
                COMMENT_CONTEXT: 'tree-constructor-context:comment',
                DOCTYPE_CONTEXT: 'tree-constructor-context:doctype',
                DOCTYPE_ATTRIBUTES_CONTEXT: 'tree-constructor-context:doctype-attributes',
                DOCTYPE_ATTRIBUTE_CONTEXT: 'tree-constructor-context:doctype-attribute',
                SCRIPT_TAG_CONTEXT: 'tree-constructor-context:script-tag',
                STYLE_TAG_CONTEXT: 'tree-constructor-context:style-tag'
            }

        }, {}], 38: [function (require, module, exports) {
            const tag = require('./tree-constructor-context-handlers/tag')
            const tagContent = require('./tree-constructor-context-handlers/tag-content')
            const tagName = require('./tree-constructor-context-handlers/tag-name')
            const attributes = require('./tree-constructor-context-handlers/attributes')
            const attribute = require('./tree-constructor-context-handlers/attribute')
            const attributeValue = require('./tree-constructor-context-handlers/attribute-value')
            const comment = require('./tree-constructor-context-handlers/comment')
            const doctype = require('./tree-constructor-context-handlers/doctype')
            const doctypeAttributes = require('./tree-constructor-context-handlers/doctype-attributes')
            const doctypeAttribute = require('./tree-constructor-context-handlers/doctype-attribute')
            const scriptTag = require('./tree-constructor-context-handlers/script-tag')
            const styleTag = require('./tree-constructor-context-handlers/style-tag')

            const {
                TAG_CONTENT_CONTEXT,
                TAG_CONTEXT,
                TAG_NAME_CONTEXT,
                ATTRIBUTES_CONTEXT,
                ATTRIBUTE_CONTEXT,
                ATTRIBUTE_VALUE_CONTEXT,
                COMMENT_CONTEXT,
                DOCTYPE_CONTEXT,
                DOCTYPE_ATTRIBUTES_CONTEXT,
                DOCTYPE_ATTRIBUTE_CONTEXT,
                SCRIPT_TAG_CONTEXT,
                STYLE_TAG_CONTEXT
            } = require('./constants/tree-constructor-contexts')
            const { NODE_DOCUMENT } = require('./constants/ast-nodes')

            const contextsMap = {
                [TAG_CONTENT_CONTEXT]: tagContent,
                [TAG_CONTEXT]: tag,
                [TAG_NAME_CONTEXT]: tagName,
                [ATTRIBUTES_CONTEXT]: attributes,
                [ATTRIBUTE_CONTEXT]: attribute,
                [ATTRIBUTE_VALUE_CONTEXT]: attributeValue,
                [COMMENT_CONTEXT]: comment,
                [DOCTYPE_CONTEXT]: doctype,
                [DOCTYPE_ATTRIBUTES_CONTEXT]: doctypeAttributes,
                [DOCTYPE_ATTRIBUTE_CONTEXT]: doctypeAttribute,
                [SCRIPT_TAG_CONTEXT]: scriptTag,
                [STYLE_TAG_CONTEXT]: styleTag
            }

            function processTokens(tokens, state, positionOffset) {
                let tokenIndex = state.caretPosition - positionOffset

                while (tokenIndex < tokens.length) {
                    const token = tokens[tokenIndex]
                    const contextHandler = contextsMap[state.currentContext.type]

                    state = contextHandler(token, state)
                    tokenIndex = state.caretPosition - positionOffset
                }

                return state
            }

            module.exports = function constructTree(
                tokens = [],
                existingState
            ) {
                let state = existingState

                if (existingState === undefined) {
                    const rootContext = {
                        type: TAG_CONTENT_CONTEXT,
                        parentRef: undefined,
                        content: []
                    }
                    const rootNode = {
                        nodeType: NODE_DOCUMENT,
                        parentRef: undefined,
                        content: {}
                    }

                    state = {
                        caretPosition: 0,
                        currentContext: rootContext,
                        currentNode: rootNode,
                        rootNode
                    }
                }

                const positionOffset = state.caretPosition

                processTokens(tokens, state, positionOffset)

                return { state, ast: state.rootNode }
            }

        }, { "./constants/ast-nodes": 34, "./constants/tree-constructor-contexts": 37, "./tree-constructor-context-handlers/attribute": 61, "./tree-constructor-context-handlers/attribute-value": 60, "./tree-constructor-context-handlers/attributes": 62, "./tree-constructor-context-handlers/comment": 63, "./tree-constructor-context-handlers/doctype": 66, "./tree-constructor-context-handlers/doctype-attribute": 64, "./tree-constructor-context-handlers/doctype-attributes": 65, "./tree-constructor-context-handlers/script-tag": 67, "./tree-constructor-context-handlers/style-tag": 68, "./tree-constructor-context-handlers/tag": 71, "./tree-constructor-context-handlers/tag-content": 69, "./tree-constructor-context-handlers/tag-name": 70 }], 39: [function (require, module, exports) {
            const OPEN_TAG_NAME_PATTERN = /^<(\S+)/
            const CLOSE_TAG_NAME_PATTERN = /^<\/((?:.|\n)*)>$/

            function prettyJSON(obj) {
                return JSON.stringify(obj, null, 2)
            }

            /**
             * Clear tree of nodes from everything
             * "parentRef" properties so the tree
             * can be easily stringified into JSON.
             */
            function clearAst(ast) {
                const cleanAst = ast

                delete cleanAst.parentRef

                if (Array.isArray(ast.content.children)) {
                    cleanAst.content.children = ast.content.children.map((node) => {
                        return clearAst(node)
                    })
                }

                return cleanAst
            }

            function parseOpenTagName(openTagStartTokenContent) {
                const match = openTagStartTokenContent.match(OPEN_TAG_NAME_PATTERN)

                if (match === null) {
                    throw new Error(
                        'Unable to parse open tag name.\n' +
                        `${openTagStartTokenContent} does not match pattern of opening tag.`
                    )
                }

                return match[1].toLowerCase()
            }

            function parseCloseTagName(closeTagTokenContent) {
                const match = closeTagTokenContent.match(CLOSE_TAG_NAME_PATTERN)

                if (match === null) {
                    throw new Error(
                        'Unable to parse close tag name.\n' +
                        `${closeTagTokenContent} does not match pattern of closing tag.`
                    )
                }

                return match[1].trim().toLowerCase()
            }

            function calculateTokenCharactersRange(state, { keepBuffer }) {
                if (keepBuffer === undefined) {
                    throw new Error(
                        'Unable to calculate characters range for token.\n' +
                        '"keepBuffer" parameter is not specified to decide if ' +
                        'the decision buffer is a part of characters range.'
                    )
                }

                const startPosition = (
                    state.caretPosition -
                    (state.accumulatedContent.length - 1) -
                    state.decisionBuffer.length
                )

                let endPosition

                if (!keepBuffer) {
                    endPosition = state.caretPosition - state.decisionBuffer.length
                } else {
                    endPosition = state.caretPosition
                }

                return { startPosition, endPosition }
            }

            function isWhitespace(char) {
                return char === ' ' || char === '\n' || char === '\t'
            }

            module.exports = {
                prettyJSON,
                clearAst,
                parseOpenTagName,
                parseCloseTagName,
                calculateTokenCharactersRange,
                isWhitespace
            }

        }, {}], 40: [function (require, module, exports) {
            (function (Buffer) {
                (function () {
                    const { Transform } = require('stream')

                    const tokenize = require('./tokenize')

                    class StreamTokenizer extends Transform {
                        constructor(options) {
                            super(Object.assign(
                                {},
                                options,
                                {
                                    decodeStrings: false,
                                    readableObjectMode: true
                                }
                            ))

                            this.currentTokenizerState = undefined
                            this.setDefaultEncoding('utf8')
                        }

                        _transform(chunk, encoding, callback) {
                            let chunkString = chunk

                            if (Buffer.isBuffer(chunk)) {
                                chunkString = chunk.toString()
                            }

                            const { state, tokens } = tokenize(
                                chunkString,
                                this.currentTokenizerState,
                                { isFinalChunk: false }
                            )

                            this.currentTokenizerState = state

                            callback(null, tokens)
                        }

                        _flush(callback) {
                            const tokenizeResults = tokenize(
                                '',
                                this.currentTokenizerState,
                                { isFinalChunk: true }
                            )

                            this.push(tokenizeResults.tokens)

                            callback()
                        }
                    }

                    module.exports = StreamTokenizer

                }).call(this)
            }).call(this, { "isBuffer": require("../../../../../../../Users/akbar/AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js") })
        }, { "../../../../../../../Users/akbar/AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js": 7, "./tokenize": 42, "stream": 13 }], 41: [function (require, module, exports) {
            const { Transform } = require('stream')

            const constructTree = require('./construct-tree')

            class StreamTreeConstructor extends Transform {
                constructor(options) {
                    super(Object.assign(
                        {},
                        options,
                        {
                            objectMode: true,
                            readableObjectMode: true
                        }
                    ))

                    this.currentState = undefined
                }

                _transform(tokensChunk, encoding, callback) {
                    const { state, ast } = constructTree(
                        tokensChunk,
                        this.currentState
                    )

                    this.currentState = state

                    callback(null, ast)
                }
            }

            module.exports = StreamTreeConstructor

        }, { "./construct-tree": 38, "stream": 13 }], 42: [function (require, module, exports) {
            const dataContext = require('./tokenizer-context-handlers/data')
            const openTagStartContext = require('./tokenizer-context-handlers/open-tag-start')
            const closeTagContext = require('./tokenizer-context-handlers/close-tag')
            const openTagEndContext = require('./tokenizer-context-handlers/open-tag-end')
            const attributesContext = require('./tokenizer-context-handlers/attributes')
            const attributeKeyContext = require('./tokenizer-context-handlers/attribute-key')
            const attributeValueContext = require('./tokenizer-context-handlers/attribute-value')
            const attributeValueBareContext = require('./tokenizer-context-handlers/attribute-value-bare')
            const attributeValueWrappedContext = require('./tokenizer-context-handlers/attribute-value-wrapped')
            const scriptContentContext = require('./tokenizer-context-handlers/script-tag-content')
            const styleContentContext = require('./tokenizer-context-handlers/style-tag-content')
            const doctypeStartContext = require('./tokenizer-context-handlers/doctype-start')
            const doctypeEndContextFactory = require('./tokenizer-context-handlers/doctype-end')
            const doctypeAttributesContext = require('./tokenizer-context-handlers/doctype-attributes')
            const doctypeAttributeWrappedContext = require('./tokenizer-context-handlers/doctype-attribute-wrapped')
            const doctypeAttributeBareEndContext = require('./tokenizer-context-handlers/doctype-attribute-bare')
            const commentContentContext = require('./tokenizer-context-handlers/comment-content')

            const {
                DATA_CONTEXT,
                OPEN_TAG_START_CONTEXT,
                CLOSE_TAG_CONTEXT,
                ATTRIBUTES_CONTEXT,
                OPEN_TAG_END_CONTEXT,
                ATTRIBUTE_KEY_CONTEXT,
                ATTRIBUTE_VALUE_CONTEXT,
                ATTRIBUTE_VALUE_BARE_CONTEXT,
                ATTRIBUTE_VALUE_WRAPPED_CONTEXT,
                SCRIPT_CONTENT_CONTEXT,
                STYLE_CONTENT_CONTEXT,
                DOCTYPE_START_CONTEXT,
                DOCTYPE_END_CONTEXT,
                DOCTYPE_ATTRIBUTES_CONTEXT,
                DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT,
                DOCTYPE_ATTRIBUTE_BARE_CONTEXT,
                COMMENT_CONTENT_CONTEXT,
            } = require('./constants/tokenizer-contexts')

            const contextHandlersMap = {
                [DATA_CONTEXT]: dataContext,
                [OPEN_TAG_START_CONTEXT]: openTagStartContext,
                [CLOSE_TAG_CONTEXT]: closeTagContext,
                [ATTRIBUTES_CONTEXT]: attributesContext,
                [OPEN_TAG_END_CONTEXT]: openTagEndContext,
                [ATTRIBUTE_KEY_CONTEXT]: attributeKeyContext,
                [ATTRIBUTE_VALUE_CONTEXT]: attributeValueContext,
                [ATTRIBUTE_VALUE_BARE_CONTEXT]: attributeValueBareContext,
                [ATTRIBUTE_VALUE_WRAPPED_CONTEXT]: attributeValueWrappedContext,
                [SCRIPT_CONTENT_CONTEXT]: scriptContentContext,
                [STYLE_CONTENT_CONTEXT]: styleContentContext,
                [DOCTYPE_START_CONTEXT]: doctypeStartContext,
                [DOCTYPE_END_CONTEXT]: doctypeEndContextFactory,
                [DOCTYPE_ATTRIBUTES_CONTEXT]: doctypeAttributesContext,
                [DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT]: doctypeAttributeWrappedContext,
                [DOCTYPE_ATTRIBUTE_BARE_CONTEXT]: doctypeAttributeBareEndContext,
                [COMMENT_CONTENT_CONTEXT]: commentContentContext
            }

            function tokenizeChars(
                chars,
                state,
                tokens,
                { isFinalChunk, positionOffset }
            ) {
                let charIndex = state.caretPosition - positionOffset

                while (charIndex < chars.length) {
                    const context = contextHandlersMap[state.currentContext]

                    state.decisionBuffer += chars[charIndex]
                    context.parseSyntax(state.decisionBuffer, state, tokens)

                    charIndex = state.caretPosition - positionOffset
                }

                if (isFinalChunk) {
                    const context = contextHandlersMap[state.currentContext]

                    // Move the caret back, as at this point
                    // it in the position outside of chars array,
                    // and it should not be taken into account
                    // when calculating characters range
                    state.caretPosition--

                    if (context.handleContentEnd !== undefined) {
                        context.handleContentEnd(state, tokens)
                    }
                }
            }

            function tokenize(
                content = '',
                existingState,
                { isFinalChunk } = {}
            ) {
                isFinalChunk = isFinalChunk === undefined ? true : isFinalChunk

                let state

                if (existingState !== undefined) {
                    state = Object.assign({}, existingState)
                } else {
                    state = {
                        currentContext: DATA_CONTEXT,
                        contextParams: {},
                        decisionBuffer: '',
                        accumulatedContent: '',
                        caretPosition: 0
                    }
                }

                const chars = state.decisionBuffer + content
                const tokens = []

                const positionOffset = state.caretPosition - state.decisionBuffer.length

                tokenizeChars(chars, state, tokens, {
                    isFinalChunk,
                    positionOffset
                })

                return { state, tokens }
            }

            module.exports = tokenize

        }, { "./constants/tokenizer-contexts": 36, "./tokenizer-context-handlers/attribute-key": 43, "./tokenizer-context-handlers/attribute-value": 46, "./tokenizer-context-handlers/attribute-value-bare": 44, "./tokenizer-context-handlers/attribute-value-wrapped": 45, "./tokenizer-context-handlers/attributes": 47, "./tokenizer-context-handlers/close-tag": 48, "./tokenizer-context-handlers/comment-content": 49, "./tokenizer-context-handlers/data": 50, "./tokenizer-context-handlers/doctype-attribute-bare": 51, "./tokenizer-context-handlers/doctype-attribute-wrapped": 52, "./tokenizer-context-handlers/doctype-attributes": 53, "./tokenizer-context-handlers/doctype-end": 54, "./tokenizer-context-handlers/doctype-start": 55, "./tokenizer-context-handlers/open-tag-end": 56, "./tokenizer-context-handlers/open-tag-start": 57, "./tokenizer-context-handlers/script-tag-content": 58, "./tokenizer-context-handlers/style-tag-content": 59 }], 43: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const { TOKEN_ATTRIBUTE_KEY } = require('../constants/token-types')
            const { ATTRIBUTES_CONTEXT } = require('../constants/tokenizer-contexts')

            function keyEnd(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                tokens.push({
                    type: TOKEN_ATTRIBUTE_KEY,
                    content: state.accumulatedContent,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTES_CONTEXT
            }

            function isKeyBreak(chars) {
                return (
                    chars === '='
                    || chars === ' '
                    || chars === '\n'
                    || chars === '\t'
                    || chars === '/'
                    || chars === '>'
                )
            }

            function parseSyntax(chars, state, tokens) {
                if (isKeyBreak(chars)) {
                    return keyEnd(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 44: [function (require, module, exports) {
            const {
                calculateTokenCharactersRange,
                isWhitespace
            } = require('../helpers')

            const { TOKEN_ATTRIBUTE_VALUE } = require('../constants/token-types')
            const { ATTRIBUTES_CONTEXT } = require('../constants/tokenizer-contexts')

            function valueEnd(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                tokens.push({
                    type: TOKEN_ATTRIBUTE_VALUE,
                    content: state.accumulatedContent,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTES_CONTEXT
            }

            function parseSyntax(chars, state, tokens) {
                if (
                    isWhitespace(chars)
                    || chars === '>'
                    || chars === '/'
                ) {
                    return valueEnd(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 45: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_ATTRIBUTE_VALUE,
                TOKEN_ATTRIBUTE_VALUE_WRAPPER_END
            } = require('../constants/token-types')
            const {
                ATTRIBUTES_CONTEXT,
                ATTRIBUTE_VALUE_WRAPPED_CONTEXT
            } = require('../constants/tokenizer-contexts')

            function wrapper(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })
                const endWrapperPosition = range.endPosition + 1

                tokens.push(
                    {
                        type: TOKEN_ATTRIBUTE_VALUE,
                        content: state.accumulatedContent,
                        startPosition: range.startPosition,
                        endPosition: range.endPosition
                    },
                    {
                        type: TOKEN_ATTRIBUTE_VALUE_WRAPPER_END,
                        content: state.decisionBuffer,
                        startPosition: endWrapperPosition,
                        endPosition: endWrapperPosition
                    }
                )

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTES_CONTEXT
                state.caretPosition++

                state.contextParams[ATTRIBUTE_VALUE_WRAPPED_CONTEXT] = undefined
            }

            function parseSyntax(chars, state, tokens) {
                const wrapperChar = state.contextParams[ATTRIBUTE_VALUE_WRAPPED_CONTEXT].wrapper

                if (chars === wrapperChar) {
                    return wrapper(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 46: [function (require, module, exports) {
            const { isWhitespace } = require('../helpers')
            const {
                ATTRIBUTE_VALUE_WRAPPED_CONTEXT,
                ATTRIBUTES_CONTEXT,
                ATTRIBUTE_VALUE_BARE_CONTEXT
            } = require('../constants/tokenizer-contexts')
            const {
                TOKEN_ATTRIBUTE_VALUE_WRAPPER_START
            } = require('../constants/token-types')

            function wrapper(state, tokens) {
                const wrapper = state.decisionBuffer

                tokens.push({
                    type: TOKEN_ATTRIBUTE_VALUE_WRAPPER_START,
                    content: wrapper,
                    startPosition: state.caretPosition,
                    endPosition: state.caretPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTE_VALUE_WRAPPED_CONTEXT
                state.contextParams[ATTRIBUTE_VALUE_WRAPPED_CONTEXT] = { wrapper }
                state.caretPosition++
            }

            function bare(state) {
                state.accumulatedContent = state.decisionBuffer
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTE_VALUE_BARE_CONTEXT
                state.caretPosition++
            }

            function tagEnd(state) {
                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTES_CONTEXT
            }

            function parseSyntax(chars, state, tokens) {
                if (chars === '"' || chars === '\'') {
                    return wrapper(state, tokens)
                }

                if (chars === '>' || chars === '/') {
                    return tagEnd(state, tokens)
                }

                if (!isWhitespace(chars)) {
                    return bare(state, tokens)
                }

                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 47: [function (require, module, exports) {
            const {
                isWhitespace,
                calculateTokenCharactersRange
            } = require('../helpers')
            const {
                ATTRIBUTES_CONTEXT,
                OPEN_TAG_END_CONTEXT,
                ATTRIBUTE_VALUE_CONTEXT,
                ATTRIBUTE_KEY_CONTEXT
            } = require('../constants/tokenizer-contexts')
            const { TOKEN_ATTRIBUTE_ASSIGNMENT } = require('../constants/token-types')

            function tagEnd(state) {
                const tagName = state.contextParams[ATTRIBUTES_CONTEXT].tagName

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = OPEN_TAG_END_CONTEXT
                state.contextParams[OPEN_TAG_END_CONTEXT] = { tagName }

                state.contextParams[ATTRIBUTES_CONTEXT] = undefined
            }

            function noneWhitespace(state) {
                state.accumulatedContent = state.decisionBuffer
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTE_KEY_CONTEXT
                state.caretPosition++
            }

            function equal(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: true })

                tokens.push({
                    type: TOKEN_ATTRIBUTE_ASSIGNMENT,
                    content: state.decisionBuffer,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTE_VALUE_CONTEXT
                state.caretPosition++
            }

            function parseSyntax(chars, state, tokens) {
                if (chars === '>' || chars === '/') {
                    return tagEnd(state, tokens)
                }

                if (chars === '=') {
                    return equal(state, tokens)
                }

                if (!isWhitespace(chars)) {
                    return noneWhitespace(state, tokens)
                }

                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 48: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const { TOKEN_CLOSE_TAG } = require('../constants/token-types')
            const { DATA_CONTEXT } = require('../constants/tokenizer-contexts')

            function closingCornerBrace(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: true })

                tokens.push({
                    type: TOKEN_CLOSE_TAG,
                    content: state.accumulatedContent + state.decisionBuffer,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DATA_CONTEXT
                state.caretPosition++
            }

            function parseSyntax(chars, state, tokens) {
                if (chars === '>') {
                    return closingCornerBrace(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 49: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_COMMENT_END,
                TOKEN_COMMENT_CONTENT
            } = require('../constants/token-types')
            const {
                DATA_CONTEXT
            } = require('../constants/tokenizer-contexts')

            const COMMENT_END = '-->'

            function commentEnd(state, tokens) {
                const contentRange = calculateTokenCharactersRange(state, { keepBuffer: false })
                const commentEndRange = {
                    startPosition: contentRange.endPosition + 1,
                    endPosition: contentRange.endPosition + COMMENT_END.length,
                }

                tokens.push({
                    type: TOKEN_COMMENT_CONTENT,
                    content: state.accumulatedContent,
                    startPosition: contentRange.startPosition,
                    endPosition: contentRange.endPosition
                })

                tokens.push({
                    type: TOKEN_COMMENT_END,
                    content: state.decisionBuffer,
                    startPosition: commentEndRange.startPosition,
                    endPosition: commentEndRange.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DATA_CONTEXT
                state.caretPosition++
            }

            function parseSyntax(chars, state, tokens) {
                if (chars === '-' || chars === '--') {
                    state.caretPosition++

                    return
                }

                if (chars === COMMENT_END) {
                    return commentEnd(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 50: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_TEXT,
                TOKEN_COMMENT_START
            } = require('../constants/token-types')
            const {
                OPEN_TAG_START_CONTEXT,
                CLOSE_TAG_CONTEXT,
                DOCTYPE_START_CONTEXT,
                COMMENT_CONTENT_CONTEXT
            } = require('../constants/tokenizer-contexts')

            const COMMENT_START = '<!--'

            function generateTextToken(state) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                return {
                    type: TOKEN_TEXT,
                    content: state.accumulatedContent,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                }
            }

            function openingCornerBraceWithText(state, tokens) {
                if (state.accumulatedContent.length !== 0) {
                    tokens.push(generateTextToken(state))
                }

                state.accumulatedContent = state.decisionBuffer
                state.decisionBuffer = ''
                state.currentContext = OPEN_TAG_START_CONTEXT
                state.caretPosition++
            }

            function openingCornerBraceWithSlash(state, tokens) {
                if (state.accumulatedContent.length !== 0) {
                    tokens.push(generateTextToken(state))
                }

                state.accumulatedContent = state.decisionBuffer
                state.decisionBuffer = ''
                state.currentContext = CLOSE_TAG_CONTEXT
                state.caretPosition++
            }

            function doctypeStart(state, tokens) {
                if (state.accumulatedContent.length !== 0) {
                    tokens.push(generateTextToken(state))
                }

                state.accumulatedContent = state.decisionBuffer
                state.decisionBuffer = ''
                state.currentContext = DOCTYPE_START_CONTEXT
                state.caretPosition++
            }

            function commentStart(state, tokens) {
                if (state.accumulatedContent.length !== 0) {
                    tokens.push(generateTextToken(state))
                }

                const commentStartRange = {
                    startPosition: state.caretPosition - (COMMENT_START.length - 1),
                    endPosition: state.caretPosition
                }

                tokens.push({
                    type: TOKEN_COMMENT_START,
                    content: state.decisionBuffer,
                    startPosition: commentStartRange.startPosition,
                    endPosition: commentStartRange.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = COMMENT_CONTENT_CONTEXT
                state.caretPosition++
            }

            function handleContentEnd(state, tokens) {
                const textContent = state.accumulatedContent + state.decisionBuffer

                if (textContent.length !== 0) {
                    const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                    tokens.push({
                        type: TOKEN_TEXT,
                        content: textContent,
                        startPosition: range.startPosition,
                        endPosition: range.endPosition
                    })
                }
            }

            function isIncompleteDoctype(chars) {
                const charsUpperCase = chars.toUpperCase()

                return (
                    charsUpperCase === '<!'
                    || charsUpperCase === '<!D'
                    || charsUpperCase === '<!DO'
                    || charsUpperCase === '<!DOC'
                    || charsUpperCase === '<!DOCT'
                    || charsUpperCase === '<!DOCTY'
                    || charsUpperCase === '<!DOCTYP'
                )
            }

            const OPEN_TAG_START_PATTERN = /^<\w/

            function parseSyntax(chars, state, tokens) {
                if (OPEN_TAG_START_PATTERN.test(chars)) {
                    return openingCornerBraceWithText(state, tokens)
                }

                if (chars === '</') {
                    return openingCornerBraceWithSlash(state, tokens)
                }

                if (
                    chars === '<'
                    || chars === '<!'
                    || chars === '<!-'
                ) {
                    state.caretPosition++

                    return
                }

                if (chars === COMMENT_START) {
                    return commentStart(state, tokens)
                }

                if (isIncompleteDoctype(chars)) {
                    state.caretPosition++

                    return
                }

                if (chars.toUpperCase() === '<!DOCTYPE') {
                    return doctypeStart(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax,
                handleContentEnd
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 51: [function (require, module, exports) {
            const { isWhitespace, calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_DOCTYPE_ATTRIBUTE
            } = require('../constants/token-types')
            const {
                DOCTYPE_ATTRIBUTES_CONTEXT
            } = require('../constants/tokenizer-contexts')

            function attributeEnd(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                tokens.push({
                    type: TOKEN_DOCTYPE_ATTRIBUTE,
                    content: state.accumulatedContent,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DOCTYPE_ATTRIBUTES_CONTEXT
            }

            function parseSyntax(chars, state, tokens) {
                if (isWhitespace(chars) || chars === '>') {
                    return attributeEnd(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 52: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_END,
                TOKEN_DOCTYPE_ATTRIBUTE
            } = require('../constants/token-types')
            const {
                DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT,
                DOCTYPE_ATTRIBUTES_CONTEXT
            } = require('../constants/tokenizer-contexts')

            function wrapper(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })
                const endWrapperPosition = range.endPosition + 1

                tokens.push({
                    type: TOKEN_DOCTYPE_ATTRIBUTE,
                    content: state.accumulatedContent,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                tokens.push({
                    type: TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_END,
                    content: state.decisionBuffer,
                    startPosition: endWrapperPosition,
                    endPosition: endWrapperPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DOCTYPE_ATTRIBUTES_CONTEXT
                state.caretPosition++

                state.contextParams[DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT] = undefined
            }

            function parseSyntax(chars, state, tokens) {
                const wrapperChar = state.contextParams[DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT].wrapper

                if (chars === wrapperChar) {
                    return wrapper(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 53: [function (require, module, exports) {
            const { isWhitespace } = require('../helpers')

            const {
                DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT,
                DOCTYPE_ATTRIBUTE_BARE_CONTEXT,
                DOCTYPE_END_CONTEXT
            } = require('../constants/tokenizer-contexts')
            const {
                TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START
            } = require('../constants/token-types')

            function wrapper(state, tokens) {
                const wrapper = state.decisionBuffer

                tokens.push({
                    type: TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START,
                    content: wrapper,
                    startPosition: state.caretPosition,
                    endPosition: state.caretPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT
                state.contextParams[DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT] = { wrapper }
                state.caretPosition++
            }

            function bare(state) {
                state.accumulatedContent = state.decisionBuffer
                state.decisionBuffer = ''
                state.currentContext = DOCTYPE_ATTRIBUTE_BARE_CONTEXT
                state.caretPosition++
            }

            function closingCornerBrace(state) {
                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DOCTYPE_END_CONTEXT
            }

            function parseSyntax(chars, state, tokens) {
                if (chars === '"' || chars === '\'') {
                    return wrapper(state, tokens)
                }

                if (chars === '>') {
                    return closingCornerBrace(state, tokens)
                }

                if (!isWhitespace(chars)) {
                    return bare(state, tokens)
                }

                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 54: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const { TOKEN_DOCTYPE_END } = require('../constants/token-types')
            const { DATA_CONTEXT } = require('../constants/tokenizer-contexts')

            function closingCornerBrace(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: true })

                tokens.push({
                    type: TOKEN_DOCTYPE_END,
                    content: state.decisionBuffer,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DATA_CONTEXT
                state.caretPosition++
            }

            function parseSyntax(chars, state, tokens) {
                return closingCornerBrace(state, tokens)
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 55: [function (require, module, exports) {
            const { isWhitespace, calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_DOCTYPE_START
            } = require('../constants/token-types')

            const {
                DOCTYPE_END_CONTEXT,
                DOCTYPE_ATTRIBUTES_CONTEXT
            } = require('../constants/tokenizer-contexts')

            function generateDoctypeStartToken(state) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                return {
                    type: TOKEN_DOCTYPE_START,
                    content: state.accumulatedContent,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                }
            }

            function closingCornerBrace(state, tokens) {
                tokens.push(generateDoctypeStartToken(state))

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DOCTYPE_END_CONTEXT
            }

            function whitespace(state, tokens) {
                tokens.push(generateDoctypeStartToken(state))

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DOCTYPE_ATTRIBUTES_CONTEXT
            }

            function parseSyntax(chars, state, tokens) {
                if (isWhitespace(chars)) {
                    return whitespace(state, tokens)
                }

                if (chars === '>') {
                    return closingCornerBrace(state, tokens)
                }

                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 56: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_OPEN_TAG_END,
                TOKEN_OPEN_TAG_END_SCRIPT,
                TOKEN_OPEN_TAG_END_STYLE
            } = require('../constants/token-types')
            const {
                OPEN_TAG_END_CONTEXT,
                DATA_CONTEXT,
                SCRIPT_CONTENT_CONTEXT,
                STYLE_CONTENT_CONTEXT
            } = require('../constants/tokenizer-contexts')

            const tokensMap = {
                'script': TOKEN_OPEN_TAG_END_SCRIPT,
                'style': TOKEN_OPEN_TAG_END_STYLE,
                'default': TOKEN_OPEN_TAG_END
            }

            const contextsMap = {
                'script': SCRIPT_CONTENT_CONTEXT,
                'style': STYLE_CONTENT_CONTEXT,
                'default': DATA_CONTEXT
            }

            function closingCornerBrace(state, tokens) {
                const range = calculateTokenCharactersRange(state, { keepBuffer: true })
                const tagName = state.contextParams[OPEN_TAG_END_CONTEXT].tagName

                tokens.push({
                    type: tokensMap[tagName] || tokensMap.default,
                    content: state.accumulatedContent + state.decisionBuffer,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = contextsMap[tagName] || contextsMap.default
                state.caretPosition++

                state.contextParams[OPEN_TAG_END_CONTEXT] = undefined
            }

            function parseSyntax(chars, state, tokens) {
                if (chars === '>') {
                    return closingCornerBrace(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 57: [function (require, module, exports) {
            const {
                parseOpenTagName,
                isWhitespace,
                calculateTokenCharactersRange
            } = require('../helpers')

            const {
                TOKEN_OPEN_TAG_START,
                TOKEN_OPEN_TAG_START_SCRIPT,
                TOKEN_OPEN_TAG_START_STYLE
            } = require('../constants/token-types')
            const {
                OPEN_TAG_END_CONTEXT,
                ATTRIBUTES_CONTEXT
            } = require('../constants/tokenizer-contexts')

            const tokensMap = {
                'script': TOKEN_OPEN_TAG_START_SCRIPT,
                'style': TOKEN_OPEN_TAG_START_STYLE,
                'default': TOKEN_OPEN_TAG_START
            }

            function tagEnd(state, tokens) {
                const tagName = parseOpenTagName(state.accumulatedContent)
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                tokens.push({
                    type: tokensMap[tagName] || tokensMap.default,
                    content: state.accumulatedContent,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.decisionBuffer = ''
                state.accumulatedContent = ''
                state.currentContext = OPEN_TAG_END_CONTEXT
                state.contextParams[OPEN_TAG_END_CONTEXT] = { tagName }
            }

            function whitespace(state, tokens) {
                const tagName = parseOpenTagName(state.accumulatedContent)
                const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                tokens.push({
                    type: tokensMap[tagName] || tokensMap.default,
                    content: state.accumulatedContent,
                    startPosition: range.startPosition,
                    endPosition: range.endPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = ATTRIBUTES_CONTEXT
                state.contextParams[ATTRIBUTES_CONTEXT] = { tagName }
                state.caretPosition++
            }

            function parseSyntax(chars, state, tokens) {
                if (chars === '>' || chars === '/') {
                    return tagEnd(state, tokens)
                }

                if (isWhitespace(chars)) {
                    return whitespace(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 58: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_SCRIPT_TAG_CONTENT,
                TOKEN_CLOSE_TAG_SCRIPT
            } = require('../constants/token-types')
            const { DATA_CONTEXT } = require('../constants/tokenizer-contexts')

            function closingScriptTag(state, tokens) {
                if (state.accumulatedContent !== '') {
                    const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                    tokens.push({
                        type: TOKEN_SCRIPT_TAG_CONTENT,
                        content: state.accumulatedContent,
                        startPosition: range.startPosition,
                        endPosition: range.endPosition
                    })
                }

                tokens.push({
                    type: TOKEN_CLOSE_TAG_SCRIPT,
                    content: state.decisionBuffer,
                    startPosition: state.caretPosition - (state.decisionBuffer.length - 1),
                    endPosition: state.caretPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DATA_CONTEXT
                state.caretPosition++
            }

            const INCOMPLETE_CLOSING_TAG_PATTERN = /<\/[^>]+$/
            const CLOSING_SCRIPT_TAG_PATTERN = /<\/script\s*>/i

            function parseSyntax(chars, state, tokens) {
                if (
                    chars === '<' ||
                    chars === '</' ||
                    INCOMPLETE_CLOSING_TAG_PATTERN.test(chars)
                ) {
                    state.caretPosition++

                    return
                }

                if (CLOSING_SCRIPT_TAG_PATTERN.test(chars)) {
                    return closingScriptTag(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 59: [function (require, module, exports) {
            const { calculateTokenCharactersRange } = require('../helpers')

            const {
                TOKEN_STYLE_TAG_CONTENT,
                TOKEN_CLOSE_TAG_STYLE
            } = require('../constants/token-types')
            const { DATA_CONTEXT } = require('../constants/tokenizer-contexts')

            function closingStyleTag(state, tokens) {
                if (state.accumulatedContent !== '') {
                    const range = calculateTokenCharactersRange(state, { keepBuffer: false })

                    tokens.push({
                        type: TOKEN_STYLE_TAG_CONTENT,
                        content: state.accumulatedContent,
                        startPosition: range.startPosition,
                        endPosition: range.endPosition
                    })
                }

                tokens.push({
                    type: TOKEN_CLOSE_TAG_STYLE,
                    content: state.decisionBuffer,
                    startPosition: state.caretPosition - (state.decisionBuffer.length - 1),
                    endPosition: state.caretPosition
                })

                state.accumulatedContent = ''
                state.decisionBuffer = ''
                state.currentContext = DATA_CONTEXT
                state.caretPosition++
            }

            const INCOMPLETE_CLOSING_TAG_PATTERN = /<\/[^>]+$/
            const CLOSING_STYLE_TAG_PATTERN = /<\/style\s*>/i

            function parseSyntax(chars, state, tokens) {
                if (
                    chars === '<' ||
                    chars === '</' ||
                    INCOMPLETE_CLOSING_TAG_PATTERN.test(chars)
                ) {
                    state.caretPosition++

                    return
                }

                if (CLOSING_STYLE_TAG_PATTERN.test(chars)) {
                    return closingStyleTag(state, tokens)
                }

                state.accumulatedContent += state.decisionBuffer
                state.decisionBuffer = ''
                state.caretPosition++
            }

            module.exports = {
                parseSyntax
            }

        }, { "../constants/token-types": 35, "../constants/tokenizer-contexts": 36, "../helpers": 39 }], 60: [function (require, module, exports) {
            const {
                TOKEN_OPEN_TAG_END,
                TOKEN_OPEN_TAG_END_SCRIPT,
                TOKEN_OPEN_TAG_END_STYLE,
                TOKEN_ATTRIBUTE_KEY,
                TOKEN_ATTRIBUTE_ASSIGNMENT,
                TOKEN_ATTRIBUTE_VALUE,
                TOKEN_ATTRIBUTE_VALUE_WRAPPER_START,
                TOKEN_ATTRIBUTE_VALUE_WRAPPER_END
            } = require('../constants/token-types')

            function getLastAttribute(state) {
                const attributes = state.currentNode.content.attributes

                return attributes[attributes.length - 1]
            }

            function handleValueEnd(state) {
                state.currentContext = state.currentContext.parentRef

                return state
            }

            function handleAttributeValue(state, token) {
                const attribute = getLastAttribute(state)

                attribute.value = token
                state.caretPosition++

                return state
            }

            function handleAttributeValueWrapperStart(state, token) {
                const attribute = getLastAttribute(state)

                attribute.startWrapper = token
                state.caretPosition++

                return state
            }

            function handleAttributeValueWrapperEnd(state, token) {
                const attribute = getLastAttribute(state)

                attribute.endWrapper = token
                state.caretPosition++

                return state
            }

            module.exports = function attributeValue(token, state) {
                const VALUE_END_TOKENS = [
                    TOKEN_OPEN_TAG_END,
                    TOKEN_OPEN_TAG_END_SCRIPT,
                    TOKEN_OPEN_TAG_END_STYLE,
                    TOKEN_ATTRIBUTE_KEY,
                    TOKEN_ATTRIBUTE_ASSIGNMENT
                ]

                if (VALUE_END_TOKENS.indexOf(token.type) !== -1) {
                    return handleValueEnd(state)
                }

                if (token.type === TOKEN_ATTRIBUTE_VALUE) {
                    return handleAttributeValue(state, token)
                }

                if (token.type === TOKEN_ATTRIBUTE_VALUE_WRAPPER_START) {
                    return handleAttributeValueWrapperStart(state, token)
                }

                if (token.type === TOKEN_ATTRIBUTE_VALUE_WRAPPER_END) {
                    return handleAttributeValueWrapperEnd(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35 }], 61: [function (require, module, exports) {
            const {
                TOKEN_OPEN_TAG_END,
                TOKEN_OPEN_TAG_END_SCRIPT,
                TOKEN_OPEN_TAG_END_STYLE,
                TOKEN_ATTRIBUTE_KEY,
                TOKEN_ATTRIBUTE_ASSIGNMENT
            } = require('../constants/token-types')
            const {
                ATTRIBUTE_VALUE_CONTEXT
            } = require('../constants/tree-constructor-contexts')

            function getLastAttribute(state) {
                const attributes = state.currentNode.content.attributes

                return attributes[attributes.length - 1]
            }

            function handleOpenTagEnd(state) {
                state.currentContext = state.currentContext.parentRef

                return state
            }

            function handleAttributeKey(state, token) {
                const attribute = getLastAttribute(state)

                if (attribute.key !== undefined || attribute.value !== undefined) {
                    state.currentContext = state.currentContext.parentRef

                    return state
                }

                attribute.key = token
                state.caretPosition++

                return state
            }

            function handleAttributeAssignment(state) {
                const attribute = getLastAttribute(state)

                if (attribute.value !== undefined) {
                    state.currentContext = state.currentContext.parentRef

                    return state
                }

                state.currentContext = {
                    parentRef: state.currentContext,
                    type: ATTRIBUTE_VALUE_CONTEXT
                }
                state.caretPosition++

                return state
            }

            module.exports = function attribute(token, state) {
                const OPEN_TAG_END_TOKENS = [
                    TOKEN_OPEN_TAG_END,
                    TOKEN_OPEN_TAG_END_SCRIPT,
                    TOKEN_OPEN_TAG_END_STYLE
                ]

                if (OPEN_TAG_END_TOKENS.indexOf(token.type) !== -1) {
                    return handleOpenTagEnd(state)
                }

                if (token.type === TOKEN_ATTRIBUTE_KEY) {
                    return handleAttributeKey(state, token)
                }

                if (token.type === TOKEN_ATTRIBUTE_ASSIGNMENT) {
                    return handleAttributeAssignment(state)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35, "../constants/tree-constructor-contexts": 37 }], 62: [function (require, module, exports) {
            const {
                TOKEN_ATTRIBUTE_KEY,
                TOKEN_ATTRIBUTE_ASSIGNMENT,
                TOKEN_OPEN_TAG_END,
                TOKEN_OPEN_TAG_END_SCRIPT,
                TOKEN_OPEN_TAG_END_STYLE
            } = require('../constants/token-types')
            const {
                ATTRIBUTE_CONTEXT
            } = require('../constants/tree-constructor-contexts')

            function handlerAttributeStart(state) {
                if (state.currentNode.content.attributes === undefined) {
                    state.currentNode.content.attributes = []
                }

                // new empty attribute
                state.currentNode.content.attributes.push({})

                state.currentContext = {
                    parentRef: state.currentContext,
                    type: ATTRIBUTE_CONTEXT
                }

                return state
            }

            function handleOpenTagEnd(state) {
                state.currentContext = state.currentContext.parentRef

                return state
            }

            module.exports = function attributes(token, state) {
                const ATTRIBUTE_START_TOKENS = [
                    TOKEN_ATTRIBUTE_KEY,
                    TOKEN_ATTRIBUTE_ASSIGNMENT
                ]

                if (ATTRIBUTE_START_TOKENS.indexOf(token.type) !== -1) {
                    return handlerAttributeStart(state)
                }

                const ATTRIBUTES_END_TOKENS = [
                    TOKEN_OPEN_TAG_END,
                    TOKEN_OPEN_TAG_END_SCRIPT,
                    TOKEN_OPEN_TAG_END_STYLE
                ]

                if (ATTRIBUTES_END_TOKENS.indexOf(token.type) !== -1) {
                    return handleOpenTagEnd(state)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35, "../constants/tree-constructor-contexts": 37 }], 63: [function (require, module, exports) {
            const {
                TOKEN_COMMENT_START,
                TOKEN_COMMENT_END,
                TOKEN_COMMENT_CONTENT
            } = require('../constants/token-types')

            function handleCommentStart(state, token) {
                state.currentNode.content.start = token
                state.caretPosition++

                return state
            }

            function handleCommentContent(state, token) {
                state.currentNode.content.value = token
                state.caretPosition++

                return state
            }

            function handleCommentEnd(state, token) {
                state.currentNode.content.end = token
                state.currentNode = state.currentNode.parentRef
                state.currentContext = state.currentContext.parentRef
                state.caretPosition++

                return state
            }

            module.exports = function comment(token, state) {
                if (token.type === TOKEN_COMMENT_START) {
                    return handleCommentStart(state, token)
                }

                if (token.type === TOKEN_COMMENT_CONTENT) {
                    return handleCommentContent(state, token)
                }

                if (token.type === TOKEN_COMMENT_END) {
                    return handleCommentEnd(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35 }], 64: [function (require, module, exports) {
            const {
                TOKEN_DOCTYPE_END,
                TOKEN_DOCTYPE_ATTRIBUTE,
                TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START,
                TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_END
            } = require('../constants/token-types')

            function getLastAttribute(state) {
                const attributes = state.currentNode.content.attributes

                return attributes[attributes.length - 1]
            }

            function handleDoctypeEnd(state) {
                state.currentContext = state.currentContext.parentRef

                return state
            }

            function handleAttributeValue(state, token) {
                const attribute = getLastAttribute(state)

                if (attribute.value !== undefined) {
                    state.currentContext = state.currentContext.parentRef

                    return state
                }

                attribute.value = token
                state.caretPosition++

                return state
            }

            function handleAttributeWrapperStart(state, token) {
                const attribute = getLastAttribute(state)

                if (attribute.start !== undefined || attribute.value !== undefined) {
                    state.currentContext = state.currentContext.parentRef

                    return state
                }

                attribute.startWrapper = token
                state.caretPosition++

                return state
            }

            function handleAttributeWrapperEnd(state, token) {
                const attribute = getLastAttribute(state)

                attribute.endWrapper = token
                state.currentContext = state.currentContext.parentRef
                state.caretPosition++

                return state
            }

            module.exports = function doctypeAttribute(token, state) {
                if (token.type === TOKEN_DOCTYPE_END) {
                    return handleDoctypeEnd(state, token)
                }

                if (token.type === TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START) {
                    return handleAttributeWrapperStart(state, token)
                }

                if (token.type === TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_END) {
                    return handleAttributeWrapperEnd(state, token)
                }

                if (token.type === TOKEN_DOCTYPE_ATTRIBUTE) {
                    return handleAttributeValue(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35 }], 65: [function (require, module, exports) {
            const {
                DOCTYPE_ATTRIBUTE_CONTEXT
            } = require('../constants/tree-constructor-contexts')

            const {
                TOKEN_DOCTYPE_END,
                TOKEN_DOCTYPE_ATTRIBUTE,
                TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START
            } = require('../constants/token-types')

            function handleDoctypeEnd(state) {
                state.currentContext = state.currentContext.parentRef

                return state
            }

            function handleAttribute(state) {
                if (state.currentNode.content.attributes === undefined) {
                    state.currentNode.content.attributes = []
                }

                // new empty attribute
                state.currentNode.content.attributes.push({})

                state.currentContext = {
                    type: DOCTYPE_ATTRIBUTE_CONTEXT,
                    parentRef: state.currentContext
                }

                return state
            }

            module.exports = function doctypeAttributes(token, state) {
                if (token.type === TOKEN_DOCTYPE_END) {
                    return handleDoctypeEnd(state, token)
                }

                const ATTRIBUTE_START_TOKENS = [
                    TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START,
                    TOKEN_DOCTYPE_ATTRIBUTE
                ]

                if (ATTRIBUTE_START_TOKENS.indexOf(token.type) !== -1) {
                    return handleAttribute(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35, "../constants/tree-constructor-contexts": 37 }], 66: [function (require, module, exports) {
            const {
                TOKEN_DOCTYPE_END,
                TOKEN_DOCTYPE_ATTRIBUTE,
                TOKEN_DOCTYPE_START,
                TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START
            } = require('../constants/token-types')
            const {
                DOCTYPE_ATTRIBUTES_CONTEXT
            } = require('../constants/tree-constructor-contexts')

            function handleDoctypeStart(state, token) {
                state.currentNode.content.start = token
                state.caretPosition++

                return state
            }

            function handleDoctypeEnd(state, token) {
                state.currentNode.content.end = token
                state.currentNode = state.currentNode.parentRef
                state.currentContext = state.currentContext.parentRef
                state.caretPosition++

                return state
            }

            function handleDoctypeAttributes(state) {
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: DOCTYPE_ATTRIBUTES_CONTEXT
                }

                return state
            }

            module.exports = function doctype(token, state) {
                if (token.type === TOKEN_DOCTYPE_START) {
                    return handleDoctypeStart(state, token)
                }

                if (token.type === TOKEN_DOCTYPE_END) {
                    return handleDoctypeEnd(state, token)
                }

                const ATTRIBUTES_START_TOKENS = [
                    TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START,
                    TOKEN_DOCTYPE_ATTRIBUTE
                ]

                if (ATTRIBUTES_START_TOKENS.indexOf(token.type) !== -1) {
                    return handleDoctypeAttributes(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35, "../constants/tree-constructor-contexts": 37 }], 67: [function (require, module, exports) {
            const {
                TOKEN_OPEN_TAG_START_SCRIPT,
                TOKEN_OPEN_TAG_END_SCRIPT,
                TOKEN_CLOSE_TAG_SCRIPT,
                TOKEN_ATTRIBUTE_KEY,
                TOKEN_ATTRIBUTE_ASSIGNMENT,
                TOKEN_SCRIPT_TAG_CONTENT
            } = require('../constants/token-types')
            const { ATTRIBUTES_CONTEXT } = require('../constants/tree-constructor-contexts')

            function handleOpenTagStartScript(state, token) {
                state.currentNode.content.openStart = token
                state.caretPosition++

                return state
            }

            function handleAttributeStartScript(state) {
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: ATTRIBUTES_CONTEXT
                }

                return state
            }

            function handleOpenTagEndScript(state, token) {
                state.currentNode.content.openEnd = token
                state.caretPosition++

                return state
            }

            function handleScriptContent(state, token) {
                state.currentNode.content.value = token
                state.caretPosition++

                return state
            }

            function handleCloseTagScript(state, token) {
                state.currentNode.content.close = token
                state.currentNode = state.currentNode.parentRef
                state.currentContext = state.currentContext.parentRef
                state.caretPosition++

                return state
            }

            module.exports = function scriptTag(token, state) {
                if (token.type === TOKEN_OPEN_TAG_START_SCRIPT) {
                    return handleOpenTagStartScript(state, token)
                }

                const ATTRIBUTE_START_TOKENS = [
                    TOKEN_ATTRIBUTE_KEY,
                    TOKEN_ATTRIBUTE_ASSIGNMENT
                ]

                if (ATTRIBUTE_START_TOKENS.indexOf(token.type) !== -1) {
                    return handleAttributeStartScript(state)
                }


                if (token.type === TOKEN_OPEN_TAG_END_SCRIPT) {
                    return handleOpenTagEndScript(state, token)
                }

                if (token.type === TOKEN_SCRIPT_TAG_CONTENT) {
                    return handleScriptContent(state, token)
                }

                if (token.type === TOKEN_CLOSE_TAG_SCRIPT) {
                    return handleCloseTagScript(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35, "../constants/tree-constructor-contexts": 37 }], 68: [function (require, module, exports) {
            const {
                TOKEN_OPEN_TAG_START_STYLE,
                TOKEN_OPEN_TAG_END_STYLE,
                TOKEN_CLOSE_TAG_STYLE,
                TOKEN_ATTRIBUTE_KEY,
                TOKEN_ATTRIBUTE_ASSIGNMENT,
                TOKEN_STYLE_TAG_CONTENT
            } = require('../constants/token-types')
            const { ATTRIBUTES_CONTEXT } = require('../constants/tree-constructor-contexts')

            function handleOpenTagStartStyle(state, token) {
                state.currentNode.content.openStart = token
                state.caretPosition++

                return state
            }

            function handleAttributeStartStyle(state) {
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: ATTRIBUTES_CONTEXT
                }

                return state
            }

            function handleOpenTagEndStyle(state, token) {
                state.currentNode.content.openEnd = token
                state.caretPosition++

                return state
            }

            function handleStyleContent(state, token) {
                state.currentNode.content.value = token
                state.caretPosition++

                return state
            }

            function handleCloseTagStyle(state, token) {
                state.currentNode.content.close = token
                state.currentNode = state.currentNode.parentRef
                state.currentContext = state.currentContext.parentRef
                state.caretPosition++

                return state
            }

            module.exports = function styleTag(token, state) {
                if (token.type === TOKEN_OPEN_TAG_START_STYLE) {
                    return handleOpenTagStartStyle(state, token)
                }

                const ATTRIBUTE_START_TOKENS = [
                    TOKEN_ATTRIBUTE_KEY,
                    TOKEN_ATTRIBUTE_ASSIGNMENT
                ]

                if (ATTRIBUTE_START_TOKENS.indexOf(token.type) !== -1) {
                    return handleAttributeStartStyle(state)
                }

                if (token.type === TOKEN_OPEN_TAG_END_STYLE) {
                    return handleOpenTagEndStyle(state, token)
                }

                if (token.type === TOKEN_STYLE_TAG_CONTENT) {
                    return handleStyleContent(state, token)
                }

                if (token.type === TOKEN_CLOSE_TAG_STYLE) {
                    return handleCloseTagStyle(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35, "../constants/tree-constructor-contexts": 37 }], 69: [function (require, module, exports) {
            const parseCloseTagName = require('../helpers').parseCloseTagName

            const {
                TOKEN_OPEN_TAG_START,
                TOKEN_CLOSE_TAG,
                TOKEN_COMMENT_START,
                TOKEN_DOCTYPE_START,
                TOKEN_TEXT,
                TOKEN_OPEN_TAG_START_SCRIPT,
                TOKEN_OPEN_TAG_START_STYLE
            } = require('../constants/token-types')
            const {
                TAG_CONTEXT,
                COMMENT_CONTEXT,
                DOCTYPE_CONTEXT,
                SCRIPT_TAG_CONTEXT,
                STYLE_TAG_CONTEXT
            } = require('../constants/tree-constructor-contexts')
            const {
                NODE_TAG,
                NODE_TEXT,
                NODE_DOCTYPE,
                NODE_COMMENT,
                NODE_SCRIPT,
                NODE_STYLE
            } = require('../constants/ast-nodes')

            function handleOpenTagStart(state) {
                if (state.currentNode.content.children === undefined) {
                    state.currentNode.content.children = []
                }

                const tagNode = {
                    nodeType: NODE_TAG,
                    parentRef: state.currentNode,
                    content: {}
                }

                state.currentNode.content.children.push(tagNode)

                state.currentNode = tagNode
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: TAG_CONTEXT
                }

                return state
            }

            function handleCloseTag(state, token) {
                const closeTagName = parseCloseTagName(token.content)

                if (closeTagName !== state.currentNode.content.name) {
                    state.caretPosition++

                    return state
                }

                state.currentContext = state.currentContext.parentRef

                return state
            }

            function handleCommentStart(state) {
                if (state.currentNode.content.children === undefined) {
                    state.currentNode.content.children = []
                }

                const commentNode = {
                    nodeType: NODE_COMMENT,
                    parentRef: state.currentNode,
                    content: {}
                }

                state.currentNode.content.children.push(commentNode)

                state.currentNode = commentNode
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: COMMENT_CONTEXT
                }

                return state
            }

            function handleDoctypeStart(state) {
                if (state.currentNode.content.children === undefined) {
                    state.currentNode.content.children = []
                }

                const doctypeNode = {
                    nodeType: NODE_DOCTYPE,
                    parentRef: state.currentNode,
                    content: {}
                }

                state.currentNode.content.children.push(doctypeNode)

                state.currentNode = doctypeNode
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: DOCTYPE_CONTEXT
                }

                return state
            }

            function handleText(state, token) {
                if (state.currentNode.content.children === undefined) {
                    state.currentNode.content.children = []
                }

                const textNode = {
                    nodeType: NODE_TEXT,
                    parentRef: state.currentNode,
                    content: {
                        value: token
                    }
                }

                state.currentNode.content.children.push(textNode)
                state.caretPosition++

                return state
            }

            function handleOpenTagStartScript(state) {
                if (state.currentNode.content.children === undefined) {
                    state.currentNode.content.children = []
                }

                const scriptNode = {
                    nodeType: NODE_SCRIPT,
                    parentRef: state.currentNode,
                    content: {}
                }

                state.currentNode.content.children.push(scriptNode)

                state.currentNode = scriptNode
                state.currentContext = {
                    type: SCRIPT_TAG_CONTEXT,
                    parentRef: state.currentContext
                }

                return state
            }

            function handleOpenTagStartStyle(state) {
                if (state.currentNode.content.children === undefined) {
                    state.currentNode.content.children = []
                }

                const styleNode = {
                    nodeType: NODE_STYLE,
                    parentRef: state.currentNode,
                    content: {}
                }

                state.currentNode.content.children.push(styleNode)

                state.currentNode = styleNode
                state.currentContext = {
                    type: STYLE_TAG_CONTEXT,
                    parentRef: state.currentContext
                }

                return state
            }

            module.exports = function tagContent(token, state) {
                if (token.type === TOKEN_OPEN_TAG_START) {
                    return handleOpenTagStart(state, token)
                }

                if (token.type === TOKEN_TEXT) {
                    return handleText(state, token)
                }

                if (token.type === TOKEN_CLOSE_TAG) {
                    return handleCloseTag(state, token)
                }

                if (token.type === TOKEN_COMMENT_START) {
                    return handleCommentStart(state, token)
                }

                if (token.type === TOKEN_DOCTYPE_START) {
                    return handleDoctypeStart(state, token)
                }

                if (token.type === TOKEN_OPEN_TAG_START_SCRIPT) {
                    return handleOpenTagStartScript(state, token)
                }

                if (token.type === TOKEN_OPEN_TAG_START_STYLE) {
                    return handleOpenTagStartStyle(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/ast-nodes": 34, "../constants/token-types": 35, "../constants/tree-constructor-contexts": 37, "../helpers": 39 }], 70: [function (require, module, exports) {
            /**
             * Parser for 'tag-name' context.
             * Parses tag name from 'open-tag-start' (<div)
             * token and save the tag name as self content.
             * Ignores tokens others than 'open-tag-start'.
             */

            const parseOpenTagName = require('../helpers').parseOpenTagName
            const {
                TOKEN_OPEN_TAG_START
            } = require('../constants/token-types')

            function handleTagOpenStart(state, token) {
                state.currentNode.content.name = parseOpenTagName(token.content)

                state.currentContext = state.currentContext.parentRef

                return state
            }

            module.exports = function tagName(token, state) {
                if (token.type === TOKEN_OPEN_TAG_START) {
                    handleTagOpenStart(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35, "../helpers": 39 }], 71: [function (require, module, exports) {
            const {
                TOKEN_OPEN_TAG_START,
                TOKEN_OPEN_TAG_END,
                TOKEN_CLOSE_TAG,
                TOKEN_ATTRIBUTE_KEY,
                TOKEN_ATTRIBUTE_ASSIGNMENT
            } = require('../constants/token-types')
            const {
                TAG_NAME_CONTEXT,
                ATTRIBUTES_CONTEXT,
                TAG_CONTENT_CONTEXT
            } = require('../constants/tree-constructor-contexts')

            function handleOpenTagStart(state, token) {
                state.currentNode.content.openStart = token
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: TAG_NAME_CONTEXT
                }

                return state
            }

            function handleAttributeStart(state) {
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: ATTRIBUTES_CONTEXT
                }

                return state
            }

            function handleOpenTagEnd(state, token) {
                const SELF_CLOSING_TAGS = [
                    'area',
                    'base',
                    'br',
                    'col',
                    'embed',
                    'hr',
                    'img',
                    'input',
                    'keygen',
                    'link',
                    'meta',
                    'param',
                    'source',
                    'track',
                    'wbr'
                ]
                const tagName = state.currentNode.content.name

                state.currentNode.content.openEnd = token

                if (SELF_CLOSING_TAGS.indexOf(tagName) !== -1) {
                    state.currentNode.content.selfClosing = true
                    state.currentNode = state.currentNode.parentRef
                    state.currentContext = state.currentContext.parentRef
                    state.caretPosition++

                    return state
                }

                state.currentNode.content.selfClosing = false
                state.currentContext = {
                    parentRef: state.currentContext,
                    type: TAG_CONTENT_CONTEXT
                }
                state.caretPosition++

                return state
            }

            function handleCloseTag(state, token) {
                state.currentNode.content.close = token
                state.currentNode = state.currentNode.parentRef
                state.currentContext = state.currentContext.parentRef
                state.caretPosition++

                return state
            }

            module.exports = function tag(token, state) {
                if (token.type === TOKEN_OPEN_TAG_START) {
                    return handleOpenTagStart(state, token)
                }

                const ATTRIBUTE_START_TOKENS = [
                    TOKEN_ATTRIBUTE_KEY,
                    TOKEN_ATTRIBUTE_ASSIGNMENT
                ]

                if (ATTRIBUTE_START_TOKENS.indexOf(token.type) !== -1) {
                    return handleAttributeStart(state)
                }

                if (token.type === TOKEN_OPEN_TAG_END) {
                    return handleOpenTagEnd(state, token)
                }

                if (token.type === TOKEN_CLOSE_TAG) {
                    return handleCloseTag(state, token)
                }

                state.caretPosition++

                return state
            }

        }, { "../constants/token-types": 35, "../constants/tree-constructor-contexts": 37 }], 72: [function (require, module, exports) {
            "use strict"; function _interopDefault(t) { return t && "object" == typeof t && "default" in t ? t.default : t } function trimWrappers(t) { return t.replace(/\[\[/g, "").replace(/\]\]/g, "").replace(/\{\{/g, "").replace(/\}\}/g, "").trim() } function trimOr(t) { var e = t.indexOf("|"); return -1 !== e ? t.substring(0, e) : t } function getValue(t, e) { if (!t) return null; var r = t.trim().replace(/File:/, "").replace(/\{\{\d+\}\}/g, "").replace(extraPropertyPattern, "").replace(endingPattern, ""); if ("y" === r || "yes" === r) return !0; if ("birthPlace" == e) return t.trim(); var a = r.match(linksPattern); return a ? a[0].split(linkSeparatorPattern).filter(function (t) { return t }) : trimOr(trimWrappers(r)) } function dataType(t) { var e = t.globalPattern, r = t.parsePattern, a = t.parse, n = t.variable, l = t.name; return function (t) { var i = t.match(e); if (!i) { var s; return s = {}, defineProperty(s, l, []), defineProperty(s, "sourceAfter", t), s } var o = i.map(function (t) { return a(t.match(r)) }), u = i.reduce(function (t, e, r) { return o[r] === DO_NOT_REPLACE ? t : t.replace(e, "$" + n + "_" + r) }, t); return { data: defineProperty({}, l, o), sourceAfter: u } } } function byDataHandler(t, e) { var r = t.source, a = t.context, n = e(r), l = n.data, i = n.sourceAfter; return { context: Object.assign({}, a, l), source: i } } function extractData(t) { return dataTypes$1.map(function (t) { return t.handler }).reduce(byDataHandler, { context: {}, source: t }) } function findPropertyList(t) { var e = t.match(keyValueGlobalPattern); return e ? e.map(function (t) { var e = keyValuePattern.exec(t); if (!e) return null; var r = slicedToArray(e, 3), a = r[1], n = r[2], l = camelCase(a.trim()); return { key: l, value: getValue(n, l) } }).filter(function (t) { return t }) : [] } function fillVariable(t, e) { var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, a = r.simplifyDataValues; if ("string" != typeof t) return console.log("Warning: Something went wrong. Could not fill variables in: (" + (void 0 === t ? "undefined" : _typeof(t)) + ") " + JSON.stringify(t)), {}; var n = dataTypes$1.find(function (e) { return t.match(e.pattern) }); if (n) { var l = n.pattern.exec(t), i = slicedToArray(l, 2), s = i[0], o = i[1], u = e[n.name][parseInt(o, 10)]; return a || "string" != typeof u ? u : t.replace(s, u) } return t } function fillVariables(t, e, r) { if (void 0 === t) return t; if (t instanceof Date) return t; if ("number" == typeof t) return t; if (Array.isArray(t)) return t.map(function (t) { return fillVariables(t, e, r) }); if ("object" === (void 0 === t ? "undefined" : _typeof(t))) return Object.keys(t).reduce(function (a, n) { return Object.assign(a, defineProperty({}, n, fillVariables(t[n], e, r))) }, {}); var a = fillVariable(t, e, r); return a === t ? t : fillVariables(a, e, r) } function handleSmallData(t, e, r) { var a = r.simplifyDataValues; if ("string" == typeof t && t.match(smallDataType.pattern)) { var n = t.replace(smallDataType.pattern, "").replace(/,/, "").trim(), l = smallDataType.pattern.exec(t), i = slicedToArray(l, 2), s = i[1], o = e[smallDataType.name][parseInt(s, 10)], u = { primary: getVariableValue(n, e, { simplifyDataValues: a }), secondary: getVariableValue(o, e, { simplifyDataValues: a }) }; return a ? u.primary : u } return null } function getVariableValue(t, e) { var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, a = r.simplifyDataValues, n = handleSmallData(t, e, { simplifyDataValues: a }); return n || fillVariables(t, e, { simplifyDataValues: a }) } function reduceVariable(t, e, r, a) { if (null === e) return null; if ("boolean" == typeof e) return e; if (Array.isArray(e)) return e.map(function (t) { return getVariableValue(t, r, a) }); if (t.match(/areaTotal/) || t.match(/population/)) { var n = numberParse(e); if (!1 === n && (n = parseFloat(e, 10)), !isNaN(n)) return n } if (t.match(/date/i)) { var l = +new Date(e); if (!isNaN(l)) return new Date(e) } var i = getVariableValue(e, r, a); return Array.isArray(i) ? i.map(function (t) { return getVariableValue(t, r, a) }) : i } function byVariableReduction(t, e) { return function (r, a) { var n = a.key, l = a.value, i = reduceVariable(n, l, t, e); return "" === i || null === i ? r : Object.assign({}, r, defineProperty({}, n, i)) } } function extractProperties(t) { var e = t.source, r = t.context, a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = a.simplifyDataValues, l = void 0 === n || n; return findPropertyList(e).reduce(byVariableReduction(r, { simplifyDataValues: l }), {}) } function transformProperties(t) { return Object.keys(t).reduce(function (e, r) { var a = t[r], n = r.match(blankNamePattern); if (n) { var l = n[1] || "", i = t["blank" + l + "NameSec2"], s = t["blank" + l + "InfoSec2"]; return "string" != typeof i ? e : Object.assign(e, defineProperty({}, camelCase(i), s)) } return r.match(blankInfoPattern) ? e : Object.assign(e, defineProperty({}, r, a)) }, {}) } function findOuterIndex(t) { for (var e = [], r = 0; r < t.length - 1; r++) { var a = t.substr(r, 2); if ("{{" !== a) { if ("}}" === a) { e.pop(); if (0 === e.length) return r + 2; r++ } } else e.push(r), r++ } } function parse(t) { var e = t.match(infoBoxStartPattern); if (!e) return { data: t, sourceLeft: null }; var r = e.index, a = t.substring(r), n = findOuterIndex(a); if (!n) return { data: t, sourceLeft: null }; var l = a.substring(0, n), i = t.substring(n); return { data: l, sourceLeft: !i.match(infoBoxStartPattern) ? null : i } } function extractInfoboxes(t) { for (var e = parse(t), r = [e.data]; e.sourceLeft;)e = parse(e.sourceLeft), r.push(e.data); return r } function cleanSource(t) { var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r = e.removeSmall, a = void 0 !== r && r, n = e.removeReferences; return (void 0 === n || n) && (t = t.replace(/<ref(\s\w+=[^>]+)?>.*<\/ref>/g, "").replace(/<ref(\s\w+=[^>]+)?\s?\/>/g, "")), a && (t = t.replace(/<small>.*<\/small>/g, "")), t.replace(/'''?/g, "").replace(/\|display=inline/g, "").replace(/<br\s?\/?>/g, ",").replace(/&minus;/g, "-").replace(/<sup>/g, "^").replace(/\{\{sfn\|([^\}\}]+)\}\}/g, "").replace(/\{\{efn\|([^\}\}]+)\}\}/g, "").replace(/−/g, "-").replace(/<\/sup>/g, "").replace(/\{\{\s*nowrap\s*\|([^\n\}]+)\}\}/gi, "$1").replace(/<!--([\s\S]*?)-->/g, "").replace(/&nbsp;/g, " ").replace("|''See list''", "") } function transformRowSpan(t) { return t.map(transformCells).reduce(function (t, e, r) { for (var a = 0 === r ? 0 : 1, n = 0; n < e.length; n++)t[n + a] || (t[n + a] = {}), e[n] && (t[n + a][e[n]] = 1); return t }, []).map(function (t) { return Object.keys(t).join(",") }).join(" || ") } function clean(t) { return t.substring(2, t.length - 2).replace(linkPattern$1, function (t, e) { return e.split("|")[0] }).replace(/'''?/g, "") } function parseRow(t) { var e = t[0].match(/BS(\d)/), r = t[0].substring(2), a = 1, n = [], l = 1; for (e && (a = e[1], r = t[0].substring(3)); l <= a; l++)n.push(t[l]); return { type: r, margin: t[l++], text1: t[l++], text2: t[l++], comment: t[l++], icons: n } } function getMatches(t, e) { for (var r = void 0, a = []; null !== (r = e.exec(t));)a.push({ value: r[1] && r[1].trim(), start: r.index, end: r.index + r[0].length }); return a } function parseTableData(t) { var e = t.match(rowPattern$1); return e ? e.map(function (t) { var e = t.match(rowPatternSingle); return slicedToArray(e, 2)[1].trim().split("|").slice(1) }) : [] } function getTables(t) { var e = getMatches(t, tableStartPattern$1), r = getMatches(t, tableEndPattern$1); return e.map(function (e, a) { var n = r[a]; if (!n) throw new Error("[Table Parsing] Failed to pair table"); return { rows: parseTableData(t.substring(e.end, n.start).trim().replace(/'''/g, "")), start: e.start, end: n.end } }) } function last(t) { return t.length ? t[t.length - 1] : void 0 } function parseInfobox(t, e) { var r = extractInfoboxes(t).map(function (t) { return transformProperties(extractProperties(extractData(cleanSource(t, e)), e)) }); if (!r.length) return {}; var a = { general: r.shift() }; return r.forEach(function (t) { var e = t.type; e ? a[camelCase(e)] = t : Object.assign(a, { general: Object.assign({}, a.general, t) }) }), a.tables = parseTables(t), a.bsTables = parseBsTables(t), a.lists = parseLists(t), a } var camelCase = _interopDefault(require("camelcase")), _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t }, defineProperty = function (t, e, r) { return e in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t }, slicedToArray = function () { function t(t, e) { var r = [], a = !0, n = !1, l = void 0; try { for (var i, s = t[Symbol.iterator](); !(a = (i = s.next()).done) && (r.push(i.value), !e || r.length !== e); a = !0); } catch (t) { n = !0, l = t } finally { try { !a && s.return && s.return() } finally { if (n) throw l } } return r } return function (e, r) { if (Array.isArray(e)) return e; if (Symbol.iterator in Object(e)) return t(e, r); throw new TypeError("Invalid attempt to destructure non-iterable instance") } }(), toConsumableArray = function (t) { if (Array.isArray(t)) { for (var e = 0, r = Array(t.length); e < t.length; e++)r[e] = t[e]; return r } return Array.from(t) }, smallGlobalPattern = /\{\{small\|([^\}\}]+)\}\}/g, smallPattern = /small\|([^\}\}]+)\}\}/, small = { globalPattern: smallGlobalPattern, parsePattern: smallPattern, parse: function (t) { return slicedToArray(t, 2)[1] }, variable: "SMALL", name: "smalls" }, flagGlobalPattern = /\{\{flag\|([^\}\}]+)\}\}/g, flagPattern = /flag\|([^\}\}]+)\}\}/, flag = { globalPattern: flagGlobalPattern, parsePattern: flagPattern, parse: function (t) { return slicedToArray(t, 2)[1] }, variable: "FLAG", name: "flags" }, coordsGlobalPattern = /\{\{coord\|([^\}\}]+)\}\}/g, coordsPattern = /coord\|([^\}\}]+)\}\}/, coords = { globalPattern: coordsGlobalPattern, parsePattern: coordsPattern, parse: function (t) { return slicedToArray(t, 2)[1] }, variable: "COORD", name: "coords" }, globalPattern = /\[\[([^\]\|]+)\|?([^\]]+)?\]\]/g, pattern = /\[\[([^\]\|]+)\|?([^\]]+)?\]\]/, instances = { globalPattern: globalPattern, parsePattern: pattern, parse: function (t) { var e = slicedToArray(t, 3), r = e[1], a = e[2]; return r || a }, variable: "INSTANCE", name: "instances" }, extraPropertyPattern = /\n?\s?\|\s?\w+$/, endingPattern = /\n\}\}$/, linksPattern = /((\$\w+_\d+)\s*,?\s*){2,}/g, linkSeparatorPattern = /[,\s?]/g, listItemPrefixPattern = /^\|\s?/, unbulletedListGlobalPattern = /\{\{(?:unbulleted list|ubl|ubt|ublist|unbullet)\s?\|([^\}\}]+)\}\}/gi, unbulletedListItemPattern = /\|\s*([^|}]+)/g, unbulletedLists = { globalPattern: unbulletedListGlobalPattern, parsePattern: unbulletedListItemPattern, parse: function (t) { return t ? t.map(function (t) { return t.replace(listItemPrefixPattern, "").trim() }).filter(function (t) { return t && t.length }) : [] }, variable: "UNBULLETED_LIST", name: "unbulletedLists" }, listItemPrefixPattern$1 = /^\*\s*/, plainListGlobalPattern = /\n(\*\s*[^*|]+)+/g, plainListItemPattern = /\*\s*([^*|]+)/g, unmarkedLists = { globalPattern: plainListGlobalPattern, parsePattern: plainListItemPattern, parse: function (t) { return t ? t.map(function (t) { return t.replace(listItemPrefixPattern$1, "").trim() }).filter(function (t) { return t && t.length }) : [] }, variable: "UNMARKED_LIST", name: "unmarkedLists" }, listItemPrefixPattern$2 = /^\*\s?/, plainListGlobalPattern$1 = /\{\{f?p?P?l?a?i?n?t?\s?list\s?\|([^\}\}]+)\}\}/g, plainListItemPattern$1 = /\*\s*([^*}]+)/g, plainLists = { globalPattern: plainListGlobalPattern$1, parsePattern: plainListItemPattern$1, parse: function (t) { return t ? t.map(function (t) { return t.replace(listItemPrefixPattern$2, "").trim() }).filter(function (t) { return t && t.length }) : [] }, variable: "PLAIN_LIST", name: "plainLists" }, marriageGlobalPattern = /\{\{Marriage\|([^\}\}]+)\}\}/gi, marriagePattern = /Marriage\|([^|]+)\|(.*)\}\}/i, marriages = { globalPattern: marriageGlobalPattern, parsePattern: marriagePattern, parse: function (t) { var e = slicedToArray(t, 3); return { who: e[1], married: e[2] } }, variable: "MARRIAGE", name: "marriages" }, nbayGlobalPattern = /\{\{nbay\|([^\}\}]+)\}\}/gi, nbayPattern = /nbay\|([^|]+)\|(.*)\}\}/i, nbay = { globalPattern: nbayGlobalPattern, parsePattern: nbayPattern, parse: function (t) { var e = slicedToArray(t, 3), r = e[1]; e[2]; return r }, variable: "nbay", name: "nbay" }, otherGlobalPattern = /\{\{([^|\n]+)\|([^|\n]+)\|?([^\}\n]+)?\}\}/g, otherPattern = /\{\{([^|\n]+)\|([^|\n]+)\|?([^\}\n]+)?\}\}/, other = { globalPattern: otherGlobalPattern, parsePattern: otherPattern, parse: function (t) { var e = slicedToArray(t, 4), r = e[1]; e[2], e[3]; return r }, variable: "OTHER", name: "others" }, hlistGlobalPattern = /\{\{hlist\|([^\}\}]+)\}\}/gi, hlistPattern = /hlist\|(.*)\n?\}\}/i, hlist = { globalPattern: hlistGlobalPattern, parsePattern: hlistPattern, parse: function (t) { return slicedToArray(t, 2)[1].split("|") }, variable: "HLIST", name: "hlists" }, birthDateGlobalPattern = /\{\{birth\sdate([^\}\}]+)\}\}/gi, birthDatePattern = /(\d+)\|(\d+)\|(\d+)/, millisInYear = 31536e6, birthDates = { globalPattern: birthDateGlobalPattern, parsePattern: birthDatePattern, parse: function (t) { var e = slicedToArray(t, 4), r = e[1], a = e[2], n = e[3], l = new Date(r, a - 1, n); return { date: l, age: Math.floor((Date.now() - +l) / millisInYear) } }, variable: "BIRTH_DATE", name: "birthDates" }, DO_NOT_REPLACE = Symbol("DO NOT REPLACE"), labeledDateGlobalPattern = /\{\{([^\n\}\}]+)\}\}/g, labeledDatePattern = /(.*)/, labeledDates = { globalPattern: labeledDateGlobalPattern, parsePattern: labeledDatePattern, parse: function (t) { var e = t[0].indexOf("|"); if (e > -1) { var r = t[0].substring(e + 1).slice(0, -2), a = new Date(r + " GMT"); if (!isNaN(a.getTime())) return { date: a }; if (a = new Date(r.split("|").join("-") + " GMT"), !isNaN(a.getTime())) return { date: a } } return DO_NOT_REPLACE }, variable: "LABELED_DATE", name: "labeledDates" }, deathDateGlobalPattern = /\{\{death\sdate\sand\sage([^\}\}]+)\}\}/gi, deathDatePattern = /(\d+)\|(\d+)\|(\d+)\|(\d+)\|?(\d+)?\|?(\d+)?/, millisInYear$1 = 31536e6, deathDates = { globalPattern: deathDateGlobalPattern, parsePattern: deathDatePattern, parse: function (t) { var e = slicedToArray(t, 7), r = e[1], a = e[2], n = e[3], l = e[4], i = e[5], s = void 0 === i ? 0 : i, o = e[6], u = void 0 === o ? 0 : o, c = new Date(r, a - 1, n), f = new Date(l, s - 1, u); return { date: c, age: Math.floor((Number(c) - Number(f)) / millisInYear$1) } }, variable: "DEATH_DATE", name: "deathDates" }, URLGlobalPattern = /\{\{URL\|([^\}\}]+)\}\}/g, URLPattern = /URL\|([^\}\}]+)\}\}/, url = { globalPattern: URLGlobalPattern, parsePattern: URLPattern, parse: function (t) { return slicedToArray(t, 2)[1] }, variable: "URL", name: "urls" }, websiteGlobalPattern = /\[(https?):\/\/((?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)\s+([\w\s]+)\]/g, websitePattern = /\[(https?):\/\/((?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)\s+([\w\s]+)\]/, website = { globalPattern: websiteGlobalPattern, parsePattern: websitePattern, parse: function (t) { var e = slicedToArray(t, 5), r = e[1], a = e[2], n = e[3]; return { protocol: r, hostname: a, path: n, title: e[4], url: r + "://" + a + n } }, variable: "WEBSITE", name: "websites" }, convertGlobalPattern = /\{\{convert\|([\d\.]+)\|(\w+)/g, convertPattern = /\{\{convert\|([\d\.]+)\|(\w+)/, convert = { globalPattern: convertGlobalPattern, parsePattern: convertPattern, parse: function (t) { var e = slicedToArray(t, 3); return e[1] + " " + e[2] }, variable: "CONVERT", name: "converts" }, filmDatesPattern = /\{\{film\sdate([^\}\}]+)\}\}/gi, filmDatePatternGlobal = /(\d+)\|?(\d+)\|?(\d+)\|?([^\|\}]*)\|?(ref\d+=([^\|\}]*))?/g, filmDatePattern = /(\d+)\|?(\d+)\|?(\d+)\|?([^\|\}]*)\|?(ref\d+=([^\|\}]*))?/, filmDates = { globalPattern: filmDatesPattern, parsePattern: filmDatePatternGlobal, parse: function (t) { return t.map(function (t) { var e = t.match(filmDatePattern), r = slicedToArray(e, 7), a = (r[0], r[1]), n = r[2], l = r[3], i = r[4], s = (r[5], r[6]); return { date: new Date(a, n && n - 1, l), location: i, ref: s } }) }, variable: "FILM_DATES", name: "filmDates" }, otherGlobalPattern$1 = /<ref(\s\w+=[^>]+)?>(.*)<\/ref>/g, otherPattern$1 = /<ref(\s\w+=[^>]+)?>(.*)<\/ref>/, attributeGlobalPattern = /(\w+)=(["\w]+)/g, attributePattern = /(\w+)=(["\w]+)/, ref1 = { globalPattern: otherGlobalPattern$1, parsePattern: otherPattern$1, parse: function (t) { var e = slicedToArray(t, 3), r = (e[0], e[1]), a = e[2]; return { attributes: ((r || "").match(attributeGlobalPattern) || []).reduce(function (t, e) { if (e) { var r = e.match(attributePattern), a = slicedToArray(r, 3), n = (a[0], a[1]), l = a[2]; t[n] = l.replace(/"/g, "") } return t }, {}), contents: a } }, variable: "REF", name: "refs" }, otherGlobalPattern$2 = /<ref(\s\w+=[^>]+)?\/>/g, otherPattern$2 = /<ref(\s\w+=[^>]+)?\/>/, attributeGlobalPattern$1 = /(\w+)=(["\w]+)/g, attributePattern$1 = /(\w+)=(["\w]+)/, ref2 = { globalPattern: otherGlobalPattern$2, parsePattern: otherPattern$2, parse: function (t) { return { attributes: t[1].match(attributeGlobalPattern$1).reduce(function (t, e) { var r = e.match(attributePattern$1), a = slicedToArray(r, 3), n = (a[0], a[1]), l = a[2]; return t[n] = l.replace(/"/g, ""), t }, {}) } }, variable: "REF", name: "refs" }, globalPattern$1 = /\{\{formatnum:\d+\}\}/gi, parsePattern = /\{\{formatnum:(\d+)\}\}/, formatNum = { globalPattern: globalPattern$1, parsePattern: parsePattern, parse: function (t) { var e = slicedToArray(t, 2), r = e[1]; return parseFloat(r) }, variable: "FORMAT_NUM", name: "formatNum" }, dataTypes = [instances, ref1, ref2, small, formatNum, flag, coords, marriages, birthDates, labeledDates, deathDates, unbulletedLists, website, hlist, url, convert, nbay, filmDates, other, plainLists, unmarkedLists], dataTypes$1 = dataTypes.map(function (t) { return { handler: dataType(t), name: t.name, pattern: new RegExp("\\$" + t.variable + "_(\\d+)") } }), keyValueGlobalPattern = /\|\s*([-'\u0400-\u04FF\w\s]+)\s*=\s*([^|]+)?/g, keyValuePattern = /\|\s*([-'\u0400-\u04FF\w\s]+)\s*=\s*([^|]+)?/, numberParse = function (t) { return "string" == typeof t && (t = t.trim().replace(/ /g, ""), t.match(/,/) && t.match(/\./) ? t.indexOf(",") < t.indexOf(".") ? parseEnglish(t) : parseSpanish(t) : t.match(/,/) && !t.match(/\./) ? t.match(/,/g).length > 1 ? parseEnglish(t) : t.match(/,[0-9]{3}($|^[0-9])/) ? parseEnglish(t) : parseSpanish(t) : !t.match(/,/) && t.match(/\./) ? t.match(/\./g).length > 1 ? parseSpanish(t) : t.match(/\.[0-9]{3}($|^[0-9])/) ? parseSpanish(t) : parseEnglish(t) : (+t).toString() === t && +t) }, parseEnglish = function (t) { return +t.replace(/,/g, "") }, parseSpanish = function (t) { return +t.replace(/\./g, "").replace(/,/g, ".") }, smallDataType = dataTypes$1.find(function (t) { return "smalls" === t.name }), blankNamePattern = /blank(\d+)?NameSec2/, blankInfoPattern = /blank(\d+)?InfoSec2/, infoBoxStartPattern = /{{\w*box/, tableStartPattern = /{\|(.*)\n?/, tableEndPattern = /\n\|}/, headersPattern = /!\s?(.*)/g, rowPattern = /\|-/, cellSeparatorPattern = /(?:\n\|)|(?:\|\|)/, linkPattern = /\[\[([^\]]+)\]\]/g, linkNamePattern = /^.*\|/, inlineHeaderPattern = "!!", actionPattern = /{{anchor\|(.*)}}/g, rowSpanCountPattern = /rowspan="(\d+)"/, stripLinks = function (t) { return t.replace(linkPattern, function (t, e) { return e.replace(linkNamePattern, "").trim() || e }) }, removeActions = function (t) { return t.replace(actionPattern, "") }, transformCell = function (t) { return stripLinks(removeActions(t || "")).replace(rowSpanCountPattern, "").replace(linkNamePattern, "").trim() }, transformCells = function (t) { return t.split(cellSeparatorPattern).map(transformCell) }, findIndex = function (t, e) { var r = t.match(e); return r ? r.index : -1 }, findTableStart = function (t) { var e = t.match(tableStartPattern); return e ? e.index + e[0].length : -1 }, findTableEnd = function (t) { return findIndex(t, tableEndPattern) }, getHeaders = function (t) { for (var e = [], r = void 0; r = headersPattern.exec(t);)e.push.apply(e, toConsumableArray(r[1].split(inlineHeaderPattern).map(transformCell))); return e }, getRows = function (t) { var e = t.split(rowPattern).map(function (t) { return t.replace(/^.*\n+?\|/, "").trim() }).filter(function (t) { return t }), r = [], a = 0, n = 0, l = [], i = !0, s = !1, o = void 0; try { for (var u, c = e[Symbol.iterator](); !(i = (u = c.next()).done); i = !0) { var f = u.value, p = f.match(rowSpanCountPattern); p && (a = 0, n = parseInt(p[1]), l = []), a < n ? (l.push(f), ++a === n && r.push(transformRowSpan(l))) : r.push(f) } } catch (t) { s = !0, o = t } finally { try { !i && c.return && c.return() } finally { if (s) throw o } } return r }, getNextTable = function (t, e, r) { var a = t, n = findTableStart(a); if (-1 === n) return null; a = a.substring(n); var l = findTableEnd(a); if (-1 === l) return null; a = a.substring(0, l); var i = getRows(a); if (!i.length) return null; var s = getHeaders(i[0]); return s.length ? { data: i.slice(1).map(transformCells).map(function (t) { return s.reduce(function (a, n, l) { return a[camelCase(fillVariable(n, e, r))] = fillVariables(t[l], e, r), a }, {}) }), end: n + l } : null }, parseTables = function (t, e) { for (var r = cleanSource(t, e), a = extractData(r), n = [], l = a.source, i = null; i = getNextTable(l, a.context, e);) { if (!i) return n; n.push(i.data), l = l.substring(i.end) } return n }, linkPattern$1 = /\[\[([^\]]+)\]\]/g, kmPattern = /{{BSkm\|([\dx]+,[\dx]+)\|([\dx]+,[\dx]+)}}/g, parseBsTables = function (t) { var e = t.replace(kmPattern, "$1/$2").match(/{{BS([^}}]+)}}/g); return e ? e.map(function (t) { return clean(t).split("|") }).map(parseRow).filter(function (t) { return "-" !== t.type[0] }) : null }, headingPattern = /[^=]==\s?([\w\s]+)\s?==/g, subheadingPattern = /===([\w\s]+)===/g, tableStartPattern$1 = /{{list.+start.*}}/gi, tableEndPattern$1 = /{{list.+end.*}}/gi, rowPattern$1 = /{{(.*)}}/g, rowPatternSingle = /{{(.*)}}/, parseLists = function (t) { var e = getMatches(t, headingPattern), r = getMatches(t, subheadingPattern), a = getTables(t); return a.forEach(function (t) { var a = e.filter(function (e) { return e.end < t.start }).map(function (t) { return t.value }); t.heading = last(a); var n = r.filter(function (e) { return e.end < t.start }).map(function (t) { return t.value }); t.subheading = last(n), delete t.start, delete t.end }), a }; module.exports = parseInfobox;


        }, { "camelcase": 31 }], 73: [function (require, module, exports) {
            'use strict'; Object.defineProperty(exports, '__esModule', { value: !0 }); var _createClass = function () { function a(b, c) { for (var f, d = 0; d < c.length; d++)f = c[d], f.enumerable = f.enumerable || !1, f.configurable = !0, 'value' in f && (f.writable = !0), Object.defineProperty(b, f.key, f) } return function (b, c, d) { return c && a(b.prototype, c), d && a(b, d), b } }(), _util = require('./util'); function _toConsumableArray(a) { if (Array.isArray(a)) { for (var b = 0, c = Array(a.length); b < a.length; b++)c[b] = a[b]; return c } return Array.from(a) } function _classCallCheck(a, b) { if (!(a instanceof b)) throw new TypeError('Cannot call a class as a function') } var processors = { extracts: function extracts(a) { return { extract: a.extract } }, links: function links(a) { return { links: a.links.map(function (b) { return b.title }) } }, extlinks: function extlinks(a) { return { extlinks: a.extlinks.map(function (b) { return b['*'] }) } }, langlinks: function langlinks(a) { return { langlinks: a.langlinks.map(function (b) { return { lang: b.lang, title: b['*'], url: b.url } }) } }, coordinates: function coordinates(a) { return a.coordinates ? { coordinates: a.coordinates[0] } : {} }, categories: function categories(a) { return { categories: a.categories.map(function (b) { return b.title }) } }, pageimages: function pageimages(a) { return { image: { name: a.pageimage, thumbnail: a.thumbnail, original: a.original } } } }; function process(a, b) { var c = { title: b.title }; return a.reduce(function (d, f) { return processors[f] && Object.assign(d, processors[f](b)), d }, c) } var QueryChain = function () { function a(b, c) { _classCallCheck(this, a), this.id = c, this.apiOptions = b, this._params = { pageids: c }, this.props = new Set } return _createClass(a, [{ key: 'params', value: function params() { var b = [].concat(_toConsumableArray(this.props)).join('|'); return Object.assign({}, this._params, { prop: b }) } }, { key: 'direct', value: function direct(b) { for (var c = arguments.length, d = Array(1 < c ? c - 1 : 0), f = 1; f < c; f++)d[f - 1] = arguments[f]; return this[b].apply(this, d).request().then(function (g) { return g[b] }) } }, { key: 'request', value: function request() { var b = this, c = [].concat(_toConsumableArray(this.props)); return (0, _util.api)(this.apiOptions, this.params()).then(function (d) { return b.id ? d.query.pages[b.id] : Object.values(d.query.pages) }).then(function (d) { return Array.isArray(d) ? d.map(function (f) { return process(c, f) }) : process(c, d) }) } }, { key: 'chain', value: function chain(b) { var c = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}; return b && this.props.add(b), Object.assign(this._params, c), this } }, { key: 'geosearch', value: function geosearch(b, c, d) { return this.chain(void 0, { generator: 'geosearch', ggsradius: d, ggscoord: b + '|' + c }) } }, { key: 'search', value: function search(b) { var c = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 50; return this.chain(void 0, { list: 'search', srsearch: b, srlimit: c }) } }, { key: 'content', value: function content() { return this.chain('extracts', { explaintext: '1' }) } }, { key: 'summary', value: function summary() { return this.chain('extracts', { explaintext: '1', exintro: '1' }) } }, { key: 'image', value: function image() { var b = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : { thumbnail: !0, original: !1, name: !0 }; return this.chain('pageimages', { piprop: Object.keys(b).filter(function (c) { return b[c] }).join('|') }) } }, { key: 'extlinks', value: function extlinks() { return this.chain('extlinks', { ellimit: 'max' }) } }, { key: 'links', value: function links() { var b = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 100; return this.chain('links', { plnamespace: 0, pllimit: b }) } }, { key: 'categories', value: function categories() { var b = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 100; return this.chain('categories', { pllimit: b }) } }, { key: 'coordinates', value: function coordinates() { return this.chain('coordinates') } }, { key: 'langlinks', value: function langlinks() { return this.chain('langlinks', { lllimit: 'max', llprop: 'url' }) } }]), a }(); exports.default = QueryChain;

        }, { "./util": 76 }], 74: [function (require, module, exports) {
            'use strict'; Object.defineProperty(exports, '__esModule', { value: !0 }), exports.parseCoordinates = parseCoordinates; function parseCoordinates(a) { return a.coordinates ? parseInfoboxCoords(a.coordinates) : a.latd && a.longd ? parseDeprecatedCoords(a) : { lat: null, lon: null, error: 'No coordinates on page.' } } function parseDeprecatedCoords(a) { var b = dmsToDecimal(floatOrDefault(a.latd), floatOrDefault(a.latm), floatOrDefault(a.lats), a.latNs), c = dmsToDecimal(floatOrDefault(a.longd), floatOrDefault(a.longm), floatOrDefault(a.longs), a.longEw); return wikiCoordinates(b, c) } var infoboxCoordinatePattern = /(\d{1,2})\|(\d{1,2})\|(\d{1,2})?\|?([NSEW])\|(\d{1,3})\|(\d{1,2})\|(\d{1,2})?\|?([NSEW])/; function parseInfoboxCoords(a) { var b, c, d; return b = a.match(infoboxCoordinatePattern), c = convertCoordinatesFromStrings(b.slice(0, 4)), d = convertCoordinatesFromStrings(b.slice(4)), wikiCoordinates(c, d) } function convertCoordinatesFromStrings(a) { return dmsToDecimal(floatOrDefault(a[1]), floatOrDefault(a[2]), floatOrDefault(a[3]), a[4]) } var directions = { N: 1, S: -1, E: 1, W: -1 }; function dmsToDecimal(a, b, c, d) { return (a + 1 / 60 * b + 1 / 3600 * c) * (directions[d] || 1) } function wikiCoordinates(a, b) { return { lat: +a.toFixed(4), lon: +b.toFixed(4) } } function floatOrDefault(a) { var b = +a; return isNaN(b) ? 0 : b }

        }, {}], 75: [function (require, module, exports) {
            'use strict'; Object.defineProperty(exports, '__esModule', { value: !0 }); var _slicedToArray = function () { function c(d, e) { var f = [], g = !0, h = !1, j = void 0; try { for (var l, k = d[Symbol.iterator](); !(g = (l = k.next()).done) && (f.push(l.value), !(e && f.length === e)); g = !0); } catch (m) { h = !0, j = m } finally { try { !g && k['return'] && k['return']() } finally { if (h) throw j } } return f } return function (d, e) { if (Array.isArray(d)) return d; if (Symbol.iterator in Object(d)) return c(d, e); throw new TypeError('Invalid attempt to destructure non-iterable instance') } }(), _typeof = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function (c) { return typeof c } : function (c) { return c && 'function' == typeof Symbol && c.constructor === Symbol && c !== Symbol.prototype ? 'symbol' : typeof c }; exports.default = wikiPage; var _util = require('./util'), _infoboxParser = require('infobox-parser'), _infoboxParser2 = _interopRequireDefault(_infoboxParser), _hyntax = require('hyntax'), _coordinates = require('./coordinates'), _chain = require('./chain'), _chain2 = _interopRequireDefault(_chain); function _interopRequireDefault(c) { return c && c.__esModule ? c : { default: c } } function _toConsumableArray(c) { if (Array.isArray(c)) { for (var d = 0, e = Array(c.length); d < c.length; d++)e[d] = c[d]; return e } return Array.from(c) } var get = function (c, d) { for (var e = arguments.length, f = Array(2 < e ? e - 2 : 0), g = 2; g < e; g++)f[g - 2] = arguments[g]; return void 0 === c || void 0 === d ? c : 'function' == typeof d ? get.apply(void 0, [d(c)].concat(f)) : get.apply(void 0, [c[d]].concat(f)) }, firstValue = function (c) { return 'object' === ('undefined' == typeof c ? 'undefined' : _typeof(c)) ? c[Object.keys(c)[0]] : c[0] }, getFileName = function (c) { if (Array.isArray(c) && (c = c[0]), !!c) { if (-1 !== c.indexOf(':')) { var d = c.split(':'), e = _slicedToArray(d, 2), f = e[1]; return f } return c } }; function wikiPage(c, d) { function e() { return (0, _util.api)(d, { prop: 'revisions', rvprop: 'content', rvlimit: 1, rvparse: '', titles: F.title }).then(function (H) { return H.query.pages[F.pageid].revisions[0]['*'] }) } function f() { return g().then(_util.parseContent) } function g() { return E().content().request().then(function (H) { return H.extract }) } function j() { return E().image({ original: !0, name: !0 }).request().then(function (H) { return get(H, 'image', 'original', 'source') }) } function k() { return (0, _util.api)(d, { generator: 'images', gimlimit: 'max', prop: 'imageinfo', iiprop: 'url', titles: F.title }).then(function (H) { return H.query ? Object.keys(H.query.pages).map(function (I) { return H.query.pages[I] }) : [] }) } function o(H, I) { return H.content.attributes && H.content.attributes.some(function (J) { return 'class' === J.key.content && -1 !== J.value.content.indexOf(I) }) } function p(H) { return 'tag' === H.nodeType } function q(H, I) { return H.content.name === I } function r(H, I) { if (I(H)) return H; if (H.content.children) { var J = !0, K = !1, L = void 0; try { for (var N, M = H.content.children[Symbol.iterator](); !(J = (N = M.next()).done); J = !0) { var O = N.value, P = r(O, I); if (P) return P } } catch (O) { K = !0, L = O } finally { try { !J && M.return && M.return() } finally { if (K) throw L } } } return null } function s(H, I, J) { if (I(H) && J.push(H), H.content.children) { var K = !0, L = !1, M = void 0; try { for (var O, P, N = H.content.children[Symbol.iterator](); !(K = (O = N.next()).done); K = !0)P = O.value, s(P, I, J) } catch (P) { L = !0, M = P } finally { try { !K && N.return && N.return() } finally { if (L) throw M } } } } function x(H) { return (0, _util.api)(d, { prop: 'revisions', rvprop: 'content', rvsection: 0, titles: H || F.title }).then(function (I) { return get(I, 'query', 'pages', firstValue, 'revisions', 0, '*') }) } function z(H) { return x().then(function (I) { var J = (0, _infoboxParser2.default)(I, d.parser).general; return 0 === Object.keys(J).length ? x('Template:Infobox ' + F.title.toLowerCase()).then(function (K) { return (0, _infoboxParser2.default)(K || '', d.parser).general }) : J }).then(function (I) { return H ? I.hasOwnProperty(H) ? I[H] : void 0 : I }) } function E() { return new _chain2.default(d, F.pageid) } var F = c, G = Object.assign({}, F); return Object.assign(G, { raw: F, html: e, rawContent: g, content: f, sections: f, summary: function () { return E().summary().request().then(function (H) { return H.extract }) }, images: function () { return k().then(function (H) { return H.map(function (I) { return I.imageinfo }).reduce(function (I, J) { return [].concat(_toConsumableArray(I), _toConsumableArray(J)) }, []).map(function (I) { return I.url }) }) }, references: function () { return e().then(function (H) { var I = (0, _hyntax.tokenize)(H), J = I.tokens, K = (0, _hyntax.constructTree)(J), L = K.ast; return L }).then(function (H) { var I = [], J = []; s(H, function (Z) { return p(Z) && q(Z, 'ol') && o(Z, 'references') }, J); var K = !0, L = !1, M = void 0; try { for (var O, N = J[Symbol.iterator](); !(K = (O = N.next()).done); K = !0) { var Z = O.value, $ = Z.content.children.filter(function (_) { return p(_) && q(_, 'li') && _.content.children }), P = !0, Q = !1, R = void 0; try { for (var T, S = $[Symbol.iterator](); !(P = (T = S.next()).done); P = !0) { var _ = T.value, aa = _.content.children[2], ba = r(aa, function (ca) { return p(ca) && q(ca, 'cite') }); if (ba) { var U = !0, V = !1, W = void 0; try { for (var Y, ca, X = ba.content.children[Symbol.iterator](); !(U = (Y = X.next()).done); U = !0)if (ca = Y.value, p(ca) && q(ca, 'a') && o(ca, 'external')) { var da = ca.content.attributes.find(function (ea) { return 'href' === ea.key.content }); I.push(da.value.content) } } catch (ca) { V = !0, W = ca } finally { try { !U && X.return && X.return() } finally { if (V) throw W } } } } } catch (_) { Q = !0, R = _ } finally { try { !P && S.return && S.return() } finally { if (Q) throw R } } } } catch (Z) { L = !0, M = Z } finally { try { !K && N.return && N.return() } finally { if (L) throw M } } return I }) }, links: function () { var H = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : !0, I = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 100, J = (0, _util.pagination)(d, { prop: 'links', plnamespace: 0, pllimit: I, titles: F.title }, function (K) { return (K.query.pages[F.pageid].links || []).map(function (L) { return L.title }) }); return H ? (0, _util.aggregatePagination)(J) : J }, externalLinks: function () { return E().direct('extlinks') }, categories: function () { var H = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : !0, I = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 100, J = (0, _util.pagination)(d, E().categories(I).params(), function (K) { return (K.query.pages[F.pageid].categories || []).map(function (L) { return L.title }) }); return H ? (0, _util.aggregatePagination)(J) : J }, coordinates: function () { return E().direct('coordinates').then(function (H) { return H ? H : z().then(function (I) { return (0, _coordinates.parseCoordinates)(I) }) }) }, info: z, backlinks: function () { var H = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : !0, I = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 100, J = (0, _util.pagination)(d, { list: 'backlinks', bllimit: I, bltitle: F.title }, function (K) { return (K.query.backlinks || []).map(function (L) { return L.title }) }); return H ? (0, _util.aggregatePagination)(J) : J }, rawImages: k, mainImage: function () { return Promise.all([k(), z()]).then(function (H) { var I = _slicedToArray(H, 2), J = I[0], K = I[1], L = getFileName(K.image || K.bildname || K.imagen || K.Immagine || K.badge || K.logo); if (!L) return x().then(function (O) { if (J.length) { J.sort(function (R, S) { return O.indexOf(S.title) - O.indexOf(R.title) }); var P = J[0], Q = P && 0 < P.imageinfo.length ? P.imageinfo[0].url : void 0; return j().then(function (R) { return R || Q }) } }); var M = J.find(function (O) { var P = O.title, Q = getFileName(P); return Q.toUpperCase() === L.toUpperCase() || Q.replace(/\s/g, '_') === L }), N = M && 0 < M.imageinfo.length ? M.imageinfo[0].url : void 0; return j().then(function (O) { return O || N }) }) }, langlinks: function () { return E().direct('langlinks') }, rawInfo: x, fullInfo: function () { return x().then(function (H) { return (0, _infoboxParser2.default)(H, d.parser) }) }, pageImage: j, tables: function () { return (0, _util.api)(d, { prop: 'revisions', rvprop: 'content', titles: F.title }).then(function (H) { return get(H, 'query', 'pages', firstValue, 'revisions', 0, '*') }).then(function (H) { return (0, _infoboxParser2.default)(H, d.parser).tables }) }, url: function () { return F.canonicalurl }, chain: E }), G }

        }, { "./chain": 73, "./coordinates": 74, "./util": 76, "hyntax": 33, "infobox-parser": 72 }], 76: [function (require, module, exports) {
            'use strict'; Object.defineProperty(exports, '__esModule', { value: !0 }), exports.api = api, exports.pagination = pagination, exports.aggregatePagination = aggregatePagination, exports.aggregate = aggregate, exports.parseContent = parseContent; var _crossFetch = require('cross-fetch'), _crossFetch2 = _interopRequireDefault(_crossFetch), _querystring = require('querystring'), _querystring2 = _interopRequireDefault(_querystring); function _interopRequireDefault(a) { return a && a.__esModule ? a : { default: a } } function _toConsumableArray(a) { if (Array.isArray(a)) { for (var b = 0, c = Array(a.length); b < a.length; b++)c[b] = a[b]; return c } return Array.from(a) } var fetchOptions = { method: 'GET', mode: 'cors', credentials: 'omit' }; function api(a) { var b = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : {}, c = Object.assign({ format: 'json', action: 'query', redirects: '1' }, b); Object.keys(c).forEach(function (g) { c[g] === void 0 && delete c[g] }), a.origin && (c.origin = a.origin); var d = a.apiUrl + '?' + _querystring2.default.stringify(c), f = Object.assign({ "User-Agent": 'WikiJS Bot v1.0' }, a.headers); return (0, _crossFetch2.default)(d, Object.assign({ headers: f }, fetchOptions)).then(function (g) { if (g.ok) return g.json(); throw new Error(g.status + ': ' + g.statusText) }).then(function (g) { if (g.error) throw new Error(g.error.info); return g }) } function pagination(a, b, c) { return api(a, b).then(function (d) { var f = { results: c(d), query: b.srsearch }; if (d['continue']) { var g = Object.keys(d['continue']).filter(function (j) { return 'continue' !== j })[0], h = d['continue'][g]; b[g] = h, f.next = function () { return pagination(a, b, c) } } return f }) } function aggregatePagination(a) { var b = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : []; return a.then(function (c) { var d = [].concat(_toConsumableArray(b), _toConsumableArray(c.results)); return c.next ? aggregatePagination(c.next(), d) : d }) } var pageLimit = 500; function aggregate(a, b, c, d, f) { var g = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : []; return b.list = c, b[f + 'limit'] = pageLimit, api(a, b).then(function (h) { var j = [].concat(_toConsumableArray(g), _toConsumableArray(h.query[c].map(function (l) { return l[d] }))), k = h['query-continue'] || h.continue; if (k) { var l = k[c] && k[c][f + 'from'] || k[c] && k[c][f + 'continue'] || k[f + 'continue']; return b[f + 'continue'] = l, b[f + 'from'] = l, aggregate(a, b, c, d, f, j) } return j }) } var headingPattern = /(==+)(?:(?!\n)\s?)((?:(?!==|\n)[^])+)(?:(?!\n)\s?)(==+)/g; function getHeadings(a) { for (var b = void 0, c = []; null !== (b = headingPattern.exec(a));)c.push({ level: b[1].trim().length, text: b[2].trim(), start: b.index, end: b.index + b[0].length }); return c } function parseContent(a) { var b = getHeadings(a), c = Math.min.apply(Math, _toConsumableArray(b.map(function (j) { var k = j.level; return k }))), d = b.map(function (j, k) { var l = b[k + 1], m = a.substring(j.end, l ? l.start : void 0).trim(); return { title: j.text, level: j.level - c, id: k, content: m, items: [] } }), f = function lastParentLevel(j, k) { if (0 === k) return null; for (var l = j - 1; 0 <= l; l--)if (d[l].level < k) return d[l].id; return null }; d.forEach(function (j, k) { j.parent = f(k, j.level) }); var g = { items: [] }, h = function findSection(j) { return d.find(function (k) { return j === k.id }) }; return d.forEach(function (j) { null === j.parent ? g.items.push(j) : h(j.parent).items.push(j) }), d.forEach(function (j) { delete j.id, delete j.parent, delete j.level, j.items.length || delete j.items }), g.items }

        }, { "cross-fetch": 32, "querystring": 11 }], 77: [function (require, module, exports) {
            'use strict'; Object.defineProperty(exports, '__esModule', { value: !0 }), exports.default = wiki; var _util = require('./util'), _page = require('./page'), _page2 = _interopRequireDefault(_page), _chain = require('./chain'), _chain2 = _interopRequireDefault(_chain); function _interopRequireDefault(a) { return a && a.__esModule ? a : { default: a } } var defaultOptions = { apiUrl: 'http://en.wikipedia.org/w/api.php', origin: '*' }; function wiki() { function a(r) { return r.query.redirects && 1 === r.query.redirects.length ? (0, _util.api)(q, { prop: 'info|pageprops', inprop: 'url', ppprop: 'disambiguation', titles: r.query.redirects[0].to }) : r } function b(r) { var s = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : 50, t = 2 < arguments.length && arguments[2] !== void 0 && arguments[2]; return (0, _util.pagination)(q, { list: 'search', srsearch: r, srlimit: s }, function (u) { return u.query.search.map(function (v) { return t ? v : v.title }) }).catch(function (u) { if ('"text" search is disabled.' === u.message) return d(r, s); throw u }) } function d(r) { var s = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : 50; return (0, _util.api)(q, { search: r, limit: s, namespace: 0, action: 'opensearch', redirects: void 0 }).then(function (t) { return t[1] }) } function f(r) { return (0, _util.api)(q, { prop: 'info|pageprops', inprop: 'url', ppprop: 'disambiguation', titles: r }).then(a).then(function (s) { var t = Object.keys(s.query.pages)[0]; if (!t || '-1' === t) throw new Error('No article found'); return (0, _page2.default)(s.query.pages[t], q) }) } var p = 0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : {}; this instanceof wiki && console.log('Please do not use wikijs ^1.0.0 as a class. Please see the new README.'); var q = Object.assign({}, defaultOptions, p); return { search: b, random: function () { var r = 0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : 1; return (0, _util.api)(q, { list: 'random', rnnamespace: 0, rnlimit: r }).then(function (s) { return s.query.random.map(function (t) { return t.title }) }) }, page: f, geoSearch: function (r, s) { var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : 1e3, u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : 10; return (0, _util.api)(q, { list: 'geosearch', gsradius: t, gscoord: r + '|' + s, gslimit: u }).then(function (v) { return v.query.geosearch.map(function (w) { return w.title }) }) }, options: p, findById: function (r) { return (0, _util.api)(q, { prop: 'info|pageprops', inprop: 'url', ppprop: 'disambiguation', pageids: r }).then(a).then(function (s) { var t = Object.keys(s.query.pages)[0]; if (!t || '-1' === t) throw new Error('No article found'); return (0, _page2.default)(s.query.pages[t], q) }) }, find: function (r) { var s = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : function (t) { return t[0] }; return b(r).then(function (t) { return s(t.results) }).then(function (t) { return f(t) }) }, allPages: function () { return (0, _util.aggregate)(q, {}, 'allpages', 'title', 'ap') }, allCategories: function () { return (0, _util.aggregate)(q, {}, 'allcategories', '*', 'ac') }, pagesInCategory: function (r) { return (0, _util.aggregate)(q, { cmtitle: r }, 'categorymembers', 'title', 'cm') }, opensearch: d, prefixSearch: function (r) { var s = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : 50; return (0, _util.pagination)(q, { list: 'prefixsearch', pslimit: s, psprofile: 'fuzzy', pssearch: r }, function (t) { return t.query.prefixsearch.map(function (u) { return u.title }) }) }, mostViewed: function () { return (0, _util.api)(q, { list: 'mostviewed' }).then(function (r) { return r.query.mostviewed.map(function (s) { var t = s.title, u = s.count; return { title: t, count: u } }) }) }, api: function (r) { return (0, _util.api)(q, r) }, chain: function () { return new _chain2.default(q) } } }

        }, { "./chain": 73, "./page": 75, "./util": 76 }]
    }, {}, [30]);
}