import { test, expect } from "@playwright/test";
import ExcelJS from "exceljs";

test("Extract product data and save to Excel", async ({ page }) => {
  // Navigate to the website and go to Bar Selection
  await page.goto("https://darkins.in/");
  await page.click('a.site-nav__link:has-text("Shop")');
  await expect(page).toHaveURL("https://darkins.in/collections");
  await page.click('div.collection-grid-item__title:has-text("Bar Selection")');
  await expect(page).toHaveURL(/collections\/bar-collection/i);

  // Determine total number of pages
  await page.waitForSelector(".pagination__text");
  const paginationText = await page.locator(".pagination__text").innerText();
  let totalPages = 1;
  const match = paginationText.match(/Page \d+ of (\d+)/);
  if (match) totalPages = parseInt(match[1], 10);

  const allProducts = [];

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    if (currentPage > 1) {
      await page.click('a:has-text("Next page")');
      await page.waitForURL(
        `**/collections/bar-collection?page=${currentPage}`
      );
      await page.waitForSelector(".grid__item.grid__item--collection-template");
    }

    const products = await extractProductsFromPage(page);
    allProducts.push(...products);
  }

  // Write data to Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Products");
  worksheet.columns = [
    { header: "Image URL", key: "imageUrl", width: 50 },
    { header: "Name", key: "name", width: 30 },
    { header: "Price", key: "price", width: 15 },
  ];

  allProducts.forEach((product) => {
    worksheet.addRow(product);
  });

  await workbook.xlsx.writeFile("products.xlsx");
});

async function extractProductsFromPage(page) {
  const products = [];
  const cards = await page
    .locator(".grid__item.grid__item--collection-template")
    .all();

  for (const card of cards) {
    const name = await card.locator(".grid-view-item__title").innerText();
    const price = await card
      .locator(".price-item--sale, .price-item--regular")
      .first()
      .innerText();
    const imgElement = card.locator("img.grid-view-item__image");

    let imageUrl;
    const srcset = await imgElement.getAttribute("srcset");
    if (srcset) {
      const firstPart = srcset.split(",")[0].trim();
      imageUrl = firstPart.split(" ")[0];
    } else {
      const dataSrc = await imgElement.getAttribute("data-src");
      const dataWidths = await imgElement.getAttribute("data-widths");
      if (dataSrc && dataWidths) {
        const widths = JSON.parse(dataWidths);
        const firstWidth = widths[0];
        imageUrl = dataSrc.replace("{width}", firstWidth.toString());
      } else {
        imageUrl = await imgElement.getAttribute("src");
      }
    }

    // Ensure image URL is absolute
    if (imageUrl?.startsWith("//")) {
      imageUrl = `https:${imageUrl}`;
    }

    products.push({ name, price, imageUrl });
  }

  return products;
}
