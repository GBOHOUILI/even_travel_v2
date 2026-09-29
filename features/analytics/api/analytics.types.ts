export interface TopPageStat {
  path: string;
  count: number;
}

export interface TopReferrerStat {
  referrer: string;
  count: number;
}

export interface FormSubmitStat {
  formName: string;
  count: number;
}

export interface DailyPageViewStat {
  date: string;
  count: number;
}

export interface AnalyticsStats {
  periodDays: number;
  totalPageViews: number;
  totalWhatsappClicks: number;
  totalFormSubmits: number;
  topPages: TopPageStat[];
  topReferrers: TopReferrerStat[];
  formSubmitsByForm: FormSubmitStat[];
  dailyPageViews: DailyPageViewStat[];
}
