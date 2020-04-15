/**
 * 
 * Copyright 2020 by s0nda00
 * 
 */

/*
 * Settings
 */
var Settings = {
	DEFAULT_PAGE_HEADER_ID  : "page_header",
	DEFAULT_PAGE_CONTENT_ID : "page_content",
	DEFAULT_PAGE_FOOTER_ID  : "page_footer",
	DEFAULT_PAGE_HEADER_LANGUAGES_ID : "page_header_languages",
	//
	// Default background image for page head. If no user-defined (specific) background image can
	// be found, then this default background image will be used, indepedent of screen resolution.
	//
	DEFAULT_BACKGROUND_IMG_URL : "assets/imgs/background/svg/bgVector.svg", // "assets/imgs/background/bgDefault.jpg",
	//
	// Animationed images (cloud)
	//
	DEFAULT_CLOUD_IMG_URLS : ["assets/imgs/background/png/cloud_smoke1.png", "assets/imgs/background/png/cloud_smoke2.png", "assets/imgs/background/png/cloud_smoke3.png"],
};

/*
 * Node.insertAfter
 *
 * This Node.insertAfter() method inserts a node after a reference node as a child of a specified 
 * parent node.
 */
Node.prototype.insertAfter = function (newNode, referenceNode) {
	let parentNode = referenceNode.parentNode;
	let referenceNode_nextSibling = referenceNode.nextSibling;
	let insertedNode = ( referenceNode_nextSibling == null || referenceNode === parentNode.lastChild )
						? parentNode.appendChild(newNode)
						: parentNode.insertBefore(newNode, referenceNode_nextSibling);
	return insertedNode; // reference to newNode
};

/*
 * Template
 */
