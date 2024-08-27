const users = [];

//join user to chat
function userJoin(id, username, room){
    const user = {id, username, room};

    //add user to the array
    users.push(user);
    return user;
}

//function to get the current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//user leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id ===id);
    
    //if it doesnt find it, it returns a negative 1
    if(index !== -1){
        //return the users array without that user
        return users.splice(index, 1)[0];
    }
}

//Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports ={
    userJoin, getCurrentUser, userLeave, getRoomUsers
}