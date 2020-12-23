	var idOfFavourites = []; //array to hold favourite items
		var idOfItemsInBasket =[]; 
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
					<div class="basketImage" src="`+data.dishes[idOfItemsInBasket[item]].dishImage+`"></div>
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
		function removeFavourite(idToRemove){
			var newArrayOfIds = idOfFavourites.filter(
				item => item != idToRemove
				);
			idOfFavourites = newArrayOfIds;
			data.dishes[idToRemove].dishFav = 0;
			setFavouriteNotice();
		}
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
				if (!hasItems){ //make the notification visible
					$(".cartBanner").addClass("notify");
				}
			}else{
				$(".catBanner").html(""); //empty the notification
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
				if (!hasFavourite){ //make the notification visible
					$(".favBanner").addClass("notify");
				}
			}else{
				$(".favBanner").html(""); //empty the notification
				if (hasFavourite){ ////make the notification invisible
					$(".favBanner").removeClass("notify");
				}
			}
		}
		//All Button Bindings
		function setBtnBindings(){
			$(".favRemoveBtn").on('vclick', function(){ 
				removeFavourite($(this).closest(".favItem").attr("dishid"));
				$(this).closest(".favItem").remove();
			});
			$(".favCartBtn").on('vclick', function(){
				idOfItemsInBasket.push($(this).closest(".favItem").attr("dishid"));
				idOfItemsInBasket.sort(function(a, b){return a - b});
				setBasketNotice();
			});
			$(".favoured").on('vclick', function(){ 
				alert("Not yet set!");
			});
		}
		//Important Jquery Css fix for sidebar
		//Must be called after the elements have been added
		function setSidebar(){//only for the landscape sidebar
			$(".ui-grid-a> .sideBar").css("height", $("#favourites").height());
			$(".ui-grid-a> .sideBar").css("height", $("#basket").height());
			//fixes the height programtically
		};
		//End of Important Jquery Css fixes
		//Before Navigating Event Handler
		$(document).on('pagecontainerbeforehide', 'body', function(event, ui) {
			switch (ui.nextPage.attr('id')){ 
			//check the attribute for the page.. do following
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
				default:
					break;
			}

		});		    
		$().ready(function(){
			getFavourites(); //initialise the array
			setFavourites(); //in case of refresh of page
			setBasket();
		});