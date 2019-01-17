/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
export function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
export function splitAtColon(input, defaultValues) {
    return _splitAt(input, ':', defaultValues);
}
export function splitAtPeriod(input, defaultValues) {
    return _splitAt(input, '.', defaultValues);
}
function _splitAt(input, character, defaultValues) {
    var characterIndex = input.indexOf(character);
    if (characterIndex == -1)
        return defaultValues;
    return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
}
export function visitValue(value, visitor, context) {
    if (Array.isArray(value)) {
        return visitor.visitArray(value, context);
    }
    if (isStrictStringMap(value)) {
        return visitor.visitStringMap(value, context);
    }
    if (value == null || typeof value == 'string' || typeof value == 'number' ||
        typeof value == 'boolean') {
        return visitor.visitPrimitive(value, context);
    }
    return visitor.visitOther(value, context);
}
export function isDefined(val) {
    return val !== null && val !== undefined;
}
export function noUndefined(val) {
    return val === undefined ? null : val;
}
var ValueTransformer = /** @class */ (function () {
    function ValueTransformer() {
    }
    ValueTransformer.prototype.visitArray = function (arr, context) {
        var _this = this;
        return arr.map(function (value) { return visitValue(value, _this, context); });
    };
    ValueTransformer.prototype.visitStringMap = function (map, context) {
        var _this = this;
        var result = {};
        Object.keys(map).forEach(function (key) { result[key] = visitValue(map[key], _this, context); });
        return result;
    };
    ValueTransformer.prototype.visitPrimitive = function (value, context) { return value; };
    ValueTransformer.prototype.visitOther = function (value, context) { return value; };
    return ValueTransformer;
}());
export { ValueTransformer };
export var SyncAsync = {
    assertSync: function (value) {
        if (isPromise(value)) {
            throw new Error("Illegal state: value cannot be a promise");
        }
        return value;
    },
    then: function (value, cb) { return isPromise(value) ? value.then(cb) : cb(value); },
    all: function (syncAsyncValues) {
        return syncAsyncValues.some(isPromise) ? Promise.all(syncAsyncValues) : syncAsyncValues;
    }
};
export function error(msg) {
    throw new Error("Internal Error: " + msg);
}
export function syntaxError(msg, parseErrors) {
    var error = Error(msg);
    error[ERROR_SYNTAX_ERROR] = true;
    if (parseErrors)
        error[ERROR_PARSE_ERRORS] = parseErrors;
    return error;
}
var ERROR_SYNTAX_ERROR = 'ngSyntaxError';
var ERROR_PARSE_ERRORS = 'ngParseErrors';
export function isSyntaxError(error) {
    return error[ERROR_SYNTAX_ERROR];
}
export function getParseErrors(error) {
    return error[ERROR_PARSE_ERRORS] || [];
}
// Escape characters that have a special meaning in Regular Expressions
export function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
var STRING_MAP_PROTO = Object.getPrototypeOf({});
function isStrictStringMap(obj) {
    return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}
