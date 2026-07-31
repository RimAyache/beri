import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { config } from '../../shared/config';
import { AboutEntry, AboutHighlight, AboutSkillGroup } from '../../shared/interfaces/about.interface';

const EDUCATION: AboutEntry[] = [
  {
    title: 'B.E. in Computer Engineering',
    subtitle: 'Lebanese American University (LAU)',
    period: 'Aug 2024 — Jun 2028 (expected)',
    location: 'Beirut, Lebanon',
    details: [
      'GPA 3.9 / 4.0 — Dean’s Distinguished List of the School of Engineering',
      'Full Merit Scholarship recipient',
      'SAT score 1490',
    ],
  },
];

const EXPERIENCE: AboutEntry[] = [
  {
    title: 'Tutor — Calculus I',
    subtitle: 'LAU Tutoring Center',
    period: 'Sept 2025 — Dec 2025',
    details: [
      'Selected as a tutor for Calculus I, helping students master core mathematical concepts and problem-solving techniques.',
    ],
  },
];

const HIGHLIGHTS: AboutHighlight[] = [
  {
    title: 'Competitive Programming',
    details: [
      'Solved 300+ algorithmic problems on LeetCode and Codeforces.',
      'Strong foundation in data structures, problem solving and algorithmic optimisation.',
    ],
  },
  {
    title: 'Mmkn Organization',
    details: [
      'Volunteered to teach maths and biology to grade 8 and 9 students in official schools — explaining concepts, working through problems and answering questions.',
    ],
  },
  {
    title: 'Ibrahim Nassir Omais Association for Disabled Children',
    details: [
      'Trained and worked on a programme aimed at integrating disabled children into society.',
    ],
  },
];

const SKILL_GROUPS: AboutSkillGroup[] = [
  { label: 'Languages', skills: ['Python', 'Java', 'C++', 'HTML', 'Bash'] },
  {
    label: 'Concepts',
    skills: [
      'Object-Oriented Programming',
      'Data Structures',
      'Algorithms',
      'Design Patterns',
    ],
  },
  { label: 'Database', skills: ['SQL'] },
  { label: 'DevOps & Tools', skills: ['Git', 'Docker', 'Microsoft Office'] },
  { label: 'Hardware', skills: ['Electronics & Circuits', 'Digital Design'] },
];

const SOFT_SKILLS: string[] = [
  'Self-driven and committed to continuous learning',
  'Analytical thinking and structured problem solving',
  'Strong mathematical reasoning',
  'Teaching and mentoring ability',
  'Leadership and initiative',
  'Team collaboration and communication',
  'Time management and discipline',
];

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  protected readonly owner = config.owner;
  protected readonly education = EDUCATION;
  protected readonly experience = EXPERIENCE;
  protected readonly highlights = HIGHLIGHTS;
  protected readonly skillGroups = SKILL_GROUPS;
  protected readonly softSkills = SOFT_SKILLS;

  protected readonly initials = this.owner.name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('');
}
