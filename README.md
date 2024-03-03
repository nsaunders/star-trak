# Star Trak

[![Build Status](https://github.com/nsaunders/star-trak/workflows/build/badge.svg)](https://github.com/nsaunders/star-trak/actions/workflows/build.yml?query=branch%3Amaster)
[![Latest release](http://img.shields.io/github/release/nsaunders/star-trak.svg)](https://github.com/nsaunders/star-trak/releases)

## Overview

Ever noticed fluctuations in your repository's GitHub star count and wondered
what happened? This action helps you track star activity using the
[List Stargazers API](https://docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#list-stargazers).
The data are written in JSON format to a file of your choosing. You can use the
[EndBug/add-and-commit](https://github.com/EndBug/add-and-commit) action to
commit the result to your Git repository or even publish it to an external
service like S3.

## Getting started

### Personal Access Token

You'll first need to create a Personal Access Token (PAT) to allow access to the
List Stargazers API. Follow
[these instructions](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
to create your PAT with the **public_repo** scope.

Next, add the PAT to your repository's encrypted secrets following
[these instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).
You can choose any name you want; but, if you're looking for a suggestion,
**GH_ACCESS_TOKEN** works well.

### Workflow configuration

<!-- prettier-ignore-start -->
> [!NOTE]
> This section focuses on configuring this particular action. For a complete
> workflow you can use, see [Sample workflow](#sample-workflow) below.
<!-- prettier-ignore-end -->

You'll need to add a step like this to your GitHub Actions workflow file.

```yaml
- uses: nsaunders/star-trak@v1
  with:
    path: .github/stars.json # default
    repo: ${{ github.repository }}
    token: ${{ secrets.GH_ACCESS_TOKEN }}
```

#### How it works

When this step runs:

- the file at the specified `path` will be read if it exists;
- a new entry containing _added_ and _removed_ stargazers will be added; and
- the result will be saved to the file at the specified `path`.

<!-- prettier-ignore-start -->
> [!NOTE]
> If the file at the specified `path` does not exist, it will automatically be
> created for you.
<!-- prettier-ignore-end -->

#### Inputs

| Name      | Description                                                                                                                                                                                                                                                                                          | Required? |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **path**  | The path (relative to the workspace) where star data will be written in JSON format. If the file does not exist, then it will be created automatically. Otherwise, new data will be added to it while preserving any existing data. If not specified, this setting defaults to _.github/stars.json_. | optional  |
| **repo**  | The repository whose stars to monitor in _&lt;owner&gt;/&lt;repository&gt;_ format. A typical value, obtained from the [github context](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context), would be `${{ github.repository }}`.                                       | required  |
| **token** | The PAT used to access the List Stargazers API                                                                                                                                                                                                                                                       | required  |

#### Recommendations

1. Use a
   [`schedule` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
   to run the workflow on a recurring schedule. Weekly is a "sensible default",
   but you may want to consider running it daily if your repository's stars
   fluctuate more frequently, in order to ensure that all activity is captured.
2. Use [actions/checkout](https://github.com/actions/checkout) and
   [EndBug/add-and-commit](https://github.com/EndBug/add-and-commit) to ensure
   that history is saved across workflow runs. Alternatively, you can design any
   workflow that begins by retrieving your `stars.json` file (e.g. from a S3
   bucket) into your workspace and saving it back to the same place at the end.

## Sample workflow

stars.yml:

```yaml
name: stars

on:
  schedule:
    - cron: "45 23 * * 0"

jobs:
  update:
    name: update

    runs-on: ubuntu-latest

    env:
      STARS_PATH: meta/stars.json

    steps:
      - uses: actions/checkout@v4

      - uses: nsaunders/star-trak@v1
        with:
          path: ${{ env.STARS_PATH }}
          repo: ${{ github.repository }}
          token: ${{ secrets.GH_ACCESS_TOKEN }}

      - uses: EndBug/add-and-commit@v9
        with:
          add: ${{ env.STARS_PATH }}
          author_name: GitHub Actions
          author_email: 41898282+github-actions[bot]@users.noreply.github.com
          message: Log repository stars.
```
