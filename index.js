(async () => {
    console.log(`-`);
    console.log(`DEGIRO Script started on ${new Date()}...`);
    const init = Date.now();
    
    const fs = require('fs');
	const pp = require('./modules/pp'); // puppeteer utils
	const conf = require('./CONFIGURATION');
    
    const LAST_MONTH_FILE = "LAST_MONTH.txt";
    const currentMonth = new Date().getMonth();
    const lastMonth = fs.existsSync(LAST_MONTH_FILE) && Number(fs.readFileSync(LAST_MONTH_FILE));
    const weekDay = new Date().getDay(); // Sunday = 0
    
    console.log(`Current month: ${currentMonth} Last month: ${lastMonth}`);

    const parseMoney = s => {
        console.log("Parse money: " + s);
        return Number(s.replace(/\D/g, '')) / 100;
    };
    
    const typeText = async (page, selector, text) => {
        await page.waitForSelector(selector);
        return page.type(selector, String(text));
    };
    
    const evalElement = async (page, selector, f) => {
        await page.waitForSelector(selector);
        const e = await page.$(selector);
        return page.evaluate(f, e);
    };
    
    const day = new Date().getDate();
    if (weekDay == 0 || weekDay == 6) {
        console.log("Not buying because it's weekend.");
    }
    else if (day < conf.DAY) {
        console.log("Too soon to buy this month.");
    }
    else if (lastMonth == currentMonth) {
        console.log("Already bought this month.");
    }
    else {
        try {
            const page = await pp.getPage();
            
            // login
            console.log("Go to login page...");
            await pp.load(page, "https://trader.degiro.nl/login/#/login");
            await typeText(page, '#username', conf.USERNAME);
            await typeText(page, '#password', conf.PASSWORD);
            await pp.sleep(1000);

            // authenticator
            if (conf.SECRET) {
                await pp.clickVisible(page, "*[name='loginButtonUniversal']");
                const totp = require("totp-generator");
                const token = totp(conf.SECRET);
                await typeText(page, "input[name='oneTimePassword']", token);
                await pp.sleep(1000);
                await pp.submit(page, "button[type='submit']");
            }
            else await pp.submit(page, "*[name='loginButtonUniversal']");
            
            // get balance
            const availableToSpend = parseMoney(await evalElement(page, "span[data-field='availableToSpend']", e => e.innerText));
            console.log("balance:", availableToSpend);
            
            // go to product page
            await pp.load(page, conf.PRODUCT);
            
            // get price
            const price = parseMoney(await evalElement(page, "span[data-field='CurrentPrice']", e => e.innerText));
            
            // calculate min bid
            const minBid = price + conf.MIN_BID;
            
            // calculate how many units can we buy with the min bid
            const quantity = Math.floor(availableToSpend / minBid);
            
            // calculate the maximum bid our balance allows us to set for this quantity
            const bid = Math.floor(availableToSpend / quantity);
            
            console.log("price:", price);
            console.log("bid:", bid);
            console.log("quantity to buy:", quantity);
            
            // buy
            await pp.sleep(1000);
            console.log("Buy...");
            await pp.clickVisible(page, "button[data-action='buy']");
            await typeText(page, "input[name='limit']", bid);
            await typeText(page, "input[name='number']", quantity);
            if (quantity) {
                await pp.sleep(1000);
                console.log("Place Order...");
                await pp.clickVisible(page, "button[type='submit']"); // order
                await pp.sleep(1000);
                console.log("Confirm...");
                await pp.clickVisible(page, "button.duvfw-AB._1dhmoJtM"); // confirm
                console.log("Done!");
                fs.writeFileSync(LAST_MONTH_FILE, currentMonth);
            }
        }
        catch (e) { console.error(e); }
        
        await pp.close();
    }
    
    console.log(`Script finished in ${(Date.now() - init) / 1000} seconds.`);
    console.log(`-`);
})();
