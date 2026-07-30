export interface AboutEntry {
  title: string;
  subtitle: string;
  period: string;
  location?: string;
  details: string[];
}

export interface AboutHighlight {
  title: string;
  details: string[];
}

export interface AboutSkillGroup {
  label: string;
  skills: string[];
}
