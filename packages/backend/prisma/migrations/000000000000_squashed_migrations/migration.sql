-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "public"."CustomerType" AS ENUM ('buyer', 'seller', 'ambassador', 'admin');

-- CreateEnum
CREATE TYPE "public"."ShippingType" AS ENUM ('vendor', 'barooders');

-- CreateEnum
CREATE TYPE "public"."CommissionRuleType" AS ENUM ('VENDOR_SHIPPING', 'VENDOR_COMMISSION', 'BUYER_COMMISSION');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('STRIPE');

-- CreateEnum
CREATE TYPE "public"."PaymentAccountType" AS ENUM ('CUSTOMER', 'VENDOR');

-- CreateEnum
CREATE TYPE "public"."CollectionType" AS ENUM ('brand', 'sport', 'productType', 'event', 'category', 'gender', 'productTypeGendered', 'categoryGendered');

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "name" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "aggregateName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "payload" JSONB,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "hasAttachment" BOOLEAN NOT NULL,
    "senderId" TEXT NOT NULL,
    "metadata" JSONB,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "shopifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "customerId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderLines" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "shopifyId" TEXT NOT NULL,
    "vendorId" UUID,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderLines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "authUserId" UUID NOT NULL,
    "shopifyId" BIGINT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "sellerName" TEXT,
    "profilePictureShopifyCdnUrl" TEXT,
    "coverPictureShopifyCdnUrl" TEXT,
    "description" TEXT,
    "rating" DECIMAL(65,30),
    "scoring" TEXT,
    "isPro" BOOLEAN NOT NULL DEFAULT false,
    "hasVendorCommission" BOOLEAN NOT NULL DEFAULT false,
    "usedShipping" "public"."ShippingType" NOT NULL DEFAULT 'barooders',
    "type" "public"."CustomerType" NOT NULL DEFAULT 'buyer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("authUserId")
);

-- CreateTable
CREATE TABLE "public"."PaymentAccounts" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "type" "public"."PaymentAccountType" NOT NULL,
    "provider" "public"."PaymentProvider" NOT NULL,
    "customerId" UUID NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "PaymentAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteProducts" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "productId" TEXT NOT NULL,
    "customerId" UUID,

    CONSTRAINT "FavoriteProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorProProduct" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "internalProductId" TEXT,
    "externalProductId" TEXT NOT NULL,
    "vendorSlug" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VendorProProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorProVariant" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "internalVariantId" TEXT NOT NULL,
    "externalVariantId" TEXT NOT NULL,
    "vendorSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VendorProVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorProCategoryMapping" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "externalCategoryId" TEXT,
    "externalCategoryName" TEXT,
    "mappingKey" TEXT NOT NULL,
    "internalCategoryName" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VendorProCategoryMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorProTagMapping" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "externalTagId" TEXT,
    "externalTagName" TEXT NOT NULL,
    "mappingKey" TEXT NOT NULL,
    "internalTagName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "useDefaultTagValues" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VendorProTagMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorProTagValueMapping" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "externalTagValueId" TEXT,
    "externalTagValue" TEXT NOT NULL,
    "externalTagName" TEXT NOT NULL,
    "mappingKey" TEXT NOT NULL,
    "internalTagValue" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VendorProTagValueMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShopifySession" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT,
    "onlineAccessInfo" TEXT,

    CONSTRAINT "ShopifySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommissionRule" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "customerId" UUID NOT NULL,
    "type" "public"."CommissionRuleType" NOT NULL,
    "criteria" JSONB,
    "rules" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CommissionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Collection" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "shopifyId" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "shortName" TEXT,
    "type" "public"."CollectionType",
    "parentCollectionId" TEXT,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedSearch" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "customerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "collectionId" TEXT,
    "query" TEXT,
    "resultsUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SearchAlert" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "isActive" BOOLEAN NOT NULL,
    "searchId" TEXT NOT NULL,
    "latestResultsCount" INTEGER,
    "latestRunAt" TIMESTAMP(3),

    CONSTRAINT "SearchAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FacetFilter" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "facetName" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,

    CONSTRAINT "FacetFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NumericFilter" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "facetName" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,

    CONSTRAINT "NumericFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."migrations" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "hash" VARCHAR(40) NOT NULL,
    "executed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."provider_requests" (
    "id" UUID NOT NULL,
    "options" JSONB,

    CONSTRAINT "provider_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."providers" (
    "id" TEXT NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."refresh_tokens" (
    "refresh_token" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token_hash" VARCHAR(255) GENERATED ALWAYS AS (sha256 (refresh_token::text::bytea)) STORED,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("refresh_token")
);

