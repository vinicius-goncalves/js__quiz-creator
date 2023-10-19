import StorageManager from './storage-manager.js'

const adminModeWrapper = document.querySelector('.admin-mode-wrapper')
const adminButton = adminModeWrapper.querySelector('[data-navbar="admin-mode"]')

const preferences = new StorageManager('preferences')

async function getStatus() {
    const { adminMode } = await preferences.get()
    return adminMode == true
}

async function loadStatus() {
    const isAdminModeActive = await getStatus()
    adminButton.textContent = isAdminModeActive ? 'Admin: ON' : 'Admin: OFF'
}

async function update(newStatus) {

    const previousPreferences = await preferences.get()
    const newPreferences = { ...previousPreferences, adminMode: newStatus }

    preferences.set(newPreferences, true)
    await loadStatus()
}

async function toggle() {
    const isAdminModeActive = await getStatus()
    await update(!isAdminModeActive)
}

export {
    getStatus,
    loadStatus,
    update,
    toggle
}