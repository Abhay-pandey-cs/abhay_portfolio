import { 
  Project, 
  LearningTopic, 
  Note, 
  Skill, 
  CommunityProject, 
  SiteSettings,
  Certification,
  Achievement,
  Experience,
  EducationItem
} from '@/types';

export const initialSiteSettings: SiteSettings = {
  name: 'Abhay Pandey',
  role: 'Computer Science Student',
  subtitle: 'Building · Learning · Exploring',
  bio: "I'm a second-year Computer Science Engineering student interested in backend development, system architecture and understanding how software works beneath the application layer.",
  currentStatus: '2nd Year · CSE · LPU',
  university: 'Lovely Professional University',
  degree: 'B.Tech — Computer Science Engineering',
  year: '2nd Year',
  cgpa: '9.42',
  cgpaFirstSem: '9.44',
  cgpaSecondSem: '9.41',
  cgpaOverall: '9.42',
  email: 'abhaypandey.dev@gmail.com',
  github: 'https://github.com/abhaypandey',
  linkedin: 'https://linkedin.com/in/abhaypandey',
  leetcode: 'https://leetcode.com/u/abhaypandey',
  codechef: 'https://www.codechef.com/users/abhaypandey',
  whatsappNumber: '+919876543210',
  resumeUrl: '#',
  githubStatsUsername: 'abhaypandey',
  splineSceneUrl: '',
  footerQuote: 'A computer science student building strong fundamentals, exploring software engineering and documenting the systems he builds along the way.',
  profilePhoto: '',
  enablePhotoBooth: false
};

