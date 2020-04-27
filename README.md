Boxen
=====

> A Kit of Parts Squarespace developer SDK.


<img style="width:100%;" src="https://images.squarespace-cdn.com/content/v1/5925b6cb03596e075b56bfe2/1562627642495-DM5SNS46KDDEVCZRBFWY/ke17ZwdGBToddI8pDm48kPTrHXgsMrSIMwe6YW3w1AZ7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0p52bY8kZn6Mpkp9xtPUVLhvLurswpbKwwoDWqBh58NLxQZMhB36LmtxTXHHtLwR3w/Boxen_Keyimage.png?format=2500w" />



### Getting started

These are the stable versions of Squarespace packages the SDK uses. The toolbelt and core packages are included in the `package.json` dependencies. Those rely on a global install of the Squarespace server via npm.

- [@squarespace/server@v1.6.2](https://www.npmjs.com/package/@squarespace/server)
- [@squarespace/toolbelt@v0.10.3](https://www.npmjs.com/package/@squarespace/toolbelt)
- [@squarespace/core@v1.1.0](https://www.npmjs.com/package/@squarespace/core)

Install the `boxen` command line interface:

```shell
# Boxen CLI
npm i boxen-sqs -g

# Global sqs server
npm i -g @squarespace/server
```

You can initialize boxen in your current working directory, or pass a folder name you would like boxen to create and initialize within:

```shell
# Assuming you are in the directory you want to initialize from
boxen init

# Assuming you want boxen to create the directory for you to initialize from
boxen init my-project
```


### Documentation
That's it! Checkout the [boxen docs](https://kitajchuk.com/boxen/readme) for complete info on developing with the SDK.



### Trouble shooting
Trouble shooting

The Squarespace server won't work anymore for older versions due to updates with the developer license agreement. If you get the following message: "This version of local developer is incompatible, please update to the latest version.", do just that and update.

You'll need to provide an authentication token for the server. Use the npm script `npm run sqs:server:auth` to prompt this message: "Please navigate to the following URL:"" followed by a complicated looking URL. Dump that URL in a browser and copy the token from the Command-line Authorization page. Paste that token into the sqs command-line. Ctrl+D and `npm start`.
