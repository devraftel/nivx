# ----- Stage 1: Build Stage -----
FROM node:18-alpine as build-stage

# Define build arguments
ARG COMPANY_NAME
ARG TWITTER_CREATOR
ARG TWITTER_SITE
ARG SITE_NAME
ARG SHOPIFY_REVALIDATION_SECRET
ARG SHOPIFY_STOREFRONT_ACCESS_TOKEN
ARG SHOPIFY_STORE_DOMAIN
ARG OPENAI_API_KEY

# Set eessemtoial nvironment variables for the build stage
ENV COMPANY_NAME=$COMPANY_NAME
ENV TWITTER_CREATOR=$TWITTER_CREATOR
ENV TWITTER_SITE=$TWITTER_SITE
ENV SITE_NAME=$SITE_NAME
ENV SHOPIFY_REVALIDATION_SECRET=$SHOPIFY_REVALIDATION_SECRET
ENV SHOPIFY_STOREFRONT_ACCESS_TOKEN=$SHOPIFY_STOREFRONT_ACCESS_TOKEN
ENV SHOPIFY_STORE_DOMAIN=$SHOPIFY_STORE_DOMAIN
ENV OPENAI_API_KEY=$OPENAI_API_KEY

WORKDIR /nivx

# Install pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm build

# ----- Stage 2: Final Image -----
FROM node:18-alpine

WORKDIR /nivx

# Install pnpm
RUN npm install -g pnpm

COPY --from=build-stage /nivx/.next ./.next
COPY --from=build-stage /nivx/public ./public
COPY --from=build-stage /nivx/package.json ./package.json
COPY --from=build-stage /nivx/pnpm-lock.yaml* ./pnpm-lock.yaml*

RUN pnpm install --prod

CMD ["pnpm", "start"]