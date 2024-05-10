export default (plugin) => {
  // Get current `MenuItem` attributes.
  const defaultAttrs = plugin.contentTypes['menu-item'].schema.attributes;

  // Define custom attributes for `MenuItem` the same way they would be
  // defined on any other schema.
  const customAttrs = {
    // Link menu item
    item_type: {
      type: 'enumeration',
      enum: ['link', 'card'],
      defaultTo: 'link',
    },
    is_pinned: {
      type: 'boolean',
    },
    is_sport_section: {
      type: 'boolean',
    },
    is_hidden_in_menu: {
      type: 'boolean',
    },
    mobile_header_order: {
      type: 'integer',
    },
    collection_id: {
      type: 'string',
    },

    // Card menu item
    card_image: {
      type: 'media',
      allowedTypes: ['images'],
      multiple: false,
    },
    card_image_mobile: {
      type: 'media',
      allowedTypes: ['images'],
      multiple: false,
    },
    button_text: {
      type: 'string',
    },
    is_default: {
      type: 'boolean',
    },
  };

  // Extend the `MenuItem` content type with custom attributes.
  plugin.contentTypes['menu-item'].schema.attributes = {
    ...defaultAttrs,
    ...customAttrs,
  };

  return plugin;
};
