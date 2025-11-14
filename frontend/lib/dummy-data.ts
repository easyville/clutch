// Dummy data for TradePal prototype

// Utility function to abbreviate names for privacy (e.g., "Sarah Chen" -> "Sarah C.")
export function abbreviateName(fullName: string): string {
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0] // Only first name
  const firstName = parts[0]
  const lastInitial = parts[parts.length - 1][0] // Get first letter of last name
  return `${firstName} ${lastInitial}.`
}

export interface Listing {
  id: string
  userId: string
  userName: string
  userAvatar: string
  title: string
  description: string
  category: 'skill' | 'item' | 'need'
  tags: string[]
  createdAt: string
}

export interface ContactInfo {
  fullName: string
  email?: string
  phone?: string
  instagram?: string
  snapchat?: string
}

export const currentUser = {
  id: '1',
  name: 'You',
  avatar: '👤',
  bio: 'Computer Science student looking to exchange skills and help out!',
}

export const myListings: Listing[] = [
  {
    id: '1',
    userId: '1',
    userName: 'You',
    userAvatar: '👤',
    title: 'Math Tutoring Available',
    description: 'Can help with calculus, algebra, and statistics. Looking for help with essay proofreading or guitar lessons.',
    category: 'skill',
    tags: ['Math', 'Tutoring', 'Calculus'],
    createdAt: '2h ago',
  },
  {
    id: '2',
    userId: '1',
    userName: 'You',
    userAvatar: '👤',
    title: 'Need Help Moving Furniture',
    description: 'Moving to a new dorm room this weekend. Can offer homemade cookies or help with coding assignments!',
    category: 'need',
    tags: ['Moving', 'Help Needed'],
    createdAt: '1d ago',
  },
]

export const allListings: Listing[] = [
  {
    id: '3',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: '👩',
    title: 'Guitar Lessons',
    description: 'Been playing for 5 years. Can teach basics to intermediate. Looking for Spanish conversation practice or baked goods!',
    category: 'skill',
    tags: ['Music', 'Guitar', 'Teaching'],
    createdAt: '30min ago',
  },
  {
    id: '4',
    userId: '3',
    userName: 'Alex Kumar',
    userAvatar: '👨',
    title: 'Homemade Indian Snacks',
    description: 'My mom sent me too many samosas and pakoras! Happy to share. Would love help with physics homework.',
    category: 'item',
    tags: ['Food', 'Snacks', 'Indian'],
    createdAt: '1h ago',
  },
  {
    id: '5',
    userId: '4',
    userName: 'Emma Wilson',
    userAvatar: '👱',
    title: 'Need French Tutor',
    description: 'Struggling with French 101. Can offer graphic design help or bake you something sweet!',
    category: 'need',
    tags: ['French', 'Language', 'Tutoring Needed'],
    createdAt: '2h ago',
  },
  {
    id: '6',
    userId: '5',
    userName: 'Marcus Brown',
    userAvatar: '🧑',
    title: 'Car Rides to Campus',
    description: 'I drive to campus every morning around 8am from downtown. Happy to give rides for coffee or study notes!',
    category: 'skill',
    tags: ['Transportation', 'Rides', 'Morning'],
    createdAt: '3h ago',
  },
  {
    id: '7',
    userId: '6',
    userName: 'Lily Zhang',
    userAvatar: '👧',
    title: 'Extra Textbooks',
    description: 'Have extra ECON 101 and PSYCH 100 textbooks from last semester. Looking for computer science textbooks or snacks!',
    category: 'item',
    tags: ['Textbooks', 'Books', 'Economics'],
    createdAt: '5h ago',
  },
  {
    id: '8',
    userId: '7',
    userName: 'David Park',
    userAvatar: '👦',
    title: 'Photography for Events',
    description: 'Can take photos for your events or portraits. Would love help with chemistry or some homemade food!',
    category: 'skill',
    tags: ['Photography', 'Events', 'Portraits'],
    createdAt: '1d ago',
  },
  {
    id: '9',
    userId: '8',
    userName: 'Sophie Taylor',
    userAvatar: '👩‍🦰',
    title: 'Need Laptop Charger (HP)',
    description: 'Lost my HP laptop charger. Can borrow for a day? Will return with cookies or help with your homework!',
    category: 'need',
    tags: ['Electronics', 'Urgent', 'Laptop'],
    createdAt: '6h ago',
  },
]

