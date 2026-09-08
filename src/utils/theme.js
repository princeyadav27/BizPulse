/**
 * BizPulse - Theme Management Utility
 * Supports 'light', 'dark', and 'system' appearance modes.
 */

export const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
    if (typeof document === 'undefined') return;
    let resolvedTheme = theme;
    if (theme === 'system') {
        resolvedTheme = getSystemTheme();
    }
    document.documentElement.setAttribute('data-theme', resolvedTheme);
};

export const getTheme = () => {
    if (typeof localStorage === 'undefined') return 'system';
    return localStorage.getItem('theme') || 'system';
};

export const setTheme = (newTheme) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    // Dispatch custom event to notify active React components
    window.dispatchEvent(new Event('themeChanged'));
};

let mediaQueryListener = null;

export const initTheme = () => {
    if (typeof window === 'undefined') return;
    
    const currentTheme = getTheme();
    applyTheme(currentTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (mediaQueryListener) {
        mediaQuery.removeEventListener('change', mediaQueryListener);
    }

    mediaQueryListener = () => {
        const theme = getTheme();
        if (theme === 'system') {
            applyTheme('system');
            window.dispatchEvent(new Event('themeChanged'));
        }
    };

    mediaQuery.addEventListener('change', mediaQueryListener);
};
