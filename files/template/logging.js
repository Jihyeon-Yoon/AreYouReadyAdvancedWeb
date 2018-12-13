// Initialize Firebase
var config = {
  apiKey: "AIzaSyA_-eCLWFI4rGFRheZab_B6YuwyBrYxn0s",
  authDomain: "areyouready-a2972.firebaseapp.com",
  databaseURL: "https://areyouready-a2972.firebaseio.com",
  projectId: "areyouready-a2972",
  storageBucket: "areyouready-a2972.appspot.com",
  messagingSenderId: "366382434226"
};
firebase.initializeApp(config);


firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithPopup(provider);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });





// Initialize Firebase
function login() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  var provider = new firebase.auth.GoogleAuthProvider();


  // 인증하기
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    var id = user.email;
    alert("로그인 되었습니다.");
    console.log(user) // 인증 후 어떤 데이터를 받아오는지 확인해보기 위함.
    $("#loginBtn").hide();
    $("#logoutBtn").show(); //...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}
//로그아웃
function logout() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  firebase.auth().signOut().then(() => {
    alert("로그아웃 되었습니다.");
    $("#loginBtn").show();
    $("#logoutBtn").hide();

  }).catch(function(error) {
    console.log('code:' + error.code + 'message' + error.message);
  });
}
