firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      $("#loginBtn").hide();
    } else {
      alert("로그인이 필요합니다.");
      login();
    }
});


function writePost() {

  var name = document.getElementById("writerName").value,
    subject = document.getElementById("subject").value,
    message = document.getElementById("postContext").value;
  var date = new Date();
  var time = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

  var postData = {

    Name: name,
    Subject: subject,
    Message: message,
    Time: time
  };

  var newPostKey = firebase.database().ref().child('board').push().key;

  var updates = {};
  updates['/board/' + newPostKey] = postData;
  return firebase.database().ref().update(updates);

}

function pageReload() {
  setTimeout(function() {

    location.reload();
  }, 1000);

}

function writeAndReload() {
  writePost();
  pageReload();
}
var postId;

function updateComment() {
  writeComment();
  pageReload();
}
function writeComment() {

  var date = new Date();
  var time = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  var comment = document.getElementById("commentContext").value;
  var commentData = {
    comment: comment,
    time: time
  };
  var newCommentKey = firebase.database().ref().child(postId + '/Comment').push().key;
  var updates = {};
  updates['/comment/' + newCommentKey] = commentData;
  return firebase.database().ref('/board/' + postId).update(updates);
}
firebase.database().ref('board').once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      var name = childData.Name;
      var subject = childData.Subject;
      var time = childData.Time;
      var message = childData.Message;


      var tbody = document.getElementById('post_body');
      // var row = my_tbody.insertRow(0); // 상단에 추가
      var row = tbody.insertRow(tbody.rows.length); // 하단에 추가
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = name;
      cell2.innerHTML = subject;
      cell3.innerHTML = time;

      cell2.onclick = function() {
        var nameD = document.getElementById('writer');
        var subjectD = document.getElementById('postSubject');
        var messageD = document.getElementById('postMessage');
        var timeD = document.getElementById('timeText');
        nameD.innerHTML = name;
        timeD.innerHTML = time;
        subjectD.innerHTML = subject;
        messageD.innerHTML = message;
        $( '#comment_body').empty();

        document.all.comment.style.display = "block";
        postId = childKey;

        firebase.database().ref('board/' + postId + '/comment').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var childCommentKey = childSnapshot.key;
              var childCommentData = childSnapshot.val();
              var comment = childCommentData.comment;
              var time=childCommentData.time;
              var tbody2 = document.getElementById('comment_body');

              var row = tbody2.insertRow(tbody2.rows.length); // 하단에 추가
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              cell1.innerHTML = comment;
              cell2.innerHTML = time;


              });
        });

        document.all.comments.style.display = "block";

    };
  });
});
