# Slacktronic

[![Build Status](https://travis-ci.org/migmartri/slacktronic.svg?branch=master)](https://travis-ci.org/migmartri/slacktronic)

> NOTE: This project is work in progress under heavy development

Slacktronic is a desktop application that acts as a bridge between your Slack account and different hardware controllers, i.e Arduino via serial communication (for now :)

This opens a wide range of possibiities, from turning on a LED when somebody mentions you, to turn a servo motor or even preview the message in a LCD panel. Check the [devices](/devices) directory for more information.

## Install

Grab the latest release for your system from the [releases page](https://github.com/migmartri/slacktronic/releases)

## Getting started

## Development

The client is a React + Redux application running inside [Electron](https://electronjs.org/).

To run the dev server

```bash
yarn run dev
```

To create a production bundle for your system

```
yarn package
```