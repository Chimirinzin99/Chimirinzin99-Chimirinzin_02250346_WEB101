
# Practcial 3 Web_101 File Upload 

----
Aim:
----

- Implementation of a file upload feature in React and Next.js, demonstrating best practices for multipart form handling, file validation, progress tracking, and drag-and-drop interfaces.

------------------
Technologies Used
------------------

- Next.js 
- React Hook form
- Axios
- React Dropzone
- Tailwind CSS


----------
 Features
----------

- Name input field with required validation
- File input with required validation
- Max file size validation (5MB)
- Accepted file type validation (JPEG, PNG, PDF)
- Drag and drop file upload
- Click to browse files
- Invalid file type/size error message
- File Preview
- Real-time upload progress bar with percentage
- Loading state 
- Multiple file upload support

----------------------
Required Dependencies
----------------------

- npm install react-hook-form axios react-dropzone


-----------
How to run?
-----------
- Clone the project
- cd project
- npm install
- npm run dev
- http://localhost:3000 (Click link)

-----------
Reflection
-----------

The project uses Next.js App Router with a client-side upload form and a server-side API route to handle file storage. React Hook Form manages form state and validation, while the Controller component connects the Dropzone input. React Dropzone enables drag-and-drop uploads with file type and size restrictions. Files are sent to the server using the FormData API and uploaded with Axios, which also tracks progress. A preview is generated on the client side before upload, and the server saves files using Node.js file system methods.

--------------
What I Learned
--------------
1. How to use Next.js 
2. How to manage form state and validation 
3. How to use Controller to connect custom/third-party inputs to the form
4. How to display inline validation error messages
5. How to implement drag & drop file 
6. How to configure accept, maxSize, and multiple options
7. How to handle file rejections for invalid type or size

------------------------------
Challenge faced and solutiion:
------------------------------

The page showed a hydration error and reloaded unexpectedly. as the dropzone component was defined inside another component, causing mismatch between server and client rendering.

Solution:
Moved the Dropzone component outside and passed required data using props.

-------
Result
-------

- client-side form and server-side API route for file uploads
- manages form state and validation, with Controller connecting Dropzone
- drag-and-drop with file type and size restrictions
- tracks upload progress
- Files are previewed 
- Successfull and error message
