import { writable } from 'svelte/store'

export const isDarkModeEnabled= writable(false);
export const userStatus = writable("offline");
export const statusColor = writable("");
export const loggedIn = writable(false);
export const loggedUser = writable("");

// Aktualne spustena aplikacia
export const currentApp = writable("");


//Portal
export const isChatModalOpen = writable(false);