# NCSU Courses

---

### System Requirements

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (should come with Node.js)
- [grunt](http://gruntjs.com/) - Easiest to do a global install with `npm install -g grunt` (probably will need sudo)

---

### Building Individual Sites

##### Navigate to site subdirectory
```bash
cd courses/couse_name/`
```

##### Install required node packages
```bash
npm install
```

##### Use grunt to bake all of the html files
```bash
grunt
```

---

### Editing Site Pages

Be sure to only edit pages and content located in the `baking` subdirectory of each site. Grunt will be using these files to regenerate the website every time it is changed.

---

### Rebuilding Individual Sites

Once the site has been built and changes have been made, you can rebuild the site by simply running
```bash
grunt
```



