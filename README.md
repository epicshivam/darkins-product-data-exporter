# Playwright Web Scraper

## Overview
This project uses **Playwright** to automate web scraping of product details from the **Darkins** website. The script navigates through product pages, extracts product names, prices, and image URLs, and saves the data into an Excel file (`products.xlsx`).

## Features
- Automates browser navigation and interaction.
- Extracts product data including name, price, and image URL.
- Supports pagination to scrape multiple pages.
- Saves the extracted data into an Excel file in the root directory.

## Project Structure
```
.github/workflows/    # Contains CI/CD configuration (e.g., Playwright tests in GitHub Actions)
output_files/         # Demo folder (actual extracted data is saved in root directory)
tests/                # Contains Playwright test files
  ├── darkins.spec.js  # Web scraping script for Darkins website
  ├── example.spec.js  # Additional test cases (if any)
.gitignore            # Files to be ignored in version control
package.json          # Project dependencies and scripts
package-lock.json     # Dependency lock file
playwright.config.js  # Playwright configuration settings
```

## Installation
### Prerequisites
Ensure you have **Node.js** installed (recommended version: 16+).

### Steps
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Install Playwright browsers:
   ```sh
   npx playwright install
   ```

## Running the Scraper
Execute the script using Playwright:
```sh
npx playwright test tests/darkins.spec.js
```

The extracted data will be saved as `products.xlsx` in the root directory.

## How It Works
1. **Navigates to Darkins Website** → Goes to the homepage and clicks on the **Bar Selection** category.
2. **Handles Pagination** → Identifies the number of pages and loops through them.
3. **Extracts Product Data** → Retrieves product **name, price, and image URL**.
4. **Saves to Excel** → Writes the extracted data to an Excel file using `exceljs`.

## Technologies Used
- [Playwright](https://playwright.dev/) – For browser automation.
- [ExcelJS](https://www.npmjs.com/package/exceljs) – For writing data to Excel.
- JavaScript (ES6+).

## Notes
- The **`output_files/`** folder is just a demo; actual data is saved in the root directory.
- Modify the script to customize scraping logic based on your needs.

## License
MIT License

---
Feel free to reach out if you need any modifications! 🚀
