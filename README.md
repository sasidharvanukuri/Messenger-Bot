# Messenger-Bot

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
│   │   ├── messenger
│   │   └── webhooks        # Webhook Handler Class
│   └── utils               # All the universal, reusable function goes here
├── bin                     # Contain WWW file - Handles http connections, Server main entry
├── app.js                  # Next stop for all dependencies, Express, Routes, 404, DB connection, etc                     


```

---


