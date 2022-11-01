function insertName() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      console.log(user.uid);
      console.log(user.displayName);
      user_Name = user.displayName;

      //method #1:  insert with html only
      //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
      //method #2:  insert using jquery
      $("#name-goes-here").text(user_Name); //using jquery
    } else {
      // No user is signed in.
    }
  });
}
insertName(); //run the function

function readQuote() {
  console.log("inside the function");
  db.collection("quotes")
    .doc("tuesday")
    .onSnapshot((tuesdayDoc) => {
      console.log(tuesdayDoc.data());
      document.getElementById("quote-goes-here").innerHTML =
        tuesdayDoc.data().quote;
    });
}
readQuote();

function writeHikes() {
  //define a variable for the collection you want to create in Firestore to populate data
  var hikesRef = db.collection("hikes");

  hikesRef.add({
    code: "BBY01",
    name: "Burnaby Lake Park Trail", //replace with your own city?
    city: "Burnaby",
    province: "BC",
    level: "easy",
    length: "10",
    details: "Elmo goes here regularly",
    last_updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
  hikesRef.add({
    code: "AM01",
    name: "Buntzen Lake Trail Trail", //replace with your own city?
    city: "Anmore",
    province: "BC",
    level: "moderate",
    length: "10.5",
    details: "Elmo goes here regularly",
    last_updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
  hikesRef.add({
    code: "NV01",
    name: "Mount Seymoure Trail", //replace with your own city?
    city: "North Vancouver",
    province: "BC",
    level: "hard",
    length: "8.2",
    details: "Elmo goes here regularly",
    last_updated: firebase.firestore.Timestamp.fromDate(
      new Date("March 10, 2022")
    ),
  });
}
function displayCards(collection) {
  let cardTemplate = document.getElementById("hikeCardTemplate");

  db.collection(collection)
    .get()
    .then((snap) => {
      //var i = 1;  //if you want to use commented out section
      snap.forEach((doc) => {
        //iterate thru each doc
        var title = doc.data().name; // get value of the "name" key
        var details = doc.data().details; // get value of the "details" key
        var hikeID = doc.data().code; //get unique ID to each hike to be used for fetching right image
        let newcard = cardTemplate.content.cloneNode(true);

        //update title and text and image
        newcard.querySelector(".card-title").innerHTML = title;
        newcard.querySelector(".card-text").innerHTML = details;
        newcard.querySelector(".card-image").src = `./images/${hikeID}.jpg`; //Example: NV01.jpg

        //give unique ids to all elements for future use
        // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
        // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
        // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

        //attach to gallery
        document.getElementById(collection + "-go-here").appendChild(newcard);
        //i++;   //if you want to use commented out section
      });
    });
}

displayCards("hikes");

async function readJSONhero() {
  const response = await fetch(
    "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json"
  );
  const data = await response.text(); //get text file, string
  const superHeroes = JSON.parse(data); //convert to JSON
  //console.log(superHeroes);
  for (x of superHeroes) {
    //iterate thru each hero
    let name = x.name;
    //console.log(name);
    let details = "Elmo is impressed! " + name + " occupation: "; //creating a string with details
    for (w in x.work) {
      details += " " + x.work.occupation;
    }
    if (name.includes("A")) {
      console.log(name);
      //db.collection("heros").add({
      //    name: x.name,
      //    details: details
      //})
    }
  }
}

//------------------------------------------------------
// Get data from a CSV file with ".fetch()"
// Since this file is local, you must use "live serve"
//------------------------------------------------------
async function getCSVdata() {
  const response = await fetch("./olympic-medals.csv"); //send get request
  const data = await response.text(); //get file response
  const list = data.split("\n").slice(1); //get line
  list.forEach((row) => {
    const columns = row.split(","); //get token
    const country = columns[0]; //country name
    const gold = columns[1]; //gold medals
    const silver = columns[2];
    const bronze = columns[3];
    let details = "Elmo is super proud of ";
    details +=
      country +
      ": " +
      gold +
      " gold;" +
      silver +
      " silver;" +
      bronze +
      "bronze.";
    if (country.includes("U")) {
      console.log(country);
      //db.collection("countries").add({   //write to firestore
      //    name: country,
      //    details: details
      //})
    }
  });
}
