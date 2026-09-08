// Central auth store — replaces the old 1-second localStorage polling.
// Components write to localStorage (as before) and then call emitAuthChange()
// so every listener updates instantly.

export const AUTH_EVENT = 'bp-auth-change';

export const emitAuthChange = () => {
    window.dispatchEvent(new Event(AUTH_EVENT));
};

export const getIsLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';

export const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem('userData') || 'null');
    } catch {
        return null;
    }
};

export const subscribeAuth = (callback) => {
    window.addEventListener('storage', callback);
    window.addEventListener(AUTH_EVENT, callback);
    return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener(AUTH_EVENT, callback);
    };
};
