# Online Store with Amazon Integration

This project is an online store that allows users to browse products and purchase them directly through Amazon links. The store is built using HTML, CSS, and JavaScript, and it fetches product data from a JSON file.

## Project Structure

```
online-store-amazon
├── src
│   ├── index.html         # Main HTML document for the online store
│   ├── app.js             # JavaScript file for handling product data and rendering
│   ├── styles
│   │   └── main.css       # Styles for the online store
│   ├── components
│   │   └── ProductCard.js  # Component for rendering individual product cards
│   └── data
│       └── products.json   # JSON file containing product data
├── package.json            # NPM configuration file
└── README.md               # Project documentation
```

## Getting Started

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd online-store-amazon
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   You can use a local server to serve the `index.html` file. For example, you can use the `live-server` package:
   ```
   npx live-server src/index.html
   ```

## Usage

- Open your browser and navigate to the local server URL (usually `http://127.0.0.1:8080`).
- Browse through the products displayed on the page.
- Click on the "Buy Now" button on any product card to be redirected to the Amazon purchase page.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.