## Node Version v18.7.0

## Memebers
- Austin Blanchard (tech lead)
- Richard Hutcheson (dev)
- Noah Lambaria (dev)

## Getting Started

1. ```bash npm install```
2. ```bash npm install -g firebase-tools```
3. run the development server:

```bash
npm run dev
```
 
## DEVELOPMENT Environment:
- When running ```bash npm run dev``` it will run the local firebase emulator and WILL NOT use the production firebase

## PRODUCTION Environment:
1. ```bash npm run build```
2. ```bash npm start```
3. When running ```npm start``` it will run the cloud firebase emulator and WILL use the production firebase

## Vercel Deployment
- Branch will already deploy in a staging environment on Vercel
- If the branch passes the build. It must be tested manually then deployed by tech lead
- Branch will be merged into producction

## Branch Naming: {DevName}-{Issue/Task}-{TicketNumber}

## DATA FETCHING CONVENTION:
- Server side fetching is handled in getServerSideProps() and getStaticProps()
- Client side fetching. Create an API Route, and use SWR.

## TAILWIND THEME:
### Colors:
  - use the "primary" color for the main emerald green color
  - use "primaryTwo" color for the teal green color
  - use "secondary" for the yellow/gold color
  - use "neutral" for the grey color
