/* globals Cookies, Promise */

const addBoard2User = function(boardId) {
  firebase.database().ref("users/"+Cookies.get('userId')+"/boards/"+boardId).set(true).then(function () {
    //location.href="board.html?id="+boardId; 
  })
};

const login = function(email, password) {
  return new Promise(function(resolve, reject){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function() { // 作成成功
      console.log("ログインしました");
      const user = firebase.auth().currentUser;
      Cookies.set('userId', user.uid, { expires: 1 });
      console.log(Cookies.get("userId"));
      resolve(user);
    }).catch(function(error) { 
      reject(error);
    });
  });
};

const logout = function() {
  return new Promise(function(resolve, reject){
    firebase.auth().signOut().then(function() {
      console.log("ログアウトしました");
      Cookies.remove('userId');
      location.reload();
      resolve(true);
    }).catch(function(error) {
      reject(error);
    });
  });
};

const createGuestAccount = function () {
  return new Promise(function(resolve, reject){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function(user) {          
        firebase.auth().signInAnonymously()   
          .then(function(user) {
            resolve(user);
          })
          .catch(function(error) {              
            reject(error);
          });
      })  
      .catch(function(error) {
        reject(error);
      });
  });
};

const createUserAccount = function(email, name, password) {
  return new Promise(function(resolve, reject){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function(user) {  
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function() { // 作成成功
        firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
          name: name,
        }).then(function () {
          const user = firebase.auth().currentUser;
          const userId = user.uid;
          Cookies.set('userId', userId, { expires: 1 });
          resolve(user);
        });
      }).catch(function(error) { // 作成失敗
        reject(error);
      });
    }).catch(function(error) {
      reject(error);
    });
  });
};

const comvertGuest2Permanent = function(email, name, password) {
  return new Promise(function(resolve, reject){
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    
    firebase.auth().currentUser.linkWithCredential(credential).then(function(usercred) {
      const user = usercred.user;
      firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
        name: name,
      });
      resolve(user);
    }, function(error) {
      reject(error);
    });
  });
};