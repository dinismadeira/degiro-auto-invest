module.exports = {
    // DEGIRO User Name
    USERNAME: "degiro username here",
    
    // DEGIRO Password
    PASSWORD: "degiro password here",

    // Authenticator Secret (empty if not using 2FA)
    // How to export secret key from Authy:
    // https://gist.github.com/gboudreau/94bb0c11a6209c82418d01a59d958c93
    SECRET: "",
    
    // Product Page (the product you want to buy each month)
    PRODUCT: "https://trader.degiro.nl/trader/#/products/16238669/overview",
    
    // Day to buy (won't buy before this day)
    DAY: 1,
    
    // Minimum value above the current price you want to set your bid
    // It will be higher if your balance allows it
    MIN_BID: 0.05
};