export const initialProjects: Project[] = [
  {
    id: 'aidsphere',
    title: 'AidSphere',
    slug: 'aidsphere',
    subtitle: 'Intelligent Emergency Response Platform',
    shortDescription: 'An intelligent emergency response platform designed to connect people in distress with trained and untrained volunteers using real-time alerts, AI-driven SOS keyword detection, and DigiLocker verification.',
    fullDescription: 'AidSphere is an intelligent emergency response platform designed to connect people in distress with trained and untrained volunteers. It combines real-time alerts, AI-driven SOS keyword detection from social media sources and DigiLocker-based verification to support faster and more coordinated emergency assistance.',
    category: 'Full Stack',
    status: 'Active',
    featured: true,
    published: true,
    displayOrder: 1,
    startDate: '2024-06',
    completionDate: '2024-11',
    liveDemoUrl: 'https://aid-sphere-mocha.vercel.app',
    githubUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'NLP / AI Keyword Detection', 'DigiLocker API', 'WebSockets'],
    whatWasBuilt: 'A real-time emergency response platform with AI-assisted SOS keyword analysis, automated spatial proximity matching, and government DigiLocker citizen authentication.',
    howItWorks: 'Distress triggers and social media signals are parsed by natural language keyword filters. Authenticated responder volunteers within the geographic radius receive instant low-latency WebSocket alerts.',
    problem: 'In critical emergencies, every second counts. Traditional emergency response pipelines suffer from delayed communication, lack of on-ground volunteer verification, and chaotic social media distress signals that fail to reach coordinated responders.',
    solution: 'AidSphere bridges this gap by combining automated SOS keyword ingestion, instant geofenced alerts, and DigiLocker-based citizen identity verification so nearby helpers and authorities can coordinate in real time with high trust.',
    approach: 'Engineered a multi-tiered reactive pipeline: SOS intake layer (web forms + NLP ingest) ➔ Verification Gateway (DigiLocker OAuth) ➔ Geofence Dispatcher ➔ Real-time Volunteer WebSocket Hub.',
    features: [
      'Real-time distress alerts with geolocation mapping',
      'AI & NLP-based SOS keyword detection from unstructured feeds',
      'DigiLocker-based volunteer and responder identity verification',
      'Tiered volunteer coordination (trained medical vs basic assistance)',
      'Automated triage and emergency response status workflow',
      'Encrypted incident messaging and audit logs'
    ],
    architectureDescription: 'SOS Signal Ingest ➔ Verification Engine ➔ Geofence Dispatcher ➔ WebSocket Hub ➔ Responder Dashboard',
    architectureNodes: [
      {
        id: 'node-1',
        label: 'SOS Intake Engine',
        role: 'Ingestion Layer',
        description: 'Captures emergency triggers via web portal, SMS gateway, and NLP keyword filters.',
        tech: 'Next.js API & NLP'
      },
      {
        id: 'node-2',
        label: 'DigiLocker Gateway',
        role: 'Identity Verification',
        description: 'Authenticates volunteer credentials and citizen identity via government-backed DigiLocker APIs.',
        tech: 'OAuth 2.0 & Cryptographic tokens'
      },
      {
        id: 'node-3',
        label: 'Geofence Dispatcher',
        role: 'Spatial Matching',
        description: 'Calculates proximity radius to match emergency incidents with active nearby volunteers.',
        tech: 'PostGIS / Spatial Indexes'
      },
      {
        id: 'node-4',
        label: 'Real-time Hub',
        role: 'WebSocket Broadcast',
        description: 'Pushes low-latency state transitions and incident updates to all subscribed responders.',
        tech: 'WebSockets & Event Bus'
      },
      {
        id: 'node-5',
        label: 'Responder Dashboard',
        role: 'Client UI',
        description: 'Provides tactical map view, one-click status updates, and encrypted volunteer channel.',
        tech: 'React & Tailwind CSS'
      }
    ],
    challenges: [
      'Handling bursts of concurrent SOS requests during simulated crisis loads without dropping events.',
      'Ensuring strict volunteer identity validation through DigiLocker while keeping the onboarding friction minimal.',
      'Preventing duplicate alerts and noise from unfiltered social media data streams.'
    ],
    whatILearned: [
      'Architecting resilient event-driven message dispatchers under real-time constraints.',
      'Integrating 3rd-party government verification APIs with reliable fallback strategies.',
      'Handling spatial geospatial queries and WebSocket connection lifecycle management.'
    ],
    futureImprovements: [
      'Offline-first PWA mode with local mesh radio fallback.',
      'Automated voice-call transcription for elderly citizens.',
      'Integration with local hospital bed availability feeds.'
    ],
    updatedAt: '2024-11-20'
  },
  {
    id: 'agrosmart',
    title: 'AgroSmart',
    slug: 'agrosmart',
    subtitle: 'Smart Irrigation for Terrace Farming',
    shortDescription: 'An IoT-based irrigation system combining soil-moisture sensing, automated pump control, and a web dashboard to monitor and manage terrace agriculture.',
    fullDescription: 'AgroSmart is an IoT-based irrigation system designed for terrace farming. It combines soil-moisture sensing, automated irrigation, pump control and a web dashboard to monitor and manage irrigation across terraces.',
    category: 'IoT / Systems',
    status: 'Completed',
    featured: true,
    published: true,
    displayOrder: 2,
    startDate: '2024-01',
    completionDate: '2024-05',
    githubUrl: '',
    liveDemoUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80',
    technologies: ['ESP32', 'C/C++', 'Capacitive Moisture Sensors', 'DHT11 Sensor', 'Relay Modules', 'Wi-Fi HTTP Server', 'JSON', 'Chart.js', 'Embedded Systems'],
    whatWasBuilt: 'A hardware-firmware-software IoT solution deploying ESP32 microcontrollers with capacitive soil moisture sensors, DHT11 environmental telemetry, relay pump actuation, and an embedded responsive web dashboard.',
    howItWorks: 'Analog capacitive sensors measure real-time soil water potential. The ESP32 FreeRTOS firmware state machine applies a 16-sample moving average filter to remove ADC noise, triggers 12V irrigation pumps when moisture drops below threshold, and serves real-time telemetry via an async HTTP server.',
    problem: 'Terrace farming environments experience rapid soil drying due to direct sun exposure and shallow container depths. Manual watering leads to over-watering or root dehydration, and standard timers cannot adapt to dynamic weather.',
    solution: 'Designed an autonomous IoT feedback loop using an ESP32 microcontroller with analog capacitive soil probes, temperature/humidity sensing, and solid-state relays that trigger localized drip irrigation only when soil water potential drops below defined biological thresholds.',
    approach: 'Constructed an embedded C++ firmware state machine running on ESP32 dual cores: Core 0 handles sensor polling, analog filtering, and relay actuation; Core 1 hosts a lightweight asynchronous HTTP server serving real-time telemetry and JSON APIs.',
    features: [
      'Terrace-wise multi-zone soil moisture monitoring',
      'Corrosion-resistant capacitive moisture sensing probes',
      'Automatic threshold-based irrigation triggering',
      'Manual pump override control from local/remote web UI',
      'Ambient temperature and relative humidity telemetry (DHT11)',
      'Fertigation scheduling support for nutrient dosing',
      'Interactive responsive web dashboard with telemetry plots',
      'Fail-safe dry-run pump cutoff protection'
    ],
    architectureDescription: 'Sensors ➔ ESP32 Microcontroller ➔ Control Logic ➔ Relays & Pumps ➔ Web Server ➔ Dashboard UI',
    architectureNodes: [
      {
        id: 'node-sensors',
        label: 'Sensors',
        role: 'Data Collection',
        description: 'Capacitive analog moisture sensors & DHT11 temperature/humidity probes across terrace zones.',
        tech: 'Analog ADC & 1-Wire'
      },
      {
        id: 'node-esp32',
        label: 'ESP32 MCU',
        role: 'Embedded Core',
        description: 'Dual-core 240MHz microcontroller sampling ADC signals, executing smoothing filters, and managing Wi-Fi.',
        tech: 'ESP-IDF / FreeRTOS / C++'
      },
      {
        id: 'node-logic',
        label: 'Control Logic',
        role: 'Threshold Engine',
        description: 'Compares real-time moisture against crop-specific saturation curves to calculate irrigation duration.',
        tech: 'Hysteresis State Machine'
      },
      {
        id: 'node-pumps',
        label: 'Relays & Pumps',
        role: 'Actuation Layer',
        description: 'Optocoupled 5V relay module driving 12V submersible DC diaphragm pumps with dry-run cutoff.',
        tech: 'Optoisolators & Solenoids'
      },
      {
        id: 'node-server',
        label: 'Web Server',
        role: 'Telemetry Gateway',
        description: 'Asynchronous HTTP server hosted on ESP32 delivering JSON endpoints and telemetry logs.',
        tech: 'AsyncWebServer & JSON'
      },
      {
        id: 'node-ui',
        label: 'Dashboard',
        role: 'Client Analytics',
        description: 'Browser UI rendering live moisture gauges, historical trend charts, and manual valve toggles.',
        tech: 'Chart.js, HTML5, CSS'
      }
    ],
    challenges: [
      'Analog noise on long sensor wiring runs solved by implementing moving-average digital filtering in C++.',
      'Preventing ESP32 brownouts during high inductive inrush current when 12V pump relays energize.',
      'Calibrating capacitive sensors for different soil mixes (cocopeat vs potting red soil).'
    ],
    whatILearned: [
      'Writing non-blocking asynchronous embedded C++ code with FreeRTOS tasks.',
      'Understanding hardware debouncing, optocoupler isolation, and inductive kickback diode protection.',
      'Building lightweight web dashboards directly served from embedded microcontrollers.'
    ],
    futureImprovements: [
      'MQTT uplink to a central home server for multi-month data logging.',
      'Solar battery charging circuit with deep sleep power management.',
      'Weather forecast API integration to delay watering if rain is predicted.'
    ],
    updatedAt: '2024-05-15'
  }
];

