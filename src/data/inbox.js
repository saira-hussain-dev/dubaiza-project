
// FRONTEND-ONLY sample data. Real messages/notifications need a backend.
export const initialConversations = [
  {
    id: 'c1', name: 'Ahmed - Tesla Seller', listing: '2023 Tesla Model Y Performance', unread: 1,
    messages: [
      { id: 'm1', from: 'them', text: 'Hi, is the Tesla still available?' },
      { id: 'm2', from: 'me', text: 'Yes, it is still available. Would you like to view it this weekend?' },
      { id: 'm3', from: 'them', text: 'Yes please, Saturday morning works for me.' },
    ],
  },
  {
    id: 'c2', name: 'Sara - Property Agent', listing: 'Luxury 2BR Apartment with Sea View', unread: 1,
    messages: [
      { id: 'm1', from: 'them', text: 'Hello, the Palm Jumeirah apartment is available for viewing tomorrow.' },
      { id: 'm2', from: 'me', text: 'Great, what time is best?' },
    ],
  },
  {
    id: 'c3', name: 'DubaiZA Support', listing: 'Your account', unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Welcome to DubaiZA! Your first ad gets 30% off with code SHOZON30.' },
    ],
  },
]

export const initialNotifications = [
  { id: 'n1', title: 'New message from Ahmed', text: 'Yes please, Saturday morning works for me.', time: '10 min ago', read: false },
  { id: 'n2', title: 'Price drop: BMW M4 Competition', text: 'A saved listing dropped to AED 410,000.', time: '1 hour ago', read: false },
  { id: 'n3', title: 'Your ad was viewed 120 times', text: 'Your listing is performing well this week.', time: 'Yesterday', read: true },
]
