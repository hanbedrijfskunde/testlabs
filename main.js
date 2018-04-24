// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAzmsgmWqiJ2VwrsqDPxUAN4aqrj8Vt_nc",
    authDomain: "slogan-5f8bf.firebaseapp.com",
    databaseURL: "https://slogan-5f8bf.firebaseio.com",
    projectId: "slogan-5f8bf",
    storageBucket: "",
    messagingSenderId: "854165043027"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var cross = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  cross.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
        $('#modal').modal('toggle');
      }
  }

// Reference slogans collection
var slogansRef = database.ref('slogans');

// Listen for form submit
document.getElementById('sloganForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
    e.preventDefault();

    // Get values
    var voor = getInputVal('inputVoor');
    var slogan = getInputVal('inputSlogan');

    saveSlogan(voor, slogan);

    // Show alert
    $("#alertThanks").removeClass('d-none');

    // Hide alert after 3 secs
    setTimeout(function(){
      $('#myModal').modal('toggle');
      $("#myBtn").addClass('d-none');
      $("#alertThanks").addClass('d-none');
    }, 1500);

    // Clear form
    document.getElementById('sloganForm').reset();
    }

// function to get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save slogans to Firebase
function saveSlogan(voor, slogan) {
  var newSloganRef = slogansRef.push();
  newSloganRef.set({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    voor: voor,
    slogan: slogan
  });
}

slogansRef.on('value', gotData, errData);

function gotData(data){
  console.log(data.val());
}

function errData(err){
  console.log('Error');
  console.log(err);
}

function timeStampToDate(timestamp){
var dateTime = new Date(timestamp);
var dateTime = new Date(dateTime + ' UTC');
return dateTime.toISOString().slice(0, 10) + ' ' + dateTime.toISOString().slice(11, 16);
}

// Add cards
var $slogans = $('#slogans');
slogansRef.on('child_added', function (snapshot) {
  var voor = snapshot.val().voor;
  var slogan = snapshot.val().slogan;
  var time = timeStampToDate(snapshot.val().timestamp);

  $slogans.prepend(
    '<div class="card w-50">' +
      '<div class="card-block">' +
          '<h3 class="card-header card-inverse card-warning p-2 text-center">' + voor + '</h3>' +
          '<p class="card-text card-outline-secondary mt-3">' + slogan + '</p>' +
          '<p class="card-footer"><small class="text-muted">Geplaatst op: ' + time + '</small></p>' +
      '</div>' +
    '</div>'
  );
});
