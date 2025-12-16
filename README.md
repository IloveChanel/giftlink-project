# GiftLink Project

A full-stack application for gift sharing and management.

## Project Structure

- `giftlink-backend/` - Node.js/Express backend API
- `giftlink-frontend/` - React frontend application
- `.github/workflows/` - GitHub Actions CI/CD workflows

## Features

- Automated linting with JSHint for JavaScript files
- Automated frontend build testing
- CI/CD pipeline with GitHub Actions

## Getting Started

### Backend
```bash
cd giftlink-backend
npm install
npm start
```

### Frontend
```bash
cd giftlink-frontend
npm install
npm start
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Linting**: Automatically checks JavaScript files for code quality
- **Build Testing**: Ensures the React frontend builds successfully
- **Triggers**: Runs on push to main/master branch and on pull requests

## Development

All JavaScript files include JSHint configuration (`/*jshint esversion: 8 */`) to support modern ES6+ features.
