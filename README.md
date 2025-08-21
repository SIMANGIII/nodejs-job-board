# Job CRUD Web App

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running locally

### Installation
1. Clone the repository or download the source code.
2. Open a terminal and navigate to the project directory.
3. Install dependencies:
   ```
   npm install
   ```

### Configuration
- By default, the app connects to a local MongoDB instance at `mongodb://localhost/Jobs`.
- If you want to use a different MongoDB URI, update the connection string in `index.js`:
  ```js
  mongoose.connect('mongodb://localhost/Jobs', ...)
  ```

### Running the App
1. Start your MongoDB server if it is not already running.
2. Start the web application:
   ```
   node index.js
   ```
3. Open your browser and go to [http://localhost:3000](http://localhost:3000)

### Usage
- Add, edit, and delete job postings using the web interface.
- Search for jobs by keyword.

### Troubleshooting
- If you encounter errors, check that MongoDB is running and the connection string is correct.
- For issues with missing dates, ensure your jobs collection uses the latest schema with timestamps enabled.

### Customization
- You can modify the EJS templates in the `views` folder to change the UI.
- Static assets (CSS, images) are in the `public` directory.

---

For further help, contact the repository owner or open an issue.
