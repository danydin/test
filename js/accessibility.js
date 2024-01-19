class Accessibility {
    constructor(elementName, elementToogle, elementDoc) {
        this.elementName = elementName;
        this.elementToogle = elementToogle;
        this.elementDoc = elementDoc;
    }

    choiceElement() {
        if (document.querySelector(this.elementName).classList.contains('font-increase') == false) {
            document.querySelector(this.elementName).classList.toggle('active');
            document.querySelector(this.elementDoc).classList.toggle(this.elementToogle);
        } else {
            this.countClick();
        }
        this.saveSelect();
    }

    saveSelect() {
        let key = document.querySelector(this.elementName).getAttribute('class').replace('access-element', '').replace('active', '').replace('tab-focused', '').trim();
        if (document.querySelector(this.elementName).classList.contains('active')) {
            document.querySelector(this.elementName).getAttribute('aria-label', document.querySelector(this.elementName).querySelector('p').textContent + ' מופעל');
            localStorage.setItem('accesability-' + key, key);
        } else {
            document.querySelector(this.elementName).getAttribute('aria-label', false);
            localStorage.removeItem('accesability-' + key);
        }
    }

    countClick() {
        let thisElement = document.querySelector(this.elementName);

        if (fontSizeLevel < 4) {
            fontSizeLevel++;
            thisElement.classList.add('active');
        } else {
            fontSizeLevel = 0;
            thisElement.classList.remove('active');
        }
    }
}

let keyboardNav = new Accessibility('.accessibility-menu .keyboard-activate', 'keyboard-nav', 'body');
let accessLink = new Accessibility('.accessibility-menu .highlight-links', 'access-link', 'body');
let readable = new Accessibility('.accessibility-menu .readable-font', 'readable', 'body');
let inverted = new Accessibility('.accessibility-menu .invert', 'inverted', 'html');
let greyscale = new Accessibility('.accessibility-menu .greyscale-mode', 'greyscale', 'html');
let fontIncrease = new Accessibility('.accessibility-menu .font-increase');

var fontSizeLevel = 0;
let allElementAccess = document.querySelectorAll('.accessibility-menu li.access-element');

for (let i = 0; i < allElementAccess.length; i++) {
    let selectTab = allElementAccess[i];
    selectTab.addEventListener('click', () => {
        if (selectTab.classList.contains('keyboard-activate')) keyboardNav.choiceElement();
        if (selectTab.classList.contains('highlight-links')) accessLink.choiceElement();
        if (selectTab.classList.contains('readable-font')) readable.choiceElement();
        if (selectTab.classList.contains('invert')) inverted.choiceElement();
        if (selectTab.classList.contains('greyscale-mode')) greyscale.choiceElement();
        if (selectTab.classList.contains('font-increase')) fontIncrease.choiceElement();
    });
}

document.addEventListener('keyup', function (e) {
    if (e.code == 'Tab' || e.code == 'Enter') {
        let allSelectTabs = document.querySelectorAll('.tab-focused');
        for (let i = 0; i < allSelectTabs.length; i++) {
            let selectTab = allSelectTabs[i];
            selectTab.classList.remove('tab-focused');
        }

        let selectTab = document.activeElement;
        selectTab.classList.add('tab-focused');
        let hassClassTab = selectTab.classList.contains('tab-focused');

        if (e.code == "Enter" && hassClassTab) {
            if (hassClassTab && selectTab.classList.contains('keyboard-activate')) keyboardNav.choiceElement();
            if (hassClassTab && selectTab.classList.contains('highlight-links')) accessLink.choiceElement();
            if (hassClassTab && selectTab.classList.contains('readable-font')) readable.choiceElement();
            if (hassClassTab && selectTab.classList.contains('invert')) inverted.choiceElement();
            if (hassClassTab && selectTab.classList.contains('greyscale-mode')) greyscale.choiceElement();
            if (hassClassTab && selectTab.classList.contains('font-increase')) fontIncrease.choiceElement();
        }
    }

});

(function ($) {
    $(document).on('click', '#accessibility-btn', function () {
        $(this).toggleClass('open');
        if ($(this).hasClass('open')) {
            $(this).attr('aria-expanded', 'true');
        } else {
            $(this).attr('aria-expanded', 'false');
        }

        $('.accessibility-menu').toggleClass('open');
    });

    $(document).on('click', '.accessibility-menu .close', function (e) {
        e.preventDefault();

        $('#accessibility-btn').removeClass('open');
        $('#accessibility-btn').attr('aria-expanded', 'false');
        $('.accessibility-menu').removeClass('open');
    })

    $(document).ready(function () {
        $('h1,h2,h3,h4,h5,h6,p,div,a,span').each(function () {
            $(this).data('font-size', $(this).css('font-size'));
        });
    });

    $(document).on('click', '.accessibility-menu .font-increase', function () {
        $('h1,h2,h3,h4,h5,h6,p,div,a,span').each(function () {
            if (!($(this).hasClass('access-element') || $(this).parent().hasClass('access-element'))) {
                curSize = parseInt($(this).data('font-size'));
                newSize = curSize + curSize * (fontSizeLevel / 5);
                newSize = curSize + curSize * (fontSizeLevel / 5);
                $(this).css('font-size', newSize + 'px');
            }
        });
    });

    $(document).on('keyup', function (e) {
        if (e.code == "Enter" && document.activeElement.classList.contains('font-increase')) {
            $('h1,h2,h3,h4,h5,h6,p,div,a,span').each(function () {
                if (!($(this).hasClass('access-element') || $(this).parent().hasClass('access-element'))) {
                    curSize = parseInt($(this).data('font-size'));
                    newSize = curSize + curSize * (fontSizeLevel / 5);
                    $(this).css('font-size', newSize + 'px');
                }
            });
        }
    });

    for (item in localStorage) {
        if (typeof item == 'string') {
            if (~item.indexOf('accesability')) {
                $('.accessibility-menu .' + localStorage[item]).trigger('click');
            }
        }
    };

})(jQuery);

