# gulp-email-builder

The gulp task manager which:

- compiles scss files
- runs a php server locally so you can use php to dynamically show email versions
- automatically refreshes page when any scss file or template file is edited
- builds final packaged version to upload to ESP
  - injects mobile css into head
  - replaces all classes for desktop css into inline css
  - minify html
  - creates a final html file

### How to run

To set up gulp: `npm i`

To compile css: `gulp css`

To run watch: `gulp watch`

To run final build `gulp build`
