document.addEventListener("DOMContentLoaded", function(event) { 

  //delceration for later use as a copy of characters that we can edit without affecting characters
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


    clearDiv: function(divName){
      $(divName).empty();
    },

    //select a player character
    //removes that char from list of chars
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

    selectDefender: function(key) {
      this.clearClicks();
      this.defenderChar=this.chars[key];
      delete this.chars[key];
      $("#char-defender").append(this.defenderChar.html);
      $("#message").text("You have choosen to fight "+this.defenderChar.name+". Prepare yourself!");
    },

    bindDefenderSelect: function(){
      for(var i in this.chars)
        this.chars[i].html.on("click", function() {
          rpg_game.selectDefender($(this).attr("id"));
        });
    },

    clearClicks: function() {
      for(var i in this.chars)
        this.chars[i].html.off("click");
    },

    displayChars: function(divName){
      for(var i in this.chars) {
         $(divName).append(this.chars[i].html);
      }
    },

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

    updateCharDisplay: function(){
      this.playerChar.html.children().eq(2).text(this.playerChar.hp);
      this.defenderChar.html.children().eq(2).text(this.defenderChar.hp);
    },

    attackGo: function() {
      if(!this.isOver) {

        if(this.playerChar===null)
          $("#message").text("Please select a character first!");
        else if(this.defenderChar===null)
          $("#message").text("No defender to attack.  Please pick an enemy to fight!");

        else {
          this.round++;
          console.log("round: "+this.round+", Base attack "+this.playerChar.baseAttack);
          this.defenderChar.hp-=(this.playerChar.baseAttack*this.round);
          var tempMessage ="You have damaged "+this.defenderChar.name+" for "+this.playerChar.baseAttack*this.round+" damage.<br>";

          if(this.defenderChar.hp>0) {
            this.playerChar.hp-=this.defenderChar.counter;
            tempMessage+=this.defenderChar.name+" has countered for "+this.defenderChar.counter+" damage.";
          }
          $("#message").html(tempMessage);
          this.updateCharDisplay();

          if(this.defenderChar.hp<=0) {
            $("#char-defender").empty();
            $("#message").text("You have defeated "+this.defenderChar.name+"!  Please select another enemy to continue your path to victory!");
            this.bindDefenderSelect();
            this.defenderChar=null;

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



  //helper function for display settup, returns a jQuery object that has id's classes settup for display, and intial field values
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
    for(var i in workingCharacters) {
      var temp = getCharHtml(workingCharacters, i);
      temp.on("click", function(){
        rpg_game.selectPlayer($(this).attr("id"));
      });
      workingCharacters[i].html=temp;
    }

    //clear any click listeners just to be safe
    //attach function call to attack button
    $("#attack-button").off("click");
    $("#attack-button").on("click", function() {
      rpg_game.attackGo();
    });

    rpg_game.initialDisplay();

  }

  restartEverything();

});