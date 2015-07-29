# d3-awsp-timeline @version 0.4.0
Draw scheduler using d3.js library

![ss](https://cloud.githubusercontent.com/assets/2015218/8866263/331f1aac-3156-11e5-8a2c-71b3d17fec7f.png)

## Folder Structure
- ./build/**   - Used in development, automatically generated from Intellij
- ./dist/**    - Production use, compiled and minified files
- ./app.js     - Main file
- ./index.html - Demo

## Development
Build to a single file with minified version. 
```
gulp build
```

Compile *.ts files to individual *.js files
```
gulp compile
```

## Dependency
- underscore.js
- d3.js


## ToDo
```
- Implement brush to zoom in / out
- Add more events handler such as (double click, click, etc.)
- APIs for Updating chart, deleting chart, etc.
```