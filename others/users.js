let users = [];

function join(id, username, room){
    const user = {id, username, room};

    users.push(user);
    return user;
}

function getCurrentUser(id){
    users.find(user=> user.id === id);
};

function removeUser(id) {
    const index = users.findIndex(user=> user.id === id);
    if(index != -1) {
        return users.splice(index, 1)[0];
    }
}

function getAllUsername() {
    return users.map(user => user.username);
}

module.exports = {
    join,
    getCurrentUser,
    removeUser,
    getAllUsername
}