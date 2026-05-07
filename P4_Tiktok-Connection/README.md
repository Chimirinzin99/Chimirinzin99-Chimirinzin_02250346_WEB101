# Practical 4: Connecting TikTok Frontend to Backend

----
Aim:
----

Connecting  Next.js frontend to the Express.js backend built in previous practicals.
It implements user authentication, video display, and social interactions like following users and viewing feeds.

-------------
Prerequisites
-------------

- Node.js installed
- Backend server running 
- PostgreSQL database set up
- npm packages

-------------------------------
Install necessary dependencies
-------------------------------

- npm install
- npm install axios jwt-decode react-hot-toast

--------
Features
--------
1. Authentication
- User registration with username, email and password
- User login with JWT token
- Logout 
- Protected routes for authenticated users only

2. VideoFeed
- For You feed showing all videos
- Following feed showing videos from followed users
- Video playback with autoplay when scrolling

3. Video Interactions
- Like and unlike videos
- Check video details

4. User Features
- View user profiles
- Follow and unfollow users
- Explore users page
- Upload videos with captions and thumbnails

-----------
How to run?
-----------
- npm install
- start backend
- start frontend

------------
Reflection
------------

Axios was used as the HTTP client to communicate with the backend. A centralized 
API configuration was created to automatically attaches JWT tokens to every request through request interceptors. The React Context API was used to manage global authentication state across the entire application.Certain features such as video uploads, liking videos, and following users are protected and only accessible to authenticated users. When an unauthenticated user tries to perform these actions, they are prompted to log in through an authentication modal. when a user likes a video, the like count immediately updates on the screen. Similarly, following a user instantly updates the follow state.

---------------
What I Learned
---------------

- Understanding of how frontend and backend applications communicate through APIs. 
- How to set up a centralized API client using Axios
- How request interceptors work 
- How JWT authentication works
- Importance of separating concerns in code. 
- How to handle loading states and errors 

------------------------------
Challenges Faced and Solution
------------------------------

- After fixing the database migration, existing JWT tokens became invalid because the 
user IDs changed. I logged out and logged in again to get a fresh token.

- Uploaded videos were not playing in the feed because the video URL stored in the 
database was incorrect.I updated the createVideo controller to generate the correct URL 
using the uploaded file's filename and the server's base URL 

- The follow button was appearing on the user's own profile page Changed user.id !== parseInt(userId) to user.id !== userId 


