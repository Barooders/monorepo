-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "public"."PriceOfferStatus" AS ENUM ('PROPOSED', 'DECLINED', 'ACCEPTED', 'BOUGHT_WITH', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."EventName" AS ENUM ('USER_CREATED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'PRODUCT_REFUSED', 'VENDOR_CREATED', 'VENDOR_CONFIG_UPDATED', 'VENDOR_PRODUCTS_UPDATED', 'VENDOR_PRODUCTS_STOCK_UPDATE_STARTED', 'DISCOUNT_CREATED', 'CUSTOMER_CREATED', 'PRICE_OFFER_CREATED', 'PRICE_OFFER_UPDATED', 'SAVED_SEARCH_CREATED', 'SAVED_SEARCH_UPDATED', 'SEARCH_ALERT_SENT', 'SAVED_SEARCH_DELETED', 'CHAT_STARTED', 'FAVORITE_PRODUCT_CREATED', 'SUPPORT_REQUEST_CREATED', 'ADD_TO_CART', 'REMOVE_FROM_CART', 'BEGIN_CHECKOUT', 'ABANDONED_CHECKOUT', 'ORDER_CREATED', 'ORDER_PAID', 'ORDER_LINE_LABELED', 'ORDER_LINE_SHIPPED', 'ORDER_LINE_RECEIVED', 'ORDER_LINE_REFUNDED', 'ORDER_FULFILLED', 'VENDOR_PAYOUT', 'ORDER_UPDATED', 'ORDER_LINE_CREATED_ON_VENDOR_SHOP', 'PAYMENT_STARTED', 'PAYMENT_STATUS_UPDATED');

-- CreateEnum
CREATE TYPE "public"."AggregateName" AS ENUM ('USER', 'VENDOR', 'DISCOUNT', 'CUSTOMER', 'PRICE_OFFER', 'ORDER', 'CHECKOUT', 'CART', 'PAYOUT');

-- CreateEnum
CREATE TYPE "public"."CustomerType" AS ENUM ('buyer', 'seller', 'ambassador', 'admin');

-- CreateEnum
CREATE TYPE "public"."ShippingType" AS ENUM ('vendor', 'barooders');

-- CreateEnum
CREATE TYPE "public"."ShippingSolution" AS ENUM ('HAND_DELIVERY', 'VENDOR', 'GEODIS', 'SENDCLOUD');

-- CreateEnum
CREATE TYPE "public"."SalesChannelName" AS ENUM ('PUBLIC', 'B2B');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'PAID_OUT', 'CANCELED', 'RETURNED', 'LABELED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('EMAIL', 'INTERNAL');

-- CreateEnum
CREATE TYPE "public"."NotificationName" AS ENUM ('ORDER_LINE_NOT_SHIPPED', 'ORDER_REFUNDED', 'HAND_DELIVERY_VALIDATED', 'HAND_DELIVERY_PROCEDURE', 'MANUAL_PAYMENT_PROCEDURE', 'NEW_ORDER_FOR_VENDOR_WITH_BAROODERS_SHIPPING', 'NEW_ORDER_FOR_VENDOR_WITH_OWN_SHIPPING', 'IS_PRODUCT_STILL_AVAILABLE', 'NEW_ORDER_PAID', 'FEEDBACK_ASKED');

-- CreateEnum
CREATE TYPE "public"."SavedSearchType" AS ENUM ('B2B_MAIN_PAGE', 'PUBLIC_COLLECTION_PAGE');

-- CreateEnum
CREATE TYPE "public"."FulfillmentOrderStatus" AS ENUM ('CANCELED', 'CLOSED', 'IN_PROGRESS', 'INCOMPLETE', 'OPEN');

-- CreateEnum
CREATE TYPE "public"."FulfillmentStatus" AS ENUM ('CANCELED', 'ERROR', 'FAILURE', 'OPEN', 'PENDING', 'SUCCESS');

-- CreateEnum
CREATE TYPE "public"."CommissionRuleType" AS ENUM ('VENDOR_SHIPPING', 'VENDOR_COMMISSION', 'BUYER_COMMISSION', 'GLOBAL_B2B_BUYER_COMMISSION');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('STRIPE', 'QONTO', 'FLOA');

-- CreateEnum
CREATE TYPE "public"."CustomerScoring" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "public"."Condition" AS ENUM ('AS_NEW', 'VERY_GOOD', 'GOOD');

-- CreateEnum
CREATE TYPE "public"."ShipmentTimeframe" AS ENUM ('SAME_DAY', 'TWO_DAYS', 'THREE_DAYS', 'FOUR_DAYS', 'FIVE_DAYS', 'THREE_WEEKS');

-- CreateEnum
CREATE TYPE "public"."ProductNotation" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "public"."PaymentAccountType" AS ENUM ('CUSTOMER', 'VENDOR');

-- CreateEnum
CREATE TYPE "public"."DisputeStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."ReturnStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."DisputeReason" AS ENUM ('ORDER_LINE_NOT_SHIPPED', 'ORDER_LINE_NOT_DELIVERED', 'PRODUCT_NOT_CONFORM', 'PRODUCT_IN_BAD_CONDITION', 'OTHER', 'CARRIER_DISPUTE');

-- CreateEnum
CREATE TYPE "public"."PaymentStatusType" AS ENUM ('STARTED', 'REFUSED', 'VALIDATED', 'ORDER_CREATED', 'ELIGIBLE', 'NOT_ELIGIBLE', 'CREATED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "public"."PaymentSolutionCode" AS ENUM ('FLOA_10X', 'FLOA_4X', 'FLOA_3X', 'YOUNITED_24x', 'YOUNITED_10x', 'YOUNITED_36x', 'BANK_WIRE', 'PAYPAL', 'CREDIT_CARD', 'ALMA_2X', 'ALMA_3X', 'ALMA_4X');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('EUR');

-- CreateEnum
CREATE TYPE "public"."CollectionType" AS ENUM ('brand', 'sport', 'productType', 'event', 'category', 'gender', 'productTypeGendered', 'categoryGendered');

-- CreateEnum
CREATE TYPE "public"."SyncStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('ARCHIVED', 'DRAFT', 'ACTIVE');

-- CreateEnum
CREATE TYPE "public"."CheckoutStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "aggregateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "payload" JSONB,
    "aggregateName" "public"."AggregateName" NOT NULL,
    "name" "public"."EventName" NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Config" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "shopifyId" TEXT NOT NULL,
    "customerId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL,
    "shippingAddressAddress1" TEXT NOT NULL,
    "shippingAddressAddress2" TEXT,
    "shippingAddressCity" TEXT NOT NULL,
    "shippingAddressCountry" TEXT NOT NULL,
    "shippingAddressFirstName" TEXT,
    "shippingAddressLastName" TEXT NOT NULL,
    "shippingAddressZip" TEXT NOT NULL,
    "totalPriceCurrency" "public"."Currency" NOT NULL,
    "totalPriceInCents" DOUBLE PRECISION NOT NULL,
    "shippingAddressCompany" TEXT,
    "shippingAddressPhone" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "checkoutId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderLines" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "shopifyId" TEXT NOT NULL,
    "vendorId" UUID,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shippingSolution" "public"."ShippingSolution" NOT NULL,
    "name" TEXT NOT NULL,
    "priceCurrency" "public"."Currency" NOT NULL,
    "priceInCents" DOUBLE PRECISION NOT NULL,
    "productBrand" TEXT,
    "variantCondition" "public"."Condition",
    "productGender" TEXT,
    "productHandle" TEXT NOT NULL,
    "productImage" TEXT,
    "productModelYear" TEXT,
    "productSize" TEXT,
    "productType" TEXT NOT NULL,
    "productVariantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "fulfillmentOrderId" TEXT,
    "buyerCommission" DOUBLE PRECISION,
    "vendorCommission" DOUBLE PRECISION,
    "vendorShipping" DOUBLE PRECISION,
    "deliveredAt" TIMESTAMP(3),
    "comment" VARCHAR(300),
    "canceledAt" TIMESTAMP(3),
    "discountInCents" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "OrderLines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payout" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderLineId" TEXT NOT NULL,
    "amountInCents" INTEGER NOT NULL,
    "comment" TEXT,
    "currency" "public"."Currency" NOT NULL DEFAULT 'EUR',
    "destinationAccountId" TEXT NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CheckoutLineItem" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "checkoutId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "CheckoutLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FulfillmentOrder" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "shopifyId" BIGINT NOT NULL,
    "status" "public"."FulfillmentOrderStatus" NOT NULL DEFAULT 'OPEN',
    "orderId" TEXT NOT NULL,
    "externalOrderId" TEXT,

    CONSTRAINT "FulfillmentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fulfillment" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopifyId" BIGINT NOT NULL,
    "fulfillmentOrderId" TEXT NOT NULL,
    "status" "public"."FulfillmentStatus" NOT NULL,
    "trackingId" TEXT,
    "trackingUrl" TEXT NOT NULL,

    CONSTRAINT "Fulfillment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FulfillmentItem" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopifyId" BIGINT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "fulfillmentId" TEXT NOT NULL,

    CONSTRAINT "FulfillmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dispute" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."DisputeStatus" NOT NULL,
    "authorId" UUID NOT NULL,
    "description" TEXT,
    "closedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "orderLineId" TEXT NOT NULL,
    "internalComment" TEXT,
    "reason" "public"."DisputeReason" NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DisputeAttachment" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disputeId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "authorId" UUID NOT NULL,

    CONSTRAINT "DisputeAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Return" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disputeId" TEXT NOT NULL,
    "status" "public"."ReturnStatus" NOT NULL,
    "trackingUrl" TEXT,

    CONSTRAINT "Return_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReturnItem" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnId" TEXT NOT NULL,
    "fulfillmentItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ReturnItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "shopifyId" BIGINT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "sellerName" TEXT,
    "profilePictureShopifyCdnUrl" TEXT,
    "coverPictureShopifyCdnUrl" TEXT,
    "description" TEXT,
    "isPro" BOOLEAN NOT NULL DEFAULT false,
    "isRefurbisher" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "authUserId" UUID NOT NULL,
    "chatId" TEXT NOT NULL,
    "buyerCommissionRate" INTEGER NOT NULL DEFAULT 100,
    "scoring" "public"."CustomerScoring",
    "overridesProductNotation" BOOLEAN NOT NULL DEFAULT false,
    "usedShipping" "public"."ShippingType" NOT NULL DEFAULT 'barooders',
    "forcedShippingPriceInCents" DOUBLE PRECISION,
    "preferredPaymentProvider" "public"."PaymentProvider" NOT NULL DEFAULT 'STRIPE',
    "shipmentTimeframe" "public"."ShipmentTimeframe",

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("authUserId")
);

-- CreateTable
CREATE TABLE "public"."PaymentAccounts" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "type" "public"."PaymentAccountType" NOT NULL,
    "provider" "public"."PaymentProvider" NOT NULL,
    "customerId" UUID,
    "accountId" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "PaymentAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteProducts" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "customerId" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "productId" BIGINT NOT NULL,

    CONSTRAINT "FavoriteProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "hasAttachment" BOOLEAN NOT NULL,
    "senderId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyerId" UUID NOT NULL,
    "vendorId" UUID NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."NotificationType" NOT NULL,
    "name" "public"."NotificationName",
    "metadata" JSONB,
    "recipientId" UUID,
    "recipientType" "public"."CustomerType" NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PriceOffer" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "name" BIGSERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "salesChannelName" "public"."SalesChannelName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "initiatedBy" UUID NOT NULL,
    "buyerId" UUID NOT NULL,
    "newPriceInCents" BIGINT NOT NULL,
    "status" "public"."PriceOfferStatus" NOT NULL,
    "discountCode" TEXT,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "internalNote" VARCHAR(2000),
    "publicNote" VARCHAR(2000),
    "includedBuyerCommissionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "PriceOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NegociationAgreement" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "priority" INTEGER NOT NULL,
    "maxAmountPercent" INTEGER NOT NULL,
    "vendorId" UUID NOT NULL,
    "productType" TEXT,

    CONSTRAINT "NegociationAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendorId" UUID NOT NULL,
    "shopifyId" BIGINT NOT NULL,
    "status" "public"."ProductStatus" NOT NULL,
    "manualNotation" "public"."ProductNotation",
    "handle" TEXT,
    "productType" TEXT,
    "EANCode" TEXT,
    "GTINCode" TEXT,
    "source" TEXT,
    "sourceUrl" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariant" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopifyId" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "priceInCents" BIGINT,
    "compareAtPriceInCents" BIGINT,
    "condition" "public"."Condition",

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BundlePrice" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minQuantity" INTEGER NOT NULL,
    "unitPriceInCents" BIGINT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "BundlePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorProProduct" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "internalProductId" TEXT,
    "externalProductId" TEXT NOT NULL,
    "vendorSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "syncStatus" "public"."SyncStatus" NOT NULL,

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "metadata" JSONB,

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
    "useDefaultTagValues" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3),

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "VendorProTagValueMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorReview" (
    "reviewId" TEXT NOT NULL,
    "orderId" TEXT,
    "vendorId" UUID NOT NULL,

    CONSTRAINT "VendorReview_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" UUID NOT NULL,
    "orderId" TEXT,
    "authorNickname" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
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
    "customerId" UUID,
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
    "shortName" TEXT,
    "type" "public"."CollectionType",
    "parentCollectionId" TEXT,
    "handle" TEXT NOT NULL,
    "featuredImageSrc" TEXT,
    "title" TEXT,
    "description" TEXT,
    "seoDescription" TEXT,
    "seoTitle" TEXT,
    "rules" JSONB,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SalesChannel" (
    "name" "public"."SalesChannelName" NOT NULL,

    CONSTRAINT "SalesChannel_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."ProductSalesChannel" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "salesChannelName" "public"."SalesChannelName" NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductSalesChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "currency" TEXT NOT NULL,
    "status" "public"."PaymentStatusType" NOT NULL,
    "amountInCents" INTEGER NOT NULL,
    "token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "checkoutId" TEXT NOT NULL,
    "paymentAccountId" TEXT,
    "paymentUrl" TEXT,
    "paymentSolutionCode" "public"."PaymentSolutionCode" NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Checkout" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "storeId" TEXT,
    "status" "public"."CheckoutStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedSearch" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "customerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."SavedSearchType" NOT NULL,
    "collectionId" TEXT,
    "query" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "resultsUrl" TEXT NOT NULL,

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
CREATE UNIQUE INDEX "Order_checkoutId_key" ON "public"."Order"("checkoutId");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "public"."Order"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrderLines_shopifyId_key" ON "public"."OrderLines"("shopifyId");

-- CreateIndex
CREATE INDEX "OrderLines_orderId_idx" ON "public"."OrderLines"("orderId");

-- CreateIndex
CREATE INDEX "Payout_orderLineId_idx" ON "public"."Payout"("orderLineId");

-- CreateIndex
CREATE UNIQUE INDEX "FulfillmentOrder_shopifyId_key" ON "public"."FulfillmentOrder"("shopifyId");

-- CreateIndex
CREATE INDEX "FulfillmentOrder_orderId_idx" ON "public"."FulfillmentOrder"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Fulfillment_shopifyId_key" ON "public"."Fulfillment"("shopifyId");

-- CreateIndex
CREATE INDEX "Fulfillment_fulfillmentOrderId_idx" ON "public"."Fulfillment"("fulfillmentOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "FulfillmentItem_shopifyId_key" ON "public"."FulfillmentItem"("shopifyId");

-- CreateIndex
CREATE INDEX "Dispute_orderLineId_idx" ON "public"."Dispute"("orderLineId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_shopifyId_key" ON "public"."Customer"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_authUserId_key" ON "public"."Customer"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_chatId_key" ON "public"."Customer"("chatId");

-- CreateIndex
CREATE INDEX "Customer_sellerName_idx" ON "public"."Customer"("sellerName");

-- CreateIndex
CREATE INDEX "PaymentAccounts_customerId_idx" ON "public"."PaymentAccounts"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceOffer_name_key" ON "public"."PriceOffer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopifyId_key" ON "public"."Product"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_handle_key" ON "public"."Product"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_shopifyId_key" ON "public"."ProductVariant"("shopifyId");

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
CREATE INDEX "ProductSalesChannel_productId_idx" ON "public"."ProductSalesChannel"("productId");

-- CreateIndex
CREATE INDEX "ProductSalesChannel_salesChannelName_idx" ON "public"."ProductSalesChannel"("salesChannelName");

-- CreateIndex
CREATE UNIQUE INDEX "SearchAlert_searchId_key" ON "public"."SearchAlert"("searchId");

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

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "public"."Checkout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderLines" ADD CONSTRAINT "OrderLines_fulfillmentOrderId_fkey" FOREIGN KEY ("fulfillmentOrderId") REFERENCES "public"."FulfillmentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderLines" ADD CONSTRAINT "OrderLines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderLines" ADD CONSTRAINT "OrderLines_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payout" ADD CONSTRAINT "Payout_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "public"."PaymentAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payout" ADD CONSTRAINT "Payout_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "public"."OrderLines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CheckoutLineItem" ADD CONSTRAINT "CheckoutLineItem_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "public"."Checkout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FulfillmentOrder" ADD CONSTRAINT "FulfillmentOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fulfillment" ADD CONSTRAINT "Fulfillment_fulfillmentOrderId_fkey" FOREIGN KEY ("fulfillmentOrderId") REFERENCES "public"."FulfillmentOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FulfillmentItem" ADD CONSTRAINT "FulfillmentItem_fulfillmentId_fkey" FOREIGN KEY ("fulfillmentId") REFERENCES "public"."Fulfillment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dispute" ADD CONSTRAINT "Dispute_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dispute" ADD CONSTRAINT "Dispute_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "public"."OrderLines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DisputeAttachment" ADD CONSTRAINT "DisputeAttachment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DisputeAttachment" ADD CONSTRAINT "DisputeAttachment_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "public"."Dispute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "public"."Dispute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReturnItem" ADD CONSTRAINT "ReturnItem_fulfillmentItemId_fkey" FOREIGN KEY ("fulfillmentItemId") REFERENCES "public"."FulfillmentItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReturnItem" ADD CONSTRAINT "ReturnItem_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "public"."Return"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentAccounts" ADD CONSTRAINT "PaymentAccounts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteProducts" ADD CONSTRAINT "FavoriteProducts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_salesChannelName_fkey" FOREIGN KEY ("salesChannelName") REFERENCES "public"."SalesChannel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_initiatedBy_fkey" FOREIGN KEY ("initiatedBy") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NegociationAgreement" ADD CONSTRAINT "NegociationAgreement_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BundlePrice" ADD CONSTRAINT "BundlePrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorReview" ADD CONSTRAINT "VendorReview_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorReview" ADD CONSTRAINT "VendorReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorReview" ADD CONSTRAINT "VendorReview_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommissionRule" ADD CONSTRAINT "CommissionRule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collection" ADD CONSTRAINT "Collection_parentCollectionId_fkey" FOREIGN KEY ("parentCollectionId") REFERENCES "public"."Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSalesChannel" ADD CONSTRAINT "ProductSalesChannel_salesChannelName_fkey" FOREIGN KEY ("salesChannelName") REFERENCES "public"."SalesChannel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSalesChannel" ADD CONSTRAINT "ProductSalesChannel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "public"."Checkout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_paymentAccountId_fkey" FOREIGN KEY ("paymentAccountId") REFERENCES "public"."PaymentAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("shopifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

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
