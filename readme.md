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
4. Insert a `<svg-render>` directive into your HTML with an `icon="{your icon here}"` attribute 
5. Optionally, you can add a `h="{height in pixels}"` and/or `w="{width in pixels}"` attribute to the directive

Note that currently the height and width attributes will not resize the SVG itself, merely the viewing space in which it's rendered. You can adjust the size of the drawn SVG via the viewbox within the SVG itself. Directive resizing of the viewbox is a new feature yet to come!

