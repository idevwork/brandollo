export default {
  syntax: "html",
  seo: {
    title: "Startup Marketing Platform Pricing"
  },
  labels: {
    price: '',
    billing: 'Plan',
    team: 'Team size',
  },
  header: [
    {
      title: 'For Startups',
      description: 'Guided Startup Growth',
      price: '49',
      billing: '<span class=\"bold\">per month/cancel anytime</span>',
      team: 'Up to 2 users',
      button: 'Start Now'
    },
    {
      title: 'For Scaleups',
      description: 'And Larger Teams',
      price: '89',
      billing: '<span class=\"bold\">per month/cancel anytime</span>',
      team: 'Up to 6 users',
      button: 'Start Now'
    },
    {
      title: 'For Accelerators',
      description: 'Turbo charge Your Cohorts',
      price: '150',
      billing: '<span class=\"bold\">per month/cancel anytime</span>',
      team: '6+ users',
      button: 'Start Now'
    }
  ],

  pricing: [
    // { label: 'Marketing Planning Tools', free: null, small: null, large: null, title: true },
    {
      label: "Guided Growth Plans",
      free: null,
      small: null,
      large: null,
      title: true
    },
    { label: "Startup Plan", free: true, small: true, large: true },
    { label: "Digital Marketing Plan", free: true, small: true, large: true },
    { label: "Branding Plan", free: true, small: true, large: true },
    { label: "Sales Plan", free: true, small: true, large: true },
    { label: "Publicity Plan", free: true, small: true, large: true },

    {
      label: "Educational Videos & Content",
      free: null,
      small: null,
      large: null,
      title: true
    },
    {
      label: "Marketing For Startups",
      free: true,
      small: true,
      large: true
    },
    {
      label: "Branding For Startups",
      free: true,
      small: true,
      large: true
    },
    { label: "Sales For Startups", free: true, small: true, large: true },
    {
      label: "Startup Software",
      free: null,
      small: null,
      large: null,
      title: true
    },
    { label: "Productivity Software", free: true, small: true, large: true },
    { label: "Workflow Tools", free: true, small: true, large: true },
    { label: "Team Timelines", free: true, small: true, large: true },
    { label: "Marketing Plan Builder", free: true, small: true, large: true },
    { label: "Deadlines & Reminders", free: true, small: true, large: true },
    {
      label: "Advanced",
      free: null,
      small: null,
      large: null,
      title: true
    },
    { label: "Multiple Team Support", free: false, small: false, large: true },
    { label: "Custom Content Uploads", free: false, small: false, large: true },
    {
      label: "Access Premium Features",
      free: false,
      small: false,
      large: true
    }
  ]
}