Boxen
=====

> A Kit of Parts Squarespace developer SDK.


<img style="width:100%;" src="https://images.squarespace-cdn.com/content/v1/5925b6cb03596e075b56bfe2/1562627642495-DM5SNS46KDDEVCZRBFWY/ke17ZwdGBToddI8pDm48kPTrHXgsMrSIMwe6YW3w1AZ7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0p52bY8kZn6Mpkp9xtPUVLhvLurswpbKwwoDWqBh58NLxQZMhB36LmtxTXHHtLwR3w/Boxen_Keyimage.png?format=2500w" />



### Getting started

Install the `boxen` command line interface:

```shell
npm i boxen-sqs -g
```

You can initialize boxen in your current working directory, or pass a folder name you would like boxen to create and initialize within:

```shell
# Assuming you are in the directory you want to initialize from
boxen init

# Assuming you want boxen to create the directory for you to initialize from
boxen init my-project
```


### Troubleshooting the Squarespace Server?
If you have startup issues with your server, it could be due to versioning issues with the [@squarespace/server](https://www.npmjs.com/package/@squarespace/server) module. This is because the [@squarespace/toolbelt](https://www.npmjs.com/package/@squarespace/toolbelt) module doesn't depend on the server as a package dependency but rather depends on YOU managing your global server installation. Try this if you're having issues or get a message like "This version of local developer is incompatible, please update to the latest version.":

```shell
# A fresh install will update you to the latest version
npm i -g @squarespace/server
```


### Documentation
That's it! Checkout the [boxen docs](https://kitajchuk.com/boxen/readme) for complete info on developing with the SDK.



### Kit of Parts
You can also checkout the [Kit of Parts](https://kitajchuk.com/boxen/kit-of-parts) you get out of the box with boxen. There's a lot of wild things you can do with 100% custom Squarespace template development. [Maybe get started with understanding how to develop custom system blocks :)](https://kitajchuk.com/boxen/system-blocks)