export function utf8Encode(str) {
    var encoded = '';
    for (var index = 0; index < str.length; index++) {
        var codePoint = str.charCodeAt(index);
        // decode surrogate
        // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > (index + 1)) {
            var low = str.charCodeAt(index + 1);
            if (low >= 0xdc00 && low <= 0xdfff) {
                index++;
                codePoint = ((codePoint - 0xd800) << 10) + low - 0xdc00 + 0x10000;
            }
        }
        if (codePoint <= 0x7f) {
            encoded += String.fromCharCode(codePoint);
        }
        else if (codePoint <= 0x7ff) {
            encoded += String.fromCharCode(((codePoint >> 6) & 0x1F) | 0xc0, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0xffff) {
            encoded += String.fromCharCode((codePoint >> 12) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0x1fffff) {
            encoded += String.fromCharCode(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
    }
    return encoded;
}
export function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token instanceof Array) {
        return '[' + token.map(stringify).join(', ') + ']';
    }
    if (token == null) {
        return '' + token;
    }
    if (token.overriddenName) {
        return "" + token.overriddenName;
    }
    if (token.name) {
        return "" + token.name;
    }
    // WARNING: do not try to `JSON.stringify(token)` here
    // see https://github.com/angular/angular/issues/23440
    var res = token.toString();
    if (res == null) {
        return '' + res;
    }
    var newLineIndex = res.indexOf('\n');
    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
/**
 * Lazily retrieves the reference value from a forwardRef.
 */
export function resolveForwardRef(type) {
    if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__')) {
        return type();
    }
    else {
        return type;
    }
}
/**
 * Determine if the argument is shaped like a Promise
 */
export function isPromise(obj) {
    // allow any Promise/A+ compliant thenable.
    // It's up to the caller to ensure that obj.then conforms to the spec
    return !!obj && typeof obj.then === 'function';
}
var Version = /** @class */ (function () {
    function Version(full) {
        this.full = full;
        var splits = full.split('.');
        this.major = splits[0];
        this.minor = splits[1];
        this.patch = splits.slice(2).join('.');
    }
    return Version;
}());
export { Version };
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof global !== 'undefined' && global;
// Check __global first, because in Node tests both __global and __window may be defined and _global
// should be __global in that case.
var _global = __global || __window || __self;
export { _global as global };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2NvbXBpbGVyL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQU9ILElBQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO0FBRXpDLE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxLQUFhO0lBQy9DLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUFDLFdBQVc7YUFBWCxVQUFXLEVBQVgscUJBQVcsRUFBWCxJQUFXO1lBQVgsc0JBQVc7O1FBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFO0lBQWxCLENBQWtCLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FBQyxLQUFhLEVBQUUsYUFBdUI7SUFDakUsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxLQUFhLEVBQUUsYUFBdUI7SUFDbEUsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsS0FBYSxFQUFFLFNBQWlCLEVBQUUsYUFBdUI7SUFDekUsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoRCxJQUFJLGNBQWMsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLGFBQWEsQ0FBQztJQUMvQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBRUQs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LENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQzs7QUFhRCxJQUFNLFFBQVEsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDO0FBQ3pELElBQU0sTUFBTSxHQUFHLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxPQUFPLGlCQUFpQixLQUFLLFdBQVc7SUFDbEYsSUFBSSxZQUFZLGlCQUFpQixJQUFJLElBQUksQ0FBQztBQUM5QyxJQUFNLFFBQVEsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDO0FBRXpELG9HQUFvRztBQUNwRyxtQ0FBbUM7QUFDbkMsSUFBTSxPQUFPLEdBQTBCLFFBQVEsSUFBSSxRQUFRLElBQUksTUFBTSxDQUFDO0FBQ3RFLE9BQU8sRUFBQyxPQUFPLElBQUksTUFBTSxFQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RhbnRQb29sfSBmcm9tICcuL2NvbnN0YW50X3Bvb2wnO1xuXG5pbXBvcnQgKiBhcyBvIGZyb20gJy4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtQYXJzZUVycm9yfSBmcm9tICcuL3BhcnNlX3V0aWwnO1xuXG5jb25zdCBEQVNIX0NBU0VfUkVHRVhQID0gLy0rKFthLXowLTldKS9nO1xuXG5leHBvcnQgZnVuY3Rpb24gZGFzaENhc2VUb0NhbWVsQ2FzZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGlucHV0LnJlcGxhY2UoREFTSF9DQVNFX1JFR0VYUCwgKC4uLm06IGFueVtdKSA9PiBtWzFdLnRvVXBwZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRBdENvbG9uKGlucHV0OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gX3NwbGl0QXQoaW5wdXQsICc6JywgZGVmYXVsdFZhbHVlcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEF0UGVyaW9kKGlucHV0OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gX3NwbGl0QXQoaW5wdXQsICcuJywgZGVmYXVsdFZhbHVlcyk7XG59XG5cbmZ1bmN0aW9uIF9zcGxpdEF0KGlucHV0OiBzdHJpbmcsIGNoYXJhY3Rlcjogc3RyaW5nLCBkZWZhdWx0VmFsdWVzOiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY2hhcmFjdGVySW5kZXggPSBpbnB1dC5pbmRleE9mKGNoYXJhY3Rlcik7XG4gIGlmIChjaGFyYWN0ZXJJbmRleCA9PSAtMSkgcmV0dXJuIGRlZmF1bHRWYWx1ZXM7XG4gIHJldHVybiBbaW5wdXQuc2xpY2UoMCwgY2hhcmFjdGVySW5kZXgpLnRyaW0oKSwgaW5wdXQuc2xpY2UoY2hhcmFjdGVySW5kZXggKyAxKS50cmltKCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmlzaXRWYWx1ZSh2YWx1ZTogYW55LCB2aXNpdG9yOiBWYWx1ZVZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXJyYXkoPGFueVtdPnZhbHVlLCBjb250ZXh0KTtcbiAgfVxuXG4gIGlmIChpc1N0cmljdFN0cmluZ01hcCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFN0cmluZ01hcCg8e1trZXk6IHN0cmluZ106IGFueX0+dmFsdWUsIGNvbnRleHQpO1xuICB9XG5cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgdHlwZW9mIHZhbHVlID09ICdib29sZWFuJykge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UHJpbWl0aXZlKHZhbHVlLCBjb250ZXh0KTtcbiAgfVxuXG4gIHJldHVybiB2aXNpdG9yLnZpc2l0T3RoZXIodmFsdWUsIGNvbnRleHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKHZhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdmFsICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub1VuZGVmaW5lZDxUPih2YWw6IFQgfCB1bmRlZmluZWQpOiBUIHtcbiAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gbnVsbCAhIDogdmFsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlVmlzaXRvciB7XG4gIHZpc2l0QXJyYXkoYXJyOiBhbnlbXSwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFN0cmluZ01hcChtYXA6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0UHJpbWl0aXZlKHZhbHVlOiBhbnksIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRPdGhlcih2YWx1ZTogYW55LCBjb250ZXh0OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZVRyYW5zZm9ybWVyIGltcGxlbWVudHMgVmFsdWVWaXNpdG9yIHtcbiAgdmlzaXRBcnJheShhcnI6IGFueVtdLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBhcnIubWFwKHZhbHVlID0+IHZpc2l0VmFsdWUodmFsdWUsIHRoaXMsIGNvbnRleHQpKTtcbiAgfVxuICB2aXNpdFN0cmluZ01hcChtYXA6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdDoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgICBPYmplY3Qua2V5cyhtYXApLmZvckVhY2goa2V5ID0+IHsgcmVzdWx0W2tleV0gPSB2aXNpdFZhbHVlKG1hcFtrZXldLCB0aGlzLCBjb250ZXh0KTsgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB2aXNpdFByaW1pdGl2ZSh2YWx1ZTogYW55LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gdmFsdWU7IH1cbiAgdmlzaXRPdGhlcih2YWx1ZTogYW55LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gdmFsdWU7IH1cbn1cblxuZXhwb3J0IHR5cGUgU3luY0FzeW5jPFQ+ID0gVCB8IFByb21pc2U8VD47XG5cbmV4cG9ydCBjb25zdCBTeW5jQXN5bmMgPSB7XG4gIGFzc2VydFN5bmM6IDxUPih2YWx1ZTogU3luY0FzeW5jPFQ+KTogVCA9PiB7XG4gICAgaWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSWxsZWdhbCBzdGF0ZTogdmFsdWUgY2Fubm90IGJlIGEgcHJvbWlzZWApO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sXG4gIHRoZW46IDxULCBSPih2YWx1ZTogU3luY0FzeW5jPFQ+LCBjYjogKHZhbHVlOiBUKSA9PiBSIHwgUHJvbWlzZTxSPnwgU3luY0FzeW5jPFI+KTpcbiAgICAgICAgICAgIFN5bmNBc3luYzxSPiA9PiB7IHJldHVybiBpc1Byb21pc2UodmFsdWUpID8gdmFsdWUudGhlbihjYikgOiBjYih2YWx1ZSk7fSxcbiAgYWxsOiA8VD4oc3luY0FzeW5jVmFsdWVzOiBTeW5jQXN5bmM8VD5bXSk6IFN5bmNBc3luYzxUW10+ID0+IHtcbiAgICByZXR1cm4gc3luY0FzeW5jVmFsdWVzLnNvbWUoaXNQcm9taXNlKSA/IFByb21pc2UuYWxsKHN5bmNBc3luY1ZhbHVlcykgOiBzeW5jQXN5bmNWYWx1ZXMgYXMgVFtdO1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZXJyb3IobXNnOiBzdHJpbmcpOiBuZXZlciB7XG4gIHRocm93IG5ldyBFcnJvcihgSW50ZXJuYWwgRXJyb3I6ICR7bXNnfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3ludGF4RXJyb3IobXNnOiBzdHJpbmcsIHBhcnNlRXJyb3JzPzogUGFyc2VFcnJvcltdKTogRXJyb3Ige1xuICBjb25zdCBlcnJvciA9IEVycm9yKG1zZyk7XG4gIChlcnJvciBhcyBhbnkpW0VSUk9SX1NZTlRBWF9FUlJPUl0gPSB0cnVlO1xuICBpZiAocGFyc2VFcnJvcnMpIChlcnJvciBhcyBhbnkpW0VSUk9SX1BBUlNFX0VSUk9SU10gPSBwYXJzZUVycm9ycztcbiAgcmV0dXJuIGVycm9yO1xufVxuXG5jb25zdCBFUlJPUl9TWU5UQVhfRVJST1IgPSAnbmdTeW50YXhFcnJvcic7XG5jb25zdCBFUlJPUl9QQVJTRV9FUlJPUlMgPSAnbmdQYXJzZUVycm9ycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N5bnRheEVycm9yKGVycm9yOiBFcnJvcik6IGJvb2xlYW4ge1xuICByZXR1cm4gKGVycm9yIGFzIGFueSlbRVJST1JfU1lOVEFYX0VSUk9SXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlRXJyb3JzKGVycm9yOiBFcnJvcik6IFBhcnNlRXJyb3JbXSB7XG4gIHJldHVybiAoZXJyb3IgYXMgYW55KVtFUlJPUl9QQVJTRV9FUlJPUlNdIHx8IFtdO1xufVxuXG4vLyBFc2NhcGUgY2hhcmFjdGVycyB0aGF0IGhhdmUgYSBzcGVjaWFsIG1lYW5pbmcgaW4gUmVndWxhciBFeHByZXNzaW9uc1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59XG5cbmNvbnN0IFNUUklOR19NQVBfUFJPVE8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoe30pO1xuZnVuY3Rpb24gaXNTdHJpY3RTdHJpbmdNYXAob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSA9PT0gU1RSSU5HX01BUF9QUk9UTztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHV0ZjhFbmNvZGUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgZW5jb2RlZCA9ICcnO1xuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc3RyLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGxldCBjb2RlUG9pbnQgPSBzdHIuY2hhckNvZGVBdChpbmRleCk7XG5cbiAgICAvLyBkZWNvZGUgc3Vycm9nYXRlXG4gICAgLy8gc2VlIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuICAgIGlmIChjb2RlUG9pbnQgPj0gMHhkODAwICYmIGNvZGVQb2ludCA8PSAweGRiZmYgJiYgc3RyLmxlbmd0aCA+IChpbmRleCArIDEpKSB7XG4gICAgICBjb25zdCBsb3cgPSBzdHIuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICAgICAgaWYgKGxvdyA+PSAweGRjMDAgJiYgbG93IDw9IDB4ZGZmZikge1xuICAgICAgICBpbmRleCsrO1xuICAgICAgICBjb2RlUG9pbnQgPSAoKGNvZGVQb2ludCAtIDB4ZDgwMCkgPDwgMTApICsgbG93IC0gMHhkYzAwICsgMHgxMDAwMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50IDw9IDB4N2YpIHtcbiAgICAgIGVuY29kZWQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlUG9pbnQpO1xuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDw9IDB4N2ZmKSB7XG4gICAgICBlbmNvZGVkICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjb2RlUG9pbnQgPj4gNikgJiAweDFGKSB8IDB4YzAsIChjb2RlUG9pbnQgJiAweDNmKSB8IDB4ODApO1xuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDw9IDB4ZmZmZikge1xuICAgICAgZW5jb2RlZCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKFxuICAgICAgICAgIChjb2RlUG9pbnQgPj4gMTIpIHwgMHhlMCwgKChjb2RlUG9pbnQgPj4gNikgJiAweDNmKSB8IDB4ODAsIChjb2RlUG9pbnQgJiAweDNmKSB8IDB4ODApO1xuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDw9IDB4MWZmZmZmKSB7XG4gICAgICBlbmNvZGVkICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoXG4gICAgICAgICAgKChjb2RlUG9pbnQgPj4gMTgpICYgMHgwNykgfCAweGYwLCAoKGNvZGVQb2ludCA+PiAxMikgJiAweDNmKSB8IDB4ODAsXG4gICAgICAgICAgKChjb2RlUG9pbnQgPj4gNikgJiAweDNmKSB8IDB4ODAsIChjb2RlUG9pbnQgJiAweDNmKSB8IDB4ODApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbmNvZGVkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE91dHB1dENvbnRleHQge1xuICBnZW5GaWxlUGF0aDogc3RyaW5nO1xuICBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdO1xuICBjb25zdGFudFBvb2w6IENvbnN0YW50UG9vbDtcbiAgaW1wb3J0RXhwcihyZWZlcmVuY2U6IGFueSwgdHlwZVBhcmFtcz86IG8uVHlwZVtdfG51bGwsIHVzZVN1bW1hcmllcz86IGJvb2xlYW4pOiBvLkV4cHJlc3Npb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnkodG9rZW46IGFueSk6IHN0cmluZyB7XG4gIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9XG5cbiAgaWYgKHRva2VuIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gJ1snICsgdG9rZW4ubWFwKHN0cmluZ2lmeSkuam9pbignLCAnKSArICddJztcbiAgfVxuXG4gIGlmICh0b2tlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnICsgdG9rZW47XG4gIH1cblxuICBpZiAodG9rZW4ub3ZlcnJpZGRlbk5hbWUpIHtcbiAgICByZXR1cm4gYCR7dG9rZW4ub3ZlcnJpZGRlbk5hbWV9YDtcbiAgfVxuXG4gIGlmICh0b2tlbi5uYW1lKSB7XG4gICAgcmV0dXJuIGAke3Rva2VuLm5hbWV9YDtcbiAgfVxuXG4gIC8vIFdBUk5JTkc6IGRvIG5vdCB0cnkgdG8gYEpTT04uc3RyaW5naWZ5KHRva2VuKWAgaGVyZVxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjM0NDBcbiAgY29uc3QgcmVzID0gdG9rZW4udG9TdHJpbmcoKTtcblxuICBpZiAocmVzID09IG51bGwpIHtcbiAgICByZXR1cm4gJycgKyByZXM7XG4gIH1cblxuICBjb25zdCBuZXdMaW5lSW5kZXggPSByZXMuaW5kZXhPZignXFxuJyk7XG4gIHJldHVybiBuZXdMaW5lSW5kZXggPT09IC0xID8gcmVzIDogcmVzLnN1YnN0cmluZygwLCBuZXdMaW5lSW5kZXgpO1xufVxuXG4vKipcbiAqIExhemlseSByZXRyaWV2ZXMgdGhlIHJlZmVyZW5jZSB2YWx1ZSBmcm9tIGEgZm9yd2FyZFJlZi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVGb3J3YXJkUmVmKHR5cGU6IGFueSk6IGFueSB7XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlLmhhc093blByb3BlcnR5KCdfX2ZvcndhcmRfcmVmX18nKSkge1xuICAgIHJldHVybiB0eXBlKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdGhlIGFyZ3VtZW50IGlzIHNoYXBlZCBsaWtlIGEgUHJvbWlzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlKG9iajogYW55KTogb2JqIGlzIFByb21pc2U8YW55PiB7XG4gIC8vIGFsbG93IGFueSBQcm9taXNlL0ErIGNvbXBsaWFudCB0aGVuYWJsZS5cbiAgLy8gSXQncyB1cCB0byB0aGUgY2FsbGVyIHRvIGVuc3VyZSB0aGF0IG9iai50aGVuIGNvbmZvcm1zIHRvIHRoZSBzcGVjXG4gIHJldHVybiAhIW9iaiAmJiB0eXBlb2Ygb2JqLnRoZW4gPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBjbGFzcyBWZXJzaW9uIHtcbiAgcHVibGljIHJlYWRvbmx5IG1ham9yOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBtaW5vcjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcGF0Y2g6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZnVsbDogc3RyaW5nKSB7XG4gICAgY29uc3Qgc3BsaXRzID0gZnVsbC5zcGxpdCgnLicpO1xuICAgIHRoaXMubWFqb3IgPSBzcGxpdHNbMF07XG4gICAgdGhpcy5taW5vciA9IHNwbGl0c1sxXTtcbiAgICB0aGlzLnBhdGNoID0gc3BsaXRzLnNsaWNlKDIpLmpvaW4oJy4nKTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnNvbGUge1xuICBsb2cobWVzc2FnZTogc3RyaW5nKTogdm9pZDtcbiAgd2FybihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkO1xufVxuXG5cbmRlY2xhcmUgdmFyIFdvcmtlckdsb2JhbFNjb3BlOiBhbnk7XG4vLyBDb21tb25KUyAvIE5vZGUgaGF2ZSBnbG9iYWwgY29udGV4dCBleHBvc2VkIGFzIFwiZ2xvYmFsXCIgdmFyaWFibGUuXG4vLyBXZSBkb24ndCB3YW50IHRvIGluY2x1ZGUgdGhlIHdob2xlIG5vZGUuZC50cyB0aGlzIHRoaXMgY29tcGlsYXRpb24gdW5pdCBzbyB3ZSdsbCBqdXN0IGZha2Vcbi8vIHRoZSBnbG9iYWwgXCJnbG9iYWxcIiB2YXIgZm9yIG5vdy5cbmRlY2xhcmUgdmFyIGdsb2JhbDogYW55O1xuY29uc3QgX193aW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3c7XG5jb25zdCBfX3NlbGYgPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZSAmJiBzZWxmO1xuY29uc3QgX19nbG9iYWwgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWw7XG5cbi8vIENoZWNrIF9fZ2xvYmFsIGZpcnN0LCBiZWNhdXNlIGluIE5vZGUgdGVzdHMgYm90aCBfX2dsb2JhbCBhbmQgX193aW5kb3cgbWF5IGJlIGRlZmluZWQgYW5kIF9nbG9iYWxcbi8vIHNob3VsZCBiZSBfX2dsb2JhbCBpbiB0aGF0IGNhc2UuXG5jb25zdCBfZ2xvYmFsOiB7W25hbWU6IHN0cmluZ106IGFueX0gPSBfX2dsb2JhbCB8fCBfX3dpbmRvdyB8fCBfX3NlbGY7XG5leHBvcnQge19nbG9iYWwgYXMgZ2xvYmFsfTtcbiJdfQ==