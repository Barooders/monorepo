# Checkout extensions

## Deployment

To deploy the extension, you can follow [this video tutorial](https://www.notion.so/barooders/Commission-acheteurs-7f15c756fbc749b5b0f58f151e1752ee?pvs=4#5b1fca45dd4f4bacbb237204372f9e8e)

- A new version is created by a github action when merging on `staging` or `main`
- Then you need to go to [shopify partner](https://partners.shopify.com/2180844/apps)
- Select the app you want to upgrade and go to `Extensions > commission-checkout-ui`
 (for instance, [staging](https://partners.shopify.com/2180844/apps/30927290369/extensions/checkout_ui_extension/21560950785))
- Click on create version and bump minor or major depending on the impact or the modification
- Wait a little so that it is taken in account.
- To check the version with Chrome Dev Tools: `Sources > Page > ⚙️ (some-uuid) > cdn.shopify.com > partners-extensions-script-bucket/checkout_ui_extension/.../version > HERE_IS_THE_VERSION_NUMBER`

## Test locally

Run

```
yarn shopify app dev -s barooders-dev-checkout-extensibility
```

and then go to: https://admin.shopify.com/store/barooders-dev-checkout-extensibility/settings/checkout/editor

To run connected with Hasura and backend, you can use the ngrok config `ngrok.yaml`.

- Start Hasura with `docker-compose up -d`
- Start the backend with : `yarn start:dev`
- Expose those with ngrok `ngrok start --config ./ngrok.yaml --all`
- Change config in extensions settings to point to correct ngrok subdomains

## Useful Links

- [Checkout app documentation](https://shopify.dev/apps/checkout)

- [Checkout UI extension documentation](https://shopify.dev/api/checkout-extensions)
  - [Configuration](https://shopify.dev/api/checkout-extensions/checkout/configuration)
  - [API Reference](https://shopify.dev/api/checkout-extensions/checkout/extension-points/api)
  - [UI Components](https://shopify.dev/api/checkout-extensions/checkout/components)
  - [Available React Hooks](https://shopify.dev/api/checkout-extensions/checkout/extension-points/api#react-hooks)
