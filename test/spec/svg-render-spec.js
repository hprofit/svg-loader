describe('SvgRender Directives', function () {
    'use strict';

    describe('SvgRenderFileService', function () {
        'use strict';

        var service;

        beforeEach(function () {
            module('svgRender.ui.svgRender');
        });

        beforeEach(function () {
            inject(function (_svgRenderFileService_) {
                service = _svgRenderFileService_;
            });
        });

        // Note that the _baseDirectory starts as an empty string
        it('Should get the baseDirectory', function () {
            var baseDir = service.getBaseDirectory();

            expect(baseDir).toBe("");
        });

        it('Should set the baseDirectory', function () {
            var newDir = 'new/base/dir';

            service.setBaseDirectory(newDir);

            expect(service.getBaseDirectory()).toBe(newDir);
        });

        it('Should set templates to a new object', function () {
            var templates = {
                "temp": "some/url"
            };

            service.setTemplates(templates);

            expect(service.getTemplates()).toBe(templates);
        });

        it('Should return the templates', function () {
            var newTemplates = {
                "newTemp": "someTemplate"
            };

            service.setTemplates(newTemplates);
            var result = service.getTemplates();

            expect(result).toBe(newTemplates);
        });

        it('Should return a template by template name', function () {
            var newTemplates = {
                "newTemp": "someTemplate"
            };

            service.setTemplates(newTemplates);
            var result = service.getTemplate('newTemp');

            expect(result).toBe(newTemplates.newTemp);
        });

        it('Should add a template to the templates object', function () {
            var tempName = "newTemp",
                url = "some/url/here";

            service.addTemplate(tempName, url);

            expect(service.getTemplate(tempName)).toBe(url);
        });
    });

    describe('SvgRender', function () {
        var template, rootScope, scope, compile, $log, svgRenderFileService;

        beforeEach(function () {
            module('test.ui.templates');

            module('svgRender.ui.svgRender', function ($provide) {
                $provide.decorator('svgRenderFileService', function ($delegate) {
                    $delegate.path = jasmine.createSpy();
                    return $delegate;
                });
            });

            inject(function (_$templateCache_, _$rootScope_, _$compile_, _$log_, _svgRenderFileService_) {
                template = _$templateCache_.get('svg/test.html');
                _$templateCache_.put('svg/test.html', template);

                rootScope = _$rootScope_;
                scope = rootScope.$new();
                compile = _$compile_;
                $log = _$log_;
                svgRenderFileService = _svgRenderFileService_;
            });
        });

        function createDirective(temp) {
            return compile(angular.element(temp))(scope);
        }

        it('Should have an SVG file string', function () {
            var element = createDirective('<svg-render svg="icon"></svg-render>'),
                iScope = element.isolateScope();

            expect(iScope.svg).toEqual("icon");
        });

        it('Should have a height variable', function () {
            var element = createDirective('<svg-render svg="icon" h="44"></svg-render>'),
                iScope = element.isolateScope();

            expect(iScope.height).toEqual("44");
        });

        it('Should have a width variable', function () {
            var element = createDirective('<svg-render svg="icon" w="44"></svg-render>'),
                iScope = element.isolateScope();

            expect(iScope.width).toEqual("44");
        });

        it('Should have a height and width variable', function () {
            var element = createDirective('<svg-render svg="icon" h="40" w="44"></svg-render>'),
                iScope = element.isolateScope();

            expect(iScope.height).toEqual("40");
            expect(iScope.width).toEqual("44");
        });

        it('Should call compile to add the generated HTML string to the dom', function () {
            var element = createDirective('<svg-render svg="icon" h="40" w="44"></svg-render>'),
                newElem = element.find('svg-render-inner');

            expect(newElem).toBeDefined();
            expect(newElem.attr('h')).toBe('40');
            expect(newElem.attr('w')).toBe('44');
        });
    });

    describe('SvgRenderInner', function () {
        var template, rootScope, scope, compile, $httpBackend, $log, svgRenderFileService;

        beforeEach(function () {
            module('test.ui.templates');

            module('svgRender.ui.svgRender', function ($provide) {
                $provide.decorator('svgRenderFileService', function ($delegate) {
                    $delegate.path = jasmine.createSpy();
                    return $delegate;
                });
            });

            inject(function (_$templateCache_, _$rootScope_, _$compile_, _$log_, _svgRenderFileService_, $injector) {
                template = _$templateCache_.get('svg/test.html');
                _$templateCache_.put('svg/test.html', template);

                rootScope = _$rootScope_;
                scope = rootScope.$new();
                compile = _$compile_;
                $httpBackend = $injector.get('$httpBackend');
                $log = _$log_;
                svgRenderFileService = _svgRenderFileService_;
            });
        });

        function createDirective(temp) {
            var dir = compile(angular.element(temp))(scope);
            rootScope.$digest();
            return dir;
        }

        it('Should have an SVG file string', function () {
            spyOn(svgRenderFileService, 'getTemplate').and.callFake(function (url) {
                expect(url).toBe('icon');
                return undefined;
            });

            var element = createDirective('<svg-render-inner svg="icon"></svg-render-inner>'),
                newElem = angular.element(element[0]);

            expect(newElem.attr('svg')).toBe('icon');
        });

        it('Should have an h and w value', function () {
            spyOn(svgRenderFileService, 'getTemplate').and.callFake(function (url) {
                expect(url).toBe('icon');
                return undefined;
            });

            var element = createDirective('<svg-render-inner svg="icon" h="20" w="30"></svg-render-inner>'),
                newElem = angular.element(element[0]);

            expect(newElem.attr('h')).toBe('20');
            expect(newElem.attr('w')).toBe('30');
        });

        it('Should have a templateURL', function () {
            spyOn(svgRenderFileService, 'getTemplate').and.callFake(function (url) {
                expect(url).toBe('icon');
                return "noFileFound.html";
            });

            var element = createDirective('<svg-render-inner svg="icon" h="20" w="30"></svg-render-inner>'),
                newElem = angular.element(element[0]);

            expect(svgRenderFileService.getTemplate.calls.count()).toBe(1);
        });

        it('Should apply h and w as height and width css styles', function () {
            spyOn(svgRenderFileService, 'getTemplate').and.callFake(function (url) {
                return "exampleSvg.html";
            });

            var element = createDirective('<svg-render-inner svg="icon" h="20" w="30"></svg-render-inner>'),
                newElem = angular.element(element[0]);

            expect(newElem.css('height')).toBe('20px');
            expect(newElem.css('width')).toBe('30px');
        });
    });
});