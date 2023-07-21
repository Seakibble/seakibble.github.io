function makeURLFriendly(text) {
    return text.replaceAll(' ', '_').replaceAll("'", "").toLowerCase()
}