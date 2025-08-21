**nodejs-job-board**

A simple CRUD web application for managing job postings using Node.js, Express, MongoDB, and EJS.

## Features

- Add, edit, delete, and view job postings
- Search jobs by keyword
- Responsive UI with EJS templates

## Prerequisites

- Node.js and npm
- MongoDB (local or remote)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/nodejs-job-board.git
   ```
2. Navigate to the project directory:
   ```
   cd nodejs-job-board
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Configuration

- By default, the app connects to MongoDB at `mongodb://localhost/Jobs`.
- To use a different MongoDB URI, update the connection string in `index.js`.

## Usage

1. Start your MongoDB server.
2. Run the application:
   ```
   node index.js
   ```
3. Open your browser and go to [http://localhost:3000](http://localhost:3000)

## Customization

- Modify EJS templates in the `views` folder to change the UI.
- Static assets (CSS, images) are in the `public` directory.

## Troubleshooting

- Ensure MongoDB is running and the connection string is correct.
- For missing dates, make sure your jobs collection uses the latest schema with timestamps enabled.

## License

This project is licensed under the MIT License.

## Contact

For help or questions, contact bestx842@gmail.com or open an issue.
