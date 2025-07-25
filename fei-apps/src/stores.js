import { writable } from 'svelte/store'

export const isDarkModeEnabled= writable(false);
export const userStatus = writable("offline");
export const statusColor = writable("");
export const loggedIn = writable(false);
export const loggedUser = writable("");


//Notification
export const isNotificationVisible = writable(false);
export const notificationText = writable("");
export const notificationType = writable("");

// Aktualne spustena aplikacia
export const currentApp = writable("");


//Portal
export const isChatModalOpen = writable(false);
export const isChatListOpen = writable(false);
export const currentChat = writable("");
export const isTutorialActive = writable(true);

export const isAskingOnPersonalDocs = writable(false);

//Settings
export const storageOptions = writable([]);
export const roleOptions = writable([]);
export const permissions = writable([]);

// Funzone
export const isPlayingGame = writable(false);
export const playedGame = writable("");

