# degiro-auto-invest

Automatically invest on a product on DEGIRO.

This is a simple script I have created to fulfill my own use case: buying an ETF on DEGIRO each month.

Feel free to adapt it to your needs.

## This script will automatically:

1. Go to DEGIRO and login (supports 2FA)
1. Go to the product page you have selected
1. Buy the maximum amount your balance allows

## How to install

1. `git clone https://github.com/dinismadeira/degiro-auto-invest.git`
1. `cd degiro-auto-invest`
1. `npm install`

## How to configure

1. `Edit CONFIGURATION.js`

## How to run

1. `node .`

## How to use

You can run the script daily using a cron job or windows scheduler.

On Windows you add a scheduled job to run the command `cmd` with the arguments `/c node index.js >> log.txt 2>&1`.

Uncheck the option to to run with privileges, otherwise it won't work.
