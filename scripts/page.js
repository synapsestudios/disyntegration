var KeyboardEvent;

var oldBody, pageIsLoaded;

function Page(visible)
{
    this.$el = $('iframe#test-iframe');

    if (this.$el.length == 0) {
        this.$el = $('<iframe>', {
            id  : 'test-iframe',
            css : {
                height : visible ? $(document).height() : 0,
                width  : visible ? $(document).width() : 0
            }
        });

        $('body').prepend(this.$el);
    }

    this.$el[0].onload = function() {
        pageIsLoaded = true;
    };

    return this;
};

Page.prototype.click = function(selector) {
    var elements = this.find(selector);

    if (elements.length) {
        elements[0].click();
    } else {
        throw new Error('Cannot find element: "' + selector + '"');
    }

    return this;
};

// https://github.com/ariya/phantomjs/issues/11289
KeyboardEvent = function(name) {
    var event = document.createEvent('KeyboardEvent');
    event.initEvent(name, true, false);

    return event;
};

Page.prototype.fillField = function(selector, text) {
    var elements = this.find(selector);

    if (elements.length) {
        elements.val(text);
        elements[0].dispatchEvent(new KeyboardEvent('focus'));
        elements[0].dispatchEvent(new KeyboardEvent('keydown'));
        elements[0].dispatchEvent(new KeyboardEvent('keypress'));
        elements[0].dispatchEvent(new KeyboardEvent('input'));
        elements[0].dispatchEvent(new KeyboardEvent('change'));
        elements[0].dispatchEvent(new KeyboardEvent('keyup'));
    } else {
        throw new Error('Cannot find element: "' + selector + '"');
    }

    return this;
};

Page.prototype.find = function(selector) {
    return this.$el.contents().find(selector);
};

Page.prototype.getBody = function() {
    return this.find('html').html();
};

Page.prototype.setSrc = function(src) {
    this.$el.attr('src', src);

    pageIsLoaded = false;

    return this;
};

// Waits for a condition then executes a callback
Page.prototype.waitFor = function(condition, callback, timeout) {
    var self = this;

    if (typeof timeout !== 'number') {
        timeout = 5000;
    }

    if (timeout <= 0) {
        return false;
    }

    if(condition()) {
        callback();
    } else {
        setTimeout(function() {
            self.waitFor(condition, callback, timeout - 100);
        }, 100);
    }
};

// Executes callback as soon as the body changes
Page.prototype.waitForBodyChange = function(callback, timeout) {
    var self = this;

    this.waitFor(function() {
        if (! oldBody) {
            oldBody = self.getBody();
        }

        if (oldBody !== self.getBody()) {
            oldBody = null;

            return true;
        }

        return false;
    }, callback, timeout);
};

// Executes callback as soon as there is at least one of the selector present
Page.prototype.waitForElement = function(selector, callback, timeout) {
    var self = this;

    this.waitFor(function() {
        return self.find(selector).length;
    }, callback, timeout);
};

Page.prototype.waitForReady = function(callback, timeout) {
    this.waitFor(function() {
        return pageIsLoaded;
    }, callback, timeout);
};

// Deprecated as of v0.3.0
// Removing in v1.0.0
Page.prototype.hide = function(callback) {
    console.error('Page.hide is has been deprecated as of v0.3.0. Please use the --visible flag.');
    this.$el.css({
        height : 0,
        width  : 0
    });
};

Page.prototype.ready = function(callback) {
    console.error('Page.ready is has been deprecated as of v0.3.0. Please use Page.waitForReady.');
    this.$el.css({
        height : $(document).height(),
        width  : $(document).width()
    });
};

Page.prototype.show = function(callback) {
    console.error('Page.show is has been deprecated as of v0.3.0. Please use the --visible flag.');
    this.waitForReady(callback);
};

module.exports = Page;
window.Page    = module.exports;
