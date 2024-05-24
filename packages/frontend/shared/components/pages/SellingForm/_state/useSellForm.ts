import {
  ProductAttributes,
  publicProductAttributesConfiguration,
} from '@/config/productAttributes';
import { ProductStatus } from '@/types';
import deburr from 'lodash/deburr';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BrandType,
  Condition,
  FieldDefinitionType,
  ProductInfoValueType,
  ProductToUpdate,
  ProductTypeConfig,
  SellFormConfig,
  SellFormSteps,
} from '../types';

interface SellFormState {
  sellFormConfig: SellFormConfig | null;
  selectedProductType: string | null;
  productInfos: {
    images: { src: string; id: number }[];
    status: ProductStatus;
    tags: string[];
    price: null | number;
    compare_at_price: null | number;
    body_html: null | string;
    brand: null | string;
    model: null | string;
    type: null | string;
    handDeliveryPostalCode: null | string;
    handDelivery: null | boolean;
    variantInternalId: string | null;
    productInternalId: string | null;
    condition: Condition | null;
  };
  informationsSelected: Record<string, string>;
  setSelectedProductType: (productTypeName: string) => void;
  getSelectedProductType: () => ProductTypeConfig | null;
  getSelectedBrand: () => BrandType | null;
  addProductInfo: (label: string, value: ProductInfoValueType) => void;
  refreshImages: (images: ProductToUpdate['images']) => void;
  loadProductInForm: (product: ProductToUpdate) => void;
  getMandatoryInformationPrefixes: () => string[];
  getInformationsConfig: () => FieldDefinitionType[];
  isStepValidated: (stepName: SellFormSteps, phoneNumber?: string) => boolean;
  addProductTagsInfo: (tagPrefix: string, value: ProductInfoValueType) => void;
  setSellFormConfig: (sellFormConfig: SellFormConfig | null) => void;
  isInCategory: (categoryName: string) => boolean;
  clearForm: () => void;
}

const createDefaultProductInfos = () => ({
  images: [],
  tags: [],
  price: null,
  condition: null,
  status: ProductStatus.DRAFT,
  compare_at_price: null,
  body_html: null,
  brand: null,
  model: null,
  type: null,
  handDeliveryPostalCode: null,
  handDelivery: null,
  productInternalId: null,
  variantInternalId: null,
});

const extractTagByPrefix = (tags: string[], prefix?: string) =>
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  prefix
    ? tags?.find((tag) => tag.startsWith(prefix))?.split(':')[1] ?? null
    : null;

