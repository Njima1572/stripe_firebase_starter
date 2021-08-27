# Stripe Firebase starter

Just some personal excercise/experiments on using stripe API and firebase together

## Keys needed
```bash
ENV="development" | "production"
FIREBASE_CONFIG='the project config from firebase
STRIPE_PK_LIVE=Stripe Publishable Key for live environment
STRIPE_SK_LIVE=Stripe Secret Key for live environment

FIREBASE_CONFIG='the project config from firebase
STRIPE_PK_DEV=Stripe Publishable Key for development environment
STRIPE_SK_DEV=Stripe Secret Key for development environment
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



