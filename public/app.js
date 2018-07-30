//getting the articles as JSON
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

//when scrape button is clicked make ajax call
$("#scrapebtn").on("click", function(){
  $.ajax({
    type: "GET",
    url: "/scrape"
  }).done(function(data){
    $("#articles").empty();
    // grab the articles as a json
    $.getJSON("/articles", function(data) {
      // for each one
      for (var i = 0; i < data.length; i++) {
      // display the info on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      }
    });
  });
});

// whenever p tag is clicked
$(document).on("click", "p", function() {
    // empty the notes from the note section
    $("#notes").empty();
    // save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // add the note information to the page
      .then(function(data) {
        console.log(data);
        // append title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // append an input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // append a textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // append a button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // if there's a note in the article
        if (data.note) {
          // place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // when the savenote button is clicked
  $(document).on("click", "#savenote", function() {
    // grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // value taken from title input
        title: $("#titleinput").val(),
        // value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // once ajax is done
      .then(function(data) {
        // log the response
        console.log(data);
        // empty the notes section
        $("#notes").empty();
      });
  
    // remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});