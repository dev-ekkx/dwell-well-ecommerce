import type { Schema, Struct } from '@strapi/strapi';

export interface FooterControlsLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_controls_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
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
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ManagementEmployee extends Struct.ComponentSchema {
  collectionName: 'components_management_employees';
  info: {
    displayName: 'Employee';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    profilePicture: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ManagementLeadershipTeam extends Struct.ComponentSchema {
  collectionName: 'components_management_leadership_teams';
  info: {
    displayName: 'Leadership Team';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    team: Schema.Attribute.Component<'management.employee', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageControlsButton extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_buttons';
  info: {
    displayName: 'Call To Action';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PageControlsCategoryNewArrival extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_category_new_arrivals';
  info: {
    displayName: 'Category/ New Arrival';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface PageControlsCategoryOrNewArrivalSection
  extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_category_or_new_arrival_sections';
  info: {
    displayName: 'Category Or New Arrival Section';
  };
  attributes: {
    items: Schema.Attribute.Component<
      'page-controls.category-new-arrival',
      true
    >;
    sectionId: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageControlsGlobalPresence extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_global_presences';
  info: {
    displayName: 'Global Presence';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    locationLatLng: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageControlsHero extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    ctaButtons: Schema.Attribute.Component<'page-controls.button', true>;
    images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    subTitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface PageControlsPromotion extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_promotions';
  info: {
    displayName: 'Flash Sale';
  };
  attributes: {
    cta: Schema.Attribute.Component<'page-controls.button', false>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    enDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageControlsReach extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_reaches';
  info: {
    displayName: 'Reach';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.BigInteger & Schema.Attribute.Required;
  };
}

export interface PageControlsRichTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_rich_text_blocks';
  info: {
    displayName: 'Rich Text Block';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
  };
}

export interface PageControlsSeo extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageControlsShowroomsSection extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_showrooms_sections';
  info: {
    displayName: 'Showrooms Section';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    sectionId: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageControlsTrophyItem extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_trophy_items';
  info: {
    displayName: 'Trophy Item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageControlsWhoWeAre extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_who_we_ares';
  info: {
    displayName: 'Global Reach';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    reaches: Schema.Attribute.Component<'page-controls.reach', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageControlsWhyChooseUs extends Struct.ComponentSchema {
  collectionName: 'components_page_controls_why_choose_uses';
  info: {
    displayName: 'Why Choose Us';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    reasons: Schema.Attribute.Component<'page-controls.trophy-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
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
    isAvailable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    salesReps: Schema.Attribute.Relation<
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
    countrySettings: Schema.Attribute.Component<
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
      'management.employee': ManagementEmployee;
      'management.leadership-team': ManagementLeadershipTeam;
      'page-controls.button': PageControlsButton;
      'page-controls.category-new-arrival': PageControlsCategoryNewArrival;
      'page-controls.category-or-new-arrival-section': PageControlsCategoryOrNewArrivalSection;
      'page-controls.global-presence': PageControlsGlobalPresence;
      'page-controls.hero': PageControlsHero;
      'page-controls.promotion': PageControlsPromotion;
      'page-controls.reach': PageControlsReach;
      'page-controls.rich-text-block': PageControlsRichTextBlock;
      'page-controls.seo': PageControlsSeo;
      'page-controls.showrooms-section': PageControlsShowroomsSection;
      'page-controls.trophy-item': PageControlsTrophyItem;
      'page-controls.who-we-are': PageControlsWhoWeAre;
      'page-controls.why-choose-us': PageControlsWhyChooseUs;
      'regional-control.country-specifics': RegionalControlCountrySpecifics;
      'regional-control.regional-availability': RegionalControlRegionalAvailability;
    }
  }
}
