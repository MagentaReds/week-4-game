document.addEventListener("DOMContentLoaded", function(event) { 

  //declaration for later use as a copy of characters that we can edit without affecting characters
  var workingCharacters = null;
  //List of characters setup and used as a dictionary
  var characters= {
      "Itchy": {
        name: "itchy",
        hp: 120,
        baseAttack: 8,
        counter: 10, 
        imageUrl: "./assets/images/itchy.jpg",
        html: null
      },
    "Lumpy": {
        name: "Lumpy",
        hp: 100,
        baseAttack: 12,
        counter: 5,
        imageUrl: "./assets/images/lumpy.jpg",
        html: null
      },
    "Saun_Dann": {
        name: "Saun Dann",
        hp: 150,
        baseAttack: 6,
        counter: 20,
        imageUrl: "./assets/images/saun_dann.jpg",
        html: null
      },
    "Ackmena": {
        name: "Ackmena",
        hp: 180,
        baseAttack: 4,
        counter: 25,
        imageUrl: "./assets/images/ackmena.jpg",
        html: null
      }
    };



  // main game object
  var rpg_game= {
    chars: workingCharacters,
    playerChar: null,
    defenderChar: null,
    round: 0,
    isOver: false,

    //function to clear a DOM object via jquery selector
    clearDiv: function(divName){
      $(divName).empty();
    },

    //select a player character
    //removes that char from dictionary of chars
    //list of chars now is now used as the list of enemies to be selected
    selectPlayer: function(key) {
      this.playerChar=this.chars[key];
      delete this.chars[key];
      this.clearDiv("#char-select");

      $("#char-your").append(this.playerChar.html);
      $("#message").text("You have choosen "+this.playerChar.name+". Good choice!");

      var counter=0;
      this.displayChars("#char-enemy");
      this.bindDefenderSelect();
    },

    //is called when user clicks on an enemy in the enemy list area
    //moves and sets that character as the defenderChar
    //deletes that object via a key in our chars dictionary
    //disables the click event listener on the other characters to prevent them from being selected
    selectDefender: function(key) {
      this.clearClicks();
      this.defenderChar=this.chars[key];
      delete this.chars[key];
      $("#char-defender").append(this.defenderChar.html);
      $("#message").text("You have choosen to fight "+this.defenderChar.name+". Prepare yourself!");
    },

    //helper function to bind this.selectDefender() function call to on the remaining enemies
    bindDefenderSelect: function(){
      for(var i in this.chars)
        this.chars[i].html.on("click", function() {
          rpg_game.selectDefender($(this).attr("id"));
        });
    },

    //helper function to clear te on click event listerns on each of the enemy divs
    clearClicks: function() {
      for(var i in this.chars)
        this.chars[i].html.off("click");
    },

    //display all the characters in this.char to the provided selector using jquery
    displayChars: function(divName){
      for(var i in this.chars) {
         $(divName).append(this.chars[i].html);
      }
    },

    //basically the reset/default values function
    //clears the screen of old content, then displays the characters as a player select
    //call this once to get the game started
    initialDisplay: function() {
      this.playerChar=null;
      this.defenderChar=null;
      this.round=0;
      this.chars=workingCharacters;
      this.isOver=false;
      this.clearDiv("#char-your");
      this.clearDiv("#char-enemy");
      this.clearDiv("#char-defender");
      this.clearDiv("#message");

      this.displayChars("#char-select");
    },

    //updates the HP values displayed on the screen of the playerChar and defenderChar
    updateCharDisplay: function(){
      this.playerChar.html.children().eq(2).text(this.playerChar.hp);
      this.defenderChar.html.children().eq(2).text(this.defenderChar.hp);
    },

    //main game function, has most of the logic of the game
    attackGo: function() {
      //do nothing if this is called but the game is over
      if(!this.isOver) {

        //if this is called before the player has selected a character
        if(this.playerChar===null)
          $("#message").text("Please select a character first!");
        //if the this is called before the player  has selected an enemy to attack
        else if(this.defenderChar===null)
          $("#message").text("No defender to attack.  Please pick an enemy to fight!");

        //else there is a player selected, and an enemy ready to attack
        else {
          this.round++;
          //increment rounds, then deal damage to defenderChar
          this.defenderChar.hp-=(this.playerChar.baseAttack*this.round);
          var tempMessage ="You have damaged "+this.defenderChar.name+" for "+this.playerChar.baseAttack*this.round+" damage.<br>";

          //if the enemy is not dead via an attack, it counters for some damage
          if(this.defenderChar.hp>0) {
            this.playerChar.hp-=this.defenderChar.counter;
            tempMessage+=this.defenderChar.name+" has countered for "+this.defenderChar.counter+" damage.";
          }
          $("#message").html(tempMessage);
          this.updateCharDisplay();

          //if the enemy has been defeated, set the refecnce to defenderChar to null, clear the #char-defender of content in the DOM, update #message on the page
          if(this.defenderChar.hp<=0) {
            $("#char-defender").empty();
            $("#message").text("You have defeated "+this.defenderChar.name+"!  Please select another enemy to continue your path to victory!");
            this.bindDefenderSelect();
            this.defenderChar=null;

            //Checking for if the chars object is empty via ECMAScript 5 support in modern browswers
            //if so, then there are no more enemies to fight, do win condition logic and displays
            if(Object.keys(this.chars).length === 0 && this.chars.constructor === Object) {
              this.isOver=true;
              $("#message").text("You have defeated everyone and claimed the title of Lord of Life Day! Press \"Restart\" to play again ");
              var restartButton=$("<button>");
              restartButton.text("Restart");
              restartButton.on("click", function() {
                restartEverything();
              });
              $("#message").append(restartButton);
            }
          } 
          //if the player has been defeated isntead, do losing condition logic and displays
          else if(this.playerChar.hp<=0){
            this.isOver=true;
            $("#message").text("You have been slain on your path to be the ultimate Life Day champion.  You will not be remembered.  Press \"Restart\" to try again ");
            var restartButton=$("<button>");
            restartButton.text("Restart");
            restartButton.on("click", function() {
              restartEverything();
            });
            $("#message").append(restartButton);
          } 
        }
      }
    }

  };



  //helper function for display setup, returns a jQuery object that has id's classes settup for display, and intial field values
  function getCharHtml(dict, key) {
    var temp = $("<div/>");
    temp.attr("id", key);
    temp.attr("class", "character-main text-center");

    var tempName= $("<p class=\"character-name\">" + dict[key].name + "</p>");
    var tempImage= $("<img class=\"character-image\" alt=\"" + dict[key].name + 
      "\" src=\"" + dict[key].imageUrl + "\">");
    var tempHp= $("<p class=\"character-hp\">" + dict[key].hp + "</p>");
    temp.append(tempName);
    temp.append(tempImage);
    temp.append(tempHp);

    return temp;
  }


  function restartEverything(){
    //clone characters for easier resetting wtihout reloading the page
    //also wee for hackaround deep copies
    workingCharacters = JSON.parse(JSON.stringify(characters));

    //make jquery object for each character, attach it to the character in workingCharacters so it can be passed around easily as a reference
    //also binds the intial on click listener to each character
    for(var i in workingCharacters) {
      var temp = getCharHtml(workingCharacters, i);
      temp.on("click", function(){
        rpg_game.selectPlayer($(this).attr("id"));
      });
      workingCharacters[i].html=temp;
    }

    //clear any click listeners just to be safe and because this function can get called multiple times.
    //attach function call to attack button
    $("#attack-button").off("click");
    $("#attack-button").on("click", function() {
      rpg_game.attackGo();
    });

    //initalizes the rpg-game object, and displays the characters for the user to select one
    rpg_game.initialDisplay();

  }

  //initial call to get the game started.
  restartEverything();

});