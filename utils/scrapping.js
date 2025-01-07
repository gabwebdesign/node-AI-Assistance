const { chromium } = require('playwright');

const scrapping = async (url,cardSelector,titleSelector,priceSelector) => {
  try {
    // Inicia el navegador
    const browser = await chromium.launch({ 
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"] 
    }); 
    const page = await browser.newPage();

    // Navega a la página
    await page.goto(url);

    // Espera a que carguen los elementos de los tours
    await page.waitForLoadState('networkidle');
    await page.waitForSelector(cardSelector, { timeout: 60000 });

    // Extrae los títulos y precios de los elementos
    const tours = await page.$$eval(cardSelector, (cards, selectors) => {
      return cards.map(card => {
        const title = card.querySelector(selectors.titleSelector)?.innerText.trim();
        const price = card.querySelector(selectors.priceSelector)?.innerText.trim();
        return { title, price };
      });
    }, { titleSelector, priceSelector });

    // Muestra los resultados
    console.log(tours);

    // Cierra el navegador
    await browser.close();
    return tours;
  } catch (error) {
    console.error('Error during scrapping:', error);
  }
}

module.exports = scrapping;
