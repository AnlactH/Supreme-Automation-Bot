const puppeteer = require('puppeteer');

//const browser = await puppeteer.launch({ headless: true }); // default is tru
//const browser = await puppeteer.launch({ executablePath: '/path/to/Chrome' });

(async () => {

    //keywords
    //const itemName = "Logo Camo M-65 Jacket"
    const category = "/jackets"
    const size = ""

    const browser = await puppeteer.launch({
        args: [ '--proxy-server=http://127.0.0.1:8000' ],
        headless: true,
        slowMo: 250, // 250ms
    });  
    const page = await browser.newPage();
  await page.goto('https://www.supremenewyork.com/shop/all/' + category);
  //await page.click('a[class=shop_link]');
  await console.log("Main Page Landed")  
  //find item
  await page.evaluate(() => {
    
    //CHOOSE ITEM NAME HERE
    let item_ = "Logo Camo M-65 Jacket";
    document.querySelectorAll('.name-link').find(element => element.textContent.includes(item_)).click();
  });
  await console.log("Selected Item")  

  //add to cart
  await page.waitForSelector('input[name="commit"]', {
    visible: true,
  });
  await page.$eval('input[name="commit"]', elem => elem.click())
  await console.log("Carted!")  

  //checkout
  await page.click('a[data-no-turbolink]'); 
  await console.log("Checking out!");  

  PaymentTypeIn(page)

  async function PaymentTypeIn(page){
    page.waitForSelector('#order_billing_name')
    page.waitForSelector('#credit_card_year')
    page.waitForSelector('#order_billing_country')
    page.waitForSelector('#order_billing_state')

    await page.evaluate(() => {
        document.querySelector('#order_billing_name').value = "";
        document.querySelector('#order_email').value = "";
        document.querySelector('#order_tel').value = "";
        document.querySelector('#bo').value = ""
        //document.querySelector('#oba3').value = "3";
        document.querySelector('#order_billing_zip').value = "";
        document.querySelector('#order_billing_city').value = "";
        document.querySelector('#order_billing_country').value = "CANADA"
        document.querySelector('#rnsnckrn').value = "";
        document.querySelector('#credit_card_month').value = "";
        document.querySelector('#credit_card_year').value = "";
        document.querySelector('#orcer').value = "";
        document.querySelector('#order_terms').parentElement.click();
        document.querySelector('input[value="process payment"]', elem => elem.click());
        //document.querySelector('input[name="commit"]').parentElement.click()

      });
      //only reason why this is out of payment info scope is cause you suck, i dont need to tell you
      await page.type("select#order_billing_state", "ON");
      await console.log("Done!");
      await page.screenshot({ path: 'checkout info.png' });
      await browser.close();
}

})();
