function Iframe()
{
    var isReady;
    var oldBody;

    this.$el = $('iframe#test-iframe');

    if (this.$el.length == 0) {
        this.$el = $('<iframe id="test-iframe" style="width:0;height:0"></iframe>');

        $('body').prepend(this.$el);
    }

    this.$el[0].onload = function() {
        isReady = true;
    };

    this.setSrc = function(src) {
        this.$el.attr('src', src);

        isReady = false;
    };

    // https://github.com/ariya/phantomjs/issues/11289

    var KeyboardEvent = function(name) {
        var event = document.createEvent('KeyboardEvent');
        event.initEvent(name, true, false);

        return event;
    };

    this.click = function(selector) {
        var elements = this.find(selector);

        if (elements.length) {
            elements[0].click();
        }

        return this;
    };

    this.fillField = function(selector, text) {
        this.find(selector).val(text);
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('focus'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keydown'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keypress'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('input'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('change'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keyup'));

        return this;
    };

    this.getBody = function() {
        return this.find('html').html();
    };

    this.find = function(selector) {
        return this.$el.contents().find(selector);
    };

    this.hide = function() {
        this.$el.css('width', 0);
        this.$el.css('height', 0);

        return this;
    };

    this.ready = function(callback) {
        var self = this;

        if (! isReady) {
            setTimeout(function() { self.ready(callback) }, 200);
        } else {
            callback();
        }

        return this;
    };

    this.show = function() {
        this.$el.css('width', $(document).width());
        this.$el.css('height', $(document).height());

        return this;
    };

    // Waits for a condition then executes a callback
    this.waitFor = function(condition, callback, timeout) {
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
            setTimeout(function() { self.waitFor(condition, callback, timeout - 100) }, 100);
        }
    };

    // Executes callback as soon as the body changes
    this.waitForBodyChange = function(callback, timeout) {
        var self = this;

        this.waitFor(function() {
            if (! oldBody) {
                oldBody = self.getBody();
            }

            return oldBody !== self.getBody();
        }, callback, timeout);
    };

    // Executes callback as soon as there is at least one of the selector present
    this.waitForElement = function(selector, callback, timeout) {
        var self = this;

        this.waitFor(function() {
            return self.find(selector).length;
        }, callback, timeout);
    };
};

function visit(path) {
    var iframe = new Iframe();

    iframe.setSrc(document.location.origin + path)

    return iframe;
};
