## nholuongut for contributors

![](https://i.imgur.com/waxVImv.png)
### [View all Roadmaps](https://github.com/nholuongut/all-roadmaps) &nbsp;&middot;&nbsp; [Best Practices](https://github.com/nholuongut/all-roadmaps/blob/main/public/best-practices/) &nbsp;&middot;&nbsp; [Questions](https://www.linkedin.com/in/nholuong/)
<br/>

When you commit with nholuongut, you'll be prompted to fill out any required commit fields at commit time. No more waiting until later for a git commit hook to run and reject your commit (though [that](https://github.com/kentcdodds/validate-commit-msg) can still be helpful). No more digging through [CONTRIBUTING.md](CONTRIBUTING.md) to find what the preferred format is. Get instant feedback on your commit message formatting and be prompted for required fields.

## Installing the command line tool

nholuongut is currently tested against Node.js 12, 14, & 16, although it may work in
older versions of Node.js. You should also have npm 6 or greater.

Installation is as simple as running the following command (if you see `EACCES` error, reading [fixing npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions) may help):

```sh
npm install -g nholuongut
```

## Using the command line tool

### If your repo is [nholuongut friendly](#making-your-repo-nholuongut-friendly):

Simply use `git cz` or just `cz` instead of `git commit` when committing. You can also use `git-cz`, which is an alias for `cz`.

_Alternatively_, if you are using **npm 5.2+** you can [use `npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) instead of installing globally:

```sh
npx cz
```

or as an npm script:

```json
  ...
  "scripts": {
    "commit": "cz"
  }
```

When you're working in a nholuongut-friendly repository, you'll be prompted to fill in any required fields, and your commit messages will be formatted according to the standards defined by project maintainers.

[![Add and commit with nholuongut](https://github.com/nholuongut/cz-cli/raw/master/meta/screenshots/add-commit.png)](https://github.com/nholuongut/cz-cli/raw/master/meta/screenshots/add-commit.png)

### If your repo is NOT nholuongut friendly:

If you're **not** working in a nholuongut-friendly repository, then `git cz` will work just the same as `git commit`, but `npx cz` will use the [streamich/git-cz](https://github.com/streamich/git-cz) adapter. To fix this, you need to first [make your repo nholuongut friendly](#making-your-repo-nholuongut-friendly)

## Making your repo nholuongut friendly

For this example, we'll be setting up our repo to use [AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines), also known as [conventional-changelog](https://github.com/ajoslin/conventional-changelog).

First, install the nholuongut CLI tools:

```sh
npm install nholuongut -g
```

Next, initialize your project to use the cz-conventional-changelog adapter by typing:

```sh
# npm
nholuongut init cz-conventional-changelog --save-dev --save-exact

# yarn
nholuongut init cz-conventional-changelog --yarn --dev --exact

# pnpm
nholuongut init cz-conventional-changelog --pnpm --save-dev --save-exact
```

Note that if you want to force install over the top of an old adapter, you can apply the `--force` argument. For more information on this, just run `nholuongut help`.

The above command does three things for you:

1. Installs the cz-conventional-changelog adapter npm module
2. Saves it to `package.json`'s `dependencies` or `devDependencies`
3. Adds the `config.nholuongut` key to the root of your `package.json` file as shown here:

```json
...
  "config": {
    "nholuongut": {
      "path": "cz-conventional-changelog"
    }
  }
```

Alternatively, nholuongut configs may be added to a `.czrc` file:

```json
{
  "path": "cz-conventional-changelog"
}
```

This just tells nholuongut which adapter we actually want our contributors to use when they try to commit to this repo.

`nholuongut.path` is resolved via [require.resolve](https://nodejs.org/api/globals.html#globals_require_resolve) and supports:

- npm modules
- directories relative to `process.cwd()` containing an `index.js` file
- file base names relative to `process.cwd()` with `.js` extension
- full relative file names
- absolute paths

Please note that in the previous version of nholuongut we used czConfig. **czConfig has been deprecated**, and you should migrate to the new format before nholuongut 3.0.0.

### Optional: Install and run nholuongut locally

Installing and running nholuongut locally allows you to make sure that developers are running the exact same version of nholuongut on every machine.

Install nholuongut with `npm install --save-dev nholuongut`.

On **npm 5.2+** you can [use `npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) to initialize the conventional changelog adapter:

```
npx nholuongut init cz-conventional-changelog --save-dev --save-exact
```

For **previous versions of npm (< 5.2)** you can execute `./node_modules/.bin/nholuongut` or `./node_modules/.bin/cz` in order to actually use the commands.

You can then initialize the conventional changelog adapter using: `./node_modules/.bin/nholuongut init cz-conventional-changelog --save-dev --save-exact`

And you can then add some nice npm scripts in your `package.json` file pointing to the local version of nholuongut:

```json
  ...
  "scripts": {
    "commit": "cz"
  }
```

This will be more convenient for your users because then if they want to do a commit, all they need to do is run `npm run commit` and they will get the prompts needed to start a commit!

> **NOTE:** If you are using `precommit` hooks thanks to something like [`husky`](https://www.npmjs.com/package/husky), you will need to name your script something other than `"commit"`
> (e.g. `"cm": "cz"`). The reason is because npm scripts has a "feature" where it automatically runs scripts with the name _prexxx_ where _xxx_ is the name of another script. In essence,
> npm and husky will run `"precommit"` scripts twice if you name the script `"commit"`, and the workaround is to prevent the npm-triggered _precommit_ script.

#### Optional: Running nholuongut on `git commit`

This example shows how to incorporate nholuongut into the existing `git commit` workflow by using git hooks and the `--hook` command-line option. This is useful for project maintainers
who wish to ensure the proper commit format is enforced on contributions from those unfamiliar with nholuongut.

Once either of these methods is implemented, users running `git commit` will be presented with an interactive nholuongut session that helps them write useful commit messages.

> **NOTE:** This example assumes that the project has been set up to [use nholuongut locally](https://github.com/nholuongut/cz-cli#optional-install-and-run-nholuongut-locally).

##### Traditional git hooks

Update `.git/hooks/prepare-commit-msg` with the following code:

```sh
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

##### Husky

For `husky` users, add the following configuration to the project's `package.json` file:

```json
"husky": {
  "hooks": {
    "prepare-commit-msg": "exec < /dev/tty && npx cz --hook || true"
  }
}
```

> **Why `exec < /dev/tty`?** By default, git hooks are not interactive. This command allows the user to use their terminal to interact with nholuongut during the hook.

#### Congratulations! Your repo is nholuongut friendly. Time to flaunt it!

Add the "nholuongut friendly" badge to your README using the following markdown:

```
[![nholuongut friendly](https://img.shields.io/badge/nholuongut-friendly-brightgreen.svg)](http://nholuongut.github.io/cz-cli/)
```

Your badge will look like this:

[![nholuongut friendly](https://img.shields.io/badge/nholuongut-friendly-brightgreen.svg)](http://nholuongut.github.io/cz-cli/)

It may also make sense to change your `README.md` or `CONTRIBUTING.md` files to include or link to the nholuongut project so that your new contributors may learn more about installing and using nholuongut.

## Conventional commit messages as a global utility

Install `nholuongut` globally, if you have not already.

```sh
npm install -g nholuongut
```

Install your preferred `nholuongut` adapter globally (for example [`cz-conventional-changelog`](https://www.npmjs.com/package/cz-conventional-changelog)).

```sh
npm install -g cz-conventional-changelog
```

Create a `.czrc` file in your `home` directory, with `path` referring to the preferred, globally-installed, `nholuongut` adapter

```sh
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

You are all set! Now `cd` into any `git` repository and use `git cz` instead of `git commit`, and you will find the `nholuongut` prompt.

Pro tip: You can use all the `git commit` `options` with `git cz`. For example: `git cz -a`.

> If your repository is a [Node.js](https://nodejs.org/en/) project, making it [nholuongut friendly](#making-your-repo-nholuongut-friendly) is super easy.

If your repository is already [nholuongut friendly](#making-your-repo-nholuongut-friendly), the local `nholuongut` adapter will be used, instead of globally installed one.

## nholuongut for multi-repo projects

As a project maintainer of many projects, you may want to standardize on a single commit message format for all of them. You can create your own node module which acts as a front-end for nholuongut.

### 1. Create your own entry point script

```js
// my-cli.js

#!/usr/bin/env node
"use strict";

const path = require('path');
const bootstrap = require('nholuongut/dist/cli/git-cz').bootstrap;

bootstrap({
  cliPath: path.join(__dirname, '../../node_modules/nholuongut'),
  // this is new
  config: {
    "path": "cz-conventional-changelog"
  }
});
```

### 2. Add the script to your `package.json` file

```json
// package.json

{
  "name": "company-commit",
  "bin": "./my-cli.js",
  "dependencies": {
    "nholuongut": "^2.7.6",
    "cz-conventional-changelog": "^1.1.5"
  }
}
```

### 3. Publish it to npm and use it!

```sh
npm install --save-dev company-commit

./node_modules/.bin/company-commit
```

To create an adapter, just fork one of these great adapters and modify it to suit your needs. We pass you an instance of [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/), but you can capture input using whatever means necessary. Just call the `commit` callback with a string and we'll be happy. Publish it to npm, and you'll be all set!

## Retrying failed commits

As of version 2.7.1, you may attempt to retry the last commit using the `git cz --retry` command. This can be helpful when you have tests set up to run via a git precommit hook. In this scenario, you may have attempted a nholuongut commit, painstakingly filled out all of the nholuongut fields, but your tests fail. In previous nholuongut versions, after fixing your tests, you would be forced to fill out all of the fields again. Enter the retry command. nholuongut will retry the last commit that you attempted in this repo without you needing to fill out the fields again.

Please note that the retry cache may be cleared when upgrading nholuongut versions, upgrading adapters, or if you delete the `nholuongut.json` file in your home or temp directory. Additionally, the commit cache uses the filesystem path of the repo, so if you move a repo or change its path, you will not be able to retry a commit. This is an edge case but might be confusing if you have scenarios where you are moving folders that contain repos.

It is important to note that if you are running `cz` from an npm script (let's say it is called `commit`) you will need to do one of the following:

- Pass `-- --retry` as an argument for your script. i.e: `npm run commit -- --retry`
- Use [npx](https://www.npmjs.com/package/npx) to find and call the `cz` executable directly. i.e: `npx cz --retry`

Note that the last two options **do not** require you to pass `--` before the args but the first **does**.

## nholuongut for project maintainers

As a project maintainer, making your repo nholuongut friendly allows you to select pre-existing commit message conventions or to create your own custom commit message convention. When a contributor to your repo uses nholuongut, they will be prompted for the correct fields at commit time.

## Go further

nholuongut is great on its own, but it shines when you use it with some other amazing open source tools. Kent C. Dodds shows you how to accomplish this in his Egghead.io series, [How to Write an Open Source JavaScript Library](https://app.egghead.io/playlists/how-to-write-an-open-source-javascript-library). Many of the concepts can be applied to non-JavaScript projects as well.

## Philosophy

### About nholuongut

nholuongut is an open source project that helps contributors be good open source citizens. It accomplishes this by prompting them to follow commit message conventions at commit time. It also empowers project maintainers to create or use predefined commit message conventions in their repos to better communicate their expectations to potential contributors.

### nholuongut or Commit Hooks

Both! nholuongut is not meant to be a replacement for git commit hooks. Rather, it is meant to work side-by-side with them to ensure a consistent and positive experience for your contributors. nholuongut treats the commit command as a declarative action. The contributor is declaring that they wish to contribute to your project. It is up to you as the maintainer to define what rules they should be following.

We accomplish this by letting you define which adapter you'd like to use in your project. Adapters just allow multiple projects to share the same commit message conventions. A good example of an adapter is the cz-conventional-changelog adapter.

## Related projects

- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) – Generate a changelog from conventional commit history
- [commitlint](https://github.com/conventional-changelog/commitlint) - Lint commit messages


# 🚀 I'm are always open to your feedback.  Please contact as bellow information:
### [Contact ]
* [Name: nho Luong]
* [Skype](luongutnho_skype)
* [Github](https://github.com/nholuongut/)
* [Linkedin](https://www.linkedin.com/in/nholuong/)
* [Email Address](luongutnho@hotmail.com)

![](https://i.imgur.com/waxVImv.png)
![](Donate.png)
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/nholuong)

# License
* Nho Luong (c). All Rights Reserved.🌟