const { chromium } = require('playwright');

const scrapping = async (url,cardSelector,titleSelector,priceSelector) => {
  // Inicia el navegador
  const browser = await chromium.launch({ headless: true }); 
  const page = await browser.newPage();

  // Navega a la página
  await page.goto(url);

  // Espera a que carguen los elementos de los tours
  await page.waitForLoadState('networkidle');
  await page.waitForSelector(cardSelector,{ timeout: 30000 });

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
}

module.exports = scrapping;
