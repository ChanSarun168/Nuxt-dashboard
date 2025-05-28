import type { EventGroup } from '~/types'

const customers: EventGroup[] = [
    {
      _id: '682edfa9026a3f12ac0d3aa6',
      date: '2025-05-21',
      isdeleted: false,
      event_info: [
        {
          name: 'Monetrey Ek - មន្ត្រីយ៍ ឯក',
          time: 'ល្ងាចនេះ',
          description: 'Christmas Day performance...',
          isSpecial: true,
          thumbnail: 'https://link.to/image.jpg',
          isdeleted: false,
          _id: '682edfa9026a3f12ac0d3aa7',
          date: '',
          admin_id: ''
        },
      ],
    },
    {
      _id: '682edfa9026a3f12ac0d3aa6',
      date: '2025-05-20',
      isdeleted: false,
      event_info: [
        {
          name: 'Monetrey Ek - មន្ត្រីយ៍ ឯក 1',
          time: 'ល្ងាចនេះ',
          description: 'Christmas Day performance...',
          isSpecial: false,
          thumbnail: 'https://link.to/image.jpg',
          isdeleted: false,
          _id: '682edfa9026a3f12ac0d3aa7',
          date: '',
          admin_id: ''
        },
      ],
    },
  ];

export default eventHandler(async () => {
  return customers
})
