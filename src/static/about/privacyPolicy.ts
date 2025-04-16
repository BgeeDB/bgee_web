import config from '../../config.json';
import { getMetadata } from '~/helpers/metadata';
import staticBuilder from '~/helpers/staticBuilder';

export function meta() {
  return getMetadata({
    title: 'Privacy notice',
    description: 'Privacy notice describing the use of personal data by Bgee.',
    keywords: 'privacy notice, privacy policy, personal data, data controller, personal data collection, GDPR',
  });
}

export default function Page() {
  return staticBuilder(privacyPolicy);
}

const privacyPolicy = [
  {
    type: 'title',
    content: 'Bgee privacy notice',
  },
  {
    type: 'text',
    content:
      'This privacy notice explains what personal data are collected by the specific service you are requesting, for what purposes, how they are processed, and how we keep them secure.',
  },
  {
    type: 'section',
    title: 'Who controls your personal data and how to contact us?',
    children: [
      {
        type: 'rich_text',
        content: [
          {
            type: 'bold',
            content: "The Bgee data controller's contact",
          },
          {
            type: 'break_line',
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Marc Robinson-Rechavi, Bgee Principal Investigator and Professor at University of Lausanne (',
              },
              {
                type: 'link_mail',
                email: config.contactEmail,
                text: 'email',
              },
              {
                type: 'text',
                content: ')',
              },
            ],
          },
          {
            type: 'break_line',
          },
          {
            type: 'text',
            content: 'Department of Ecology and Evolution, University of Lausanne, 1015 Lausanne, Switzerland',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'bold',
            content: "The University of Lausanne Data Protection Officer's contact",
          },
          {
            type: 'break_line',
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Salamin Mikhaël, Délégué à la protection des données (',
              },
              {
                type: 'link_mail',
                email: 'Mikhael.Salamin@unil.ch',
                text: 'email',
              },
              {
                type: 'text',
                content: ')',
              },
            ],
          },
          {
            type: 'break_line',
          },
          {
            type: 'text',
            content: 'Affaires générales, University of Lausanne, 1015 Lausanne, Switzerland',
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'Which is the lawful basis for processing personal data?',
    children: [
      {
        type: 'text',
        content:
          'Processing your personal data is necessary for our legitimate interests in providing services to you, to help improve our resources and for the purposes of day-to-day running of the Bgee resource and underlying infrastructure.',
      },
    ],
  },
  {
    type: 'section',
    title: 'What personal data are collected from users of the service? How do we use these personal data?',
    children: [
      {
        type: 'text',
        content: 'The personal data collected from the services listed below is as follows:',
      },
      {
        type: 'break_line',
      },
      {
        type: 'bold',
        content: 'Website and API',
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'text',
            content: 'IP address',
          },
          {
            type: 'text',
            content: 'Date and time of a visit to the service',
          },
          {
            type: 'text',
            content: 'Operating system',
          },
          {
            type: 'text',
            content: 'Browser',
          },
          {
            type: 'text',
            content: 'Amount of data transmitted',
          },
          {
            type: 'text',
            content: 'Email address (optionally requested)',
          },
        ],
      },
      {
        type: 'break_line',
      },
      {
        type: 'bold',
        content: 'BgeeDB R package',
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'text',
            content: 'IP address',
          },
          {
            type: 'text',
            content: 'Date and time of a visit to the service',
          },
          {
            type: 'text',
            content: 'Operating system',
          },
          {
            type: 'text',
            content: 'Browser',
          },
          {
            type: 'text',
            content: 'Amount of data transmitted',
          },
        ],
      },
      {
        type: 'break_line',
      },
      {
        type: 'bold',
        content: 'Help desk',
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'text',
            content: 'Name',
          },
          {
            type: 'text',
            content: 'Email address',
          },
        ],
      },
      {
        type: 'break_line',
      },
      {
        type: 'text',
        content: 'The data controller will use your personal data for the following purposes:',
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'text',
            content: 'To provide the user access to the service',
          },
          {
            type: 'text',
            content: 'To answer questions from users',
          },
          {
            type: 'text',
            content: 'To better understand the needs of the users and guide future improvements of the service',
          },
          {
            type: 'text',
            content: 'To create anonymous usage statistics',
          },
          {
            type: 'text',
            content: 'To conduct and monitor data protection activities',
          },
          {
            type: 'text',
            content: 'To conduct and monitor security activities',
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'Who will have access to your personal data?',
    children: [
      {
        type: 'text',
        content:
          'Personal data will only be disclosed to authorized staff of Bgee. Your personal data are stored internally and not exposed to third parties or countries. IP addresses are removed from log files or anonymized before being stored in case they are needed.',
      },
    ],
  },
  {
    type: 'section',
    title:
      'Will your personal data be transferred to third parties/countries (i.e. countries not part of EU/EAA) and/or international organisations?',
    children: [
      {
        type: 'text',
        content: 'There are no personal data transfers to international organisations outside Bgee.',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content:
              'Bgee uses Matomo as a third-party analytics service to collect information about website performance and how users navigate through and use our site to help us design better interfaces. We use a local instance of Matomo, all data stay local in Switzerland.',
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'How long do we keep your personal data?',
    children: [
      {
        type: 'text',
        content:
          'Any personal data directly obtained from you will be retained as long as the service is live, even if you stop using the service. We will keep the personal data for the minimum amount of time possible to ensure legal compliance and to facilitate internal and external audits if they arise.',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content: 'Data are erased when not needed any more, and cannot be conserved more than 5 years for audits.',
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'Cookies',
    children: [
      {
        type: 'text',
        content:
          'The user is informed that cookies may be stored on the hard drive of his/her/its computer to record information about his/her/its visits to this portal.',
      },
      {
        type: 'text',
        content:
          "Cookies are used to identify the user and to facilitate and customize this portal's use by memorizing certain parameters. Cookies are used, in particular, to obtain information on the visits to the pages of this portal and the date and time of consultation.",
      },
      {
        type: 'text',
        content:
          'The user can at any time prevent the recording and storage of cookies on her/his/its computer by disabling the option in her/his/its browser. However, some features of this portal may require the mandatory use of cookies (customization, warnings, etc.). Otherwise the use of this portal may be impaired or even impossible.',
      },
    ],
  },
  {
    type: 'section',
    title: 'The Data Controller provides these rights regarding your personal data',
    children: [
      {
        type: 'text',
        content: 'You have the right to:',
      },
      {
        type: 'ordered_list',
        children: [
          {
            type: 'text',
            content:
              'Not be subject to decisions based solely on an automated processing of data (i.e. without human intervention) without you having your views taken into consideration.',
          },
          {
            type: 'text',
            content:
              'Request at reasonable intervals and without excessive delay or expense, information about the personal data processed about you. Under your request we will inform you in writing about, for example, the origin of the personal data or the preservation period.',
          },
          {
            type: 'text',
            content:
              'Request information to understand data processing activities when the results of these activities are applied to you.',
          },
          {
            type: 'text',
            content:
              'Object at any time to the processing of your personal data unless we can demonstrate that we have legitimate reasons to process your personal data.',
          },
          {
            type: 'text',
            content:
              'Request free of charge and without excessive delay rectification or erasure of your personal data if we have not been processing it respecting the data protection policies of the controller.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content: 'Requests and objections can be sent to our ',
          },
          {
            type: 'link_mail',
            email: config.contactEmail,
            text: 'Bgee e-mail',
          },
          {
            type: 'text',
            content: '.',
          },
        ],
      },
      {
        type: 'text',
        content:
          'It must be clarified that rights 4 and 5 are only available whenever the processing of your personal data is not necessary to:',
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'text',
            content: 'Comply with a legal obligation.',
          },
          {
            type: 'text',
            content: 'Perform a task carried out in the public interest.',
          },
          {
            type: 'text',
            content: 'Exercise authority as a data controller.',
          },
          {
            type: 'text',
            content:
              'Archive for purposes in the public interest, or for historical research purposes, or for statistical purposes.',
          },
          {
            type: 'text',
            content: 'Establish, exercise or defend legal claims.',
          },
        ],
      },

      {
        type: 'text',
        content: 'Additional terms: privacy policy',
      },
    ],
  },
];
