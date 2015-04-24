# LiveReactload browser API

This API is meant to be used along with [LiveReactload](https://github.com/milankinen/livereactload). 
Check it to get more information.

This project contains very lightweight browser API which can be used if
your application needs to:

 * Propagate state between reloading events that is not managed by React components
 * Expose private (non-exported) components so that their state propagation can be properly
   handled during reloading events

This API does not depend on LiveReactload server and browserify transformation
so it can be mixed with the production code - if browserify transformation is not
enabled, then these API methods are practically no-ops.

## API

```javascript
// npm install --save livereactload-api
var lrApi = require('livereactload-api')
``` 

### .onReload(callback)

This method sets the event listener which is triggered when reloading event
occurs. It takes one callback function that takes no arguments.

```javascript
lrApi.onReload(function() {
  var currentState = lrApi.getState() || window.INITIAL_STATE_FROM_SERVER
  React.render(...use currentState to render your root component ...)
})
```

If LiveReactload transformer is not set, then this method is no-op.
    
### .setState([name], newState)
    
This sets the state that can be used when next bundle is reloaded. You can set
multiple state by using name as a first argument. Name is not mandatory.
Calling this method sequentially overrides the old values.

```javascript
lrAPI.setState(myGlobalState)
lrAPI.setState('socket', socket)
```

If LiveReactload transformer is not set, then this method is no-op.

### .getState([name])

Restores the state. You can also retrieve named state objects by giving an 
optional name argument. If state is not found then `undefined` is returned.

```javascript
var global = lrAPI.getState()
var socket = lrAPI.getState('socket')
```

### .expose(clz, id)

Provides a way to expose private inner components to LiveReactload so that
their state can be propagated across reload events. 

**ATTENTION:** In LiveReactload version `0.5.0`, automatic class detection 
was introduced to `React.createClass` so ES6 inner classes are the only use 
case for this method.

```javascript
class MyClass extends React.Component {
  ...
}

MyClass = lrApi.expose(MyClass, 'MyClass')
```

Note that id is mandatory and it must be unique. You can for example use `__dirname` 
to ensure uniqueness.

If LiveReactload transformer is not set, then this method is no-op.
