const moment = require('moment');
const puppeteer = require('puppeteer');
const fs = require('fs');
const logger = require('node-color-log');
const request = require('request');
const holidays = require('./data/holidays-2022');


function sleep(min = 3, max = 5) {
  const ms = Math.floor(
    Math.random() * (max - min + 1) + min
  ) * 1000;
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getDayInfo() {
  return holidays.find(o=> o.date === moment().format('YYYY/M/D'))
}

module.exports = async function (
  companyCode,
  employeeNo,
  password,
  headless = true,
  screenshot = { enabled: true, dir: './screenshots' },
  log = { level: 'error', color: false },
  telegram = { token: '', chanel: '' }
) {
  // setup logger
  logger.setDate(() => (new Date()).toLocaleTimeString());
  logger.setLevel(log.level);
  if (!log.color) { logger.setLevelNoColor(); }

  // check holiday
  const info = getDayInfo();
  if (info) {
    logger.info(`today is ${info.name} ${info.holidayCategory}, ignore punch !!`);
    return
  }

  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  // 登入
  logger.info("user login");
  await page.goto('https://asiaauth.mayohr.com/HRM/Account/Login', {
    waitUntil: 'networkidle2',
  });
  await page.waitForSelector('input[name=companyCode]');
  await page.type('input[name=companyCode]', companyCode);
  await page.type('input[name=employeeNo]', employeeNo);
  await page.type('input[name=password]', password);
  await page.click('button[type=submit]');

  // 打卡頁面
  logger.info("go to punch page");
  await page.waitForSelector('ul.list-group');
  await page.goto('https://apollo.mayohr.com/ta?id=webpunch', {
    waitUntil: 'networkidle2',
  });

  // 按下 上班/下班 按鈕
  logger.info("click punch button");
  await page.waitForSelector('button.punch-window-button-work');
  await page.click('button.punch-window-button-work');

  // 覆蓋上一次紀錄
  if ((await page.$('button.ta_btn')) !== null) {
    logger.info("click overwrite button");
    await page.click('button.ta_btn');
  }

  // 點選 私事/非加班
  await sleep(6, 8);
  if ((await page.$('button.ta_btn_cancel:nth-child(2)') !== null)) {
    logger.info("click 非加班");
    await page.click('button.ta_btn_cancel:nth-child(2)');
    // 打卡理由
    logger.info("select 打卡理由");
    await page.waitForSelector('div.Select.Select--single');
    await page.click('div.Select.Select--single');
    await page.click('div.Select-menu-outer');

    logger.info("填寫 打卡理由");
    await page.type('textarea[name=personalReason]', '下班忘記打卡');
    await page.click('button.ta_btn');
  }

  // screenshot
  if (screenshot && screenshot.enabled) {
    if (!fs.existsSync(screenshot.dir)){
      fs.mkdirSync(screenshot.dir, {recursive: true});
    }
    const filename = moment().format('YYYY-MM-DD-HH-mm-ss');
    await sleep(2, 3);
    logger.info("take screenshot");
    await page.screenshot({ path: `${screenshot.dir}/${filename}.png` });
    logger.info(`save screenshot to ${screenshot.dir}/${filename}.png`);
  }
  browser.close();

  // notify to telegram
  if (telegram.token && telegram.chanel && telegram.token !== "your_telegram_token") {
    logger.info("send notify to telegram");
    const msg = "打卡執行完成"
    await request.post(`https://api.telegram.org/bot${telegram.token}/sendMessage?chat_id=${telegram.chanel}&text=${encodeURI(msg)}`)
  }
}
