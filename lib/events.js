(function () {

    var cache = {},
        guidCounter = 1,
        expando = "data" + (new Date).getTime();

    this.getData = function (elem) {
        var guid = elem[expando];
        if (!guid) {
            guid = elem[expando] = guidCounter++;
            cache[guid] = {};
        }
        return cache[guid];
    };

    this.removeData = function (elem) {
        var guid = elem[expando];
        if (!guid) return;
        delete cache[guid];
        try {
            delete elem[expando];
        }
        catch (e) {
            if (elem.removeAttribute) {
                elem.removeAttribute(expando);
            }
        }
    };
})();

function fixEvent(event) {

    function returnTrue() { return true; }
    function returnFalse() { return false; }

    if (!event || !event.stopPropagation) {
        var old = event || window.event;

        // Clone the old object so that we can modify the values
        event = {};

        for (var prop in old) {
            event[prop] = old[prop];
        }

        // The event occurred on this element
        if (!event.target) {
            event.target = event.srcElement || document;
        }

        // Handle which other element the event is related to
        event.relatedTarget = event.fromElement === event.target ?
            event.toElement :
            event.fromElement;

        // Stop the default browser action
        event.preventDefault = function () {
            event.returnValue = false;
            event.isDefaultPrevented = returnTrue;
        };

        event.isDefaultPrevented = returnFalse;

        // Stop the event from bubbling
        event.stopPropagation = function () {
            event.cancelBubble = true;
            event.isPropagationStopped = returnTrue;
        };

        event.isPropagationStopped = returnFalse;

        // Stop the event from bubbling and executing other handlers
        event.stopImmediatePropagation = function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        };

        event.isImmediatePropagationStopped = returnFalse;

        // Handle mouse position
        if (event.clientX != null) {
            var doc = document.documentElement, body = document.body;

            event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
            (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0);
        }

        // Handle key presses
        event.which = event.charCode || event.keyCode;

        // Fix button for mouse clicks:
        // 0 == left; 1 == middle; 2 == right
        if (event.button != null) {
            event.button = (event.button & 1 ? 0 :
                (event.button & 4 ? 1 :
                    (event.button & 2 ? 2 : 0)));
        }
    }

    return event;

}

(function() {

    var nextGuid = 1;

    this.addEvent = function (elem, type, fn) {

        var data = getData(elem);                           //#1

        if (!data.handlers) data.handlers = {};             //#2

        if (!data.handlers[type])                           //#3
            data.handlers[type] = [];                         //#3

        if (!fn.guid) fn.guid = nextGuid++;                 //#4

        data.handlers[type].push(fn);                       //#5

        if (!data.dispatcher) {                             //#6
            data.disabled = false;
            data.dispatcher = function (event) {

                if (data.disabled) return;
                event = fixEvent(event);

                var handlers = data.handlers[event.type];       //#7
                if (handlers) {
                    for (var n = 0; n < handlers.length; n++) {   //#7
                        handlers[n].call(elem, event);              //#7
                    }
                }
            };
        }

        if (data.handlers[type].length == 1) {              //#8
            if (document.addEventListener) {
                elem.addEventListener(type, data.dispatcher, false);
            }
            else if (document.attachEvent) {
                elem.attachEvent("on" + type, data.dispatcher);
            }
        }

    };

    function tidyUp(elem, type) {

        function isEmpty(object) {                          //#1
            for (var prop in object) {
                return false;
            }
            return true;
        }

        var data = getData(elem);

        if (data.handlers[type].length === 0) {             //#2

            delete data.handlers[type];

            if (document.removeEventListener) {
                elem.removeEventListener(type, data.dispatcher, false);
            }
            else if (document.detachEvent) {
                elem.detachEvent("on" + type, data.dispatcher);
            }
        }

        if (isEmpty(data.handlers)) {                        //#3 no types at all left?
            delete data.handlers;
            delete data.dispatcher;
        }

        if (isEmpty(data)) {                                 //#4 no handlers at all?
            removeData(elem);
        }
    }

    this.removeEvent = function (elem, type, fn) {       //#1 variable length argument list

        var data = getData(elem);                          //#2 fetch data

        if (!data.handlers) return;                        //#3 no handlers!

        var removeType = function(t){                      //#4 utility function
            data.handlers[t] = [];
            tidyUp(elem,t);
        };

        if (!type) {                                       //#5 remove all types
            for (var t in data.handlers) removeType(t);
            return;
        }

        var handlers = data.handlers[type];                 //#6 get handlers for type
        if (!handlers) return;

        if (!fn) {                                          //#7 remove all of type
            removeType(type);
            return;
        }

        if (fn.guid) {                                      //#8 remove one bound function?
            for (var n = 0; n < handlers.length; n++) {
                if (handlers[n].guid === fn.guid) {
                    handlers.splice(n--, 1);
                }
            }
        }
        tidyUp(elem, type);

    };

    this.proxy = function (context, fn) {
        if (!fn.guid) {
            fn.guid = nextGuid++;
        }
        var ret = function () {
            return fn.apply(context, arguments);
        };
        ret.guid = fn.guid;
        return ret;
    };

})();

