(function (ng) {
    ng.module('ui.svgRender', [])
        .run(["$templateCache", function ($templateCache) {
            $templateCache.put("noFileFound.html", "<span>No file found!</span>");
        }])
        .provider('svgRenderFile', function () {
            return {
                _baseDirectory: "",
                _templates: {},
                setBaseDirectory: function (baseDir) {
                    this._baseDirectory = baseDir;
                },
                getBaseDirectory: function () {
                    return this._baseDirectory;
                },
                setTemplates: function (newTemplates) {
                    this._templates = newTemplates;
                },
                getTemplates: function () {
                    return this._templates;
                },
                getTemplate: function (template) {
                    return this._templates[template];
                },
                addTemplate: function (name, url) {
                    this._templates[name] = this._baseDirectory + url;
                },
                $get: function () {
                    return this;
                }
            };
        })
        .directive('svgRender', ['$compile', function ($compile) {
            var template = '<svg-render-inner svg="{{svg}}" h="{{h}}" w="{{w}}"></svg-render-inner>';
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    svg: '@',
                    height: '@?h',
                    width: '@?w'
                },
                link: function (scope, elem, attrs) {
                    var newTemp = template.replace('{{svg}}', scope.svg);
                    newTemp = scope.height ? newTemp.replace('{{h}}', scope.height) : newTemp.replace('h={{h}}', '');
                    newTemp = scope.width ? newTemp.replace('{{w}}', scope.width) : newTemp.replace('w={{w}}', '');
                    elem.html(newTemp);
                    $compile(elem.contents())(scope);
                }
            };
        }])
        .directive('svgRenderInner', ['$log', 'svgRenderFile', function ($log, svgRenderFile) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    svg: '@',
                    height: '@?h',
                    width: '@?w'
                },
                link: function (scope, element, attrs) {
                    var cssAttributes = {
                        height: scope.height ? scope.height + "px" : undefined,
                        width: scope.width ? scope.width + "px" : undefined
                    };
                    element.css(cssAttributes);
                },
                templateUrl: function (element, attrs) {
                    var result = svgRenderFile.getTemplate(attrs.svg);

                    if (!result) {
                        $log.error('Unfound Symbol: ' + attrs.svg);
                        return 'noFileFound.html';
                    }
                    return result;
                }
            };
        }]);
})(angular);