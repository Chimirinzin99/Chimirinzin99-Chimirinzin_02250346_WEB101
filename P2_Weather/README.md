# Practical_2_Weather_API

-----
Aims:
-----
- Creating a Weather website and using  different types of API requests (GET, POST, PUT, DELETE) to get current weather state  using HTML, CSS, and JavaScript.

----
APIs
---- 
OpenWeatherMap API → Used for fetching weather data (GET request)
Replace YOUR_OPENWEATHERMAP_API_KEY in script.js with your own API key at : https://openweathermap.org/ 
POST → Create/save data
PUT → Update data
DELETE → Remove data

----------------------
How to Run the Project
----------------------

Open the project folder
Replace YOUR_OPENWEATHERMAP_API_KEY  with your own API key
Open index.html  using live server in vscode

---------------------
How to check weather?
---------------------

GET: Enter a city name → Click “Get Weather”
POST: Fill location form → Click “Save Location”
PUT: Click “Edit” → Modify data → Click “Update”
DELETE: Click “Delete” on a saved location

--------
Results
--------

- The application successfully fetches weather data using the OpenWeatherMap API .
- Users can add new locations using the POST request and view them in the saved list.
- Existing locations can be updated using the PUT request.
- Locations can be removed using the DELETE request.
- The user interface updates dynamically based on API responses.

-----------
Reflection 
-----------
In this practical, I applied the concept of API integration in web development using JavaScript. I learned how to connect a frontend application with external services using different HTTP methods:

- GET method to fetch weather data from OpenWeatherMap API
- POST method to simulate saving new location data
- PUT method to update existing data
- DELETE method to remove saved data

----------------
Challenges Faced
----------------

I understood how each HTTP method plays a role in CRUD operations.
One of the main challenges I faced was : I had trouble handling API responses and displaying the data correctly on the webpage.
How I overcame it: I used console logs to debug the responses and carefully checked the API documentation.

---------------
What I learned?
---------------
- How to use APIs to connect a web application with external services
- Dfference between GET, POST, PUT, and DELETE requests
- How to fetch and display data from an API in a webpage
- How to use JavaScript for handling user interactions
