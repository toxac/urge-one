interface SkillCategory {
    category: string;
    subcategories: { name: string; description: string }[];
  }
  
export  const skillsData: SkillCategory [] = [
    {
      category: "Marketing & Sales",
      subcategories: [
        {
          name: "Digital Marketing",
          description: "Creating and managing online marketing campaigns.",
        },
        {
          name: "Content Marketing",
          description:
            "Creating and distributing valuable content to attract an audience.",
        },
        {
          name: "Social Media Marketing",
          description:
            "Managing social media presence to engage and grow an audience.",
        },
        {
          name: "Public Relations (PR)",
          description: "Building and maintaining relationships with the public.",
        },
        {
          name: "Sales",
          description: "Identifying and converting leads into customers.",
        },
        {
          name: "Business Development",
          description: "Creating strategic partnerships and growth opportunities.",
        },
      ],
    },
    {
      category: "Technology",
      subcategories: [
        {
          name: "Software Development",
          description: "Designing, coding, and testing software applications.",
        },
        {
          name: "Web Development",
          description: "Building and maintaining websites.",
        },
        {
          name: "Mobile App Development",
          description: "Creating mobile applications for iOS and Android.",
        },
        {
          name: "Data Science",
          description: "Analyzing and interpreting complex data sets.",
        },
        {
          name: "Cybersecurity",
          description: "Protecting systems and networks from cyber threats.",
        },
        {
          name: "IT Support",
          description: "Providing technical assistance and troubleshooting.",
        },
      ],
    },
    {
      category: "Creative & Design",
      subcategories: [
        {
          name: "Graphic Design",
          description: "Creating visual concepts for communication.",
        },
        {
          name: "UX/UI Design",
          description: "Designing user interfaces for websites and applications.",
        },
        {
          name: "Writing & Editing",
          description: "Producing written content for various purposes.",
        },
        {
          name: "Video Production & Editing",
          description: "Creating and editing video content.",
        },
        {
          name: "Photography",
          description: "Capturing and editing images.",
        },
        {
          name: "Music & Audio Production",
          description: "Creating and producing music and audio content.",
        },
      ],
    },
    {
      category: "Business & Management",
      subcategories: [
        {
          name: "Business Strategy & Planning",
          description: "Developing and implementing business strategies.",
        },
        {
          name: "Project Management",
          description: "Planning, executing, and managing projects.",
        },
        {
          name: "Operations Management",
          description: "Overseeing and optimizing business operations.",
        },
        {
          name: "Human Resources (HR)",
          description: "Managing employee relations and resources.",
        },
        {
          name: "Leadership & Team Management",
          description: "Leading and motivating teams to achieve goals.",
        },
      ],
    },
    {
      category: "Finance & Accounting",
      subcategories: [
        {
          name: "Accounting & Bookkeeping",
          description: "Recording and managing financial transactions.",
        },
        {
          name: "Financial Analysis",
          description: "Analyzing financial data and making investment decisions.",
        },
        {
          name: "Investment Management",
          description: "Managing investment portfolios.",
        },
        {
          name: "Tax Preparation",
          description: "Preparing and filing tax returns.",
        },
      ],
    },
    {
      category: "Communication & Interpersonal",
      subcategories: [
        {
          name: "Public Speaking",
          description: "Delivering presentations to an audience.",
        },
        {
          name: "Presentation Skills",
          description: "Creating and delivering effective presentations.",
        },
        {
          name: "Negotiation & Persuasion",
          description: "Influencing others and reaching agreements.",
        },
        {
          name: "Conflict Resolution",
          description: "Resolving disagreements and disputes.",
        },
        {
          name: "Teamwork & Collaboration",
          description: "Working effectively with others to achieve goals.",
        },
        {
          name: "Active Listening",
          description: "Paying attention and understanding others' perspectives.",
        },
      ],
    },
    {
      category: "Personal Development",
      subcategories: [
        {
          name: "Time Management & Productivity",
          description: "Managing time effectively and maximizing productivity.",
        },
        {
          name: "Self-Awareness & Emotional Intelligence",
          description: "Understanding and managing one's emotions and behavior.",
        },
        {
          name: "Learning & Development",
          description: "Continuously acquiring new knowledge and skills.",
        },
        {
          name: "Problem-Solving & Decision-Making",
          description: "Identifying and solving problems effectively.",
        },
        {
          name: "Stress Management & Resilience",
          description: "Managing stress and bouncing back from setbacks.",
        },
      ],
    },
    {
      category: "Arts & Crafts",
      subcategories: [
        {
          name: "Painting & Drawing",
          description: "Creating visual art using paint or drawing tools.",
        },
        {
          name: "Sculpture",
          description: "Creating three-dimensional art.",
        },
        {
          name: "Ceramics",
          description: "Creating objects from clay.",
        },
        {
          name: "Jewelry Making",
          description: "Designing and creating jewelry.",
        },
        {
          name: "Textiles",
          description: "Working with fabrics and textiles.",
        },
        // Add more specific crafts as needed
      ],
    },
    {
      category: "Trades",
      subcategories: [
        {
          name: "Electrician",
          description: "Installing and maintaining electrical systems.",
        },
        {
          name: "Plumber",
          description: "Installing and repairing water and drainage systems.",
        },
        {
          name: "Carpenter",
          description: "Constructing and repairing building frameworks.",
        },
        {
          name: "Mechanic",
          description: "Repairing and maintaining vehicles and machinery.",
        },
        {
          name: "Welder",
          description: "Joining metals using welding processes.",
        },
        // Add more specific trades as needed
      ],
    },
    {
      category: "Engineering",
      subcategories: [
        {
          name: "Civil Engineering",
          description: "Designing and constructing infrastructure.",
        },
        {
          name: "Mechanical Engineering",
          description: "Designing and developing mechanical systems.",
        },
        {
          name: "Electrical Engineering",
          description: "Designing and developing electrical systems.",
        },
        {
          name: "Chemical Engineering",
          description: "Applying chemical principles to industrial processes.",
        },
        {
          name: "Software Engineering",
          description: "Designing and developing software applications.",
        },
        // Add more specific engineering disciplines as needed
      ],
    },
    {
      category: "Medicine",
      subcategories: [
        {
          name: "General Practice",
          description: "Providing primary healthcare services.",
        },
        {
          name: "Surgery",
          description: "Performing surgical procedures.",
        },
        {
          name: "Nursing",
          description: "Providing care to patients.",
        },
        {
          name: "Pharmacy",
          description: "Dispensing medications and providing pharmaceutical care.",
        },
        {
          name: "Dentistry",
          description: "Providing dental care.",
        },
        // Add more specific medical specializations as needed
      ],
    },
    {
      category: "Legal",
      subcategories: [
        {
          name: "Contract Law",
          description: "Drafting and interpreting contracts.",
        },
        {
          name: "Intellectual Property Law",
          description: "Protecting intellectual property rights.",
        },
        {
          name: "Corporate Law",
          description: "Advising businesses on legal matters.",
        },
        {
          name: "Litigation",
          description: "Representing clients in legal disputes.",
        },
        // Add more specific legal specializations as needed
      ],
    },
  ];