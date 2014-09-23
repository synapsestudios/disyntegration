function Iframe()
{
    this.$el = $('iframe#jasmine-iframe');

    if(this.$el.length == 0) {
        this.$el = $('<iframe id="jasmine-iframe" style="width:0;height:0"></iframe>');

        $('body').prepend(this.$el);
    }

    var isReady;
    var oldBody;

    this.$el[0].onload = function() {
        isReady = true;
    }

    this.setSrc = function (src)
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
    }

    var MouseEvent = function(name)
    {
        var event = document.createEvent('MouseEvents');
        event.initEvent(name, true, false);

        return event;
    }

    var pageContainsText = function(text)
    {
        var pageContent = (document.documentElement.textContent || document.documentElement.innerText);

        return (pageContent.indexOf(text) > -1);
    };

    this.click = function(selector)
    {
        console.log(selector);
        this.find(selector)[0].dispatchEvent(new MouseEvent('click'));
        this.find(selector)[0].dispatchEvent(new MouseEvent('mousedown'));
        this.find(selector)[0].dispatchEvent(new MouseEvent('mouseup'));
    };

    this.fillIn = function(selector, text)
    {
        this.find(selector).val(text);
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('focus'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keydown'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keypress'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('input'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('change'));
        this.find(selector)[0].dispatchEvent(new KeyboardEvent('keyup'));
    };

    this.find = function(selector)
    {
        return this.$el.contents().find(selector);
    };

    this.ready = function(fun)
    {
        var self = this;

        if (! isReady) {
            setTimeout(function() { self.ready(fun) }, 200);
        } else {
            fun();
        }
    };

    this.waitFor = function(condition, fun, maxTimeout)
    {
        var maxTimeout, self;

        self = this;

        maxTimeout = maxTimeout || 1000;

        if(maxTimeout <= 0) {
            return false;
        }

        if(condition()) {
            fun();
        } else {
            setTimeout(function() { self.waitFor(condition, fun, maxTimeout - 100) }, 100);
        }
    };

    this.waitForText = function(text, fun, _maxTimeout)
    {
        this.waitFor(_.partial(pageContainsText, text), fun, _maxTimeout);
    };

    this.onBodyChange = function(done)
    {
        var self = this;

        if(!oldBody) {
            oldBody = this.body();
        }

        if(oldBody == this.body()) {
            setTimeout(function() { self.onBodyChange(done) }, 200);
        } else {
            oldBody = undefined;
            done();
        }
    };

    this.show = function()
    {
        this.$el.css('width', $(document).width());
        this.$el.css('height', $(document).height());
    };

    this.hide = function()
    {
        this.$el.css('width', 0);
        this.$el.css('height', 0);
    };

    this.body = function() {
        return this.find('html').html();
    }
}

function visit(path)
{
    var iframe = new Iframe();

    iframe.setSrc(document.location.origin + path)

    return iframe;
}

