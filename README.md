# d3-awsp-timeline @version 0.3.0
Draw scheduler using d3.js library


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


## ToDo
```
- Implement brush to zoom in / out
- Add more events handler such as (double click, click, etc.)
- APIs for Updating chart, deleting chart, etc.
```