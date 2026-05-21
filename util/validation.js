function isValidUsername(username){
    if (!username) return false;

    return /^[a-zA-Z0-9_]{3-16}$/.test(username); //regex.
}

module.exports = {
    isValidUsername
};