export const initialCertifications: Certification[] = [];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Academic Standing (Overall CGPA: 9.42 / 10.0)',
    organization: 'Lovely Professional University',
    date: '2023 - Present',
    rankOrHonor: 'First Year Aggregate',
    description: 'First Semester 9.44 · Second Semester 9.41 · Overall 9.42 across B.Tech Computer Science Engineering core subjects.'
  }
];

export const initialExperience: Experience[] = [
  {
    id: 'exp-1',
    role: 'Community Development Volunteer (45 Hours)',
    organization: 'Gaganraj Foundation',
    location: 'Punjab, India',
    startDate: '2024-06',
    endDate: '2024-07',
    current: false,
    description: 'Completed 45 hours of structured community education, supporting foundational mathematics concepts and essential computer literacy for students.',
    highlights: [
      'Delivered 45 hours of structured academic support sessions',
      'Taught foundational mathematics concepts including Rational Numbers and arithmetic reasoning',
      'Conducted awareness sessions on Digital Footprints and cyber safety',
      'Trained students on basic computer operations and digital tools'
    ],
    technologies: ['Mathematics Instruction', 'Computer Education', 'Digital Literacy']
  }
];

export const initialEducation: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'B.Tech — Computer Science Engineering',
    institution: 'Lovely Professional University (LPU)',
    year: '2nd Year (2023 - 2027)',
    cgpa: '9.42 / 10.0',
    location: 'Punjab, India',
    coursework: [
      'Data Structures & Algorithms',
      'Object Oriented Programming in Java',
      'Database Management Systems (DBMS)',
      'Operating Systems',
      'Computer Organization & Architecture',
      'Discrete Mathematics'
    ],
    description: 'Building strong core fundamentals in computer science, software engineering, and systems.'
  }
];

