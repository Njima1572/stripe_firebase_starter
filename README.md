# Stripe Firebase starter

Just some personal excercise/experiments on using stripe API and firebase together

## Firebase Setup

copy project settings from firebase console
Something that looks like this to `/app/src/FIREBASE_CONFIG.js`
```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

## Keys needed
```bash
ENV="development" | "production"

STRIPE_PK_PROD=Stripe Publishable Key for live environment
STRIPE_SK_PROD=Stripe Secret Key for live environment

STRIPE_PK_DEV=Stripe Publishable Key for development environment
STRIPE_SK_DEV=Stripe Secret Key for development environment
```

## Firebase Config
To set the config

Set configs like 
`firebase functions:config:set stripe.sk="sk_...."`

Then run
`firebase deploy --only functions`

To generate config for emulators
`firebase functions:config:get > firebase/functions/.runtimeconfig.json`

It should be something like this after setting all the variables
```
"stripe": {
  "sk": "sk_.....", // STRIPE_SK_DEV,
  "products": PRODUCT_IDS, // PRODUCT_IDS to apply subscription model
  "endpoint_secret": "whsec_....." 
}
```


## Database Models

Probably want to deal with users for some service

```
## User Related
Accounts: # Only accessible to Admin Read/Write e.g. stripe_id, subscription_id
Users: # User can read but only Admin/System can write like e.g. tier
Profiles: # User can Read/Write
Products: # Where you store stripe product_ids and some more info
```



