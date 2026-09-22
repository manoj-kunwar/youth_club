export type Language = 'en' | 'ne';

export interface TranslationDictionary {
  common: {
    siteName: string;
    siteAddress: string;
    loading: string;
    error: string;
    viewAll: string;
    readMore: string;
    learnMore: string;
    backToHome: string;
    exploreMore: string;
    previous: string;
    next: string;
    page: string;
    of: string;
    search: string;
    searchPlaceholder: string;
    all: string;
    filter: string;
    noResults: string;
    noResultsDesc: string;
    statusActive: string;
    statusCompleted: string;
    statusUpcoming: string;
    verified: string;
    chapter: string;
    nepalFlag: string;
  };
  nav: {
    home: string;
    about: string;
    activities: string;
    events: string;
    members: string;
    gallery: string;
    notices: string;
    contact: string;
    signIn: string;
    joinClub: string;
    myProfile: string;
    adminDashboard: string;
    signOut: string;
    menu: string;
    close: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    switchLanguage: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleEnd: string;
    description: string;
    exploreEvents: string;
    joinCommunity: string;
    statVolunteers: string;
    statVolunteersLabel: string;
    statProjects: string;
    statProjectsLabel: string;
    statFestivals: string;
    statFestivalsLabel: string;
    statGrassroots: string;
    statGrassrootsLabel: string;
  };
  homeSections: {
    eventsBadge: string;
    eventsTitle: string;
    eventsSubtitle: string;
    viewAllEvents: string;
    noEvents: string;
    activitiesBadge: string;
    activitiesTitle: string;
    activitiesSubtitle: string;
    viewAllActivities: string;
    noticesBadge: string;
    noticesTitle: string;
    noticesSubtitle: string;
    viewAllNotices: string;
    galleryBadge: string;
    galleryTitle: string;
    gallerySubtitle: string;
    viewAllGallery: string;
    ctaBadge: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    ctaSecondary: string;
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    missionTitle: string;
    missionDesc: string;
    visionTitle: string;
    visionDesc: string;
    storyBadge: string;
    storyTitle: string;
    storyPara1: string;
    storyPara2: string;
    meetTeamBtn: string;
    exploreActivitiesBtn: string;
    valuesTitle: string;
    valUnityTitle: string;
    valUnityDesc: string;
    valDemocracyTitle: string;
    valDemocracyDesc: string;
    valCultureTitle: string;
    valCultureDesc: string;
    valEnvironmentTitle: string;
    valEnvironmentDesc: string;
    showcaseTag: string;
    showcaseTitle: string;
    showcaseDesc: string;
    showcaseChapter: string;
    milestonesTag: string;
    milestonesTitle: string;
    objectivesBadge: string;
    objectivesTitle: string;
    journeyBadge: string;
    journeyTitle: string;
    impactBadge: string;
    impactTitle: string;
    impactActiveMembers: string;
    impactCommunityEvents: string;
    impactActivitiesCompleted: string;
    impactVolunteers: string;
    impactInfoPending: string;
    committeeBadge: string;
    committeeTitle: string;
    committeeEmpty: string;
    partnersBadge: string;
    partnersTitle: string;
    partnersEmpty: string;
  };
  activitiesPage: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    sports: string;
    education: string;
    environment: string;
    culture: string;
    health: string;
    leadership: string;
    viewDetails: string;
    noActivities: string;
    noActivitiesDesc: string;
  };
  eventsPage: {
    badge: string;
    title: string;
    subtitle: string;
    allEvents: string;
    upcoming: string;
    completed: string;
    date: string;
    location: string;
    organizer: string;
    entryFee: string;
    free: string;
    viewDetails: string;
    registerNow: string;
    eventEnded: string;
    noEvents: string;
    noEventsDesc: string;
    category: string;
  };
  membersPage: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allRoles: string;
    executiveCommittee: string;
    generalMembers: string;
    volunteers: string;
    memberSince: string;
    activeStatus: string;
    noMembers: string;
    noMembersDesc: string;
    contactMember: string;
  };
  galleryPage: {
    badge: string;
    title: string;
    subtitle: string;
    allPhotos: string;
    communityDrives: string;
    sportsEvents: string;
    culturalFestivals: string;
    noPhotos: string;
    noPhotosDesc: string;
    viewFull: string;
  };
  noticesPage: {
    badge: string;
    title: string;
    subtitle: string;
    publishedDate: string;
    important: string;
    downloadNotice: string;
    noNotices: string;
    noNoticesDesc: string;
  };
  contactPage: {
    badge: string;
    title: string;
    subtitle: string;
    getInTouch: string;
    getInTouchDesc: string;
    officeAddressLabel: string;
    officeAddressVal: string;
    phoneLabel: string;
    phoneVal: string;
    emailLabel: string;
    emailVal: string;
    hoursLabel: string;
    hoursVal: string;
    formTitle: string;
    formSubtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabelForm: string;
    emailPlaceholder: string;
    phoneLabelForm: string;
    phonePlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successMessage: string;
    errorMessage: string;
    directContact: string;
    mapTitle: string;
    mapSubtitle: string;
    viewLargerMap: string;
    faqTitle: string;
    faqSubtitle: string;
    faq1Q: string;
    faq1A: string;
    faq2Q: string;
    faq2A: string;
    faq3Q: string;
    faq3A: string;
    faq4Q: string;
    faq4A: string;
    faq5Q: string;
    faq5A: string;
  };
  footer: {
    tagline: string;
    explore: string;
    aboutUs: string;
    events: string;
    activities: string;
    gallery: string;
    notices: string;
    getInvolved: string;
    joinVolunteer: string;
    executiveTeam: string;
    communityPartners: string;
    donateSupport: string;
    communityOffice: string;
    address: string;
    phone: string;
    email: string;
    officeHours: string;
    copyright: string;
    allRightsReserved: string;
    clubBadge: string;
    privacyPolicy: string;
    privacyPolicyDesc: string;
    termsConditions: string;
    termsConditionsDesc: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    common: {
      siteName: 'HIGH SCHOOL YOUTH CLUB',
      siteAddress: 'Gulariya, Krishnapur-5, Kanchanpur',
      loading: 'Loading...',
      error: 'An error occurred. Please try again.',
      viewAll: 'View All',
      readMore: 'Read More',
      learnMore: 'Learn More',
      backToHome: 'Back to Home',
      exploreMore: 'Explore More',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      search: 'Search',
      searchPlaceholder: 'Search here...',
      all: 'All',
      filter: 'Filter',
      noResults: 'No items found',
      noResultsDesc: 'Try adjusting your search criteria.',
      statusActive: 'Active',
      statusCompleted: 'Completed',
      statusUpcoming: 'Upcoming',
      verified: 'Verified Member',
      chapter: 'Krishnapur-5 Chapter',
      nepalFlag: '🇳🇵',
    },
    nav: {
      home: 'Home',
      about: 'About Us',
      activities: 'Activities',
      events: 'Events',
      members: 'Members',
      gallery: 'Gallery',
      notices: 'Notices',
      contact: 'Contact',
      signIn: 'Sign In',
      joinClub: 'Join Club',
      myProfile: 'My Profile',
      adminDashboard: 'Admin Portal',
      signOut: 'Sign Out',
      menu: 'Menu',
      close: 'Close',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
      themeSystem: 'System Theme',
      switchLanguage: 'Language',
    },
    hero: {
      badge: '🇳🇵 High School Youth Club • Gulariya, Krishnapur-5',
      titleStart: 'Empowering Nepali Youth.',
      titleEnd: 'Transforming Communities.',
      description:
        'A grassroots youth community dedicated to education, sports, cultural preservation, environmental protection, and civic leadership across Gulariya, Krishnapur-5.',
      exploreEvents: 'Explore Events',
      joinCommunity: 'Join Community',
      statVolunteers: '0',
      statVolunteersLabel: 'Active Volunteers',
      statProjects: '0',
      statProjectsLabel: 'Projects Executed',
      statFestivals: '0',
      statFestivalsLabel: 'Annual Festivals',
      statGrassroots: '—',
      statGrassrootsLabel: 'Grassroots Driven',
    },
    homeSections: {
      eventsBadge: 'Events • कार्यक्रमहरू',
      eventsTitle: 'Upcoming Community Events',
      eventsSubtitle:
        'Join youth tournaments, cultural celebrations, educational workshops, and volunteer drives in Krishnapur.',
      viewAllEvents: 'View All Events',
      noEvents: 'No upcoming events scheduled at this moment.',
      activitiesBadge: 'Initiatives • गतिविधिहरू',
      activitiesTitle: 'Our Core Youth Programs',
      activitiesSubtitle:
        'Empowering the youth through structured education, athletic training, cleanliness drives, and civic leadership.',
      viewAllActivities: 'View All Activities',
      noticesBadge: 'Bulletins • सूचनाहरू',
      noticesTitle: 'Latest Official Bulletins',
      noticesSubtitle:
        'Stay updated with official announcements, meeting schedules, and general assembly notices.',
      viewAllNotices: 'View All Notices',
      galleryBadge: 'Moments • ग्यालरी',
      galleryTitle: 'Community in Action',
      gallerySubtitle:
        'Photographic highlights from our recent sporting events, volunteer campaigns, and cultural festivals.',
      viewAllGallery: 'View Full Gallery',
      ctaBadge: 'Join Us • सहकार्य गरौं',
      ctaTitle: 'Be the Spark for Positive Change in Krishnapur',
      ctaDesc:
        'Whether you are a student, athlete, volunteer, or local organizer, High School Youth Club welcomes you.',
      ctaButton: 'Join As Club Member',
      ctaSecondary: 'Contact Our Office',
    },
    about: {
      badge: 'About Us • हाम्रो बारेमा',
      title: 'Building Community From the Ground Up',
      subtitle:
        'High School Youth Club was founded in Gulariya, Krishnapur-5, Kanchanpur with a singular purpose: uniting youth to empower education, foster sports and civic leadership, and uplift our community.',
      missionTitle: 'Our Mission',
      missionDesc:
        'To mobilize youth in Gulariya and across Krishnapur-5 in civic responsibility, educational empowerment, sports development, and cultural preservation, creating a resilient, progressive society.',
      visionTitle: 'Our Vision',
      visionDesc:
        'A united youth community where young leaders drive positive social change, build strong character through education and athletics, and contribute actively to Kanchanpur’s future.',
      storyBadge: 'Who We Are • हामी को हौँ',
      storyTitle: 'Youth & Community Organization in Gulariya, Krishnapur-5',
      storyPara1:
        'High School Youth Club is a grassroots youth and community organization operating in Gulariya, Krishnapur-5, Kanchanpur. We bring together local youth and students to collaborate on community welfare, sports, education, and voluntary initiatives.',
      storyPara2:
        'Our members participate in local community activities, recreational sports programs, and environmental cleanups, fostering mutual cooperation, healthy living, and civic engagement throughout our neighborhood.',
      meetTeamBtn: 'Meet the Executive Team',
      exploreActivitiesBtn: 'Explore Our Activities',
      valuesTitle: 'Our Guiding Values',
      valUnityTitle: 'Inclusivity & Unity',
      valUnityDesc: 'Welcoming every resident regardless of background, gender, or belief.',
      valDemocracyTitle: 'Democratic Governance',
      valDemocracyDesc:
        'Transparent committee elections, open financial accounts, and communal decisions.',
      valCultureTitle: 'Cultural Respect',
      valCultureDesc:
        'Honoring Nepal’s diverse traditions, languages, music, and seasonal festivities.',
      valEnvironmentTitle: 'Environmental Stewardship',
      valEnvironmentDesc:
        'Protecting local open spaces, greenery, clean drinking water, and waste segregation.',
      showcaseTag: 'Youth Volunteers & Community',
      showcaseTitle: 'High School Youth Club Community',
      showcaseDesc:
        'United for youth leadership, education, sports development, and community welfare in Gulariya, Krishnapur-5, Kanchanpur.',
      showcaseChapter: 'Krishnapur-5 Chapter',
      milestonesTag: 'Recognitions & Milestones',
      milestonesTitle: 'Awards and Community Achievements',
      objectivesBadge: 'Our Objectives • हाम्रा उद्देश्यहरू',
      objectivesTitle: 'Core Areas of Community Action',
      journeyBadge: 'Our Journey • हाम्रो यात्रा',
      journeyTitle: 'How Our Community Grew Together',
      impactBadge: 'Community Impact • हाम्रो प्रभाव',
      impactTitle: 'Real Community Footprint',
      impactActiveMembers: 'Active Members',
      impactCommunityEvents: 'Community Events',
      impactActivitiesCompleted: 'Activities Completed',
      impactVolunteers: 'Volunteers',
      impactInfoPending: 'Information will be updated',
      committeeBadge: 'Leadership • कार्यसमिति',
      committeeTitle: 'Executive Committee',
      committeeEmpty: 'Executive committee information will be updated.',
      partnersBadge: 'Partners • साझेदारहरू',
      partnersTitle: 'Community Partners',
      partnersEmpty: 'Community partner information will be updated.',
    },
    activitiesPage: {
      badge: 'Programs • गतिविधिहरू',
      title: 'Active Community Initiatives',
      subtitle:
        'Explore our diverse youth wings covering sports training, civic development, educational workshops, and environmental care.',
      searchPlaceholder: 'Search activities by title or keyword...',
      allCategories: 'All Categories',
      sports: 'Sports & Athletics',
      education: 'Education & Literacy',
      environment: 'Environmental Protection',
      culture: 'Cultural Preservation',
      health: 'Health & Blood Donation',
      leadership: 'Youth Leadership',
      viewDetails: 'View Activity Details',
      noActivities: 'No activities found matching your criteria.',
      noActivitiesDesc: 'Try choosing another category or clearing search terms.',
    },
    eventsPage: {
      badge: 'Calendar • कार्यक्रमहरू',
      title: 'Club Events & Tournaments',
      subtitle:
        'Participate in sports tournaments, blood donation camps, cleaning drives, and youth seminars in Gulariya, Krishnapur-5.',
      allEvents: 'All Events',
      upcoming: 'Upcoming Events',
      completed: 'Past Events',
      date: 'Date',
      location: 'Location',
      organizer: 'Organized by',
      entryFee: 'Entry Fee',
      free: 'Free Entry',
      viewDetails: 'Event Details',
      registerNow: 'Register Now',
      eventEnded: 'Event Concluded',
      noEvents: 'No events found.',
      noEventsDesc: 'Check back soon for new announcements and programs.',
      category: 'Category',
    },
    membersPage: {
      badge: 'Our People • सदस्यहरू',
      title: 'Youth Club Leadership & Members',
      subtitle:
        'Meet the dedicated executive committee members, organizers, advisors, and youth volunteers driving our mission forward.',
      searchPlaceholder: 'Search member by name, role, or tole...',
      allRoles: 'All Members',
      executiveCommittee: 'Executive Committee',
      generalMembers: 'General Members',
      volunteers: 'Volunteers',
      memberSince: 'Member since',
      activeStatus: 'Active Member',
      noMembers: 'No members found matching your search.',
      noMembersDesc: 'Try checking your search spelling.',
      contactMember: 'Connect',
    },
    galleryPage: {
      badge: 'Moments • ग्यालरी',
      title: 'Official Photo Gallery',
      subtitle:
        'Visual chronicles of our community service, clean-up drives, sports events, and cultural gatherings in Krishnapur-5.',
      allPhotos: 'All Photos',
      communityDrives: 'Community Drives',
      sportsEvents: 'Sports & Games',
      culturalFestivals: 'Festivals & Culture',
      noPhotos: 'No gallery photos uploaded yet.',
      noPhotosDesc: 'Event photos will be posted here soon.',
      viewFull: 'View High Resolution',
    },
    noticesPage: {
      badge: 'Official Bulletins • सूचनाहरू',
      title: 'Notices & Press Releases',
      subtitle:
        'Important community announcements, general assembly convocations, tournament circulars, and executive circulars.',
      publishedDate: 'Published on',
      important: 'Important',
      downloadNotice: 'Download Official Notice',
      noNotices: 'No notices published at the moment.',
      noNoticesDesc: 'All upcoming club circulars will be published here.',
    },
    contactPage: {
      badge: 'Reach Us • सम्पर्क',
      title: 'Get in Touch With Us',
      subtitle:
        'Have inquiries, suggestions, or wish to partner with High School Youth Club? Reach out to our team in Gulariya.',
      getInTouch: 'Contact Information',
      getInTouchDesc:
        'Visit our community club office or contact our executive committee directly.',
      officeAddressLabel: 'Club Office Address',
      officeAddressVal: 'Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim, Nepal',
      phoneLabel: 'Phone & WhatsApp',
      phoneVal: '+977 9748886690',
      emailLabel: 'Email Address',
      emailVal: 'hsyc172@gmail.com',
      hoursLabel: 'Office Hours',
      hoursVal: 'Sunday – Friday: 9:00 AM – 5:00 PM NPT',
      formTitle: 'Send a Direct Message',
      formSubtitle: 'Fill out the form below and an executive officer will respond promptly.',
      fullNameLabel: 'Full Name *',
      fullNamePlaceholder: 'Enter your full name',
      emailLabelForm: 'Email Address *',
      emailPlaceholder: 'name@example.com',
      phoneLabelForm: 'Phone Number',
      phonePlaceholder: '+977 98XXXXXXXX',
      subjectLabel: 'Subject *',
      subjectPlaceholder: 'What is your message regarding?',
      messageLabel: 'Your Message *',
      messagePlaceholder: 'Write your questions, suggestions, or feedback here...',
      submitBtn: 'Send Message',
      submittingBtn: 'Sending Message...',
      successMessage: 'Thank you! Your message has been received. We will get back to you soon.',
      errorMessage: 'Could not send message. Please try again or reach out via phone.',
      directContact: 'Direct Support',
      mapTitle: 'Find Our Office on the Map',
      mapSubtitle: 'Located at Shree Krishna Secondary School, Krishnapur-4, Gulariya, Kanchanpur, Nepal.',
      viewLargerMap: 'View Larger Map',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Find quick answers to common questions about High School Youth Club, membership, and programs.',
      faq1Q: 'Where is the High School Youth Club office located?',
      faq1A: 'Our official club office is located in Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim Province, Nepal.',
      faq2Q: 'What are the official club office hours?',
      faq2A: 'We are open Sunday through Friday from 9:00 AM to 5:00 PM NPT. We are closed on Saturdays and public holidays.',
      faq3Q: 'How can I join or register as a member?',
      faq3A: 'Youth and community members can register online through our Member Portal or visit our Gulariya office in person during office hours with identification.',
      faq4Q: 'What kind of activities does High School Youth Club organize?',
      faq4A: 'We organize youth leadership workshops, educational seminars, sports tournaments, community sanitation and environmental campaigns, health camps, and cultural preservation events.',
      faq5Q: 'How quickly does the team respond to inquiries?',
      faq5A: 'Our executive committee reviews and responds to messages within 24 to 48 business hours. For urgent matters, call or WhatsApp us directly at +977 9748886690.',
    },
    footer: {
      tagline:
        'Empowering youth, fostering character, and building a united, vibrant community through grassroots action, education, sports, and civic outreach.',
      explore: 'Explore',
      aboutUs: 'About Us',
      events: 'Events',
      activities: 'Activities',
      gallery: 'Gallery',
      notices: 'Notices',
      getInvolved: 'Get Involved',
      joinVolunteer: 'Join as Volunteer',
      executiveTeam: 'Executive Committee',
      communityPartners: 'Community Partners',
      donateSupport: 'Support Our Club',
      communityOffice: 'Community Office',
      address: 'Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim, Nepal',
      phone: '+977 9748886690',
      email: 'hsyc172@gmail.com',
      officeHours: 'Office Hours: Sun – Fri, 9:00 AM – 5:00 PM NPT',
      copyright: 'High School Youth Club. All rights reserved.',
      allRightsReserved: 'All rights reserved.',
      clubBadge: 'High School Youth Club • Kanchanpur',
      privacyPolicy: 'Privacy Policy',
      privacyPolicyDesc: 'Member privacy commitments and data handling policies.',
      termsConditions: 'Terms & Conditions',
      termsConditionsDesc: 'Club governance, membership guidelines, and conduct.',
    },
  },
  ne: {
    common: {
      siteName: 'हाई स्कूल युवा क्लब',
      siteAddress: 'गुलरिया, कृष्णपुर-५, कञ्चनपुर',
      loading: 'लोड हुँदैछ...',
      error: 'त्रुटि देखा पर्यो। कृपया पुनः प्रयास गर्नुहोस्।',
      viewAll: 'सबै हेर्नुहोस्',
      readMore: 'थप पढ्नुहोस्',
      learnMore: 'विस्तृत जानकारी',
      backToHome: 'गृहपृष्ठमा फर्कनुहोस्',
      exploreMore: 'थप अन्वेषण गर्नुहोस्',
      previous: 'अघिल्लो',
      next: 'पछिल्लो',
      page: 'पृष्ठ',
      of: 'को',
      search: 'खोज्नुहोस्',
      searchPlaceholder: 'यहाँ खोज्नुहोस्...',
      all: 'सबै',
      filter: 'फिल्टर',
      noResults: 'कुनै नतिजा फेला परेन',
      noResultsDesc: 'कृपया आफ्नो खोज शब्द परिवर्तन गरी हेर्नुहोस्।',
      statusActive: 'सक्रिय',
      statusCompleted: 'सम्पन्न',
      statusUpcoming: 'आगामी',
      verified: 'प्रमाणित सदस्य',
      chapter: 'कृष्णपुर-५ शाखा',
      nepalFlag: '🇳🇵',
    },
    nav: {
      home: 'गृहपृष्ठ',
      about: 'हाम्रो बारेमा',
      activities: 'गतिविधिहरू',
      events: 'कार्यक्रमहरू',
      members: 'सदस्यहरू',
      gallery: 'ग्यालरी',
      notices: 'सूचनाहरू',
      contact: 'सम्पर्क',
      signIn: 'लग-इन',
      joinClub: 'क्लबमा जोडिनुहोस्',
      myProfile: 'मेरो प्रोफाइल',
      adminDashboard: 'एडमिन पोर्टल',
      signOut: 'बाहिरिनुहोस्',
      menu: 'मेनु',
      close: 'बन्द गर्नुहोस्',
      themeLight: 'लाइट मोड',
      themeDark: 'डार्क मोड',
      themeSystem: 'सिस्टम थिम',
      switchLanguage: 'भाषा',
    },
    hero: {
      badge: '🇳🇵 हाई स्कूल युवा क्लब • गुलरिया, कृष्णपुर-५',
      titleStart: 'नेपाली युवाको सशक्तीकरण।',
      titleEnd: 'समुदायको रूपान्तरण।',
      description:
        'गुलरिया, कृष्णपुर-५ मा शिक्षा, खेलकुद, सांस्कृतिक संरक्षण, वातावरण संरक्षण र नागरिक नेतृत्व विकासमा समर्पित एक अग्रगामी युवा सामाजिक संस्था।',
      exploreEvents: 'कार्यक्रमहरू हेर्नुहोस्',
      joinCommunity: 'समुदायमा जोडिनुहोस्',
      statVolunteers: '०',
      statVolunteersLabel: 'सक्रिय स्वयंसेवक',
      statProjects: '०',
      statProjectsLabel: 'सम्पन्न परियोजनाहरू',
      statFestivals: '०',
      statFestivalsLabel: 'वार्षिक महोत्सवहरू',
      statGrassroots: '—',
      statGrassrootsLabel: 'समुदाय-केन्द्रित',
    },
    homeSections: {
      eventsBadge: 'कार्यक्रमहरू • Events',
      eventsTitle: 'आगामी सामुदायिक कार्यक्रमहरू',
      eventsSubtitle:
        'कृष्णपुरमा आयोजना हुने खेलकुद प्रतियोगिता, सांस्कृतिक उत्सव, शैक्षिक कार्यशाला र स्वयंसेवा अभियानमा सहभागी हुनुहोस्।',
      viewAllEvents: 'सबै कार्यक्रमहरू हेर्नुहोस्',
      noEvents: 'हाल कुनै आगामी कार्यक्रम तय गरिएको छैन।',
      activitiesBadge: 'अभियानहरू • Activities',
      activitiesTitle: 'हाम्रा मुख्य युवा कार्यक्रमहरू',
      activitiesSubtitle:
        'शैक्षिक सहयोग, खेलकुद प्रशिक्षण, सरसफाइ अभियान र नेतृत्व विकासमार्फत युवाहरूको सशक्तीकरण।',
      viewAllActivities: 'सबै गतिविधिहरू हेर्नुहोस्',
      noticesBadge: 'बुलेटिन • Notices',
      noticesTitle: 'ताजा आधिकारिक सूचनाहरू',
      noticesSubtitle:
        'क्लबका आधिकारिक निर्णय, साधारण सभा, बैठक तथा सार्वजनिक कार्यक्रमका सूचनाहरू हेर्नुहोस्।',
      viewAllNotices: 'सबै सूचनाहरू हेर्नुहोस्',
      galleryBadge: 'तस्बिरहरू • Gallery',
      galleryTitle: 'समुदायमा हाम्रा पलहरू',
      gallerySubtitle:
        'हाम्रा खेलकुद, सामाजिक सरसफाइ, वृक्षारोपण र सांस्कृतिक कार्यक्रमका मुख्य झलकहरू।',
      viewAllGallery: 'सम्पूर्ण ग्यालरी हेर्नुहोस्',
      ctaBadge: 'सहकार्य गरौं • Join Us',
      ctaTitle: 'कृष्णपुरमा सकारात्मक परिवर्तनको संवाहक बन्नुहोस्',
      ctaDesc:
        'तपाईं विद्यार्थी, खेलाडी, स्वयंसेवक वा स्थानीय बासिन्दा हुनुहुन्छ भने हाई स्कूल युवा क्लबमा हार्दिक स्वागत छ।',
      ctaButton: 'क्लबको सदस्य बन्नुहोस्',
      ctaSecondary: 'कार्यालयमा सम्पर्क गर्नुहोस्',
    },
    about: {
      badge: 'हाम्रो बारेमा • About Us',
      title: 'समुदायको जगदेखि युवा सशक्तीकरणतर्फ',
      subtitle:
        'गुलरिया, कृष्णपुर-५, कञ्चनपुरमा युवाहरूलाई एकजुट गर्दै शिक्षा, खेलकुद, वातावरण र सामाजिक नेतृत्वको विकास गरी समाज रूपान्तरण गर्ने उद्देश्यले हाई स्कूल युवा क्लब स्थापना भएको हो।',
      missionTitle: 'हाम्रो लक्ष्य (Mission)',
      missionDesc:
        'गुलरिया र कृष्णपुर-५ का युवाहरूलाई नागरिक दायित्व, शैक्षिक सशक्तीकरण, खेलकुद विकास र सांस्कृतिक संरक्षणमा परिचालन गर्दै एक आत्मनिर्भर र प्रगतिशील समाज निर्माण गर्नु।',
      visionTitle: 'हाम्रो दृष्टिकोण (Vision)',
      visionDesc:
        'एकताबद्ध र सक्षम युवा समाज, जहाँ युवा नेताहरूले सामाजिक परिवर्तनको नेतृत्व गर्छन् र कञ्चनपुरको उज्यालो भविष्य निर्माणमा सक्रिय योगदान पुर्याउँछन्।',
      storyBadge: 'हामी को हौँ • Who We Are',
      storyTitle: 'गुलरिया, कृष्णपुर-५ मा क्रियाशील युवा तथा सामुदायिक संस्था',
      storyPara1:
        'हाई स्कुल युवा क्लब गुलरिया, कृष्णपुर-५, कञ्चनपुरमा कार्यरत युवा तथा सामुदायिक संस्था हो। यसले स्थानीय युवा र विद्यार्थीहरूलाई सामुदायिक कल्याण, खेलकुद, शिक्षा र स्वैच्छिक सेवामा एकताबद्ध गर्दछ।',
      storyPara2:
        'हाम्रा सदस्यहरू स्थानीय सरसफाइ अभियान, खेलकुद कार्यक्रम र सामुदायिक सद्भाव अभिवृद्धिमा सहभागी हुँदै आपसी सहकार्य र स्वस्थ जीवनशैली प्रवर्द्धनमा क्रियाशील छन्।',
      meetTeamBtn: 'कार्यसमिति टोली हेर्नुहोस्',
      exploreActivitiesBtn: 'हाम्रा गतिविधिहरू हेर्नुहोस्',
      valuesTitle: 'हाम्रा मार्गदर्शक मूल्यहरू',
      valUnityTitle: 'समावेशिता र एकता',
      valUnityDesc: 'जात, धर्म, लिंग वा पृष्ठभूमिको भेदभाव बिना हरेक नागरिकलाई समान अवसर र स्वागत।',
      valDemocracyTitle: 'लोकतान्त्रिक सुशासन',
      valDemocracyDesc:
        'पारदर्शी कार्यसमिति निर्वाचन, खुला वित्तीय हिसाबकिताब र सामूहिक निर्णय प्रक्रिया।',
      valCultureTitle: 'सांस्कृतिक सम्मान',
      valCultureDesc:
        'नेपालका विविध भाषा, परम्परा, चाडपर्व र मौलिक संस्कृतिको संरक्षण र संवर्द्धन।',
      valEnvironmentTitle: 'पर्यावरण संरक्षण',
      valEnvironmentDesc:
        'खुला सार्वजनिक स्थलको संरक्षण, हरियाली प्रवर्द्धन, शुद्ध खानेपानी र फोहोर व्यवस्थापन।',
      showcaseTag: 'युवा स्वयंसेवक तथा समुदाय',
      showcaseTitle: 'हाई स्कूल युवा क्लब समुदाय',
      showcaseDesc:
        'गुलरिया, कृष्णपुर-५, कञ्चनपुरमा युवा नेतृत्व, गुणस्तरीय शिक्षा, खेलकुद र सामाजिक कल्याणका लागि एकताबद्ध युवा शक्ति।',
      showcaseChapter: 'कृष्णपुर-५ शाखा',
      milestonesTag: 'उपलब्धि र सम्मानहरू',
      milestonesTitle: 'क्लबका मुख्य पुरस्कार र सामुदायिक उपलब्धिहरू',
      objectivesBadge: 'हाम्रा उद्देश्यहरू • Our Objectives',
      objectivesTitle: 'सामुदायिक कार्यका मुख्य क्षेत्रहरू',
      journeyBadge: 'हाम्रो यात्रा • Our Journey',
      journeyTitle: 'हाम्रो समुदाय कसरी एकसाथ अघि बढ्यो',
      impactBadge: 'हाम्रो प्रभाव • Community Impact',
      impactTitle: 'वास्तविक सामुदायिक उपलब्धिहरू',
      impactActiveMembers: 'सक्रिय सदस्यहरू',
      impactCommunityEvents: 'सामुदायिक कार्यक्रमहरू',
      impactActivitiesCompleted: 'सम्पन्न गतिविधिहरू',
      impactVolunteers: 'स्वयंसेवकहरू',
      impactInfoPending: 'विवरण अद्यावधिक गरिनेछ',
      committeeBadge: 'कार्यसमिति • Leadership',
      committeeTitle: 'कार्यसमिति टोली',
      committeeEmpty: 'कार्यसमिति विवरण चाँडै अद्यावधिक गरिनेछ।',
      partnersBadge: 'साझेदारहरू • Partners',
      partnersTitle: 'सामुदायिक साझेदारहरू',
      partnersEmpty: 'सामुदायिक साझेदारहरूको विवरण चाँडै अद्यावधिक गरिनेछ।',
    },
    activitiesPage: {
      badge: 'गतिविधिहरू • Programs',
      title: 'सक्रिय सामुदायिक अभियानहरू',
      subtitle:
        'खेलकुद प्रशिक्षण, शैक्षिक कार्यशाला, सरसफाइ तथा स्वास्थ्य सचेतनामार्फत सञ्चालन गरिएका विभिन्न युवा गतिविधिहरू।',
      searchPlaceholder: 'गतिविधि खोज्नुहोस्...',
      allCategories: 'सबै विधा',
      sports: 'खेलकुद तथा एथलेटिक्स',
      education: 'शिक्षा तथा साक्षरता',
      environment: 'पर्यावरण तथा सरसफाइ',
      culture: 'संस्कृति तथा चाडपर्व',
      health: 'स्वास्थ्य तथा रक्तदान',
      leadership: 'युवा नेतृत्व विकास',
      viewDetails: 'विवरण हेर्नुहोस्',
      noActivities: 'कुनै गतिविधि फेला परेन।',
      noActivitiesDesc: 'कृपया अर्को विधा छान्नुहोस् वा खोज शब्द बदल्नुहोस्।',
    },
    eventsPage: {
      badge: 'कार्यक्रम तालिका • Calendar',
      title: 'क्लबका आगामी तथा सम्पन्न कार्यक्रमहरू',
      subtitle:
        'गुलरिया, कृष्णपुर-५ मा हुने खेलकुद प्रतियोगिता, रक्तदान शिविर, सरसफाइ अभियान र शैक्षिक गोष्ठीहरूमा सहभागी हुनुहोस्।',
      allEvents: 'सबै कार्यक्रमहरू',
      upcoming: 'आगामी कार्यक्रम',
      completed: 'सम्पन्न कार्यक्रम',
      date: 'मिति',
      location: 'स्थान',
      organizer: 'आयोजक',
      entryFee: 'प्रवेश शुल्क',
      free: 'निःशुल्क प्रवेश',
      viewDetails: 'कार्यक्रम विवरण',
      registerNow: 'अहिले दर्ता गर्नुहोस्',
      eventEnded: 'कार्यक्रम सम्पन्न भइसकेको',
      noEvents: 'कुनै कार्यक्रम फेला परेन।',
      noEventsDesc: 'नयाँ कार्यक्रमहरूको तालिका चाँडै यहाँ प्रकाशित गरिनेछ।',
      category: 'विधा',
    },
    membersPage: {
      badge: 'हाम्रो नेतृत्व • Members',
      title: 'क्लब कार्यसमिति तथा सदस्यहरू',
      subtitle:
        'हाई स्कूल युवा क्लबलाई अगाडि बढाउने समर्पित पदाधिकारी, सल्लाहकार, आजीवन सदस्य तथा युवा स्वयंसेवकहरू।',
      searchPlaceholder: 'नाम, पद वा टोल अनुसार खोज्नुहोस्...',
      allRoles: 'सबै सदस्यहरू',
      executiveCommittee: 'कार्यसमिति',
      generalMembers: 'साधारण सदस्यहरू',
      volunteers: 'स्वयंसेवकहरू',
      memberSince: 'आबद्धता मिति',
      activeStatus: 'सक्रिय सदस्य',
      noMembers: 'कुनै सदस्य फेला परेन।',
      noMembersDesc: 'कृपया नामको हिज्जे जाँच गरी पुनः खोज्नुहोस्।',
      contactMember: 'सम्पर्क',
    },
    galleryPage: {
      badge: 'फोटो ग्यालरी • Moments',
      title: 'आधिकारिक फोटो ग्यालरी',
      subtitle:
        'कृष्णपुर-५ मा सम्पन्न सामाजिक सेवा, खेलकुद प्रतियोगिता, रक्तदान र सांस्कृतिक कार्यक्रमका जीवन्त तस्बिरहरू।',
      allPhotos: 'सबै तस्बिरहरू',
      communityDrives: 'सामाजिक अभियान',
      sportsEvents: 'खेलकुद गतिविधि',
      culturalFestivals: 'चाडपर्व तथा उत्सव',
      noPhotos: 'हाल कुनै तस्बिर उपलब्ध छैन।',
      noPhotosDesc: 'चाँडै नयाँ तस्बिरहरू यहाँ अपलोड गरिनेछ।',
      viewFull: 'ठूलो तस्बिर हेर्नुहोस्',
    },
    noticesPage: {
      badge: 'आधिकारिक बुलेटिन • Notices',
      title: 'सूचना तथा प्रेस विज्ञप्तिहरू',
      subtitle:
        'क्लबका महत्त्वपूर्ण निर्णयहरू, साधारण सभा आह्वान, प्रतियोगिता सम्बन्धी सूचना र सार्वजनिक सूचनाहरू।',
      publishedDate: 'प्रकाशित मिति',
      important: 'महत्त्वपूर्ण',
      downloadNotice: 'आधिकारिक सूचना डाउनलोड गर्नुहोस्',
      noNotices: 'हाल कुनै नयाँ सूचना प्रकाशित गरिएको छैन।',
      noNoticesDesc: 'क्लबका नयाँ सूचनाहरू यथाशीघ्र यहाँ राखिनेछ।',
    },
    contactPage: {
      badge: 'सम्पर्क • Reach Us',
      title: 'हामीलाई सिधै सम्पर्क गर्नुहोस्',
      subtitle:
        'हाई स्कूल युवा क्लबसँग जोडिन, सल्लाह-सुझाव दिन वा सहकार्य गर्न गुलरियास्थित हाम्रो कार्यालयमा सम्पर्क राख्नुहोस्।',
      getInTouch: 'सम्पर्क विवरण',
      getInTouchDesc: 'हाम्रो कार्यालयमा सिधै आउनुहोस् वा पदाधिकारीहरूसँग सम्पर्क गर्नुहोस्।',
      officeAddressLabel: 'क्लब कार्यालय ठेगाना',
      officeAddressVal: 'गुलरिया, कृष्णपुर-५, कञ्चनपुर, सुदूरपश्चिम प्रदेश, नेपाल',
      phoneLabel: 'फोन तथा ह्वाट्सएप',
      phoneVal: '+977 ९७४८८८६६९०',
      emailLabel: 'इमेल ठेगाना',
      emailVal: 'hsyc172@gmail.com',
      hoursLabel: 'कार्यालय समय',
      hoursVal: 'आइतबार – शुक्रबार: बिहान ९:०० देखि साँझ ५:०० बजेसम्म',
      formTitle: 'सिधै सन्देश पठाउनुहोस्',
      formSubtitle: 'तलको फारम भर्नुहोस्, हाम्रो टोलीले तुरुन्तै तपाईंलाई जवाफ दिनेछ।',
      fullNameLabel: 'पुरा नाम *',
      fullNamePlaceholder: 'तपाईंको पुरा नाम लेख्नुहोस्',
      emailLabelForm: 'इमेल ठेगाना *',
      emailPlaceholder: 'name@example.com',
      phoneLabelForm: 'फोन नम्बर',
      phonePlaceholder: '+977 ९८XXXXXXXX',
      subjectLabel: 'विषय *',
      subjectPlaceholder: 'सन्देशको विषय लेख्नुहोस्',
      messageLabel: 'तपाईंको सन्देश *',
      messagePlaceholder: 'तपाईंका प्रश्न, सुझाव वा विचारहरू यहाँ लेख्नुहोस्...',
      submitBtn: 'सन्देश पठाउनुहोस्',
      submittingBtn: 'सन्देश जाँदैछ...',
      successMessage: 'धन्यवाद! तपाईंको सन्देश प्राप्त भएको छ। हामी छिट्टै सम्पर्क गर्नेछौं।',
      errorMessage: 'सन्देश पठाउन सकिएन। कृपया पुनः प्रयास गर्नुहोस् वा फोनमा सम्पर्क गर्नुहोस्।',
      directContact: 'प्रत्यक्ष सहयोग',
      mapTitle: 'नक्सामा हाम्रो कार्यालय हेर्नुहोस्',
      mapSubtitle: 'श्री कृष्ण माध्यमिक विद्यालय, कृष्णपुर-४, गुलरिया, कञ्चनपुर, नेपालमा अवस्थित।',
      viewLargerMap: 'ठूलो नक्सा हेर्नुहोस्',
      faqTitle: 'बारम्बार सोधिने प्रश्नहरू (FAQ)',
      faqSubtitle: 'हाई स्कूल युवा क्लब, सदस्यता र कार्यक्रमहरू सम्बन्धी सामान्य प्रश्नहरूको उत्तर।',
      faq1Q: 'हाई स्कूल युवा क्लबको कार्यालय कहाँ अवस्थित छ?',
      faq1A: 'हाम्रो आधिकारिक क्लब कार्यालय गुलरिया, कृष्णपुर-५, कञ्चनपुर, सुदूरपश्चिम प्रदेश, नेपालमा अवस्थित छ।',
      faq2Q: 'क्लब कार्यालयको समय कहिले हो?',
      faq2A: 'हाम्रो कार्यालय आइतबारदेखि शुक्रबार बिहान ९:०० देखि साँझ ५:०० बजेसम्म खुला रहन्छ। शनिबार र सार्वजनिक बिदाका दिन बन्द रहन्छ।',
      faq3Q: 'क्लबको सदस्यता कसरी लिन सकिन्छ?',
      faq3A: 'युवा तथा समुदायका सदस्यहरूले हाम्रो अनलाइन सदस्य पोर्टल मार्फत वा गुलरियास्थित कार्यालयमा उपस्थित भई सदस्यता फारम भर्न सक्नुहुन्छ।',
      faq4Q: 'हाई स्कूल युवा क्लबले कस्ता गतिविधिहरू सञ्चालन गर्छ?',
      faq4A: 'हामी युवा नेतृत्व विकास, खेलकुद प्रतियोगिता, शैक्षिक गोष्ठी, वातावरण संरक्षण तथा सरसफाइ अभियान, स्वास्थ्य शिविर र सांस्कृतिक कार्यक्रमहरू सञ्चालन गर्दछौं।',
      faq5Q: 'सम्पर्क सन्देशको जवाफ कति समयमा प्राप्त हुन्छ?',
      faq5A: 'हाम्रो कार्यसमितिले सामान्यतया २४ देखि ४८ घण्टाभित्र जवाफ दिनेछ। जरुरी कामका लागि सिधै फोन वा ह्वाट्सएप (+९७७ ९७४८८८६६९०) मा सम्पर्क गर्न सक्नुहुन्छ।',
    },
    footer: {
      tagline:
        'शिक्षा, खेलकुद, संस्कृति संरक्षण र सामाजिक एकताको माध्यमबाट युवाहरूको सशक्तीकरण र सशक्त समुदाय निर्माण।',
      explore: 'पृष्ठहरू',
      aboutUs: 'हाम्रो बारेमा',
      events: 'कार्यक्रमहरू',
      activities: 'गतिविधिहरू',
      gallery: 'ग्यालरी',
      notices: 'सूचनाहरू',
      getInvolved: 'सहभागी हुनुहोस्',
      joinVolunteer: 'स्वयंसेवक बन्नुहोस्',
      executiveTeam: 'कार्यसमिति टोली',
      communityPartners: 'सामुदायिक साझेदारहरू',
      donateSupport: 'क्लबलाई सहयोग गर्नुहोस्',
      communityOffice: 'क्लब कार्यालय',
      address: 'गुलरिया, कृष्णपुर-५, कञ्चनपुर, सुदूरपश्चिम प्रदेश, नेपाल',
      phone: '+977 ९७४८८८६६९०',
      email: 'hsyc172@gmail.com',
      officeHours: 'कार्यालय समय: आइतबार – शुक्रबार, बिहान ९:०० – साँझ ५:०० बजे',
      copyright: 'हाई स्कूल युवा क्लब। सर्वाधिकार सुरक्षित।',
      allRightsReserved: 'सर्वाधिकार सुरक्षित।',
      clubBadge: 'हाई स्कूल युवा क्लब • कञ्चनपुर',
      privacyPolicy: 'गोपनीयता नीति',
      privacyPolicyDesc: 'सदस्य डेटा सुरक्षा र गोपनीयता नीति सम्बन्धी जानकारी।',
      termsConditions: 'नियम तथा सर्तहरू',
      termsConditionsDesc: 'क्लब सञ्चालन नियम, सदस्यता तथा आचारसंहिता।',
    },
  },
};
