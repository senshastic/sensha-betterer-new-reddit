
// ==UserScript==
// @name        Reddit Style Modifier (Shadow DOM Targets)
// @version     2.4.0
// @namespace   Violentmonkey Scripts
// @description Styles specific elements in multiple shadow DOMs
// @match       https://www.reddit.com/*
// @grant       none
// ==/UserScript==

(function () {
    'use strict';

    console.log("🔍 Script started: Targeting shadow DOM elements...");

    // Define styles for both elements
    const styleText = `
        /* Original selected element */
        a.flex.justify-between.relative.px-md.gap-\\[0\\.5rem\\].text-secondary-onBackground.bg-neutral-background-selected.hover\\:bg-neutral-background-selected.hover\\:bg-neutral-background-hover.hover\\:no-underline.cursor-pointer.py-2xs.-outline-offset-1.s\\:rounded-\\[8px\\].no-underline {
            box-shadow: 0px 2px 0px 0px #FFFFFF0f,
                  0px 2px 8px 0px #00000040,
                  inset 0px 8px 8px 0px #FFFFFF07 !important;
            outline: 1px solid #ffffff10 !important;
            outline-offset: -1px !important;
            background-color: transparent !important;
        }

                /* Hover effect for non-selected items */
        a.flex.justify-between.relative.px-md.gap-\\[0\\.5rem\\].text-secondary.hover\\:text-secondary-hover.active\\:bg-interactive-pressed.hover\\:bg-neutral-background-hover.hover\\:no-underline.cursor-pointer.py-2xs.-outline-offset-1.s\\:rounded-\\[8px\\].bg-transparent.no-underline:not([rpl-selected]):hover {
            box-shadow: 0px 2px 0px 0px #FFFFFF0f,
                  0px 2px 8px 0px #00000040,
                  inset 0px 8px 8px 0px #FFFFFF07 !important;
            outline: 1px solid #ffffff10 !important;
            outline-offset: -1px !important;
            background-color: transparent !important;
        }

        /* New hover style for specific elements */
        .flex.justify-between.relative.px-md.gap-\\[0\\.5rem\\].text-secondary.hover\\:text-secondary-hover.active\\:bg-interactive-pressed.hover\\:bg-neutral-background-hover.hover\\:no-underline.cursor-pointer.py-xs.-outline-offset-1.no-underline:hover {
            box-shadow: 0px 2px 0px 0px #FFFFFF0f,
                  0px 2px 8px 0px #00000040,
                  inset 0px 8px 8px 0px #FFFFFF07 !important;
            outline: 1px solid #ffffff10 !important;
            outline-offset: -1px !important;
            background-color: transparent !important;
        }

        /* Search results container */
        .max-h-\\[calc\\(100vh-var\\(--shreddit-header-height\\)-15px-10px\\)\\].overflow-y-auto.overflow-x-hidden.m-t {
                    background-color: rgba(5, 5, 5, .18) !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(100px) saturate(110%);
        -webkit-backdrop-filter: blur(100px);
        transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        border-radius: 0 0 12px 12px !important;
        }

        /* Search bar styling */
        .reddit-search-bar {
            background: transparent !important;
            box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.3),
                       5px 5px 15px rgba(0, 0, 0, 0.1),
                       inset 5px 5px 10px rgba(0, 0, 0, 0.05),
                       inset -5px -5px 10px rgba(255, 255, 255, 0.1);
            font-size: 15px;
        }

        shreddit-post-share-button{
            display: none !important
        }
    `;

    // List of shadow hosts to target
    const shadowHostSelectors = [
        'left-nav-top-section',    // Navigation section
        'reddit-search-large',      // Search bar container
        'shreddit-post'
    ];

    function injectStylesIntoShadowRoots() {
        shadowHostSelectors.forEach(selector => {
            const host = document.querySelector(selector);
            if (host?.shadowRoot) {
                const shadowRoot = host.shadowRoot;
                const styleElement = document.createElement('style');
                styleElement.textContent = styleText;

                // Clear previous styles and re-inject
                const oldStyle = shadowRoot.querySelector('style');
                if (oldStyle) oldStyle.remove();

                shadowRoot.appendChild(styleElement);
                console.log(`✅ Styles injected into ${selector} shadow root`);

                // Handle nested shadow roots
                shadowRoot.querySelectorAll('*').forEach(node => {
                    if (node.shadowRoot) {
                        const nestedStyle = document.createElement('style');
                        nestedStyle.textContent = styleText;
                        node.shadowRoot.appendChild(nestedStyle);
                    }
                });
            }
        });
    }

    // Initial injection
    injectStylesIntoShadowRoots();

    // Debounced MutationObserver
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(injectStylesIntoShadowRoots, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("👀 Observer started");
})();