export const myInterests = [
  'Guitar Lessons',
  'Spanish Practice',
  'Essay Proofreading',
  'Graphic Design',
]

export interface Exchange {
  id: string
  listingId: string
  listingTitle: string
  listingCategory: 'skill' | 'item' | 'need'
  otherUserId: string
  otherUserName: string
  otherUserAvatar: string
  type: 'sent' | 'received'
  status: 'pending' | 'approved' | 'rejected'
  message: string
  createdAt: string
  contactInfo?: ContactInfo // Only available when status is 'approved'
}

// Offers/exchanges you've sent to others
export const sentExchanges: Exchange[] = [
  {
    id: 'e1',
    listingId: '3',
    listingTitle: 'Guitar Lessons',
    listingCategory: 'skill',
    otherUserId: '2',
    otherUserName: 'Sarah Chen',
    otherUserAvatar: '👩',
    type: 'sent',
    status: 'approved',
    message: 'Hi! I can help you with Spanish conversation practice in exchange for guitar lessons.',
    createdAt: '2d ago',
    contactInfo: {
      fullName: 'Sarah Chen',
      email: 'sc21234@essex.ac.uk',
      phone: '07123 456789',
      instagram: '@sarahplaysguitar',
    },
  },
  {
    id: 'e2',
    listingId: '6',
    listingTitle: 'Car Rides to Campus',
    listingCategory: 'skill',
    otherUserId: '5',
    otherUserName: 'Marcus Brown',
    otherUserAvatar: '🧑',
    type: 'sent',
    status: 'pending',
    message: 'I\'d love a ride on Mondays and Wednesdays! I can bring you coffee.',
    createdAt: '1d ago',
  },
  {
    id: 'e3',
    listingId: '7',
    listingTitle: 'Extra Textbooks',
    listingCategory: 'item',
    otherUserId: '6',
    otherUserName: 'Lily Zhang',
    otherUserAvatar: '👧',
    type: 'sent',
    status: 'rejected',
    message: 'Would love to borrow the ECON textbook. I can share some snacks!',
    createdAt: '3d ago',
  },
]

// Offers/exchanges you've received from others
export const receivedExchanges: Exchange[] = [
  {
    id: 'e4',
    listingId: '1',
    listingTitle: 'Math Tutoring Available',
    listingCategory: 'skill',
    otherUserId: '9',
    otherUserName: 'Chris Johnson',
    otherUserAvatar: '🧑‍💼',
    type: 'received',
    status: 'pending',
    message: 'I really need help with calculus! Can I take you up on your tutoring offer? I can proofread your essays.',
    createdAt: '1h ago',
  },
  {
    id: 'e5',
    listingId: '2',
    listingTitle: 'Need Help Moving Furniture',
    listingCategory: 'need',
    otherUserId: '10',
    otherUserName: 'Maya Patel',
    otherUserAvatar: '👩‍💻',
    type: 'received',
    status: 'pending',
    message: 'I can help you move this weekend! Those cookies sound great :)',
    createdAt: '4h ago',
  },
  {
    id: 'e6',
    listingId: '1',
    listingTitle: 'Math Tutoring Available',
    listingCategory: 'skill',
    otherUserId: '4',
    otherUserName: 'Emma Wilson',
    otherUserAvatar: '👱',
    type: 'received',
    status: 'approved',
    message: 'Can you help me with statistics? I can design a logo for you!',
    createdAt: '2d ago',
    contactInfo: {
      fullName: 'Emma Wilson',
      email: 'ew20987@essex.ac.uk',
      phone: '07845 123456',
      instagram: '@emmacreates',
      snapchat: 'emma_designs',
    },
  },
]
