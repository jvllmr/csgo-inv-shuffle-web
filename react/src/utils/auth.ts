

export function is_authenticated(): boolean {
    return !(!getUserID())
}

export function getUserID(): string | null {
    return localStorage.getItem('steam64id')
}

export function deleteUserID() {
    localStorage.removeItem('steam64id')
}

export function setUserID(value: string) {
    localStorage.setItem('steam64id', value)
}