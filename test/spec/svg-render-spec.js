describe('SvgRender Directives', function () {
    'use strict';

    describe('SvgRenderFileProvider', function () {
        'use strict';

        var provider;

        beforeEach(function () {
            // Initialize the service provider
            // by injecting it to a fake module's config block
            var fakeModule = angular.module('test.app.config', function () {});
            fakeModule.config( function (svgRenderFileProvider) {
                provider = svgRenderFileProvider;
            });
            // Initialize test.app injector
            module('ui.svgRender', 'test.app.config');

            // Kickstart the injectors previously registered
            // with calls to angular.mock.module
            inject(function () {});
        });

        it('Should have a _baseDirectory and _template field', function () {
            expect(provider._baseDirectory).toEqual("");
            expect(provider._templates).toEqual({});
        });

        it('Should return the _baseDirectory', function () {
            expect(provider.getBaseDirectory()).toEqual("");
        });

        it('Should set the _baseDirectory', function () {
            var url = 'base/directory/here';

            provider.setBaseDirectory(url);

            expect(provider._baseDirectory).toEqual(url);
        });

        it('Should return the _templates object', function () {
            expect(provider.getTemplates()).toEqual({});
        });

        it('Should set the _templates object', function () {
            var templates = {
                "icon": "some/dir/here.html",
                "another": "some/other/dir.html"
            };

            provider.setTemplates(templates);

            expect(provider._templates).toEqual(templates);
            expect(provider.getTemplate('icon')).toEqual(templates.icon);
            expect(provider.getTemplate('another')).toEqual(templates.another);
        });

        it('Should return a template url', function () {
            var templates = {
                "icon": "some/dir/here.html"
            };

            provider.setTemplates(templates);

            expect(provider.getTemplate("icon")).toEqual(templates.icon);
        });

        it('Should add a template to the _templates object', function () {
            var templates = {
                "icon": "some/dir/here.html"
            };

            provider.addTemplate("icon", templates.icon);

            expect(provider._templates.icon).toEqual(templates.icon);
        });

        it('Should have a $get method that returns the svgRenderFileProvider', function () {
            expect(provider.$get()).toEqual(provider);
        });
    });

    describe('SvgRender', function () {
        var template, rootScope, scope, compile, $log, svgRenderFile;

        beforeEach(function () {
            module('test.ui.templates');

            module('ui.svgRender', function ($provide) {
                $provide.decorator('svgRenderFile', function ($delegate) {
                    $delegate.path = jasmine.createSpy();
                    return $delegate;
                });
            });

            inject(function (_$templateCache_, _$rootScope_, _$compile_, _$log_, _svgRenderFile_) {
                template = _$templateCache_.get('svg/test.html');
                _$templateCache_.put('svg/test.html', template);

                rootScope = _$rootScope_;
                scope = rootScope.$new();
                compile = _$compile_;
                $log = _$log_;
                svgRenderFile = _svgRenderFile_;
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
        var template, rootScope, scope, compile, $httpBackend, $log, svgRenderFile;

        beforeEach(function () {
            module('test.ui.templates');

            module('ui.svgRender', function ($provide) {
                $provide.decorator('svgRenderFile', function ($delegate) {
                    $delegate.path = jasmine.createSpy();
                    return $delegate;
                });
            });

            inject(function (_$templateCache_, _$rootScope_, _$compile_, _$log_, _svgRenderFile_, $injector) {
                template = _$templateCache_.get('svg/test.html');
                _$templateCache_.put('svg/test.html', template);

                rootScope = _$rootScope_;
                scope = rootScope.$new();
                compile = _$compile_;
                $httpBackend = $injector.get('$httpBackend');
                $log = _$log_;
                svgRenderFile = _svgRenderFile_;
            });
        });

        function createDirective(temp) {
            var dir = compile(angular.element(temp))(scope);
            rootScope.$digest();
            return dir;
        }

        it('Should have an SVG file string', function () {
            spyOn(svgRenderFile, 'getTemplate').and.callFake(function (url) {
                expect(url).toBe('icon');
                return undefined;
            });

            var element = createDirective('<svg-render-inner svg="icon"></svg-render-inner>'),
                newElem = angular.element(element[0]);

            expect(newElem.attr('svg')).toBe('icon');
        });

        it('Should have an h and w value', function () {
            spyOn(svgRenderFile, 'getTemplate').and.callFake(function (url) {
                expect(url).toBe('icon');
                return undefined;
            });

            var element = createDirective('<svg-render-inner svg="icon" h="20" w="30"></svg-render-inner>'),
                newElem = angular.element(element[0]);

            expect(newElem.attr('h')).toBe('20');
            expect(newElem.attr('w')).toBe('30');
        });

        it('Should have a templateURL', function () {
            spyOn(svgRenderFile, 'getTemplate').and.callFake(function (url) {
                expect(url).toBe('icon');
                return "noFileFound.html";
            });

            var element = createDirective('<svg-render-inner svg="icon" h="20" w="30"></svg-render-inner>'),
                newElem = angular.element(element[0]);

            expect(svgRenderFile.getTemplate.calls.count()).toBe(1);
        });

        it('Should apply h and w as height and width css styles', function () {
            spyOn(svgRenderFile, 'getTemplate').and.callFake(function (url) {
                return "exampleSvg.html";
            });

            var element = createDirective('<svg-render-inner svg="icon" h="20" w="30"></svg-render-inner>'),
                newElem = angular.element(element[0]);

            expect(newElem.css('height')).toBe('20px');
            expect(newElem.css('width')).toBe('30px');
        });
    });
});