function triggerEvent(elem, event) {

    var elemData = getData(elem),                         //#1 Fetch element data and parent reference.
        parent = elem.parentNode || elem.ownerDocument;

    if (typeof event === "string") {                      //#2 If passed as a string, create an event out out of it
        event = { type:event, target:elem };
    }
    event = fixEvent(event);                              //#3 Normalize the event

    if (elemData.dispatcher) {                             //#4 If the passed element has a dispatcher, execute the established handlers
        elemData.dispatcher.call(elem, event);
    }

    if (parent && !event.isPropagationStopped()) {        //#5 Unless explicitly stopped, recursively call this function to bubble the event up the DOM
        triggerEvent(parent, event);
    }

    else if (!parent && !event.isDefaultPrevented()) {    //#6 We're at the top of the DOM, so trigger the default action unless disabled

        var targetData = getData(event.target);

        if (event.target[event.type]) {                     //#7 If event has a default action for this event..

            targetData.disabled = true;                       //#8 Temporarily disable event dispatching on the target as we already executed the handler

            event.target[event.type]();                       //#9 Execute the default action

            targetData.disabled = false;                      //#10 Re-enable the delagator

        }

    }
}

(function () {

    var isReady = false,                                   //#A Start off assuming that we're not ready
        contentLoadedHandler;

    function ready() {                                     //#B Function that triggers the ready handler and records that fact
        if (!isReady) {
            triggerEvent(document, "ready");
            isReady = true;
        }
    }

    if (document.readyState === "complete") {               //#C If the DOM is already ready by the time we get here, fire the handler
        ready();
    }

    if (document.addEventListener) {                       //#D For W3C browsers, create a handler for the DOMContentLoaded event that fires off the ready handler and removes itself
        contentLoadedHandler = function () {
            document.removeEventListener(
                "DOMContentLoaded", contentLoadedHandler, false);
            ready();
        };

        document.addEventListener(                             //#E Establish the handler
            "DOMContentLoaded", contentLoadedHandler, false);

    }

    else if (document.attachEvent) {                        //#F For IE Event Model, create a handler that removes itself and fires the ready handler if the document readyState is complete
        contentLoadedHandler = function () {
            if (document.readyState === "complete") {
                document.detachEvent(
                    "onreadystatechange", contentLoadedHandler);
                ready();
            }
        };

        document.attachEvent(                                  //#G Establish the handler. Probably late, but is iframe-safe.
            "onreadystatechange", contentLoadedHandler);

        var toplevel = false;
        try {
            toplevel = window.frameElement == null;
        }
        catch (e) {
        }

        if (document.documentElement.doScroll && toplevel) {     //#H If not in an iframe try the scroll check
            doScrollCheck();
        }
    }

    function doScrollCheck() {                                  //#I Scroll check process for legacy IE
        if (isReady) return;
        try {
            document.documentElement.doScroll("left");
        }
        catch (error) {
            setTimeout(doScrollCheck, 1);
            return;
        }
        ready();
    }

//        addEvent(window, "load", function () {                       //#1
//
//            var handler = addEvent(elem, "click", function () {      //#3
//                this.style.backgroundColor =
//                    this.style.backgroundColor == '' ? 'green' : '';
//            });
//
//        });

})();

