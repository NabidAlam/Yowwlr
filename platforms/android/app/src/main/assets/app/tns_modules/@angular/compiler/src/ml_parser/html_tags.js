/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/src/ml_parser/html_tags", ["require", "exports", "@angular/compiler/src/ml_parser/tags"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tags_1 = require("@angular/compiler/src/ml_parser/tags");
    var HtmlTagDefinition = /** @class */ (function () {
        function HtmlTagDefinition(_a) {
            var _b = _a === void 0 ? {} : _a, closedByChildren = _b.closedByChildren, requiredParents = _b.requiredParents, implicitNamespacePrefix = _b.implicitNamespacePrefix, _c = _b.contentType, contentType = _c === void 0 ? tags_1.TagContentType.PARSABLE_DATA : _c, _d = _b.closedByParent, closedByParent = _d === void 0 ? false : _d, _e = _b.isVoid, isVoid = _e === void 0 ? false : _e, _f = _b.ignoreFirstLf, ignoreFirstLf = _f === void 0 ? false : _f;
            var _this = this;
            this.closedByChildren = {};
            this.closedByParent = false;
            this.canSelfClose = false;
            if (closedByChildren && closedByChildren.length > 0) {
                closedByChildren.forEach(function (tagName) { return _this.closedByChildren[tagName] = true; });
            }
            this.isVoid = isVoid;
            this.closedByParent = closedByParent || isVoid;
            if (requiredParents && requiredParents.length > 0) {
                this.requiredParents = {};
                // The first parent is the list is automatically when none of the listed parents are present
                this.parentToAdd = requiredParents[0];
                requiredParents.forEach(function (tagName) { return _this.requiredParents[tagName] = true; });
            }
            this.implicitNamespacePrefix = implicitNamespacePrefix || null;
            this.contentType = contentType;
            this.ignoreFirstLf = ignoreFirstLf;
        }
        HtmlTagDefinition.prototype.requireExtraParent = function (currentParent) {
            if (!this.requiredParents) {
                return false;
            }
            if (!currentParent) {
                return true;
            }
            var lcParent = currentParent.toLowerCase();
            var isParentTemplate = lcParent === 'template' || currentParent === 'ng-template';
            return !isParentTemplate && this.requiredParents[lcParent] != true;
        };
        HtmlTagDefinition.prototype.isClosedByChild = function (name) {
            return this.isVoid || name.toLowerCase() in this.closedByChildren;
        };
        return HtmlTagDefinition;
    }());
    exports.HtmlTagDefinition = HtmlTagDefinition;
    var _DEFAULT_TAG_DEFINITION;
    // see http://www.w3.org/TR/html51/syntax.html#optional-tags
    // This implementation does not fully conform to the HTML5 spec.
    var TAG_DEFINITIONS;
    function getHtmlTagDefinition(tagName) {
        if (!TAG_DEFINITIONS) {
            _DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
            TAG_DEFINITIONS = {
                'base': new HtmlTagDefinition({ isVoid: true }),
                'meta': new HtmlTagDefinition({ isVoid: true }),
                'area': new HtmlTagDefinition({ isVoid: true }),
                'embed': new HtmlTagDefinition({ isVoid: true }),
                'link': new HtmlTagDefinition({ isVoid: true }),
                'img': new HtmlTagDefinition({ isVoid: true }),
                'input': new HtmlTagDefinition({ isVoid: true }),
                'param': new HtmlTagDefinition({ isVoid: true }),
                'hr': new HtmlTagDefinition({ isVoid: true }),
                'br': new HtmlTagDefinition({ isVoid: true }),
                'source': new HtmlTagDefinition({ isVoid: true }),
                'track': new HtmlTagDefinition({ isVoid: true }),
                'wbr': new HtmlTagDefinition({ isVoid: true }),
                'p': new HtmlTagDefinition({
                    closedByChildren: [
                        'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset',
                        'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
                        'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'ol',
                        'p', 'pre', 'section', 'table', 'ul'
                    ],
                    closedByParent: true
                }),
                'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
                'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
                'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
                'tr': new HtmlTagDefinition({
                    closedByChildren: ['tr'],
                    requiredParents: ['tbody', 'tfoot', 'thead'],
                    closedByParent: true
                }),
                'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
                'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
                'col': new HtmlTagDefinition({ requiredParents: ['colgroup'], isVoid: true }),
                'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
                'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
                'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
                'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
                'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
                'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
                'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
                'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
                'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
                'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
                'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
                'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
                'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
                'style': new HtmlTagDefinition({ contentType: tags_1.TagContentType.RAW_TEXT }),
                'script': new HtmlTagDefinition({ contentType: tags_1.TagContentType.RAW_TEXT }),
                'title': new HtmlTagDefinition({ contentType: tags_1.TagContentType.ESCAPABLE_RAW_TEXT }),
                'textarea': new HtmlTagDefinition({ contentType: tags_1.TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
            };
        }
        return TAG_DEFINITIONS[tagName.toLowerCase()] || _DEFAULT_TAG_DEFINITION;
    }
    exports.getHtmlTagDefinition = getHtmlTagDefinition;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF90YWdzLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLyIsInNvdXJjZXMiOlsicGFja2FnZXMvY29tcGlsZXIvc3JjL21sX3BhcnNlci9odG1sX3RhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCw2REFBcUQ7SUFFckQ7UUFjRSwyQkFDSSxFQVVNO2dCQVZOLDRCQVVNLEVBVkwsc0NBQWdCLEVBQUUsb0NBQWUsRUFBRSxvREFBdUIsRUFDMUQsbUJBQTBDLEVBQTFDLHNFQUEwQyxFQUFFLHNCQUFzQixFQUF0QiwyQ0FBc0IsRUFBRSxjQUFjLEVBQWQsbUNBQWMsRUFDbEYscUJBQXFCLEVBQXJCLDBDQUFxQjtZQUgxQixpQkEwQkM7WUF2Q08scUJBQWdCLEdBQTZCLEVBQUUsQ0FBQztZQUV4RCxtQkFBYyxHQUFZLEtBQUssQ0FBQztZQVNoQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztZQWM1QixJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25ELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQXJDLENBQXFDLENBQUMsQ0FBQzthQUM1RTtZQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxJQUFJLE1BQU0sQ0FBQztZQUMvQyxJQUFJLGVBQWUsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDakQsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7Z0JBQzFCLDRGQUE0RjtnQkFDNUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJ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Q29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VGFnQ29udGVudFR5cGUsIFRhZ0RlZmluaXRpb259IGZyb20gJy4vdGFncyc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sVGFnRGVmaW5pdGlvbiBpbXBsZW1lbnRzIFRhZ0RlZmluaXRpb24ge1xuICBwcml2YXRlIGNsb3NlZEJ5Q2hpbGRyZW46IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIGNsb3NlZEJ5UGFyZW50OiBib29sZWFuID0gZmFsc2U7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICByZXF1aXJlZFBhcmVudHMgIToge1trZXk6IHN0cmluZ106IGJvb2xlYW59O1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcGFyZW50VG9BZGQgITogc3RyaW5nO1xuICBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeDogc3RyaW5nfG51bGw7XG4gIGNvbnRlbnRUeXBlOiBUYWdDb250ZW50VHlwZTtcbiAgaXNWb2lkOiBib29sZWFuO1xuICBpZ25vcmVGaXJzdExmOiBib29sZWFuO1xuICBjYW5TZWxmQ2xvc2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHtjbG9zZWRCeUNoaWxkcmVuLCByZXF1aXJlZFBhcmVudHMsIGltcGxpY2l0TmFtZXNwYWNlUHJlZml4LFxuICAgICAgIGNvbnRlbnRUeXBlID0gVGFnQ29udGVudFR5cGUuUEFSU0FCTEVfREFUQSwgY2xvc2VkQnlQYXJlbnQgPSBmYWxzZSwgaXNWb2lkID0gZmFsc2UsXG4gICAgICAgaWdub3JlRmlyc3RMZiA9IGZhbHNlfToge1xuICAgICAgICBjbG9zZWRCeUNoaWxkcmVuPzogc3RyaW5nW10sXG4gICAgICAgIGNsb3NlZEJ5UGFyZW50PzogYm9vbGVhbixcbiAgICAgICAgcmVxdWlyZWRQYXJlbnRzPzogc3RyaW5nW10sXG4gICAgICAgIGltcGxpY2l0TmFtZXNwYWNlUHJlZml4Pzogc3RyaW5nLFxuICAgICAgICBjb250ZW50VHlwZT86IFRhZ0NvbnRlbnRUeXBlLFxuICAgICAgICBpc1ZvaWQ/OiBib29sZWFuLFxuICAgICAgICBpZ25vcmVGaXJzdExmPzogYm9vbGVhblxuICAgICAgfSA9IHt9KSB7XG4gICAgaWYgKGNsb3NlZEJ5Q2hpbGRyZW4gJiYgY2xvc2VkQnlDaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBjbG9zZWRCeUNoaWxkcmVuLmZvckVhY2godGFnTmFtZSA9PiB0aGlzLmNsb3NlZEJ5Q2hpbGRyZW5bdGFnTmFtZV0gPSB0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5pc1ZvaWQgPSBpc1ZvaWQ7XG4gICAgdGhpcy5jbG9zZWRCeVBhcmVudCA9IGNsb3NlZEJ5UGFyZW50IHx8IGlzVm9pZDtcbiAgICBpZiAocmVxdWlyZWRQYXJlbnRzICYmIHJlcXVpcmVkUGFyZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnJlcXVpcmVkUGFyZW50cyA9IHt9O1xuICAgICAgLy8gVGhlIGZpcnN0IHBhcmVudCBpcyB0aGUgbGlzdCBpcyBhdXRvbWF0aWNhbGx5IHdoZW4gbm9uZSBvZiB0aGUgbGlzdGVkIHBhcmVudHMgYXJlIHByZXNlbnRcbiAgICAgIHRoaXMucGFyZW50VG9BZGQgPSByZXF1aXJlZFBhcmVudHNbMF07XG4gICAgICByZXF1aXJlZFBhcmVudHMuZm9yRWFjaCh0YWdOYW1lID0+IHRoaXMucmVxdWlyZWRQYXJlbnRzW3RhZ05hbWVdID0gdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuaW1wbGljaXROYW1lc3BhY2VQcmVmaXggPSBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeCB8fCBudWxsO1xuICAgIHRoaXMuY29udGVudFR5cGUgPSBjb250ZW50VHlwZTtcbiAgICB0aGlzLmlnbm9yZUZpcnN0TGYgPSBpZ25vcmVGaXJzdExmO1xuICB9XG5cbiAgcmVxdWlyZUV4dHJhUGFyZW50KGN1cnJlbnRQYXJlbnQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5yZXF1aXJlZFBhcmVudHMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIWN1cnJlbnRQYXJlbnQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGxjUGFyZW50ID0gY3VycmVudFBhcmVudC50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGlzUGFyZW50VGVtcGxhdGUgPSBsY1BhcmVudCA9PT0gJ3RlbXBsYXRlJyB8fCBjdXJyZW50UGFyZW50ID09PSAnbmctdGVtcGxhdGUnO1xuICAgIHJldHVybiAhaXNQYXJlbnRUZW1wbGF0ZSAmJiB0aGlzLnJlcXVpcmVkUGFyZW50c1tsY1BhcmVudF0gIT0gdHJ1ZTtcbiAgfVxuXG4gIGlzQ2xvc2VkQnlDaGlsZChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1ZvaWQgfHwgbmFtZS50b0xvd2VyQ2FzZSgpIGluIHRoaXMuY2xvc2VkQnlDaGlsZHJlbjtcbiAgfVxufVxuXG5sZXQgX0RFRkFVTFRfVEFHX0RFRklOSVRJT04gITogSHRtbFRhZ0RlZmluaXRpb247XG5cbi8vIHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNTEvc3ludGF4Lmh0bWwjb3B0aW9uYWwtdGFnc1xuLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBmdWxseSBjb25mb3JtIHRvIHRoZSBIVE1MNSBzcGVjLlxubGV0IFRBR19ERUZJTklUSU9OUyAhOiB7W2tleTogc3RyaW5nXTogSHRtbFRhZ0RlZmluaXRpb259O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHRtbFRhZ0RlZmluaXRpb24odGFnTmFtZTogc3RyaW5nKTogSHRtbFRhZ0RlZmluaXRpb24ge1xuICBpZiAoIVRBR19ERUZJTklUSU9OUykge1xuICAgIF9ERUZBVUxUX1RBR19ERUZJTklUSU9OID0gbmV3IEh0bWxUYWdEZWZpbml0aW9uKCk7XG4gICAgVEFHX0RFRklOSVRJT05TID0ge1xuICAgICAgJ2Jhc2UnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ21ldGEnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2FyZWEnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2VtYmVkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdsaW5rJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdpbWcnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2lucHV0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdwYXJhbSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnaHInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2JyJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdzb3VyY2UnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ3RyYWNrJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICd3YnInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ3AnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe1xuICAgICAgICBjbG9zZWRCeUNoaWxkcmVuOiBbXG4gICAgICAgICAgJ2FkZHJlc3MnLCAnYXJ0aWNsZScsICdhc2lkZScsICAgJ2Jsb2NrcXVvdGUnLCAnZGl2JywgICdkbCcsICAnZmllbGRzZXQnLFxuICAgICAgICAgICdmb290ZXInLCAgJ2Zvcm0nLCAgICAnaDEnLCAgICAgICdoMicsICAgICAgICAgJ2gzJywgICAnaDQnLCAgJ2g1JyxcbiAgICAgICAgICAnaDYnLCAgICAgICdoZWFkZXInLCAgJ2hncm91cCcsICAnaHInLCAgICAgICAgICdtYWluJywgJ25hdicsICdvbCcsXG4gICAgICAgICAgJ3AnLCAgICAgICAncHJlJywgICAgICdzZWN0aW9uJywgJ3RhYmxlJywgICAgICAndWwnXG4gICAgICAgIF0sXG4gICAgICAgIGNsb3NlZEJ5UGFyZW50OiB0cnVlXG4gICAgICB9KSxcbiAgICAgICd0aGVhZCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0Ym9keScsICd0Zm9vdCddfSksXG4gICAgICAndGJvZHknOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsndGJvZHknLCAndGZvb3QnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICd0Zm9vdCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0Ym9keSddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3RyJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtcbiAgICAgICAgY2xvc2VkQnlDaGlsZHJlbjogWyd0ciddLFxuICAgICAgICByZXF1aXJlZFBhcmVudHM6IFsndGJvZHknLCAndGZvb3QnLCAndGhlYWQnXSxcbiAgICAgICAgY2xvc2VkQnlQYXJlbnQ6IHRydWVcbiAgICAgIH0pLFxuICAgICAgJ3RkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3RkJywgJ3RoJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAndGgnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsndGQnLCAndGgnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdjb2wnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe3JlcXVpcmVkUGFyZW50czogWydjb2xncm91cCddLCBpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdzdmcnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2ltcGxpY2l0TmFtZXNwYWNlUHJlZml4OiAnc3ZnJ30pLFxuICAgICAgJ21hdGgnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2ltcGxpY2l0TmFtZXNwYWNlUHJlZml4OiAnbWF0aCd9KSxcbiAgICAgICdsaSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydsaSddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ2R0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ2R0JywgJ2RkJ119KSxcbiAgICAgICdkZCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydkdCcsICdkZCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3JiJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKFxuICAgICAgICAgIHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3JiJywgJ3J0JywgJ3J0YycsICdycCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3J0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKFxuICAgICAgICAgIHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3JiJywgJ3J0JywgJ3J0YycsICdycCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3J0Yyc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydyYicsICdydGMnLCAncnAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdycCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbihcbiAgICAgICAgICB7Y2xvc2VkQnlDaGlsZHJlbjogWydyYicsICdydCcsICdydGMnLCAncnAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdvcHRncm91cCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydvcHRncm91cCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ29wdGlvbic6XG4gICAgICAgICAgbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ29wdGlvbicsICdvcHRncm91cCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3ByZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aWdub3JlRmlyc3RMZjogdHJ1ZX0pLFxuICAgICAgJ2xpc3RpbmcnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lnbm9yZUZpcnN0TGY6IHRydWV9KSxcbiAgICAgICdzdHlsZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y29udGVudFR5cGU6IFRhZ0NvbnRlbnRUeXBlLlJBV19URVhUfSksXG4gICAgICAnc2NyaXB0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGUuUkFXX1RFWFR9KSxcbiAgICAgICd0aXRsZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y29udGVudFR5cGU6IFRhZ0NvbnRlbnRUeXBlLkVTQ0FQQUJMRV9SQVdfVEVYVH0pLFxuICAgICAgJ3RleHRhcmVhJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKFxuICAgICAgICAgIHtjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGUuRVNDQVBBQkxFX1JBV19URVhULCBpZ25vcmVGaXJzdExmOiB0cnVlfSksXG4gICAgfTtcbiAgfVxuICByZXR1cm4gVEFHX0RFRklOSVRJT05TW3RhZ05hbWUudG9Mb3dlckNhc2UoKV0gfHwgX0RFRkFVTFRfVEFHX0RFRklOSVRJT047XG59XG4iXX0=