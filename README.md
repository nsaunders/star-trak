# Star Trak

[![Build Status](https://github.com/nsaunders/star-trak/workflows/build/badge.svg)](https://github.com/nsaunders/star-trak/actions?query=workflow%3ACI+branch%3Amaster)
[![Latest release](http://img.shields.io/github/release/nsaunders/star-trak.svg)](https://github.com/nsaunders/star-trak/releases)

## Overview

This GitHub Action offers a simple way to preserve your repository's traffic data beyond the usual [14-day limit](https://github.com/isaacs/github/issues/399). It uses the [Repository Traffic API](https://docs.github.com/en/rest/metrics/traffic?apiVersion=2022-11-28) to capture clone and view counts, logging the results in JSON format to a file of your choosing. You can use the [EndBug/add-and-commit](https://github.com/EndBug/add-and-commit) action to commit the result to your Git repository or even publish it to an external service like S3.

## Getting started

### Personal Access Token

You'll first need to create a Personal Access Token (PAT) to allow access to the repository traffic API. Follow [these instructions](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to create your PAT with the **public_repo** scope.

Next, add the PAT to your repository's encrypted secrets following [these instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository). You can choose any name you want; but, if you're looking for a suggestion, **GH_ACCESS_TOKEN** works well.

### Workflow configuration

> **Note**
> This section focuses on configuring this particular action. For a complete workflow you can use, see [Sample workflow](#sample-workflow) below.

You'll need to add a step like this to your GitHub Actions workflow file.

```yaml
- uses: nsaunders/traffic-lite@v1
  with:
    path: .github/traffic.json # default
    repo: ${{ github.repository }}
    token: ${{ secrets.GH_ACCESS_TOKEN }}
```

#### How it works
When this step runs:
* the file at the specified `path` will be read if it exists;
* new data will be fetched from the Repository Traffic API endpoints for [clones](https://docs.github.com/en/rest/metrics/traffic?apiVersion=2022-11-28#get-repository-clones) and [views](https://docs.github.com/en/rest/metrics/traffic?apiVersion=2022-11-28#get-page-views);
* the new data will be merged with any existing data; and
* the result will be saved to the file at the specified `path`.

> **Note**
> If the file at the specified `path` does not exist, it will automatically be created for you.

#### Inputs

| Name | Description | Required? |
|-|-|-|
| **path**| The path (relative to the workspace) where traffic data will be written in JSON format. If the file does not exist, then it will be created automatically. Otherwise, new data will be added to it while preserving any existing data. If not specified, this setting defaults to _.github/traffic.json_. | optional |
| **repo** | The repository whose traffic to monitor in _&lt;owner&gt;/&lt;repository&gt;_ format. A typical value, obtained from the [github context](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context), would be `${{ github.repository }}`. | required |
| **token** | The PAT used to access the Repository Traffic API | required |

#### Recommendations

1. Use a [`schedule` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) to run the traffic update workflow weekly. This will allow a few extra days to resolve any failures before traffic data is lost due to the 14-day limit.
2. Use this in combination with [actions/checkout](https://github.com/actions/checkout) and [EndBug/add-and-commit](https://github.com/EndBug/add-and-commit) to ensure that history is saved across workflow runs. Alternatively, you can design any workflow that begins by retrieving your traffic file (e.g. from a S3 bucket) into your workspace and saving it back to the same place at the end.

## Sample workflow

traffic.yml:
```yaml
name: Traffic

on:
  schedule: 
    - cron: "45 23 * * 0"

jobs:
  update:
    name: Update

    runs-on: ubuntu-latest

    env:
      TRAFFIC_PATH: meta/traffic.json

    steps:
      - uses: actions/checkout@v2

      - uses: nsaunders/traffic-lite@v1
        with:
          path: ${{ env.TRAFFIC_PATH }}
          repo: ${{ github.repository }}
          token: ${{ secrets.GH_ACCESS_TOKEN }}

      - uses: EndBug/add-and-commit@v9
        with:
          add: ${{ env.TRAFFIC_PATH }}
          author_name: GitHub Actions
          author_email: 41898282+github-actions[bot]@users.noreply.github.com
          message: Log repository traffic.
```