export const initialLearningTopics: LearningTopic[] = [
  {
    id: 'learn-1',
    title: 'Java Backend Development',
    category: 'Backend',
    status: 'Learning',
    notes: 'Core Java OOP, Collections Framework, Multithreading, Concurrency utilities, JVM memory architecture (Heap, Stack, Metaspace), Garbage Collection tuning.',
    subtopics: ['Collections Framework', 'Generics', 'CompletableFuture', 'JVM Internals', 'Garbage Collectors']
  },
  {
    id: 'learn-2',
    title: 'Spring Boot & Spring Data JPA',
    category: 'Backend',
    status: 'Learning',
    notes: 'Inversion of Control, Dependency Injection, RESTful APIs, Spring Data JPA with Hibernate, Entity Lifecycle, Transaction Management (@Transactional), Connection Pooling with HikariCP.',
    subtopics: ['IoC & DI', 'Spring Data Repositories', 'Hibernate Entity States', 'Transaction Propagation', 'Spring Security JWT']
  },
  {
    id: 'learn-3',
    title: 'PostgreSQL & Database Design',
    category: 'Backend',
    status: 'Learning',
    notes: 'Relational modeling, Normalization, ACID transactions, B-Tree and GIN indexes, Query optimization with EXPLAIN ANALYZE, Connection pooling.',
    subtopics: ['ACID Semantics', 'B-Tree & Hash Indexing', 'EXPLAIN ANALYZE', 'Foreign Keys & Constraints', 'Transactions & Isolation Levels']
  },
  {
    id: 'learn-4',
    title: 'Data Structures & Algorithms',
    category: 'DSA',
    status: 'Learning',
    notes: 'Systematic problem solving in Java. Practicing arrays, two pointers, sliding window, linked lists, trees, heaps, graphs, BFS/DFS, recursion, and dynamic programming.',
    subtopics: ['Arrays & Sliding Window', 'Linked Lists & Two Pointers', 'Binary Search Trees & Heaps', 'Graph Traversals (BFS/DFS)', 'Dynamic Programming Fundamentals']
  },
  {
    id: 'learn-5',
    title: 'Operating Systems (GATE / Core CSE)',
    category: 'Computer Science',
    status: 'Learning',
    notes: 'Process scheduling algorithms, Context switching overhead, Virtual Memory paging, TLB, Deadlocks and Banker algorithm, Mutexes, Semaphores, and Race conditions.',
    subtopics: ['Process vs Thread Lifecycle', 'Virtual Memory & Paging', 'CPU Scheduling', 'Deadlocks & Synchronization', 'File System Inodes']
  },
  {
    id: 'learn-6',
    title: 'Computer Networks (GATE / Core CSE)',
    category: 'Computer Science',
    status: 'Learning',
    notes: 'OSI 7-Layer & TCP/IP models, IP addressing, Subnetting, TCP 3-Way Handshake & Congestion Control, DNS resolution, HTTP/HTTPS, WebSockets.',
    subtopics: ['TCP vs UDP', 'Routing Protocols', 'Subnetting & CIDR', 'HTTP/1.1 vs HTTP/2 vs WebSockets', 'DNS & Socket Layer']
  },
  {
    id: 'learn-7',
    title: 'Database Management Systems (GATE / Core CSE)',
    category: 'Computer Science',
    status: 'Learning',
    notes: 'Relational algebra, SQL query optimization, 1NF to BCNF normalization, concurrency control, Two-Phase Locking (2PL), Write-Ahead Logging (WAL).',
    subtopics: ['Relational Algebra', 'Normalization (1NF-BCNF)', 'Concurrency Control (2PL)', 'WAL & Crash Recovery', 'Indexing Strategies']
  },
  {
    id: 'learn-8',
    title: 'Computer Organization & Architecture (COA)',
    category: 'Computer Science',
    status: 'Learning',
    notes: 'CPU instruction cycles, RISC vs CISC, pipeline hazards, CPU cache hierarchy (L1/L2/L3), memory alignment, byte endianness.',
    subtopics: ['Instruction Cycle', 'Pipelining & Hazards', 'Cache Locality & Hierarchy', 'Bus Architecture', 'Digital Logic & ALUs']
  },
  {
    id: 'learn-9',
    title: 'Linux & System Programming',
    category: 'Systems',
    status: 'Learning',
    notes: 'POSIX system calls (fork, exec, pipe, socket), file descriptors, signals, bash scripting, memory management with malloc/mmap, low-level socket programming.',
    subtopics: ['POSIX System Calls', 'File Descriptors & Pipes', 'Signal Handling', 'Memory Mapping (mmap)', 'TCP/IP Socket Programming']
  },
  {
    id: 'learn-10',
    title: 'AI & Machine Learning in Systems',
    category: 'Backend',
    status: 'Learning',
    notes: 'Integrating AI components in backend architectures: NLP keyword ingestion for distress triage in AidSphere, Prompt engineering, LLM API integration, and AI system design.',
    subtopics: ['NLP Keyword Parsing', 'AI / LLM API Integrations', 'Prompt Engineering', 'Vector Embeddings & Search', 'AI-assisted Data Pipelines']
  }
];

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Understanding JVM Memory Model: Heap, Stack & Metaspace',
    slug: 'understanding-jvm-memory-model',
    date: '2024-10-14',
    category: 'Java',
    tags: ['Java', 'JVM', 'Memory Management', 'Backend'],
    summary: 'A deep dive into how the Java Virtual Machine manages heap allocations, stack frames, and Metaspace, and how Garbage Collection works underneath.',
    content: `# Understanding the JVM Memory Model

When we run a Java program, memory is divided into distinct operational regions managed by the JVM:

## 1. The Stack
- Each thread has its own private Stack.
- Stores primitive local variables and references to objects living in the Heap.
- Stack frames are pushed on method invocation and popped on return.
- **Allocation/Deallocation cost**: Zero garbage collection overhead; very fast $O(1)$ pointer bump.

\`\`\`java
public void executeProcess() {
    int localCount = 42; // Allocated on the Thread Stack
    User user = new User("Abhay"); // 'user' reference is on Stack; object is on Heap
}
\`\`\`

## 2. The Heap
- Shared across all threads in the JVM.
- Holds all instantiated objects and instance variables.
- Split into **Young Generation** (Eden, S0, S1 survivor spaces) and **Old Generation (Tenured)**.
- Minor GC collects short-lived objects in Eden; long-lived objects get promoted to Old Gen.

## 3. Metaspace (Native Memory)
- Replaced the older *PermGen* in Java 8.
- Lives in native OS memory rather than continuous JVM heap.
- Holds loaded class metadata, static bytecodes, and method descriptors.

## Why this matters for Backend Engineers
Understanding memory layout allows us to write memory-efficient Spring Boot applications, avoid memory leaks from unclosed resources, and minimize Stop-The-World GC pauses under high request throughput.`,
    readTime: '4 min read',
    published: true,
    updatedAt: '2024-10-14'
  },
  {
    id: 'note-2',
    title: 'How Operating Systems Handle Context Switching Between Threads',
    slug: 'os-thread-context-switching',
    date: '2024-09-28',
    category: 'OS',
    tags: ['Operating Systems', 'Concurrency', 'Linux', 'CPU'],
    summary: 'What actually happens at the hardware and kernel level when the CPU scheduler pauses one thread and resumes another.',
    content: `# What Happens During a CPU Context Switch

When an operating system switches execution from Thread A to Thread B, it involves cooperative or preemptive kernel intervention:

\`\`\`
[Thread A Running] 
       ↓ (Timer Interrupt / System Call)
[Save Thread A Registers into PCB/TCB]
       ↓
[Kernel Scheduler selects Thread B]
       ↓
[Switch Memory Space if Process Changed (Page Directory Base Register CR3)]
       ↓
[Load Thread B Registers & Program Counter]
       ↓
[Thread B Resumes Execution]
\`\`\`

## Key Overheads:
1. **Direct Overhead**: Saving and restoring general-purpose registers, stack pointers, and program counter ($PC$).
2. **Indirect Overhead (Cache Coldness)**: CPU L1/L2 caches and Translation Lookaside Buffer (TLB) entries become stale, leading to cache misses when the new thread executes.

Understanding this helps explain why lightweight concurrency models (such as Java 21 Virtual Threads or Go Goroutines) achieve vastly higher throughput by handling scheduling in user space rather than issuing OS kernel context switches.`,
    readTime: '5 min read',
    published: true,
    updatedAt: '2024-09-28'
  },
  {
    id: 'note-3',
    title: 'Building Non-Blocking IoT Sensor Polling on ESP32 with FreeRTOS',
    slug: 'esp32-freertos-non-blocking-sensors',
    date: '2024-04-12',
    category: 'Systems',
    tags: ['IoT', 'ESP32', 'C/C++', 'Embedded', 'AgroSmart'],
    summary: 'Architectural lessons from AgroSmart on using FreeRTOS tasks to read analog sensors without freezing the embedded web server.',
    content: `# Non-Blocking Sensor Polling on ESP32

When building AgroSmart, naive implementations using Arduino \`delay()\` paused the CPU, causing HTTP request drops on the web dashboard.

## The Solution: FreeRTOS Task Pinning
ESP32 has two Xtensa LX6 cores:
- **Core 0**: Dedicated to networking (Wi-Fi, HTTP server, WebSockets).
- **Core 1**: Dedicated to high-precision analog ADC sampling, noise filtering, and relay actuation.

\`\`\`cpp
void setup() {
    // Pin sensor acquisition task to Core 1
    xTaskCreatePinnedToCore(
        SensorTaskLoop,    /* Function to implement the task */
        "SensorTask",      /* Name of the task */
        4096,              /* Stack size in words */
        NULL,              /* Task input parameter */
        1,                 /* Priority of the task */
        &SensorTaskHandle, /* Task handle */
        1                  /* Core where the task should run */
    );
}
\`\`\`

## ADC Noise Reduction
Capacitive soil moisture sensors produce analog ripple. We implemented a 16-sample moving average filter in C++ to smooth out erratic spikes before triggering relay logic.`,
    readTime: '3 min read',
    published: true,
    updatedAt: '2024-04-12'
  }
];

