var idOfFavourites = []; //array to hold favourite items
var idOfItemsInBasket =[];
var total = 0;
	///Discover Page JS
	function randomDish(){
		var noDishes = data.dishes.length;
		return Math.floor(Math.random() * Math.floor(noDishes));
	}
	function getDiscoveries(){
		//Featured Dish
		$(".discoverItem").remove(); //clear all discoveries
		var randomId =  randomDish();
		var featuredDish =  `<div class="discoverItem featured" dishId="`+ randomId +`">
				<div class="discoverInfo">
				<h2 class="discoverTitle">***`+data.dishes[randomId].dishName.substring(0, 14)+`..</h2>
				<p class="discoverText">`+data.dishes[randomId].dishDescription.substring(0, 120)+`...</p>
				</div>
				<div class="discoverRight">
				<img class="discoverImage" src="`+ data.dishes[randomId].dishImage +`" alt="Image of " `+ data.dishes[randomId].dishName+`>
				<div class="discoverAbove">
				<div class="discoverBtn featuredDishBtn">
				<i class="icon fas fa-eye fa-lg"></i>
				</div>
				</div>
				</div>
				</div>`;
		$(".discoverList").append(featuredDish); //add the featured as the first item
		for (featured in data.discover){
			var featuredHtml = `<div class="discoverItem" dishId="`+ featured +`">
				<div class="discoverInfo">
				<h2 class="discoverTitle">`+ data.discover[featured].title+`</h2>
				<p class="discoverText">`+data.discover[featured].description.substring(0, 100)+`...</p>
				</div>
				<div class="discoverRight">
				<img class="discoverImage" src="`+ data.discover[featured].image +`" alt="Image of " `+ data.discover[featured].title +`>
				<div class="discoverAbove">
				<div class="discoverBtn">
				<i class="icon fas fa-eye fa-lg"></i>
				</div>
				</div>
				</div>
				</div>`;
			$(".discoverList").append(featuredHtml);
		}
		setSidebar();
	}
	function getFavourites(){ //sets up the local array of favourites for easy access for notifications and page loading
		idOfFavourites = []; //Empty array before repopulating
		for(item in data.dishes){ //populate my favourites array with ids of dishes
			if(data.dishes[item].dishFav  == 1){
				idOfFavourites.push(data.dishes[item].id);
			}
		}
	}
	function setFavourites() { //loads the favourites into html and appends
		for(id in idOfFavourites){ //create html of the favourites add to list
			innerHtmlString = `<div class="favItem" dishId="` + idOfFavourites[id] +`">
			<img class="favImage" src="`+ data.dishes[idOfFavourites[id]].dishImage +`" alt="Image of " `+ data.dishes[idOfFavourites[id]].dishName+`>
			<div class="textCenter">
			<h2 class="favTitle">`+ data.dishes[idOfFavourites[id]].dishName +`</h2>
			<p class="favText">`+ data.dishes[idOfFavourites[id]].dishDescription.substring(0, 100) +`...</p>
			</div>
			<h3 class="favCost">£`+ data.dishes[idOfFavourites[id]].dishPrice +`</h3>
			<div class="rightIcons">
			<div class="favCartBtn"><i class="icon fas fa-shopping-cart fa-lg"></i></div>
			<div class="favRemoveBtn"><i class="icon fas fa-times fa-lg"></i></div>
			</div>
				</div>`; //string litteral representation of inner div
			$(".favDishList").append(innerHtmlString); //attach the favourites to the dom
		}
		setBtnBindings();//bind onclicks
		setSidebar(); //sort the sidebar
		setFavouriteNotice(); //update notifications
	}
	function setBasket(){
		for (item in idOfItemsInBasket){
			var favIcon = "";
			if (isFavourite(idOfItemsInBasket[item])){
				favIcon = `<i class="icon green fas fa-heart fa-lg"></i>`;
			}else{
				favIcon = `<i class="icon far fa-heart fa-lg"></i>`;
			}
			innerHtmlString = `<div class="basketItem" dishId="`+idOfItemsInBasket[item]+`">
			<img class="basketImage" src="`+data.dishes[idOfItemsInBasket[item]].dishImage+`">
			<div class="textCenter">
			<h2 class="basketTitle">`+data.dishes[idOfItemsInBasket[item]].dishName+`</h2>
			<p class="basketText">`+ data.dishes[idOfItemsInBasket[item]].dishDescription.substring(0, 100) +`...</p>
			</div>
			<div class="basketCost">
			<div class="favoured">
			`+favIcon+`	
			</div>
			<h3 class="price">£`+data.dishes[idOfItemsInBasket[item]].dishPrice+`</h3>
			</div>
			<div class="rightIcons">
			<div class="basketRemoveBtn"><i class="icon fas fa-times fa-lg"></i></div>
			</div>
				</div>`; //string litteral representation of inner div
				$(".basketDishList").append(innerHtmlString);
			}
		setBtnBindings();//bind onclicks
		setSidebar(); //sort the sidebar
		setBasketNotice(); //update notifications
	}
	//Removes a favourtite based on the id from json and array
	function setFavourite(idToAdd){
		idOfFavourites.push(idToAdd);
		data.dishes[idToAdd].dishFav  = 1;
		setFavouriteNotice();
	}
	//Creates the table on the Checkout page
	function setCheckout(){
		var tallyBasket = {};
		total = 0;
		$(".squareTable").empty();
		idOfItemsInBasket.forEach(
			x => tallyBasket[x] = (tallyBasket[x] || 0) + 1
			);
		var rows = `<div class="tableRow tbHead">
          <h3>&emsp;Qty&emsp;</h3><h3>&emsp;Dish Name&emsp;</h3><h3>&emsp;Price&emsp;</h3>
        </div>`
		for (item in tallyBasket){
			rows += `<div class="tableRow rowGreen"> 
            <h4>`+tallyBasket[item]+`x</h4>
            <h4>`+data.dishes[item].dishName.substring(0, 15)+`</h4>
            <h4 class="textWhite">£`+(Number(data.dishes[item].dishPrice) * Number(tallyBasket[item]))+`</h4>
            </div>`;
            total += (Number(data.dishes[item].dishPrice) * Number(tallyBasket[item]));
		}
		rows +=`<div class="tableRow rowGreen"> 
			<h4></h4><h4>Delivery Cost</h4>
            <h4 class="textWhite">£4</h4>
            </div>`;
		total += 4;
		rows +=`<div class="tableRow">
			<h3></h3>
			<h3>Total Cost</h3>
            <h3>£`+ total +`</h3>
            </div>
		`;
		$(".squareTable").append(rows);
	}
	//Removes a favourtite based on the id from json and array
	function removeFavourite(idToRemove){
		var newArrayOfIds = idOfFavourites.filter(
			item => item != idToRemove
			);
		idOfFavourites = newArrayOfIds;
		data.dishes[idToRemove].dishFav = 0;
		setFavouriteNotice();
	}
	//Removes a favourtite based on the id from *array only!
	function removeBasketItem(idToRemove){
		var newArrayOfItems = idOfItemsInBasket.filter(
			item => item != idToRemove
			);
		idOfItemsInBasket = newArrayOfItems;
		setBasketNotice();
	}
	//Boolean determination of whether the dish is in the favourite list
	function isFavourite(id){
		var idsFound = idOfFavourites.filter(
			item => item == id
			);
		if (idsFound.length > 0){
			return true;
		} else{
			return false;
		}
	}
	//Banner notification of Basket
	function setBasketNotice(){
		//check the length of the basket list
		var noOfItems =  idOfItemsInBasket.length;
		//check previous notification status
		var hasItems =  $(".cartBanner").hasClass("notify");
		//if greater than 0 update notifications
		if (noOfItems > 0){
			$(".cartBanner").html(noOfItems); //set the notification
			$(".basketMessage").hide(); //Hide empty message
			$(".checkoutBtn").show(); //user can now checkout
			if (!hasItems){ //make the notification visible
				$(".cartBanner").addClass("notify");
			}
		}else{
			$(".cartBanner").html(""); //empty the notification
			$(".basketMessage").show(500); //Show empty message
			$(".checkoutBtn").hide(); //user cannot now checkout
			if (hasItems){ ////make the notification invisible
				$(".cartBanner").removeClass("notify");
			}
		}
	}
	//Banner notification of favourites
	function setFavouriteNotice(){
		//check the length of the favourites list
		var noOfFavs =  idOfFavourites.length;
		//check previous notification status
		var hasFavourite =  $(".favBanner").hasClass("notify");
		//if greater than 0 update notifications
		if (noOfFavs > 0){
			$(".favBanner").html(noOfFavs); //set the notification
			$(".favMessage").hide(); //Hide empty message
			$(".emailFavList").show(); //User has favourites to email
			if (!hasFavourite){ //make the notification visible
				$(".favBanner").addClass("notify");
			}
		}else{
			$(".favBanner").html(""); //empty the notification
			$(".favMessage").show(500); //Show empty message
			$(".emailFavList").hide(); //User has no favourites to email
			if (hasFavourite){ ////make the notification invisible
				$(".favBanner").removeClass("notify");
			}
		}
	}
	//All Button Bindings
	function setBtnBindings(){
		//Favourite Page Buttons
		$(".favRemoveBtn").on('vclick', function(){ 
			removeFavourite($(this).closest(".favItem").attr("dishid"));
			$(this).closest(".favItem").remove();
			//WARNING LOGIC ERROR - wont remove the element from the opposite device orientation
		});
		//Add Dishes to the Basket
		$(".favCartBtn").on('vclick', function(){
			idOfItemsInBasket.push($(this).closest(".favItem").attr("dishid"));
			idOfItemsInBasket.sort(function(a, b){return a - b});
			setBasketNotice();
		});
		//Basket page buttons
		$(".favoured").on('vclick', function(){ 
			alert("Easter Egg!");
		}); //toggles the favourite status of an item in the basket
		$(".basketRemoveBtn").on('vclick', function(){
			removeBasketItem($(this).closest(".basketItem").attr("dishid"));
			$(this).closest(".basketItem").remove();
			//WARNING LOGIC ERROR - wont remove the element from the opposite device orientation
		});
		$(".checkoutBtn").on("vclick", function(){
			location.hash = "checkout";
		});
	}
	//Important Jquery Css fix for sidebar
	//Must be called after the elements have been added
	function setSidebar(){//only for the landscape sidebar
		$(".ui-grid-a> .sideBar").css("height", $("#home").height());
		$(".ui-grid-a> .sideBar").css("height", $("#favourites").height());
		$(".ui-grid-a> .sideBar").css("height", $("#basket").height());
		$(".ui-grid-a> .sideBar").css("height", $("#searchPage").height());
		$(".ui-grid-a> .sideBar").css("height", $("#dishPage").height());
		//fixes the height programtically
	};
	//Matts Favourite and Basket buttons
	function dishPageBtns(){
		//Favourites the Dish
		$(".favBTNonTOP").on('vclick', function(){
			var id =  $(this).attr("dishid");
			if (isFavourite(id)){
				removeFavourite(id);
				$(".favPopup").html("<p>Removed</p>");
			}else{
				setFavourite(id);
				$(".favPopup").html("<p>Added</p>");
			}
		});
		//Adds the dish to the basket
		$(".addDishBTN").on('vclick', function(){
			idOfItemsInBasket.push($(this).attr("dishid"));
			idOfItemsInBasket.sort(function(a, b){return a - b});
			setBasketNotice();
			location.hash = "basket";
		});
	}
	//End of Important Jquery Css fixes
	//Before Navigating Event Handler
	$(document).on('pagecontainerbeforehide', 'body', function(event, ui) {
		switch (ui.nextPage.attr('id')){ 
		//check the attribute for the page.. do following
			case "home":
				getDiscoveries();
				break;
			case "dishPage":
				dishPageBtns();
				break;
			case "favourites":
				$(".favItem").remove(); //remove all favItems from Dom
				getFavourites(); //get the most up to date data from the dish data
				setFavourites(); //load it to the html
				setFavouriteNotice(); //set notifications  in case of update
				break;
			case "basket":
				$(".basketItem").remove();
				setBasket();
				break;
			case "checkout":
				setCheckout();
				break;
			default:
				break;
			}
		});
	//Once the dom loads call these functions to set the basics	    
	$().ready(function(){
		getDiscoveries();
		getFavourites(); //initialise the array
		setFavourites(); //in case of refresh of page
		setBasket();
	});