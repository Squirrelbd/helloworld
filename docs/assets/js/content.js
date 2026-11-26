// Replace YOUR_* fields with public-approved details. Empty arrays show a pending state.
export const content = {
  profile: {
    name: 'Md. Amirul Islam',
    title: 'Embedded Systems & Industrial IoT Engineer',
    tagline: { lead: 'Connecting machines,', accent: 'devices & data.' },
    introduction: 'I develop embedded hardware and firmware for industrial machine monitoring, energy monitoring, and IoT-based cold chain management.',
    biography: 'I’m a senior embedded systems engineer at B-Trac Solutions. I work across hardware and firmware, from bringing up prototypes to integrating equipment and testing devices in the field.',
    about: 'My work includes sensor interfaces and C/C++ firmware on ESP32 and FreeRTOS. I use Modbus RTU and MQTT to connect equipment to monitoring systems, and I review firmware and mentor engineers.',
    location: '',
    phone: '',
    portrait: { path: 'assets/images/amirul-islam.webp', alt: 'Portrait of Md. Amirul Islam', width: 576, height: 576 }
  },
  expertise: [
    { title: 'Embedded hardware', description: 'Sensor and peripheral interfaces, prototype bring-up, and bench testing.', icon: 'prototype' },
    { title: 'Embedded firmware', description: 'C/C++ firmware on ESP32 and FreeRTOS, with I²C, SPI, and UART peripherals.', icon: 'chip' },
    { title: 'Industrial automation', description: 'Machine and energy meter integration using industrial interfaces such as Modbus RTU and RS-485.', icon: 'machine' },
    { title: 'Production monitoring', description: 'RFID-based data collection, target-versus-actual tracking, and quality workflows.', icon: 'pulse' },
    { title: 'Industrial IoT', description: 'Remote telemetry over MQTT using Wi-Fi, Ethernet, and GSM.', icon: 'network' },
    { title: 'IoT platforms', description: 'Device integration with Raspberry Pi, Node-RED, REST APIs, and PostgreSQL.', icon: 'platform' }
  ],
  // Experience fields include organization, organizationLogo, title, period, location,
  // employmentType, overview, responsibilities, contributions, solutions, technologies,
  // projectIds and achievements.
  experience: [
    {
      title: 'Senior Embedded Systems Engineer',
      organization: 'B-Trac Solutions Ltd.',
      period: 'Nov 2023–Present',
      overview: 'Lead embedded development for industrial monitoring and connected devices. Coordinate architecture, integration, testing, and field deployments.',
      contributions: 'Review firmware and mentor engineers. Work on device diagnostics and connectivity recovery.',
      technologies: ['C/C++', 'ESP32', 'FreeRTOS', 'MQTT', 'Modbus RTU']
    },
    {
      title: 'Embedded Systems Engineer',
      organization: 'B-Trac Solutions Ltd.',
      period: 'Jul 2021–Oct 2023',
      overview: 'Developed firmware for industrial IoT devices, including sensor acquisition, RFID-based monitoring, and remote telemetry. Supported device testing and field integration.',
      projectIds: ['cold-chain-monitoring']
    },
    {
      title: 'IT Support Engineer, IoT Device R&D',
      organization: 'Saiham Knit Composite Ltd.',
      period: 'Nov 2020–Jun 2021',
      overview: 'Supported factory IT operations and worked on IoT device prototypes and troubleshooting.'
    },
    {
      title: 'Embedded Systems Engineer',
      organization: 'Teknovus',
      period: 'Apr 2019–Oct 2020',
      overview: 'Developed embedded firmware and sensor interfaces, and built and tested prototypes.'
    },
    {
      title: 'Robotics Engineer',
      organization: 'Sirena Technology',
      period: 'Jan 2018–Mar 2019',
      overview: 'Worked on microcontroller-based robotics projects and delivered hands-on robotics training.'
    }
  ],
  projects: [
    {
      id: 'production-monitoring',
      title: 'Production line monitoring',
      category: 'Industrial automation',
      description: 'RFID-enabled production tracking for garment manufacturing, with line output and quality data.',
      features: ['Target-versus-actual tracking', 'Quality-control workflows'],
      technologies: ['RFID', 'Production data integration'],
      visual: 'monitoring',
      caseStudy: {
        role: 'Worked on integrating RFID and production data into the monitoring system.',
        objectives: 'Make actual output visible against production targets and support quality-control workflows.'
      }
    },
    {
      id: 'industrial-iot-gateway',
      title: 'Industrial IoT gateway',
      category: 'Industrial IoT',
      description: 'Connect equipment for remote industrial machine monitoring and device configuration.',
      features: ['Equipment data collection', 'Remote telemetry'],
      technologies: ['Modbus RTU', 'RS-485'],
      visual: 'platform',
      caseStudy: {
        role: 'Worked on device-side data collection and connected industrial equipment to remote monitoring workflows.',
        connectivity: 'Used serial interfaces and Modbus RTU over RS-485 to collect equipment data.'
      }
    },
    {
      id: 'cold-chain-monitoring',
      title: 'Cold-chain temperature monitoring',
      category: 'Embedded systems',
      description: 'IoT-based cold chain management with remote temperature monitoring for refrigerated transport and cold storage.',
      features: ['Temperature acquisition', 'Remote monitoring'],
      technologies: ['ESP32', 'MQTT'],
      visual: 'device',
      caseStudy: {
        role: 'Worked on ESP32 sensor acquisition and remote telemetry, and helped troubleshoot device connectivity.',
        dataFlow: 'The device reads temperature sensors and sends readings over MQTT for remote monitoring.'
      }
    }
  ],
  services: [
    { title: 'Industrial machine monitoring', description: 'Collect machine status and production data for remote equipment monitoring and line performance tracking.', capabilities: ['Industrial IoT', 'Modbus RTU', 'Production monitoring'], icon: 'machine' },
    { title: 'Energy monitoring & building management', description: 'Bring energy meter readings, environmental sensors, and equipment status into dashboards for energy monitoring and building management systems (BMS).', capabilities: ['Energy metering', 'Facility monitoring', 'Operational dashboards'], icon: 'platform' },
    { title: 'IoT-based cold chain management', description: 'Track temperatures in cold storage and refrigerated transport using connected sensors and remote telemetry.', capabilities: ['Temperature monitoring', 'Refrigerated transport', 'MQTT'], icon: 'network' },
    { title: 'Queue management systems', description: 'Track queues as they move through service counters and make wait times visible to staff.', capabilities: ['Queue status', 'Wait-time reporting'], icon: 'pulse' },
    { title: 'Trip management', description: 'Give operations teams a single view of trip status, scheduled stops, and completed journeys.', capabilities: ['Trip tracking', 'Transport operations'], icon: 'platform' },
    { title: 'Embedded device development', description: 'Develop embedded hardware and firmware for connected devices, from sensor bring-up through field testing.', capabilities: ['Hardware prototyping', 'ESP32', 'C/C++'], icon: 'chip' }
  ],
  resume: { path: 'assets/files/md-amirul-islam-resume.pdf', preview: true },
  socials: [
    { label: 'GitHub', url: 'https://github.com/Squirrelbd' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mdamirul/' }
  ],
  // Provider mode accepts an approved HTTPS endpoint that returns JSON with ok: true on success.
  // Default email mode launches a draft and does not submit anything to a server.
  contact: { mode: 'email', email: '', endpoint: '', providerName: '' },
  // Authorize public metadata in index.html before adding verified JSON-LD here.
  seo: { person: null }
};