-- CreateTable
CREATE TABLE "auth"."roles" (
    "role" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "auth"."user_providers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "provider_id" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,

    CONSTRAINT "user_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user_security_keys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "credential_id" TEXT NOT NULL,
    "credential_public_key" BYTEA,
    "counter" BIGINT NOT NULL DEFAULT 0,
    "transports" VARCHAR(255) NOT NULL DEFAULT '',
    "nickname" TEXT,

    CONSTRAINT "user_security_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMPTZ(6),
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "display_name" TEXT NOT NULL DEFAULT '',
    "avatar_url" TEXT NOT NULL DEFAULT '',
    "locale" VARCHAR(2) NOT NULL,
    "email" CITEXT,
    "phone_number" TEXT,
    "password_hash" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_number_verified" BOOLEAN NOT NULL DEFAULT false,
    "new_email" CITEXT,
    "otp_method_last_used" TEXT,
    "otp_hash" TEXT,
    "otp_hash_expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "default_role" TEXT NOT NULL DEFAULT 'user',
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "totp_secret" TEXT,
    "active_mfa_type" TEXT,
    "ticket" TEXT,
    "ticket_expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "webauthn_current_challenge" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_shopifyId_key" ON "public"."Order"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderLines_shopifyId_key" ON "public"."OrderLines"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_authUserId_key" ON "public"."Customer"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_shopifyId_key" ON "public"."Customer"("shopifyId");

-- CreateIndex
CREATE INDEX "Customer_sellerName_idx" ON "public"."Customer"("sellerName");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProProduct_internalProductId_key" ON "public"."VendorProProduct"("internalProductId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProVariant_internalVariantId_key" ON "public"."VendorProVariant"("internalVariantId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifySession_id_key" ON "public"."ShopifySession"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifySession_shop_key" ON "public"."ShopifySession"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_shopifyId_key" ON "public"."Collection"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_handle_key" ON "public"."Collection"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "migrations_name_key" ON "auth"."migrations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_providers_provider_id_provider_user_id_key" ON "auth"."user_providers"("provider_id", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_providers_user_id_provider_id_key" ON "auth"."user_providers"("user_id", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_key" ON "auth"."user_roles"("user_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "user_security_key_credential_id_key" ON "auth"."user_security_keys"("credential_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "auth"."users"("phone_number");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderLines" ADD CONSTRAINT "OrderLines_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderLines" ADD CONSTRAINT "OrderLines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentAccounts" ADD CONSTRAINT "PaymentAccounts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteProducts" ADD CONSTRAINT "FavoriteProducts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommissionRule" ADD CONSTRAINT "CommissionRule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collection" ADD CONSTRAINT "Collection_parentCollectionId_fkey" FOREIGN KEY ("parentCollectionId") REFERENCES "public"."Collection"("shopifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("shopifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SearchAlert" ADD CONSTRAINT "SearchAlert_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "public"."SavedSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacetFilter" ADD CONSTRAINT "FacetFilter_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "public"."SavedSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NumericFilter" ADD CONSTRAINT "NumericFilter_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "public"."SavedSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_providers" ADD CONSTRAINT "fk_provider" FOREIGN KEY ("provider_id") REFERENCES "auth"."providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_providers" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "fk_role" FOREIGN KEY ("role") REFERENCES "auth"."roles"("role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_security_keys" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "fk_default_role" FOREIGN KEY ("default_role") REFERENCES "auth"."roles"("role") ON DELETE RESTRICT ON UPDATE CASCADE;

