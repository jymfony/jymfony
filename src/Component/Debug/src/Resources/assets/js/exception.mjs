class Jfjs {
    /**
     * Constructor.
     *
     * @param {Document} document
     */
    constructor(document) {
        /**
         * @type {Document}
         *
         * @private
         */
        this._document = document;
    }

    createTabs() {
        const tabGroups = Array.prototype.slice.call(this._document.querySelectorAll('.jf-tabs:not([data-processed=true])'));

        /* Create the tab navigation for each group of tabs */
        for (let i = 0; i < tabGroups.length; i++) {
            const tabs = tabGroups[i].querySelectorAll(':scope > .tab');
            const tabNavigation = this._document.createElement('ul');
            tabNavigation.className = 'tab-navigation';

            let selectedTabId = 'tab-' + i + '-0'; /* Select the first tab by default */
            for (let j = 0; j < tabs.length; j++) {
                const tabId = 'tab-' + i + '-' + j;
                const tabTitle = tabs[j].querySelector('.tab-title').innerHTML;

                const tabNavigationItem = document.createElement('li');
                tabNavigationItem.dataset.tabId = tabId;
                if (tabs[j].classList.contains('active')) {
                    selectedTabId = tabId;
                }
                if (tabs[j].classList.contains('disabled')) {
                    tabNavigationItem.classList.add('disabled');
                }
                tabNavigationItem.innerHTML = tabTitle;
                tabNavigation.appendChild(tabNavigationItem);

                const tabContent = tabs[j].querySelector('.tab-content');
                tabContent.parentElement.setAttribute('id', tabId);
            }

            tabGroups[i].insertBefore(tabNavigation, tabGroups[i].firstChild);
            this._document.querySelector('[data-tab-id="' + selectedTabId + '"]')
                .classList.add('active');
        }

        /* Display the active tab and add the 'click' event listeners */
        for (let i = 0; i < tabGroups.length; i++) {
            const tabNavigation = Array.prototype.slice.call(tabGroups[i].querySelectorAll(':scope >.tab-navigation li'));

            for (const tabElement of tabNavigation) {
                const tabId = tabElement.dataset.tabId;
                const element = this._document.getElementById(tabId);

                element.querySelector('.tab-title').className = 'hidden';
                element.className = tabElement.classList.contains('active') ? 'block' : 'hidden';

                tabElement.addEventListener('click', function(e) {
                    let activeTab = e.target;

                    /*
                     * Needed because when the tab contains HTML contents, user can click
                     * on any of those elements instead of their parent '<li>' element
                     */
                    while ('li' !== activeTab.tagName.toLowerCase()) {
                        activeTab = activeTab.parentNode;
                    }

                    /* Get the full list of tabs through the parent of the active tab element */
                    for (const navigationElement of Array.prototype.slice.call(activeTab.parentNode.children)) {
                        document.getElementById(navigationElement.dataset.tabId).className = 'hidden';
                        navigationElement.classList.remove('active');
                    }

                    activeTab.classList.add('active');
                    document.getElementById(activeTab.dataset.tabId).className = 'block';
                });
            }

            tabGroups[i].dataset.processed = 'true';
        }
    }

    createToggles() {
        const toggles = Array.prototype.slice.call(this._document.querySelectorAll('.jf-toggle:not([data-processed=true])'));

        for (const toggle of toggles) {
            const elementSelector = toggle.dataset.toggleSelector;
            if (! elementSelector) {
                continue;
            }

            const element = this._document.querySelector(elementSelector);
            element.classList.add('jf-toggle-content');

            if ('display' === toggle.dataset.toggleInitial) {
                toggle.classList.add('jf-toggle-on');
                element.classList.add('jf-toggle-visible');
            } else {
                toggle.classList.add('jf-toggle-off');
                element.classList.add('jf-toggle-hidden');
            }

            toggle.addEventListener('click', e => {
                e.preventDefault();

                if ('' !== window.getSelection().toString()) {
                    /* Don't do anything on text selection */
                    return;
                }

                const element = this._document.querySelector(toggle.dataset.toggleSelector);
                toggle.classList.toggle('jf-toggle-on');
                toggle.classList.toggle('jf-toggle-off');
                element.classList.toggle('jf-toggle-hidden');
                element.classList.toggle('jf-toggle-visible');

                /* The toggle doesn't change its contents when clicking on it */
                if (! toggle.dataset.altContent) {
                    return;
                }

                const currentContent = toggle.innerHTML;
                if (! toggle.dataset.toggleOriginalContent) {
                    toggle.dataset.toggleOriginalContent = currentContent;
                }

                const originalContent = toggle.dataset.toggleOriginalContent;
                const altContent = toggle.dataset.altContent;

                toggle.innerHTML = currentContent !== altContent ? altContent : originalContent;
            });

            /* Prevents from disallowing clicks on links inside toggles */
            for (const link of Array.prototype.slice.call(toggle.querySelectorAll('a'))) {
                link.addEventListener('click', e => e.stopPropagation());
            }

            toggle.dataset.processed = 'true';
        }
    }

    createFilters() {
        for (const filter of Array.prototype.slice.call(this._document.querySelectorAll('[data-filters] [data-filter]'))) {
            const filters = filter.closest('[data-filters]');
            let type = 'choice';
            const name = filter.dataset.filter;
            const ucName = name.charAt(0).toUpperCase()+name.slice(1);
            const list = document.createElement('ul');
            let values = filters.dataset['filter'+ucName] || filters.querySelectorAll('[data-filter-'+name+']');
            let labels = {};
            let defaults = null;
            const indexed = {};
            const processed = {};

            if ('string' === typeof values) {
                type = 'level';
                labels = values.split(',');
                values = values.toLowerCase().split(',');
                defaults = values.length - 1;
            }

            list.classList.add('filter-list', 'filter-list-'+type);
            let i = -1;
            for (let value of values) {
                ++i;
                if (value instanceof HTMLElement) {
                    value = value.dataset['filter'+ucName];
                }

                if (value in processed) {
                    return;
                }

                const option = this._document.createElement('li');
                const label = labels[i] || value;
                let active = false;
                let matches;

                if ('' === label) {
                    option.innerHTML = '<em>(none)</em>';
                } else {
                    option.innerText = label;
                }

                option.dataset.filter = value;
                option.setAttribute('title', 1 === (matches = filters.querySelectorAll('[data-filter-'+name+'="'+value+'"]').length) ? 'Matches 1 row' : 'Matches '+matches+' rows');

                indexed[value] = i;
                list.appendChild(option);
                option.addEventListener('click', () => {
                    if ('choice' === type) {
                        filters.querySelectorAll('[data-filter-'+name+']').forEach(row => {
                            if (option.dataset.filter === row.dataset['filter'+ucName]) {
                                row.classList.toggle('filter-hidden-'+name);
                            }
                        });

                        option.classList.toggle('active');
                    } else if ('level' === type) {
                        if (indexed[value] === option.parentNode.querySelectorAll('.active').length - 1) {
                            return;
                        }

                        const options = Array.prototype.slice.call(option.parentNode.querySelectorAll('li'));
                        let j = 0;
                        for (const currentOption of options) {
                            if (j > indexed[value]) {
                                currentOption.classList.remove('active', 'last-active');
                            } else {
                                currentOption.classList.add('active');
                                currentOption.classList[indexed[value] === j ? 'add' : 'remove']('last-active');
                            }

                            ++j;
                        }

                        const rows = Array.prototype.slice.call(filters.querySelectorAll('[data-filter-'+name+']'));
                        for (const row of rows) {
                            row.classList[indexed[value] < indexed[row.dataset['filter'+ucName]] ? 'add' : 'remove']('filter-hidden-'+name);
                        }
                    }
                });

                if ('choice' === type) {
                    active = null === defaults;
                } else if ('level' === type) {
                    active = i <= defaults;
                    if (active && i === defaults) {
                        option.classList.add('last-active');
                    }
                }

                if (active) {
                    option.classList.add('active');
                } else {
                    filters.querySelectorAll('[data-filter-'+name+'="'+value+'"]')
                        .forEach(row => row.classList.toggle('filter-hidden-'+name));
                }

                processed[value] = true;
            }

            if (1 < list.childNodes.length) {
                filter.appendChild(list);
                filter.dataset.filtered = '';
            }
        }
    }
}

const jfjs = new Jfjs(document);
jfjs.createTabs();
jfjs.createToggles();
jfjs.createFilters();
