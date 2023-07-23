function makeURLFriendly(text) {
    let output = text
    if (output !== undefined) output = output.replaceAll(' ', '_').replaceAll("'", "").toLowerCase()
    else output = ''
    return output
}