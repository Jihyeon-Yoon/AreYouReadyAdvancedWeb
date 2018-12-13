function writeBook() {
  var user = firebase.auth().currentUser;

  var bookTitle = document.getElementById("bookTitle").value;
  var readDate = document.getElementById("readDate").value;
  var bookData = {
    bookTitle: bookTitle,
    readDate: readDate
  };

  var newBookKey = firebase.database().ref('userinfo/' + user.displayName).child('bookList').push().key;
  var updates = {};
  updates['userinfo/' + user.displayName + '/bookList/' + newBookKey] = bookData;

  return firebase.database().ref().update(updates);

}

function bookPlus() {
  var user = firebase.auth().currentUser;
  var n = parseInt($("#bookNum").text());
  if (n < 40)
    n++;
  $("#bookNum").text(n);

  firebase.database().ref('userinfo/' + user.displayName).once('value', function(snapshot) {
    var data = snapshot.val();
    var bookNum = data.bookN;
    var n = parseInt(bookNum);
    n++;

    firebase.database().ref('/userinfo/' + user.displayName + '/bookN').set(n);

  });
}

function updateBook() {
  writeBook();
  bookPlus();
  alert("저장되었습니다.");
  pageReload();

}

function pageReload() {
  setTimeout(function() {

    location.reload();
  }, 1000);

}

function writeVoluntary() {
  var user = firebase.auth().currentUser;
  var volunPlace = document.getElementById("volunPlace").value;
  var thisVolunNum = document.getElementById("thisVolunNum").value;
  var thisVolunTime = document.getElementById("thisVolunTime").value;

  var volunData = {
    volunPlace: volunPlace,
    volunNum: thisVolunNum,
    volunTime: thisVolunTime
  };
  var newVolunKey = firebase.database().ref('userinfo/' + user.displayName).child('volunList').push().key;
  var updates = {};
  updates['userinfo/' + user.displayName + '/volunList/' + newVolunKey] = volunData;
  return firebase.database().ref().update(updates);

}

function volunPlus() {
  var user = firebase.auth().currentUser;
  firebase.database().ref('userinfo/' + user.displayName).once('value', function(snapshot) {
    var data = snapshot.val();
    var volunNum = parseInt(data.volunN);
    var curVolunNum = parseInt(thisVolunNum.value);
    var volunTime = parseInt(data.volunT);
    var curVolunTime = parseInt(thisVolunTime.value);
    var n1 = volunNum+curVolunNum;
    var n2 =volunTime+curVolunTime;
    firebase.database().ref('/userinfo/' + user.displayName + '/volunN').set(n1);
    firebase.database().ref('/userinfo/' + user.displayName + '/volunT').set(n2);


  });
}

function updateVolun() {
  writeVoluntary();
  volunPlus();
  alert("저장되었습니다.");
  pageReload();
}

firebase.auth().onAuthStateChanged(function(user) {

  if (user) {
    $("#loginBtn").hide();
  } else {
    alert("로그인이 필요합니다.");
    login();
  }
  firebase.database().ref('/userinfo/' + user.displayName + '/bookN').once('value').then(function(snapshot) {
    bookN = snapshot.val();
    if (bookN == null) {
      firebase.database().ref('userinfo/' + user.displayName).set({

        bookN: 0,
        volunN: 0,
        volunT: 0,
        creditN: 0
      });
    }
  });
  if (user != null) {
    firebase.database().ref('userinfo/' + user.displayName + '/bookList').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        var title = childData.bookTitle;
        var date = childData.readDate;

        var tbody = document.getElementById('book_body');

        var row = tbody.insertRow(tbody.rows.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = title;
        cell2.innerHTML = date;
      });

    });

    firebase.database().ref('userinfo/' + user.displayName + '/volunList').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        var volunP = childData.volunPlace;
        var volunN = childData.volunNum;
        var volunT = childData.volunTime;
        var tbody = document.getElementById('volun_body');

        var row = tbody.insertRow(tbody.rows.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = volunP;
        cell2.innerHTML = volunN;
        cell3.innerHTML = volunT;

      });
    });
    firebase.database().ref('user/' + user.displayName+'/gradePoint').once('value', function(snapshot) {
      var gradeP = snapshot.val();
      var creditNum=0;
      if(gradeP!=null) {
      creditNum = parseInt(gradeP);
    } else {
      firebase.database().ref('/user/' + user.displayName + '/gradePoint').set(0);
    }
      $("#creditNum").text(creditNum);
      $("#creditValue").attr("value", creditNum);


    });
    firebase.database().ref('userinfo/' + user.displayName).once('value', function(snapshot) {
      var data = snapshot.val();
      var bookNum = parseInt(data.bookN);
      var nowVolunNum=parseInt(data.volunN);
      var volunTime=parseInt(data.volunT);


      $("#bookNum").text(bookNum);
      $("#bookNumValue").attr("value", bookNum);
      $("#volunNum").text(nowVolunNum);
      $("#volunNumValue").attr("value",nowVolunNum);
      $("#volunTime").text(volunTime);
      $("#volunTimeValue").attr("value",volunTime);

    });
  }
});
