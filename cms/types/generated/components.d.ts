import type { Schema, Struct } from '@strapi/strapi';

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
      'regional-control.country-specifics': RegionalControlCountrySpecifics;
      'regional-control.regional-availability': RegionalControlRegionalAvailability;
    }
  }
}