export const initialSkills: Skill[] = [
  // Languages
  { id: 's-1', name: 'Java', group: 'Languages', status: 'Used in Projects', highlight: true },
  { id: 's-2', name: 'C', group: 'Languages', status: 'Used in Projects' },
  { id: 's-3', name: 'C++', group: 'Languages', status: 'Used in Projects', highlight: true },
  { id: 's-4', name: 'Python', group: 'Languages', status: 'Used in Projects' },
  { id: 's-5', name: 'JavaScript', group: 'Languages', status: 'Used in Projects' },
  { id: 's-6', name: 'TypeScript', group: 'Languages', status: 'Used in Projects' },

  // Backend
  { id: 's-7', name: 'Spring Boot', group: 'Backend', status: 'Currently Learning', highlight: true },
  { id: 's-8', name: 'Spring Data JPA', group: 'Backend', status: 'Currently Learning' },
  { id: 's-9', name: 'RESTful APIs', group: 'Backend', status: 'Used in Projects', highlight: true },
  { id: 's-10', name: 'Node.js', group: 'Backend', status: 'Used in Projects' },
  { id: 's-10b', name: 'AI / LLM API Integration', group: 'Backend', status: 'Currently Learning', highlight: true },

  // Database
  { id: 's-11', name: 'PostgreSQL', group: 'Database', status: 'Used in Projects', highlight: true },
  { id: 's-12', name: 'SQL', group: 'Database', status: 'Used in Projects' },

  // Frontend
  { id: 's-13', name: 'React', group: 'Frontend', status: 'Used in Projects' },
  { id: 's-14', name: 'Next.js', group: 'Frontend', status: 'Used in Projects', highlight: true },
  { id: 's-15', name: 'Tailwind CSS', group: 'Frontend', status: 'Used in Projects' },
  { id: 's-16', name: 'HTML / CSS', group: 'Frontend', status: 'Used in Projects' },

  // Systems
  { id: 's-17', name: 'Linux', group: 'Systems', status: 'Used in Projects', highlight: true },
  { id: 's-18', name: 'Operating Systems', group: 'Systems', status: 'Currently Learning' },
  { id: 's-19', name: 'System Architecture', group: 'Systems', status: 'Currently Learning', highlight: true },
  { id: 's-20', name: 'ESP32 / Embedded C++', group: 'Systems', status: 'Used in Projects' },

  // Tools
  { id: 's-21', name: 'Git & GitHub', group: 'Tools', status: 'Used in Projects', highlight: true },
  { id: 's-22', name: 'CI/CD Basics', group: 'Tools', status: 'Currently Learning' },
  { id: 's-23', name: 'Chart.js', group: 'Tools', status: 'Used in Projects' },
  { id: 's-24', name: 'Postman', group: 'Tools', status: 'Used in Projects' }
];

export const initialCommunityProjects: CommunityProject[] = [
  {
    id: 'gaganraj-foundation',
    title: 'Community Development Project',
    organization: 'Gaganraj Foundation',
    role: 'Academic & Digital Literacy Volunteer',
    hours: 45,
    description: 'Contributed 45 hours of structured mentorship to students, supporting foundational mathematics concepts and essential computer literacy.',
    highlights: [
      'Conducted 45 hours of interactive academic support sessions',
      'Taught fundamental mathematics concepts including Rational Numbers and arithmetic reasoning',
      'Delivered awareness modules on Digital Footprints, internet safety, and cyber hygiene',
      'Introduced students to basic computer operation, typing, and digital tools',
      'Fostered student curiosity and provided personalized academic guidance'
    ],
    startDate: '2024-06',
    endDate: '2024-07',
    photo: ''
  }
];
