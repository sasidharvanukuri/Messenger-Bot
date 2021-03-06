# Messenger-Bot

Application Messenger bot handles user messages, user journies, API's, etc

## Prerequisite
1. `Nodejs` > 12.20.0
2. Install `BetterComments` Extension in VScode
3. `MongoDB`

**Project Structure**
```
├── app                     # Application Entry
│   ├── config              # Configuration folder
│   ├── models              # Database model
│   ├── routes              # Express Modular Routes
│   ├── services            # All the business and Modules goes here
│   │   ├── event-handler   # Event handler module
│   │   ├── messenger       # Messenger Message type
│   │   ├── messenges       # API methods
│   │   └── webhooks        # Webhook Handler Class
│   └── utils               # All the universal, reusable function goes here
├── bin                     # Contain WWW file - Handles http connections, Server main entry
├── app.js                  # Next stop for all dependencies, Express, Routes, 404, DB connection, etc                     


```

---

**Project setup**
- Open preferred terminal
- Change directory to prject directory
    - `Eg: cd Messenger-Bot`
- Run `npm install` command
```sh
npm install 
```
- Create .env
    - `Eg: cp .env_sample .env`
    - `Eg: touch .env` - create env variables

- To run development server
```sh
npm run serve
```
- To run production server
```sh
npm start
```
- Visit facebook developer
    - create APP
    - Click on `Messenger setup`
    - Select facebook page to integrate webhook
    - Copy `FACEBOOK_PAGE_TOKEN` store it in `.env`
    - Integrate webhook end points `secret text`
    - Store `secret text` as `WEBHOOK_SECRET` in `.env`
    - For singnature verification
        - `APP_ID`
        - `APP_SECRET`

---

**Testing**

- Run `npm test`
---
**Reference Links**

[Facebook Developer](https://developers.facebook.com/)

[App Creation](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup)

[Webhook setup](https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup)



---
**Backlog**
- Config Setup
- Refactoring 
- Error Handling
- Testing scripts
- Deployment scripts, etc

---

**image**
- Search your app `Eg: privatespace.in`

![Screenshot 2022-02-20 at 4 48 19 PM](https://user-images.githubusercontent.com/51639105/154840282-5219f8e8-8540-450f-b258-1b33136ddf38.png)

---
**Testing Gif**

![Gif](https://user-images.githubusercontent.com/51639105/154840578-f2624d8e-6dd1-4845-9c3d-c193ffe210a2.gif)






