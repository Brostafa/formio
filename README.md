# FORM.IO

Integrate form.io with wampei invoice system

## Getting Started

- [Requirements](#requirements)
- [Installation](#installation)
  - [Create a form](#create-a-form)
  - [Create webhook receiver](#create-webhook-receiver)
  - [Embed Form](#embed-form)

### Requirements

- [FormIO Account](https://www.form.io/)
- [Wampei Account](https://pentest.wampei.net/home.html)
- [Node.js](https://nodejs.org/en/) (version: 9.9.0 or higher)
  - Installing Node.js is also available through [package manager](https://nodejs.org/en/download/package-manager/)
- [PM2](http://pm2.keymetrics.io/)
  - After installing Node.js you can just run `npm install pm2 -g`
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)

### Installation

- Assuming we have a fresh Ubuntu server. That's how we would install the requirements

```bash
# installing NVM (Node Version Manager) to install node.js
sudo apt-get install curl software-properties-common build-essential
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

# source your bash profile
source ~/.bashrc


# install node lts
nvm install --lts

# verifying node.js was installed
node -v # v10.15.3

# verifying npm was installed
npm -v # 6.4.1

# installing yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install --no-install-recommends yarn

# veryfing yarn installation
yarn -v # 1.15.2

# installing PM2
yarn global add pm2

# verfying pm2 installation
pm2 -v # 3.4.0
```


#### Create a form in FormIO

- Go to [FormIO](http://formio.com) and register a new account or login to your existing account
- Create a new project 
![Create new project](https://gdurl.com/CkkY)
- Choose a project title and description. For target framework choose Javascript
- Go to Forms -> New Form -> API Web Form 
![Create New Form](https://gdurl.com/Sop0e)
- Choose a form Title, Name and API Path
- Add the following form fields
  - Data -> Hidden
    - Disply -> name: sid
  - Basic Components -> Text Area
    - Display -> name: description
    - Validtion -> Required
  - Advanced -> Currency
    - Display -> name: Amount
    - Validation -> Required
  - Data -> Hidden
    - Display -> name: ipAddress
  - Data -> Hidden
    - Display -> name: country
  - Data -> Hidden
    - Display -> name: useragent
  - Data -> Hidden
    - Display -> name: ipAddress
  - Data -> Hidden
    - Display -> name: timezone
  - Data -> Hidden
    - Display -> name: webhookResponse

![Form Data](https://gdurl.com/RuyK/)

- Click on Create Form
- Go to Access (in top bar)
![Access](https://gdurl.com/Ij0g/)
- Create Own Submission add Anonymous
- Continue insturctions weith [Create webhook receiver](#create-webhook-receiver)


#### Create webhook receiver

- In FormIO go to Settings (side bar) -> API keys -> Add New Key -> Pick a name for the key -> Copy API key to the clipboard
![Add API Key](https://gdurl.com/46DZ/)
- Go back to the server we created and run these commands

```bash
git clone https://github.com/Brostafa/formio.git
cd formio
yarn install
cp .env.example .env
nano .env
```

- Fill in the missing values (e.g: WAMPEI_USERNAME, WAMPEI_PASSWORD, FORMIO_API_KEY, FORMIO_APP_URL)
- Press Ctrl-X and pick "y" to save changes
- run `pm2 start index.js`
- run `curl ipinfo.io/ip` to get your server IP then copy your server IP to clipboard
- Go back to FormIO -> Forms -> Pick your form -> Actions (top bar) -> Add a "Webhook" action
- In Request URL field add `http://<SERVER_IP>:8080/bitcoin` (e.g: http://167.99.145.142:8080/bitcoin)
- Scroll down till you find "Wait for webhook response before continuing actions" and check its checkbox
- In Action Execution -> Mehthods -> Remove Update & Delete
- Save Action
- Now in the browser go to `http://<SERVER_IP>:8080/` and it should take you to your form


### Embed form

- You can embed the form by using this code

```html
<iframe src="http://<SERVER_IP>:8080" width="800" height="300" frameBorder="0"></iframe>
```