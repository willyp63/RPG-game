## What it is?
It is not a module!
It's a boilerplate to show how to use PIXI.js with Typescript.
You can use it for your own PIXI.js projects.

## Getting started with Typescript & PIXI.js

**All you have to do is:**
- Clone repo
- Build it with command **npm run build:base**
- Please read the **"note"** section below!!!
- **npm start**, open a web browser and go to http://localhost:5355
- It works!

**For building manually**  
```
npm run build:browserify
```

**Running a web server**  ( [http://localhost:5355](http://localhost:5355) )
```
http-server ./build -p 5355 
```
  
    
### **NOTE (step 3)**
Now you should open package.json file located in
``` node_modules/pixi.js/package.json ```

And change entry point ("main" line) to
```
"main": "./src/index.js",
```

Read about this on [PIXI.js github, issue #3213](https://github.com/pixijs/pixi.js/issues/3213)
