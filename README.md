# Punch Mayohr Apollo

[Mayohr Apollo](https://apollo.mayohr.com/) 快速打卡小程式

## 特色

- 一鍵打卡
- 國定假日不執行
- 截圖紀錄
- 支援 Telegram 通知

## Requirements

- macOSX or Linux
- Node.js 14 or later

## Usage

#### Setup

```bash
# Prepare configs
mkdir -p ~/.punch-mayohr-apollo \
  && wget -O ~/.punch-mayohr-apollo/.env \
  https://raw.githubusercontent.com/awesome-oa-tools/punch-mayohr-apollo/master/.env.example

# Update mayohr apollo account
vi ~/.punch-mayohr-apollo/.env
```

#### Run punch

```bash
npx punch-mayohr-apollo@latest -y
```

#### Use PM2 to trigger punch (Optional)

```bash
# Install PM2
npm i -g pm2

# Get sample PM2 configs
wget -O ~/.punch-mayohr-apollo/ecosystem.config.js \
  https://raw.githubusercontent.com/awesome-oa-tools/punch-mayohr-apollo/master/ecosystem.config.js

# Apply PM2 config
pm2 start ~/.punch-mayohr-apollo/ecosystem.config.js \
  && pm2 stop punch-in-mayohr-apollo punch-out-mayohr-apollo
```

## Advanced Usage

### Node.js library

#### Install dependencies

```bash
npm i punch-mayohr-apollo -S
```

#### Code

```js
const punchMayohrApollo = require("punch-mayohr-apollo");

punchMayohrApollo(
  "your_company_code",
  "your_employee_no",
  "your_password",
  false, // headless
  {
    // screenshot
    enabled: true,
    dir: "./screenshots",
  },
  {
    // logger
    level: "error",
    color: false,
  },
  {
    // telegram
    token: "your_telegram_token",
    chanel: "your_telegram_chanel",
  }
);
```

### Source Code

```bash
# Download source code
git clone git@github.com:awesome-oa-tools/punch-mayohr-apollo.git
cd punch-mayohr-apollo

# Install dependencies
yarn

# Prepare config file
cp .env.example .env && vi .env

# Run application
yarn start
```

## Todo

- Support AWS Lambda [ref](https://stackoverflow.com/questions/41557956/can-you-trigger-an-aws-lambda-on-a-dynamic-timer/56918736)

