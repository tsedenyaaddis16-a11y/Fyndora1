import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, amPhrases } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('fyndora_lang');
      if (saved === 'en' || saved === 'am') return saved;
    } catch (e) {
      console.warn('Could not read language from localStorage', e);
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('fyndora_lang', language);
      document.documentElement.lang = language;
      if (language === 'am') {
        document.documentElement.classList.add('lang-amharic');
      } else {
        document.documentElement.classList.remove('lang-amharic');
      }
    } catch (e) {}
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'am') {
      setLanguageState(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'am' : 'en'));
  };

  // Translation helper function
  const t = useCallback((keyOrPhrase, fallback = '') => {
    if (!keyOrPhrase) return '';
    const currentDict = translations[language] || translations.en;
    if (currentDict && currentDict[keyOrPhrase] !== undefined) {
      return currentDict[keyOrPhrase];
    }
    if (language === 'am') {
      if (amPhrases[keyOrPhrase] !== undefined) {
        return amPhrases[keyOrPhrase];
      }
      const trimmed = String(keyOrPhrase).trim();
      if (amPhrases[trimmed] !== undefined) {
        return amPhrases[trimmed];
      }
      if (trimmed.endsWith(':') && amPhrases[trimmed.slice(0, -1).trim()]) {
        return amPhrases[trimmed.slice(0, -1).trim()] + '፡';
      }
    }
    // Fallback to English translation
    if (translations.en && translations.en[keyOrPhrase] !== undefined) {
      return translations.en[keyOrPhrase];
    }
    return fallback || keyOrPhrase;
  }, [language]);

  // Translate any general phrase/category/status
  const tr = useCallback((text) => {
    if (!text || language !== 'am') return text;
    const trimmed = String(text).trim();
    return amPhrases[trimmed] || amPhrases[text] || t(text, text);
  }, [language, t]);

  // Comprehensive DOM Text Node and Attributes auto-translator for all words matching amPhrases
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const originalTextMap = new WeakMap();

    const getAmharicForText = (trimmed) => {
      // 1. Direct dictionary match
      if (amPhrases[trimmed]) return amPhrases[trimmed];

      // 2. Trailing colon
      if (trimmed.endsWith(':')) {
        const withoutColon = trimmed.slice(0, -1).trim();
        if (amPhrases[withoutColon]) {
          return amPhrases[withoutColon] + '፡';
        }
      }

      // 3. Dynamic patterns
      // "Showing X active opportunities"
      const matchActive = trimmed.match(/^Showing\s+(\d+)\s+active opportunities$/i);
      if (matchActive) return `${matchActive[1]} ንቁ እድሎች እየታዩ ነው`;

      // "Showing X opportunities"
      const matchOpp = trimmed.match(/^Showing\s+(\d+)\s+opportunities$/i);
      if (matchOpp) return `${matchOpp[1]} እድሎች እየታዩ ነው`;

      // "X filter(s) applied"
      const matchFilter = trimmed.match(/^(\d+)\s+filters?\s+applied$/i);
      if (matchFilter) return `${matchFilter[1]} ማጣሪያዎች ተመርጠዋል`;

      // "Question X of Y"
      const matchQ = trimmed.match(/^Question\s+(\d+)\s+of\s+(\d+)$/i);
      if (matchQ) return `ጥያቄ ${matchQ[1]} ከ ${matchQ[2]}`;

      // "X% Completed"
      const matchComp = trimmed.match(/^(\d+)%\s+Completed$/i);
      if (matchComp) return `${matchComp[1]}% ተጠናቋል`;

      // "X% Ready"
      const matchReady = trimmed.match(/^(\d+)%\s+Ready$/i);
      if (matchReady) return `${matchReady[1]}% ዝግጁ`;

      // "Offered by X"
      if (trimmed.startsWith('Offered by ')) {
        const prov = trimmed.replace('Offered by ', '');
        return `አቅራቢ ድርጅት፡ ${prov}`;
      }

      // "Destination: X"
      if (trimmed.startsWith('Destination: ')) {
        const dest = trimmed.replace('Destination: ', '');
        const transDest = amPhrases[dest] || dest;
        return `መዳረሻ፡ ${transDest}`;
      }

      // "Submitted on X"
      if (trimmed.startsWith('Submitted on ')) {
        const date = trimmed.replace('Submitted on ', '');
        return `የተላከበት ቀን፡ ${date}`;
      }

      // "Deadline in X days"
      const matchDays = trimmed.match(/^Deadline in\s+(\d+)\s+days$/i);
      if (matchDays) return `የቀረው ጊዜ፡ ${matchDays[1]} ቀናት`;

      return null;
    };

    const translateSubtree = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (!text) return;
        const trimmed = text.trim();
        if (!trimmed) return;

        if (language === 'am') {
          const amharic = getAmharicForText(trimmed);
          if (amharic) {
            if (!originalTextMap.has(node)) {
              originalTextMap.set(node, text);
            }
            node.nodeValue = text.replace(trimmed, amharic);
          }
        } else {
          if (originalTextMap.has(node)) {
            node.nodeValue = originalTextMap.get(node);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (
          tag === 'script' ||
          tag === 'style' ||
          tag === 'code' ||
          tag === 'pre'
        ) {
          return;
        }

        // Translate Placeholders on inputs / textareas
        if (node.hasAttribute && node.hasAttribute('placeholder')) {
          const ph = node.getAttribute('placeholder');
          if (ph) {
            const phTrimmed = ph.trim();
            if (language === 'am') {
              const amPh = amPhrases[phTrimmed] || getAmharicForText(phTrimmed);
              if (amPh) {
                if (!node.hasAttribute('data-fyndora-orig-ph')) {
                  node.setAttribute('data-fyndora-orig-ph', ph);
                }
                node.setAttribute('placeholder', amPh);
              }
            } else {
              if (node.hasAttribute('data-fyndora-orig-ph')) {
                node.setAttribute('placeholder', node.getAttribute('data-fyndora-orig-ph'));
              }
            }
          }
        }

        // Translate Title / Tooltips
        if (node.hasAttribute && node.hasAttribute('title')) {
          const tit = node.getAttribute('title');
          if (tit) {
            const titTrimmed = tit.trim();
            if (language === 'am') {
              const amTit = amPhrases[titTrimmed];
              if (amTit) {
                if (!node.hasAttribute('data-fyndora-orig-tit')) {
                  node.setAttribute('data-fyndora-orig-tit', tit);
                }
                node.setAttribute('title', amTit);
              }
            } else {
              if (node.hasAttribute('data-fyndora-orig-tit')) {
                node.setAttribute('title', node.getAttribute('data-fyndora-orig-tit'));
              }
            }
          }
        }

        // Traverse child nodes
        for (let i = 0; i < node.childNodes.length; i++) {
          translateSubtree(node.childNodes[i]);
        }
      }
    };

    const rootEl = document.getElementById('root') || document.body;
    translateSubtree(rootEl);

    // Watch for dynamic route / page changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          translateSubtree(mutation.addedNodes[i]);
        }
      }
    });

    observer.observe(rootEl, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [language]);

  const isAmharic = language === 'am';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        tr,
        isAmharic,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
