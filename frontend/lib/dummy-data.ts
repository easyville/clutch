// Dummy data for Clutch prototype

// Utility function to abbreviate names for privacy (e.g., "Sarah Chen" -> "Sarah C.")
export function abbreviateName(fullName: string): string {
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0]
  const firstName = parts[0]
  const lastInitial = parts[parts.length - 1][0]
  return `${firstName} ${lastInitial}.`
}

export interface Listing {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userEmail: string
  title: string
  description: string
  category: 'skill' | 'item' | 'need'
  tags: string[]
  createdAt: string
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
    userEmail: '',
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
    userEmail: '',
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
    userEmail: 'sc21234@essex.ac.uk',
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
    userEmail: 'ak19876@essex.ac.uk',
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
    userEmail: 'ew20987@essex.ac.uk',
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
    userEmail: 'mb22345@essex.ac.uk',
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
    userEmail: 'lz21456@essex.ac.uk',
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
    userEmail: 'dp23567@essex.ac.uk',
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
    userEmail: 'st20678@essex.ac.uk',
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
