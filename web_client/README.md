This directory has initialized

```
yo init webapp
```

see http://yeoman.io/


# How to setup Development environment

## Requirement

- Node.js >= 0.8.23
- npm modules
 - bower
 - yo
 - grunt-cli
- Ruby
- Compass

## Install Node modules and Ruby gems

```
npm install -g yo bower grunt-cli
gem install compass
```

## Init working directory

```
cd web_client
# Download development tools specidied at package.json
npm install
# Download JavaScript libraries specified at component.json
bower install
```

## Other commands

```
# Add JavaScript Library
bower install angular

# Launch web server with auto browser reloader
grunt server

# Check javascript style
grunt jshint

# Create release files 
grunt build
```
