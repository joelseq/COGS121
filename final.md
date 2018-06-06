# Final Project Deliverables

## Project Members
1. Jared Suasin
  * Styled results page
  * Wrote sort/filter functions
  * Worked on branding
2. Emily Nguyen
  * Set up API call to Zillow
  * Styled home page
  * Worked on branding
3. Joel Sequeira
 * Setup project boilerplate
 * Created backend API
 * Integrated Zillow and GreatSchools
4. Aman Gupta
 * Worked on map interface
 * Worked on map interactions

## Link to Final video
https://drive.google.com/file/d/1a0_elaRO7U0osApLxUgap3Kg3ghxkchM/view?usp=sharing

## Source Code Files
* Home
    * README.md
		* Contains instructions on how to set up and run our application
* Client
	* Public
		* Index.html
			* Basic template to set up each HTML page in application. Includes imported CSS and Google Fonts
		* Images
			* Directory containing graphic .svg files used in application
		* src
			* index.js
				* Index file for react which renders at the root level
			* Components
				* App.js
					* React file which renders the correct component based on the filepath.
				* Listings.js
					* React file that renders list (right side) of neighbourhoods in area specified by user. Also contains sorting and filter functions.
				* Listings.scss
					* Scss file with styling for list of neighbourhoods on results page. Includes active hover area and scrollable list.
				* MainForm.js
					* React file holding the html and logic for the home page
				* MainForm.scss
					* Scss file with styling for the home page
				* Map.js
					* React file holding the html and js for the map view on the results page.
				* Map.scss
					* Scss file with styling for the map
				* MapElement.js
					* React file holding the html and js for the outline of each neighborhood in the map
				* Results.js
					* React file which brings renders the map and listings components onto the same page.
				* Results.scss
					* Scss file with styling for the results page.
				* States.json
					* JSON file containing names and abbreviations of all states in the United States for reference when doing API requests
			* Styles
				* Index.css
					* CSS file containing base stylings for all HTML pages. Sets standard for font usage.
* Server
  * Routes
	* Api.js
		* Javascript file that makes and manages API requests to Zillow, Greatschools, and Walkscore
	* Index.js
		* Javascript file requiring api.js when making API requests
	* Boundaries
		* Directory containing shapefiles that were downloaded to define and display boundaries on the map.
  * Server.js
	* Express Server which starts the App
