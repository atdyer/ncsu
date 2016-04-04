/**
 * Created by tristan on 10/19/15.
 */

ADCIRC.OrbitControls = function ( orbit_scene ) {

    //// API
    this.enabled = true;

    // Rotation options
    this.rotateSpeed = 1.0;
    this.rotationAxis = new THREE.Vector3(0, 0, 1);

    // Tilt options
    this.tiltSpeed = 1.0;
    this.tiltAxis = new THREE.Vector3(1, 0, 0);

    // Zoom options
    this.zoomSpeed = 0.95;
    this.minZoom = 0;
    this.maxZoom = Infinity;


    //// List of scenes being controlled (must be ADCIRC.OrbitScenes)
    this.scenes = [ orbit_scene ];
    this.numscenes = 1;


    //// Scoping variable and constants
    var self = this;
    var BUTTONS = { ROTATE: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
    var STATES = { NONE: -1, ROTATE: 0, PAN: 1, ZOOM: 2, ELEVATE: 3 };


    //// Event helpers
    var clickStart = new THREE.Vector2();
    var clickEnd = new THREE.Vector2();
    var clickDelta = new THREE.Vector2();
    var state = STATES.NONE;
    var i = 0;


    //// Events
    var startEvent = { type: 'start' };
    var changeEvent = { type: 'change' };
    var endEvent = { type: 'end' };
    var scrollEvent = { type: 'scroll', scrollSpeed: this.zoomSpeed };
    var hoverEvent = { type: 'hover' };


    //// Functions
    this.elevate = function ( dz ) {

        for ( i=0; i<self.numscenes; ++i ) {

            // Calculate scale factor based on camera size and zoom
            var scale = (self.scenes[i].camera.top - self.scenes[i].camera.bottom) / (self.scenes[i].height * self.scenes[i].camera.zoom);

            // Move the scene in the z-direction
            self.scenes[i].panScene.translateZ(-scale * dz);

        }

    };

    this.orbit = function ( angle ) {

        // LOCK ROTATION
        //return;

        for ( i=0; i<self.numscenes; ++i ) {

            // Rotate the scene that contains all of the actual objects
            self.scenes[i].rotateScene.rotateOnAxis( self.rotationAxis, angle );

        }

    };

    this.pan = function ( dx, dy ) {

        for ( i=0; i<self.numscenes; ++i ) {

            // Calculate scale factor based on camera size and zoom
            var scale = (self.scenes[i].camera.top - self.scenes[i].camera.bottom) / (self.scenes[i].height * self.scenes[i].camera.zoom);

            // Get angle of rotation of the scene
            var angle = self.scenes[i].rotateScene.rotation.z;

            // Calculate translations so that things will move in the 'global' x and y
            var _dx = scale * ( dx * Math.cos(angle) - dy * Math.sin(angle) );
            var _dy = scale * ( dx * Math.sin(angle) + dy * Math.cos(angle) );

            // Perform translations
            self.scenes[i].panScene.translateX(_dx);
            self.scenes[i].panScene.translateY(-_dy);

        }

    };

    this.reset = function () {

        for ( i=0; i<self.numscenes; ++i ) {

            // Return tilt to 0 degrees
            self.scenes[i].tiltScene.rotation.set( 0, 0, 0 );

            // Return rotation to 0 degrees
            self.scenes[i].rotateScene.rotation.set( 0, 0, 0 );

            // Return all offsets to 0
            self.scenes[i].panScene.position.set( 0, 0, 0 );

            // Set zoom back to 1.0
            self.scenes[i].camera.zoom = 1.0;
            self.scenes[i].camera.updateProjectionMatrix();

        }

        // Let everyone know we've changed some stuff
        self.dispatchEvent( changeEvent );

    };

    this.tilt = function ( angle ) {

        // LOCK ROTATION
        //return;

        for ( i=0; i<self.numscenes; ++i ) {

            // Tilt the world scene
            self.scenes[i].tiltScene.rotateOnAxis( self.tiltAxis, angle );

        }

    };

    this.zoom = function ( direction ) {

        // Decide whether to dolly in or out based on scroll direction
        if ( direction > 0 ) {

            for ( i=0; i<self.numscenes; ++i ) {
                self.scenes[i].camera.zoom = Math.max(self.minZoom, Math.min(self.maxZoom, self.scenes[i].camera.zoom / self.zoomSpeed));
                self.scenes[i].camera.updateProjectionMatrix();
            }

        } else if ( direction < 0 ) {

            for ( i=0; i<self.numscenes; ++i ) {
                self.scenes[i].camera.zoom = Math.max(self.minZoom, Math.min(self.maxZoom, self.scenes[i].camera.zoom * self.zoomSpeed));
                self.scenes[i].camera.updateProjectionMatrix();
            }

        }

    };


    //// Event responders
    function onMouseDown ( event ) {

        // Check that controls are enabled
        if ( self.enabled === false ) return;

        // Prevent any default event from happening
        event.preventDefault();

        // Keep track of the mouse position so we can calculate
        // how far it moves when the mouse starts moving
        clickStart.set( event.clientX, event.clientY );

        // Set the current state based on which key has been pressed
        if ( event.button === BUTTONS.ROTATE ) {

            // Set the state to rotating so we know what to do when
            // the mouse move event is fired
            state = STATES.ROTATE;

        } else if ( event.button === BUTTONS.PAN ) {

            if ( event.shiftKey ) {

                // User is holding down shift, so we'll be elevating
                // instead of panning
                state = STATES.ELEVATE;

            } else {

                // Set the state to panning so we know what to do when
                // the mouse move event is fired
                state = STATES.PAN;

            }

        }

        // Things are happening that we care about, so add mouse move and
        // mouse release event listeners
        if ( state !== STATES.NONE ) {

            document.addEventListener( 'mousemove', onMouseMove, false );
            document.addEventListener( 'mouseup', onMouseUp, false );

            // Let everyone know we've started doing stuff
            self.dispatchEvent( startEvent );
        }

    }

    function onMouseHover ( event ) {

        // Get the position of the canvas on the page
        var domposition = orbit_scene.dom.getBoundingClientRect();

        // Calculate the coordinates of the mouse in screen and normalized coordinates
        hoverEvent.coordinates = {

            xscreen: event.clientX - domposition.left,
            yscreen: event.clientY - domposition.top,
            xnorm: ( ( event.clientX - domposition.left ) / domposition.width ) * 2 - 1,
            ynorm: - ( ( event.clientY - domposition.top ) / domposition.height ) * 2 + 1

        };

        // Dispatch the event
        self.dispatchEvent( hoverEvent );

    }

    function onMouseMove ( event ) {

        // Check that controls are enabled
        if ( self.enabled === false ) return;

        // Prevent any default event from happening
        event.preventDefault();

        // Determine how much the mouse moved
        clickEnd.set( event.clientX, event.clientY );
        clickDelta.subVectors( clickEnd, clickStart );

        // Do some stuff based on what state we're in
        if ( state == STATES.ROTATE ) {

            // Calculate rotation
            var rotationX = 2 * Math.PI * clickDelta.x / self.scenes[0].width * self.rotateSpeed;
            var rotationY = 2 * Math.PI * clickDelta.y / self.scenes[0].height * self.tiltSpeed;

            // Spin the objects
            self.orbit( rotationX );

            // Tilt the scene
            self.tilt( rotationY );

            // Set the current mouse position for the next event
            clickStart.copy( clickEnd );

            // Let everyone know we're changing things
            self.dispatchEvent( changeEvent );

        } else if ( state == STATES.PAN ) {

            // Pan the scene
            self.pan( clickDelta.x, clickDelta.y );

            // Set the current mouse position for the next event
            clickStart.copy( clickEnd );

            // Let everyone know we're changing things
            self.dispatchEvent( changeEvent );

        } else if ( state == STATES.ELEVATE ) {

            // Elevate the scene
            self.elevate( clickDelta.y );

            // Set the current mouse position for the next event
            clickStart.copy( clickEnd );

            // Let everyone know we're changing things
            self.dispatchEvent( changeEvent );

        }

    }

    function onMouseUp ( event ) {

        // Check that controls are enabled
        if ( self.enabled === false ) return;

        // Prevent any default event from happening
        event.preventDefault();

        // Let everyone know we've changed stuff
        self.dispatchEvent( changeEvent );

        // Remove event listeners for mouse movement and click release
        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

        // Set the current state to none
        state = STATES.NONE;

        // Let everyone know we're done doing stuff
        self.dispatchEvent( endEvent );

    }

    function onMouseWheel ( event ) {

        // Check that controls are enabled
        if ( self.enabled === false ) return;

        // Prevent any default event from happening and from scrolling the window
        event.preventDefault();
        event.stopPropagation();

        // Get wheel scroll amount
        var delta = 0;
        if ( !!event.wheelDelta ) {

            delta = event.wheelDelta;

        } else if ( !!event.detail ) {

            delta = -event.detail;

        }

        // Perform the zoom
        self.zoom( delta );

        // Dispatch event
        scrollEvent.direction = delta / Math.abs( delta );
        self.dispatchEvent( scrollEvent );

    }


    //// Add event listeners (for handling events)
    this.scenes[0].dom.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.scenes[0].dom.addEventListener( 'mousedown', onMouseDown, false );
    this.scenes[0].dom.addEventListener( 'mousewheel', onMouseWheel, false );
    this.scenes[0].dom.addEventListener( 'mousemove', onMouseHover, false );
    this.scenes[0].dom.addEventListener( 'DOMMouseScroll', onMouseWheel, false );


    //// Add event listeners (for responding to events)

    // Function used to update every scene that this controller is in charge of
    var updateScenes = function() {

        for ( var i=0; i<self.numscenes; ++i ) {
            self.scenes[i].repaint();
        }

    };

    // Add the listeners
    this.addEventListener( 'change', updateScenes);
    this.addEventListener( 'scroll', updateScenes);

};

ADCIRC.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
ADCIRC.OrbitControls.prototype.constructor = ADCIRC.OrbitControls;

ADCIRC.OrbitControls.prototype.addScene = function ( orbit_scene ) {

    for ( var i=0; i<this.numscenes; ++i ) {

        if ( this.scenes[i] === orbit_scene ) {
            return;
        }

        this.scenes.append( orbit_scene );
        this.numscenes = this.scenes.length;

    }

};