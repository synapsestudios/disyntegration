function Iframe()
{
    this.$el = $('iframe#jasmine-iframe');

    if (this.$el.length == 0) {
        this.$el = $('<iframe id="jasmine-iframe" style="width:0;height:0"></iframe>');

        $('body').prepend(this.$el);
    }

    var isReady;
    var oldBody;

    this.$el[0].onload = function() {
        isReady = true;
    };

    this.setSrc = function(src)
    {
        this.$el.attr('src', src);

        isReady = false;
    };

    // https://github.com/ariya/phantomjs/issues/11289

    var KeyboardEvent = function(name)
    {
        var event = document.createEvent('KeyboardEvent');
        event.initEvent(name, true, false);

        return event;
    };

    var MouseEvent = function(name)
    {
        var event = document.createEvent('MouseEvents');
        event.initEvent(name, true, false);

        return event;
    };

    this.click = function(selector)
    {
        var elements = this.find(selector);

        if (elements.length) {
            elements[0].dispatchEvent(new MouseEvent('click'));
            elements[0].dispatchEvent(new MouseEvent('mousedown'));
            elements[0].dispatchEvent(new MouseEvent('mouseup'));

            if ($(elements[0]).attr('href')) {
                isReady = false;
            }
        }

        return this;
    };

    this.fillField = function(selector, text)
    {
        this.find(selector).val(text);
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('focus'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keydown'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keypress'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('input'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('change'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keyup'));

        return this;
    };

    this.getBody = function()
    {
        return this.find('html').html();
    };

    this.find = function(selector)
    {
        return this.$el.contents().find(selector);
    };

    this.hide = function()
    {
        this.$el.css('width', 0);
        this.$el.css('height', 0);

        return this;
    };

    this.onBodyChange = function(done)
    {
        var self = this;

        if (! oldBody) {
            oldBody = this.getBody();
        }

        if (oldBody == this.getBody()) {
            setTimeout(function() { self.onBodyChange(done) }, 200);
        } else {
            oldBody = undefined;
            done();
        }
    };

    this.ready = function(callback)
    {
        var self = this;

        if (! isReady) {
            setTimeout(function() { self.ready(callback) }, 200);
        } else {
            callback();
        }

        return this;
    };

    this.show = function()
    {
        this.$el.css('width', $(document).width());
        this.$el.css('height', $(document).height());

        return this;
    };

    this.waitFor = function(condition, callback, maxTimeout)
    {
        var maxTimeout, self;

        self = this;

        maxTimeout = maxTimeout || 1000;

        if(maxTimeout <= 0) {
            return false;
        }

        if(condition()) {
            callback();
        } else {
            setTimeout(function() { self.waitFor(condition, callback, maxTimeout - 100) }, 100);
        }
    };
}

function visit(path)
{
    var iframe = new Iframe();

    iframe.setSrc(document.location.origin + path)

    return iframe;
}