var Template = (function($) {
	//
	// Constants
	//
	const CONST_DELAY_PER_FRAME = 24; // 16 [ms]; because 60 fps => (1000 / 60) [ms/frame] ~ 16 */
	const CONST_SCALING_FACTOR = 0.75; // 0.33;

	let pHeader;
	let pContent_section_contents;
	let pContent_section_titles;
	let numberOfLanguages = 0;
	let current_language_index = 0;

	let last_cloud = null;

	return {
		/*========================================================================================================
		 *
		 * Invoke all initial steps
		 * @params
		 * 
		 *======================================================================================================*/
		init : function () {
			pHeader = $(Settings.DEFAULT_PAGE_HEADER_ID); //pHeader = document.getElementById("page_header");
			if ( !pHeader ) return;
			pContent_section_contents = $("#" + Settings.DEFAULT_PAGE_CONTENT_ID + "> div[class] > p:not(:first-child)");
			pContent_section_titles = $("#" + Settings.DEFAULT_PAGE_CONTENT_ID + "> div[class] > p:first-child > span");
			numberOfLanguages = $("#" + Settings.DEFAULT_PAGE_HEADER_LANGUAGES_ID + " > ul > li:not(:first-child)").length;
			this.config2();
			//this.config();
			//this.fadeIn();
		}, // END (init)

		/*========================================================================================================
		 *
		 * Make configurations
		 * @params
		 * 
		 *======================================================================================================*/
		config : function () {
			//
			let url = Settings.DEFAULT_BACKGROUND_IMG_URL;
			//
			let img = new Image();
			img.src = url;
			pHeader.appendChild(img); // add Image object to header-div to show it
			//
			// Configurations for page sections (CSS style, animation etc.)
			//
			this.config_page_sections();
			//
			// Check if the (smart) device viewport is currently in the landscape or portrait modus
			//
			const mediaQueryList = window.matchMedia("(orientation: landscape)"); // get list of media queries of device screen
			handleViewportOrientationChange(mediaQueryList); // handle obtained media query list
			mediaQueryList.addListener(handleViewportOrientationChange);

			function handleViewportOrientationChange (evt) {
				if (evt.matches) { // window.matchMedia("(orientation: landscape)").matches == true
					Template.config_page_head(img);
				}
				else { // window.matchMedia("(orientation: portrait)").matches == true
					Template.config_page_head(img, true);
				}
				Template.fadeIn(); // run fading-in (from unsharp to sharp) effect for background image
			}
		}, // EDN (config)

		/*========================================================================================================
		 *
		 * Make configurations (2)
		 * @params
		 * 
		 *======================================================================================================*/
		config2 : function () {
			//
			// Determine the screen resolution
			//
			let scrW = window.screen.availWidth; // https://developer.mozilla.org/en-US/docs/Web/API/Screen/availHeight
			//
			// Create object (tag <object>) for SVG
			//
			let svg = document.createElement("OBJECT");
			svg.setAttribute("data", "assets/imgs/background/svg/bgVector.svg");
			svg.setAttribute("type", "image/svg+xml");
			svg.addEventListener("load", () => { // invoked (as last) after SVG and other code lines have been loaded
				let svg_doc = svg.contentDocument;
				let svg_cloud = $("#CLOUD", svg_doc)[0];
				const limX = (scrW < 800) ? (3*scrW) : scrW;
				let x = 0, dx = 2;
				///
				// Animation of moving cloud
				//
				window.setInterval(() => {
					svg_cloud.setAttribute("transform", "translate(" + x + " 0)"); // transform="translate(x y)"
					x += dx;
					if (x > limX || x < -50) {
						dx = -dx;
					}
				}, 16); // 16 [ms]; because 60 fps => (1000 / 60) [ms/frame] ~ 16 */
			});
			//
			// Add newly created SVG object to page head
			//
			pHeader.appendChild(svg);
			//
			// Configurations for page sections (CSS style, animation etc.)
			//
			this.config_page_sections();
			//
			// Check if the (smart) device viewport is currently in the landscape or portrait modus
			//
			const mediaQueryList = window.matchMedia("(orientation: landscape)"); // get list of media queries of device screen
			handleViewportOrientationChange(mediaQueryList); // handle obtained media query list
			mediaQueryList.addListener(handleViewportOrientationChange);

			function handleViewportOrientationChange (evt) {
				if (evt.matches) { // window.matchMedia("(orientation: landscape)").matches == true
					Template.config_page_head(null);
				}
				else { // window.matchMedia("(orientation: portrait)").matches == true
				Template.config_page_head(null,true);
				}
				Template.fadeIn(); // run fading-in (from unsharp to sharp) effect for background image
			}

		}, // END (config2)

		/*========================================================================================================
		 *
		 * Make configurations for page head
		 * @params
		 * 
		 *======================================================================================================*/
		config_page_head : function (img, portrait=false) {
			//
			// Determine the screen resolution
			//
			let scrW = window.screen.availWidth, // https://developer.mozilla.org/en-US/docs/Web/API/Screen/availHeight
				scrH = window.screen.availHeight; // availHeight = window.screen.width - (Dock.height + MenueBar.height),
			//
			// If screen is in portrait mode, scale it using scaling factor
			//
			/*
			if (portrait) {
				scrH *= CONST_SCALING_FACTOR;
			}
			*/
			scrH = CONST_SCALING_FACTOR * scrW; // Height must always be 3/4 of Width
			pHeader.style.height = scrH + "px"; // set height of div-container
			pHeader.style.opacity = 0;
			pHeader.filter = "opacity(alpha=0)";
			//
			if (img) {
				this.scaleImg(img, scrW, scrH); // draw and scale image			
			}
			// Note: Code within the 'onload' and 'onerror' block will be called last after all other code lines before 
			//		 and after them have been invoked already.
			/*
			img.onload = () => { // Note: Arrow function loses its own bindings to 'this', 'arguments', 'super' or 'new.target'
				Template.scaleImg(img, scrW, scrH); // draw and scale image
			};
			img.onerror = () => { // If image with given 'url' cannot be loaded, reset the 'url' attribute of Image and reload it
				img.src = Settings.DEFAULT_BACKGROUND_IMG_URL; // reset image url
				Template.scaleImg(img, scrW, scrH); // draw and scale image
			};
			*/
			//
			this.config_page_head_languages();
			this.config_page_head_animation(scrW, portrait);
		}, // END (config_page_head)

		/*========================================================================================================
		 *
		 * @params
		 * 
		 *======================================================================================================*/
		config_page_head_languages : function () {
			//
			let div = $(Settings.DEFAULT_PAGE_HEADER_LANGUAGES_ID),
				ul = div.querySelector("ul"),
				firstLi = ul.querySelector("li:first-child")
				lis = ul.querySelectorAll("li:not(:first-child)"); // without first li (FirstLi)
			//
			let showing = false;
			//
			// Add touch listeners
			//
			firstLi.addEventListener("touchstart", function (evt) {
				div.style.animation = "none";
				evt.preventDefault();
				
			});
			firstLi.addEventListener("touchend", function (evt) {
				blend(CONST_BLEND_OUT);
				evt.preventDefault();
			});
			//
			// Add mouse event listeners
			//
			firstLi.addEventListener("mouseover", function (evt) {
				if (!showing) {
					blend(CONST_BLEND_OUT);
					showing = true;
				}
				evt.preventDefault();
			});
			//
			// Add click listeners
			//
			firstLi.addEventListener("click", function (evt) {
				div.style.animation = "display_vertical 1s";
				if (!showing) {					
					div.style.height = "6.6em";
				}
				else {
					div.style.height = "1.6em";
				}
				showing = !showing;
			});
			lis.forEach(li => {
				li.addEventListener("click", function (evt) {
					firstLi.innerHTML = evt.target.innerHTML + " &radic;";
					blend(CONST_BLEND_IN);
					switchLanguage(evt.target);
					showing = false;
				})
			});
			//
			// Helper function for blending in/out the language drop-down menue
			//
			const CONST_BLEND_IN = true,
				  CONST_BLEND_OUT = false;

			function blend(b_in) {
				div.style.animation = "display_vertical 1s";
				if (b_in)				
					div.style.height = "1.6em";
				else
					div.style.height = "6.6em";
			}
			//
			// Helper function for toggling/switching languages
			//
			function switchLanguage(liElem) {
				// Make content of current language invisible (display: none)
				for (let i = current_language_index; i < pContent_section_titles.length; i+=numberOfLanguages) {
					//pContent_section_titles[i].style.visibility = "hidden";
					pContent_section_titles[i].style.display = "none"; // hide title
					pContent_section_titles[i].nextSibling.style.display = "none"; // hide underline
				}
				for (let i = current_language_index; i < pContent_section_contents.length; i+=numberOfLanguages) {
					//pContent_section_contents[i].style.visibility = "hidden";
					pContent_section_contents[i].style.display = "none"; // hide content
				}
				// Determine index of newly choosen language
				for (let i = 0; i < lis.length; i++) {
					if (liElem === lis[i]) {
						current_language_index = i; // foudn index for the clicked li-element
						break;
					}
				}
				// Make content of new current language visible (display: inline-block)
				for (let i = current_language_index; i < pContent_section_titles.length; i+=numberOfLanguages) {
					//pContent_section_titles[i].style.visibility = "visible";
					pContent_section_titles[i].style.display = "block"; // show title, inline-block
					pContent_section_titles[i].nextSibling.style.display = "block"; // show underline
				}
				for (let i = current_language_index; i < pContent_section_contents.length; i+=numberOfLanguages) {
					//pContent_section_contents[i].style.visibility = "visible";
					pContent_section_contents[i].style.display = "block"; // show content, inline-block
				}
			}
		}, // END (config_page_head_languages)

		/*========================================================================================================
		 *
		 * Make some animations (moving cloud ...) in page head
		 * @params
		 * 
		 *======================================================================================================*/
		config_page_head_animation : function (scrW, portrait) {
			//
			// Clear old animation(s) before running new one
			//
			if (last_cloud) {
				pHeader.removeChild(last_cloud);
			}
			//
			let img = new Image();
			let imgW, imgH;
			if (scrW < 400) {
				imgW = 200; imgH = 79;
				img.src = Settings.DEFAULT_CLOUD_IMG_URLS[2];
			}
			else if (scrW < 800) {
				imgW = 400; imgH = 158;
				img.src = Settings.DEFAULT_CLOUD_IMG_URLS[1];
			}
			else { // >= 800
				imgW = 748; imgH = 295;
				img.src = Settings.DEFAULT_CLOUD_IMG_URLS[0];
			}
			img.style.position = "absolute";
			img.style.opacity = ".5";
			img.style.filter = "alpha(opacity=50)";
			img.style.margin = "0 0 0 " + (scrW-100) + "px";
			img.style.width = imgW + "px";
			img.style.height = imgH + "px";
			//
			last_cloud = pHeader.insertBefore(img, pHeader.lastChild);
			//
			// Invoke animation
			//
			window.setInterval(animationHandler, 16); // 16 [ms]; because 60 fps => (1000 / 60) [ms/frame] ~ 16 

			function animationHandler () {
				let marginLeft = parseInt(img.style.marginLeft.substring(0,img.style.marginLeft.length-2));
				if (marginLeft <= -imgW) {
					marginLeft = scrW;
					let marginTop = parseInt(img.style.marginTop.substring(0,img.style.marginLeft.length-2));
					marginTop = (marginTop == 0) ? (Math.floor(Math.random() * 150)) : 0;
					img.style.marginTop = marginTop + "px";
				}
				else {
					marginLeft -= 1;
				}
				img.style.marginLeft = marginLeft + "px";
			}
		},

		/*========================================================================================================
		 *
		 * @params
		 * 
		 *======================================================================================================*/
		config_page_sections : function () {
			//
			// Set underline for each section's title
			//
			for (let i = 0; i < pContent_section_titles.length; i++) {
				//
				// Create new node (HTML <span>) for underline. Add CSS style properties.
				//
				let newNode = document.createElement("SPAN");
				newNode.setAttribute("class", "underline"); // <span class="underline"></span>
				newNode.style.height = "4px"
				newNode.style.width = "8ch"; // ch == length of the character '0'
				newNode.style.margin = "0 auto"; /* align center */
    			newNode.style.marginTop = "10px";
				newNode.style.backgroundColor = "#000";
				//
				// Insert this new node to the position after each section_titles[i] node
				//
				pContent_section_titles[i].parentNode.insertAfter(newNode, pContent_section_titles[i]);
				//
				// Add touch listener
				//
				pContent_section_titles[i].addEventListener("touchstart", function (evt) {
					newNode.style.animation = "none";
					evt.preventDefault();
				});
				pContent_section_titles[i].addEventListener("touchend", function (evt) {
					newNode.style.animation = "underline_width .75s";
					evt.preventDefault();
				});
				newNode.style.display = (i % numberOfLanguages == 0) ? "block" : "none"; // block
			}
		}, // END (config_page_sections)
		
		/*========================================================================================================
		 *
		 * Execute the fading-in effect for background image 
		 * @params
		 * 
		 *======================================================================================================*/
		fadeIn : function ( duration=1 /* in second, default=1s */ ) {
			if ( duration <= 0 ) {
				pHeader.style.opacity = 1;
				pHeader.style.filter = "alpha(opacity=100)";
				return;
			}
			let curOpac = 0, /* <int>, current opacity */
				delay = 2 * CONST_DELAY_PER_FRAME, /* <int>, time between two frames; N * 60 fps => N * (1000 / 60) [ms/frame] = N * 16 */
				fadeId = null; /* <int>, timer id */
			let step = ( duration > 1 ) ? delay * duration : delay;
			step = 1 / step;
			//
			// Start timer (animation)
			//
			fadeId = window.setInterval( () => fn(), delay);
			//
			// Helper function
			//
			function fn () {
				if ( curOpac >= 1 ) {
					pHeader.style.opacity = 1;
					pHeader.style.filter = "alpha(opacity=100)";
					clearInterval(fadeId);
				}
				curOpac += step;
				pHeader.style.opacity = curOpac;
				pHeader.style.filter = "alpha(opacity=" + (100*curOpac) + ")";
			}
		}, // END (fadeIn)

		/*========================================================================================================
		 *
		 * Use canvas to redraw and scale/resize image
		 * @params
		 * 
		 *======================================================================================================*/
		scaleImg : function (img, new_width, new_height) {
			let mCanvas = document.createElement("canvas"),
				mCtx = mCanvas.getContext("2d");
			mCanvas.width = new_width;
			mCanvas.height = new_height;
			mCtx.drawImage(img, 0, 0, mCanvas.width, mCanvas.height);
		}, // END (resizeImage)

	};
})(
	//
	// Call-back function
	//
	function (selector /* id, class selector ...*/, reference = document) 
	{
		if (reference !== document) {
			return reference.querySelectorAll(selector) || null;
		}
		else { // reference === document
			return reference.getElementById(selector) || reference.querySelectorAll(selector) || null;
		}
	}
);
 
/*======================================================================================================================
*
* Start script
* 
*======================================================================================================================*/
document.addEventListener("DOMContentLoaded", () => { // Note: Arrow function loses its own bindings to 'this', 'arguments', 'super' or 'new.target'
	Template.init();
}, false);