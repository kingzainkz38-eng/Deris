"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "so";

const STORAGE_KEY = "deris_locale";

const dict = {
  en: {
    // nav
    nav_browse: "Browse Services",
    nav_post: "Post a Service",
    nav_login: "Log in",
    nav_register: "Register",
    nav_dashboard: "Dashboard",
    nav_logout: "Log out",

    // home
    hero_title: "Find help. Offer your skills.",
    hero_subtitle:
      "Deris connects people who need a service with people who provide one — near you.",
    search_placeholder: "What service are you looking for?",
    search_city_placeholder: "City",
    search_button: "Search",
    categories_heading: "Browse by category",
    recent_heading: "Recently posted",
    recent_view_all: "View all",
    no_results: "No listings found. Try a different search.",
    cta_heading: "Have a skill or service to offer?",
    cta_subtitle: "Create a free listing and let people looking for your service find you on Deris.",
    cta_button: "Post your service",

    // footer
    footer_tagline: "A marketplace for services, talents, and short-term projects.",
    footer_rights: "All rights reserved.",

    // browse
    browse_heading: "Browse services",
    filter_keyword_label: "Keyword",
    filter_keyword_placeholder: "e.g. plumbing, tutoring, logo design",
    filter_category_label: "Category",
    filter_all_categories: "All categories",
    filter_city_label: "City",
    filter_city_placeholder: "e.g. Mogadishu",
    filter_apply: "Search",
    results_count_suffix: "results",

    // pricing
    price_negotiable: "Negotiable",
    price_hour_suffix: "/hr",

    // listing detail
    back_to_results: "Back to results",
    listing_description_heading: "About this service",
    contact_heading: "Contact",
    member_since: "Member since",
    view_profile: "View full profile",

    // provider profile
    profile_listings_heading: "Listings from this provider",
    profile_no_listings: "This provider has no active listings right now.",

    // register
    register_heading: "Create your account",
    register_sub: "Join Deris to post services or save your favorites.",
    field_name: "Full name",
    field_email: "Email address",
    field_password: "Password",
    field_phone: "Phone number",
    field_city: "City",
    optional_label: "optional",
    register_submit: "Create account",
    register_have_account: "Already have an account?",
    register_error_generic: "Something went wrong. Please try again.",
    register_error_exists: "An account with this email already exists.",
    loading: "Loading…",

    // login
    login_heading: "Log in to Deris",
    login_submit: "Log in",
    login_no_account: "Don't have an account?",
    login_error: "Incorrect email or password.",

    // dashboard
    dashboard_heading: "Your listings",
    dashboard_sub: "Manage the services you've posted on Deris.",
    dashboard_new_listing: "New listing",
    dashboard_no_listings: "You haven't posted any listings yet.",
    dashboard_status_active: "Active",
    dashboard_status_paused: "Paused",
    dashboard_pause: "Pause",
    dashboard_activate: "Activate",
    dashboard_edit: "Edit",
    dashboard_delete: "Delete",
    dashboard_delete_confirm: "Delete this listing? This can't be undone.",

    // listing form
    form_title_label: "Title",
    form_title_placeholder: "e.g. Home plumbing repairs",
    form_category_label: "Category",
    form_description_label: "Description",
    form_description_placeholder: "Describe the service you offer, your experience, and what's included.",
    form_price_type_label: "Pricing",
    form_price_label: "Price",
    price_type_fixed: "Fixed price",
    price_type_hourly: "Hourly rate",
    price_type_negotiable: "Negotiable",
    form_city_label: "City",
    form_photo_label: "Photo (optional)",
    upload_error: "Couldn't upload that image. Please try a smaller file.",
    form_error_generic: "Something went wrong saving your listing. Please try again.",
    form_submit_create: "Publish listing",
    form_submit_update: "Save changes",

    not_found: "Not found.",
    forbidden: "You don't have permission to view this.",
  },
  so: {
    // nav
    nav_browse: "Baadh Adeegyada",
    nav_post: "Dhig Adeeg",
    nav_login: "Gal",
    nav_register: "Isdiiwaangeli",
    nav_dashboard: "Bogga Gudaha",
    nav_logout: "Ka bax",

    // home
    hero_title: "Hel caawimaad. Bixi xirfadahaaga.",
    hero_subtitle:
      "Deris waxa ay isku xirtaa dadka u baahan adeeg iyo dadka bixiya adeegyada — agtaada.",
    search_placeholder: "Adeeg noocee ah ayaad raadinaysaa?",
    search_city_placeholder: "Magaalada",
    search_button: "Raadi",
    categories_heading: "Ku baadh qaybaha",
    recent_heading: "Dhawaan la dhigay",
    recent_view_all: "Dhammaan arag",
    no_results: "Wax xayeysiisyo ah lama helin. Isku day raadin kale.",
    cta_heading: "Ma leedahay xirfad ama adeeg aad bixiso?",
    cta_subtitle: "Ku abuur xayeysiis bilaash ah oo aan dadka adeegaaga u baahan kaaga heli Deris.",
    cta_button: "Dhig adeegaaga",

    // footer
    footer_tagline: "Suuq loogu talagalay adeegyada, xirfadaha, iyo mashaariicda gaagaaban.",
    footer_rights: "Dhammaan xuquuqda way dhawran yihiin.",

    // browse
    browse_heading: "Baadh adeegyada",
    filter_keyword_label: "Erey raadin",
    filter_keyword_placeholder: "tusaale: tuubbooyin, waxbarasho, naqshad",
    filter_category_label: "Qaybta",
    filter_all_categories: "Dhammaan qaybaha",
    filter_city_label: "Magaalada",
    filter_city_placeholder: "tusaale: Muqdisho",
    filter_apply: "Raadi",
    results_count_suffix: "natiijo",

    // pricing
    price_negotiable: "La heshiin karo",
    price_hour_suffix: "/saacad",

    // listing detail
    back_to_results: "Ku noqo natiijooyinka",
    listing_description_heading: "Ku saabsan adeegan",
    contact_heading: "La xiriir",
    member_since: "Xubin ka dhaxeeya",
    view_profile: "Fiiri profile-ka oo dhan",

    // provider profile
    profile_listings_heading: "Xayeysiisyada bixiyahan",
    profile_no_listings: "Bixiyahan hadda ma laha xayeysiis firfircoon.",

    // register
    register_heading: "Samayso akoon",
    register_sub: "Ku biir Deris si aad adeeg u dhigto ama u kaydiso kuwa aad jeceshahay.",
    field_name: "Magaca oo dhan",
    field_email: "Ciwaanka email-ka",
    field_password: "Furaha sirta ah",
    field_phone: "Lambarka taleefanka",
    field_city: "Magaalada",
    optional_label: "ikhtiyaari",
    register_submit: "Samayso akoon",
    register_have_account: "Miyaad horey u lahayd akoon?",
    register_error_generic: "Wax baa qaldamay. Fadlan mar kale isku day.",
    register_error_exists: "Akoon ayaa horey ugu jira email-kan.",
    loading: "Waa la soo raraya…",

    // login
    login_heading: "Ku gal Deris",
    login_submit: "Gal",
    login_no_account: "Akoon ma lihid?",
    login_error: "Email ama furaha sirta ah ayaa qaldan.",

    // dashboard
    dashboard_heading: "Xayeysiisyadaada",
    dashboard_sub: "Maamul adeegyada aad ku dhigtay Deris.",
    dashboard_new_listing: "Xayeysiis cusub",
    dashboard_no_listings: "Weli xayeysiis ma dhigin.",
    dashboard_status_active: "Firfircoon",
    dashboard_status_paused: "La joojiyay",
    dashboard_pause: "Jooji",
    dashboard_activate: "Firfircooneey",
    dashboard_edit: "Wax ka beddel",
    dashboard_delete: "Tirtir",
    dashboard_delete_confirm: "Ma tirtirtaa xayeysiiskan? Tallaabadan lama celin karo.",

    // listing form
    form_title_label: "Cinwaanka",
    form_title_placeholder: "tusaale: Dayactirka tuubbooyinka guriga",
    form_category_label: "Qaybta",
    form_description_label: "Sharaxaad",
    form_description_placeholder: "Sharax adeegga aad bixiso, khibradaada, iyo waxa ku jira.",
    form_price_type_label: "Qiimaynta",
    form_price_label: "Qiimaha",
    price_type_fixed: "Qiime go'an",
    price_type_hourly: "Qiime saacadeed",
    price_type_negotiable: "La heshiin karo",
    form_city_label: "Magaalada",
    form_photo_label: "Sawir (ikhtiyaari)",
    upload_error: "Sawirka lama soo geli karin. Isku day fayl yar.",
    form_error_generic: "Wax baa qaldamay markii xayeysiiska la keydinayay. Fadlan mar kale isku day.",
    form_submit_create: "Daabac xayeysiiska",
    form_submit_update: "Kaydi isbeddelka",

    not_found: "Lama helin.",
    forbidden: "Idan uma lihid inaad tan aragto.",
  },
} as const;

export type DictKey = keyof typeof dict.en;

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey) => string;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => dict.en[key] ?? key,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "so") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the saved language on mount
        setLocaleState(saved);
      }
    } catch {
      // ignore (private browsing, etc.)
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const t = useMemo(() => {
    return (key: DictKey) => dict[locale][key] ?? dict.en[key] ?? key;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
