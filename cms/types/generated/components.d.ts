import type { Schema, Struct } from '@strapi/strapi';

export interface FooterControlsLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_controls_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    URL: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterControlsLinkColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_controls_link_columns';
  info: {
    displayName: 'LinkColumn';
  };
  attributes: {
    links: Schema.Attribute.Component<'footer-controls.link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterControlsSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_controls_social_links';
  info: {
    displayName: 'SocialLink';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['Facebook', 'Instagram', 'X', 'LinkedIn']
    > &
      Schema.Attribute.Required;
    URL: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface RegionalControlCountrySpecifics
  extends Struct.ComponentSchema {
  collectionName: 'components_regional_control_country_specifics';
  info: {
    displayName: 'CountrySpecifics';
  };
  attributes: {
    country: Schema.Attribute.Relation<'oneToOne', 'api::country.country'>;
    is_available: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    sales_reps: Schema.Attribute.Relation<
      'oneToMany',
      'api::sales-rep.sales-rep'
    >;
  };
}

export interface RegionalControlRegionalAvailability
  extends Struct.ComponentSchema {
  collectionName: 'components_regional_control_regional_availabilities';
  info: {
    displayName: 'RegionalAvailability';
  };
  attributes: {
    country_settings: Schema.Attribute.Component<
      'regional-control.country-specifics',
      true
    >;
    region: Schema.Attribute.Relation<'oneToOne', 'api::region.region'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer-controls.link': FooterControlsLink;
      'footer-controls.link-column': FooterControlsLinkColumn;
      'footer-controls.social-link': FooterControlsSocialLink;
      'regional-control.country-specifics': RegionalControlCountrySpecifics;
      'regional-control.regional-availability': RegionalControlRegionalAvailability;
    }
  }
}
