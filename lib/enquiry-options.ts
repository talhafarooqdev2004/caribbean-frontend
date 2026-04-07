export const roleOptions = [
    { value: "journalist", label: "Journalist" },
    { value: "editor", label: "Editor" },
    { value: "news_producer", label: "News Producer" },
    { value: "media_executive", label: "Media Executive" },
    { value: "freelance_writer", label: "Freelance Writer" },
    { value: "content_creator", label: "Content Creator" },
    { value: "pr_professional", label: "PR Professional" },
    { value: "communications_manager", label: "Communications Manager" },
    { value: "business_owner", label: "Business Owner" },
    { value: "other", label: "Other" },
] as const;

export const territoryOptions = [
    { value: "anguilla", label: "Anguilla" },
    { value: "antigua_barbuda", label: "Antigua & Barbuda" },
    { value: "aruba", label: "Aruba" },
    { value: "bahamas", label: "Bahamas" },
    { value: "barbados", label: "Barbados" },
    { value: "belize", label: "Belize" },
    { value: "bermuda", label: "Bermuda" },
    { value: "bonaire", label: "Bonaire" },
    { value: "british_virgin_islands", label: "British Virgin Islands" },
    { value: "cayman_islands", label: "Cayman Islands" },
    { value: "cuba", label: "Cuba" },
    { value: "curacao", label: "Curaçao" },
    { value: "dominica", label: "Dominica" },
    { value: "dominican_republic", label: "Dominican Republic" },
    { value: "grenada", label: "Grenada" },
    { value: "guadeloupe", label: "Guadeloupe" },
    { value: "guyana", label: "Guyana" },
    { value: "haiti", label: "Haiti" },
    { value: "jamaica", label: "Jamaica" },
    { value: "martinique", label: "Martinique" },
    { value: "montserrat", label: "Montserrat" },
    { value: "puerto_rico", label: "Puerto Rico" },
    { value: "saint_barthelemy", label: "Saint Barthélemy" },
    { value: "st_kitts_nevis", label: "St. Kitts & Nevis" },
    { value: "st_lucia", label: "St. Lucia" },
    { value: "saint_martin", label: "Saint Martin" },
    { value: "st_vincent", label: "St. Vincent & the Grenadines" },
    { value: "sint_maarten", label: "Sint Maarten" },
    { value: "suriname", label: "Suriname" },
    { value: "trinidad_tobago", label: "Trinidad & Tobago" },
    { value: "turks_caicos", label: "Turks and Caicos Islands" },
    { value: "us_virgin_islands", label: "U.S. Virgin Islands" },
    { value: "other_caribbean", label: "Other Caribbean" },
    { value: "diaspora_na", label: "Caribbean Diaspora - North America" },
    { value: "diaspora_europe", label: "Caribbean Diaspora - Europe" },
    { value: "diaspora_other", label: "Caribbean Diaspora - Other" },
    { value: "other", label: "Other" },
] as const;

export type EnquiryFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    publicationName: string;
    role: string;
    coverageArea: string;
    region: string;
    website: string;
    notes: string;
};

export type EnquirySubmissionValues = EnquiryFormValues & {
    requestId: string;
};

export const initialEnquiryValues: EnquiryFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    publicationName: "",
    role: "",
    coverageArea: "",
    region: "",
    website: "",
    notes: "",
};
