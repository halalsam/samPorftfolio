// What a visitor can say they need on the /contact enquiry form. Shared by the
// form and its server action, which can't export plain values itself.
export const NEED_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'app', label: 'App' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Something else' },
] as const;

export type Need = (typeof NEED_OPTIONS)[number]['value'];

export const NEEDS = NEED_OPTIONS.map((o) => o.value) as [Need, ...Need[]];
