SVG-Render 
=========


Installing SVG-Render
---------
    bower install angular-svg-render


Running Tests
-------------
In order to execute tests, first install dependencies within the angular-svg-render directory

    bower install

Once that is completed, you can run the tests via:

    gulp

or

    gulp test

Using SVG-Render
-------------
1. Add `ui.svgRender` to your app's dependencies
2. In your app.config, add `svgRenderFileProvider` to the list of providers
3. Within the app.config you can add templates to the svgRenderFileProvider via `svgRenderFileProvider.addTemplate(name, path)` or `svgRenderFileProvider.setTemplates(templateObj)`