const useSellForm = create<SellFormState>()(
  persist(
    (set, get) => {
      return {
        sellFormConfig: null,
        selectedProductType: null,
        productInfos: createDefaultProductInfos(),
        informationsSelected: {},

        addProductInfo: (label, value) => {
          if (label === 'type') {
            get().clearForm();
          }
          set(({ productInfos }) => {
            return {
              productInfos: { ...productInfos, [label]: value },
            };
          });
        },

        isStepValidated: (stepName, phoneNumber) => {
          if (stepName === SellFormSteps.PRODUCT_INFOS) {
            const informationsSelected = get().informationsSelected;

            return get()
              .getMandatoryInformationPrefixes()
              .every((itemMandatory: string) =>
                informationsSelected.hasOwnProperty(itemMandatory),
              );
          }

          if (stepName === SellFormSteps.PICTURES) {
            const nbImages = get().productInfos?.images?.length;

            return nbImages > 2;
          }

          if (stepName === SellFormSteps.CONDITION_AND_PRICE) {
            const productInfos = get().productInfos;

            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            return !!productInfos?.price && !((productInfos?.condition) == null);
          }

          if (stepName === SellFormSteps.VENDOR) {
            const productInfos = get().productInfos;
            const isValidHandDeliveryPostalCode =
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              !productInfos.handDelivery ||
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              (!!productInfos.handDeliveryPostalCode &&
                !!productInfos.handDeliveryPostalCode.match(/\d{5}$/));

                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            return isValidHandDeliveryPostalCode && !!phoneNumber;
          }

          if (stepName === SellFormSteps.DESCRIPTION) {
            const description = get().productInfos.body_html;

            return (
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              !!description &&
              description.length >= 20 &&
              description.length <= 2000
            );
          }

          return false;
        },

        addProductTagsInfo: (tagPrefix, value) => {
          set(({ productInfos, informationsSelected }) => {
            const productTags = productInfos.tags;

            const index = productTags.findIndex((element: string) => {
              if (element.includes(tagPrefix)) {
                return true;
              }
            });

            if (index > -1) {
              productTags.splice(index, 1);
            }

            const newTags = [...productTags, `${tagPrefix}:${value}`];

            return {
              informationsSelected: {
                ...informationsSelected,
                [tagPrefix]: String(value),
              },
              productInfos: { ...productInfos, tags: newTags },
            };
          });
        },

        setSellFormConfig: (sellFormConfig) => {
          set(() => ({
            sellFormConfig,
          }));
        },

        setSelectedProductType: (productTypeName) => {
          set(() => ({
            selectedProductType: productTypeName,
          }));
        },

        getSelectedProductType: () => {
          const selectedProductTypeName = get().selectedProductType;

          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          return !selectedProductTypeName
            ? null
            : get().sellFormConfig?.productTypeConfig[
                selectedProductTypeName
              ] ?? null;
        },

        getSelectedBrand: () => {
          const selectedBrand = get().productInfos.brand;

          return (
            get()
              .getSelectedProductType()
              ?.brands.find((brand) => brand.name === selectedBrand) ?? null
          );
        },

        getInformationsConfig: () =>
          get()
            .getSelectedProductType()
            ?.fieldDefinitions.map((fieldDefinition) => ({
              ...fieldDefinition,
              tagPrefix: fieldDefinition.tagPrefix.toLowerCase(),
            })) ?? [],

        getMandatoryInformationPrefixes: () =>
          get()
            .getInformationsConfig()
            .filter(({ required }) => required)
            .map((info) => info.tagPrefix),

        refreshImages: (images) => {
          set(() => ({
            productInfos: { ...get().productInfos, images },
          }));
        },

        loadProductInForm: (product: ProductToUpdate) => {
          get().clearForm();

          set(() => ({
            selectedProductType: product.productType,
            productInfos: {
              body_html: product.description,
              brand: extractTagByPrefix(
                product.tags,
                publicProductAttributesConfiguration[ProductAttributes.BRAND]
                  .shopifyTagName,
              ),
              model: extractTagByPrefix(
                product.tags,
                publicProductAttributesConfiguration[ProductAttributes.MODEL]
                  .shopifyTagName,
              ),
              status: product.status,
              compare_at_price: product.compareAtPrice,
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              handDelivery: !!product.handDeliveryPostalCode,
              handDeliveryPostalCode: product.handDeliveryPostalCode,
              images: product.images,
              price: product.price,
              tags: product.tags,
              type: product.productType,
              variantInternalId: product.variantInternalId,
              productInternalId: product.productInternalId,
              condition: product.condition,
            },
          }));
          [...product.tags].forEach((tag) => {
            const [tagPrefix, ...valueParts] = tag.split(':');
            get().addProductTagsInfo(tagPrefix, valueParts.join(':'));
          });
        },

        isInCategory: (categoryName) => {
          const taxonomy = get().sellFormConfig?.taxonomy;
          if (!taxonomy) {
            throw new Error(
              `Sell form config is not loaded, could not determine if in category ${categoryName}`,
            );
          }

          return (
            Object.values(taxonomy).find(
              (item) =>
                deburr(item.name).toLowerCase() ===
                deburr(categoryName).toLowerCase(),
            )?.children ?? []
          ).some((child) => taxonomy[child].name === get().selectedProductType);
        },

        clearForm: () => {
          set(() => {
            return {
              productInfos: createDefaultProductInfos(),
              informationsSelected: {},
            };
          });
        },
      };
    },
    {
      name: 'sellForm',
    },
  ),
);

export default useSellForm;
