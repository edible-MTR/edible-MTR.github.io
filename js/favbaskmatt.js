//Global Variables 
var stripe = Stripe('pk_test_51I59sLEA31F0bKjbZeAEa3UtZLgAJXS8oc028XnMtAH4WTPpzYsMfdvZrFAm5kCLgIThHVo0OHdU62xI7TlUQPom00J1sKttdp'); //Stripe Test API Key
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
		//First remove any Favourites & bindings
		unbindFavouriteBtns();
		$(".favItem").remove(); //remove all favItems from Dom
		//Recreate all the items for the favourites list
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
		//All items attached now add bindings for button licks
		bindFavouriteBtns();
		setSidebar(); //Set the height of the sidebar
		setFavouriteNotice(); //update notifications
	}
	function setBasket(){
		//Remove all previous basket items & bindings
		unbindBasketBtns();
		$(".basketItem").remove(); //remove all the basket items
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
		bindBasketBtns(); //Attach bindings to new items only
		setSidebar(); //Set the height of the sidebar
		setBasketNotice(); //Update notifications
	}
	//Removes a favourtite based on the id from json and array
	function setFavourite(idToAdd){
		
		setFavouriteNotice();
	}
	//Creates the table on the Checkout page
	function setCheckout(){
		var tallyBasket = {};
		total = 0;
		$(".squareTable").empty(); //Empty old content
		$(".btnPay").empty(); //Empty old 
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
		$(".btnPay").html("Pay £"+total);
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
	/// In Order to ensure click events occur correctly when the user interacts with the content that is added programatically all events must be bound to a handle and then removed when deleted and reinstansiated.

	//Favourites (each fucntion here is attached to the favourites page)
	//removes the item from the favourites list
	var removeFavourite = function(){
		var idToRemove = $(this).closest(".favItem").attr("dishid");
		var newArrayOfIds = idOfFavourites.filter(
			item => item != idToRemove
			); //Removes a favourtite based on the id from json and array
		idOfFavourites = newArrayOfIds;
		data.dishes[idToRemove].dishFav = 0;
		$(this).closest(".favItem").remove();
		setFavouriteNotice();
	}
	//Add favourite to the Basket
	var addFavouriteToCart = function(){
		idOfItemsInBasket.push($(this).closest(".favItem").attr("dishid"));
		idOfItemsInBasket.sort(function(a, b){return a - b});
		setBasketNotice();
	}
	//Favourite Binding functions for programatically created buttons
	function bindFavouriteBtns(){
		$(".favRemoveBtn").bind("click", removeFavourite);
		$(".favCartBtn").bind("click",addFavouriteToCart);
	}
	//Favourite Unbinding for programatically removed buttons
	function unbindFavouriteBtns(){
		$(".favRemoveBtn").unbind("click", removeFavourite);
		$(".favCartBtn").unbind("click",addFavouriteToCart);
	}

	//Basket (each function here is attached to the basket and checkout pages)
	//Click on the heart in the basket
	var easter = function (){
		alert("Easter Egg!");
	}
	var removeBasketItem = function(){
		var idToRemove = $(this).closest(".basketItem").attr("dishid");
		var newArrayOfItems = idOfItemsInBasket.filter(
			item => item != idToRemove
			); //Removes a item based on the id from *array only!
		idOfItemsInBasket = newArrayOfItems;
		$(this).closest(".basketItem").remove();
		setBasketNotice();
		//
		//
	}
	//Basket Binding functions for programatically created buttons
	function bindBasketBtns(){
		$(".favoured").bind("click", easter);
		$(".basketRemoveBtn").bind("click",removeBasketItem);
	}
	//Basket Unbinding for programatically removed buttons
	function unbindBasketBtns(){
		$(".favoured").unbind("click", easter);
		$(".basketRemoveBtn").unbind("click",removeBasketItem);
	}

	//Regular Buttons present at all times on the DOM
	$(".checkoutBtn").on("vclick", function(){
		location.hash = "checkout";
	});
	//Opens the payment popup
	$(".payBtn").on("click", function(){
		$("#paymentPopup").popup('open');
	});
	//Favourites the Dish
	$(".favBTNonTOP").on('vclick', function(){
		var favId =  $(this).attr("dishid");
		if (isFavourite(favId)){
			var newArrayOfIds = idOfFavourites.filter(
				item => item != favId
				); //Removes a favourtite based on the id from json and array
			idOfFavourites = newArrayOfIds;
			data.dishes[favId].dishFav = 0;
			$(".favPopup").html("<p>Removed</p>");
		}else{
			idOfFavourites.push(favId);
			data.dishes[favId].dishFav  = 1;
			$(".favPopup").html("<p>Added</p>");
		}
		setFavouriteNotice();
	});
	//Adds the dish to the basket
	$(".addDishBTN").on('vclick', function(){
		idOfItemsInBasket.push($(this).attr("dishid"));
		idOfItemsInBasket.sort(function(a, b){return a - b});
		setBasketNotice();
		location.hash = "basket";
	});
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
	//Email favourite dishes
	$('.emailFavList').click(function (event) {
        var email = 'sample@gmail.com';
        var subject = 'My Favourite Edible Dishes';
        var emailBody = 'Hello, %0D%0A' +'I have been using edible. Try one of these delightful favourites of mine.';
        for(item in idOfFavourites){
        	emailBody += "%0D%0A" + data.dishes[idOfFavourites[item]].dishName;
        }
        emailBody += "%0D%0A"+"https://edible-mtr.github.io/";
        emailBody += "%0D%0A"+"Your friend %0D%0A %0D%0A";
        document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody
    });
	//Initialise the popup
	$("#paymentPopup").popup({
		positionTo: "window",
		transition: "pop"
	});
	//End of Important Jquery Css fixes
	///////////////////////////////////
	// Stripe Payment JS -- Doesn't work for some reason as all the inputs lie stacked and wont move.
	///////////////////////////////////
	//Alternative Card Payment Thing
	$("paymentForm").card({
		container: '.cardImage',
	});
	//Some Fo Transfer thingy
	$(".btnPay").on("click", function(){
		$("#paymentPopup").popup('close');
		$.mobile.loading("show", {
			text: "Verifying card information through stripe..",
			textVisible: true,
			theme: "b",
		});
		setTimeout(function() { 
			idOfItemsInBasket = [];
			setBasketNotice();
			$.mobile.loading("hide");
			$.mobile.loading("show", {
				text: "Approved. Sending order to kitchen..",
				textVisible: true,
				theme: "b",
			});
			$.mobile.loading("hide");
			$("#badgeTitle").text("ETA of order 5mins");
			setTimeout(function(){
				$("#badgeTitle").text("Order delivered!");
			}, 100000);
			location.hash = "home";
		}, 1500);
	});
	//Before Navigating Event Handler
	$(document).on('pagecontainerbeforehide', 'body', function(event, ui) {
		switch (ui.nextPage.attr('id')){ 
		//check the attribute for the page.. do following
			case "home":
				getDiscoveries(); //Update and populate
				break;
			case "dishPage":
				break;
			case "favourites":
				getFavourites(); //Update dish data
				setFavourites(); //Populate the favourites
				break;
			case "basket":
				setBasket(); //update and set the basket
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
		setBasket(); //in case items are there
	});

