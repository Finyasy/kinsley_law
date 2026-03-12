# Create attorneys
attorneys = [
  {
    name: 'Jane Kinsley',
    email: 'jane.kinsley@kinsleylaw.com',
    phone: '(123) 456-7890',
    bio: 'Jane Kinsley is the founding partner of Kinsley Law Advocates with over 20 years of experience in corporate law. She has helped countless businesses navigate complex legal challenges with her expertise and dedication.',
    position: 'Founding Partner',
    specialization: 'Corporate Law'
  },
  {
    name: 'Robert Johnson',
    email: 'robert.johnson@kinsleylaw.com',
    phone: '(123) 456-7891',
    bio: 'Robert Johnson is a senior partner at Kinsley Law Advocates specializing in family law and civil litigation. With 15 years of experience, he has successfully handled numerous complex cases.',
    position: 'Senior Partner',
    specialization: 'Family Law'
  },
  {
    name: 'Amanda Lewis',
    email: 'amanda.lewis@kinsleylaw.com',
    phone: '(123) 456-7892',
    bio: 'Amanda Lewis specializes in real estate and property law. She provides comprehensive legal services for residential and commercial property transactions, landlord-tenant disputes, and more.',
    position: 'Associate',
    specialization: 'Real Estate Law'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@kinsleylaw.com',
    phone: '(123) 456-7893',
    bio: 'Michael Chen is dedicated to criminal defense and civil rights advocacy. He fights passionately to protect the rights and freedom of his clients in various criminal cases.',
    position: 'Associate',
    specialization: 'Criminal Defense'
  }
]

attorneys.each do |attorney_data|
  Attorney.create!(attorney_data)
end

# Create practice areas
practice_areas = [
  {
    name: 'Family Law',
    description: 'Our family law practice provides compassionate and expert guidance through life\'s most challenging personal matters. We handle divorce, child custody, adoption, domestic violence protection, and prenuptial agreements with sensitivity and professionalism.'
  },
  {
    name: 'Corporate Law',
    description: 'Our corporate law practice helps businesses of all sizes navigate complex legal challenges and capitalize on opportunities. We provide services for business formation, contract drafting and review, mergers and acquisitions, corporate governance, and regulatory compliance.'
  },
  {
    name: 'Real Estate',
    description: 'Our real estate practice ensures smooth property transactions and protects your real estate investments. We handle residential and commercial transactions, landlord-tenant disputes, property development, land use and zoning, and title issues.'
  },
  {
    name: 'Criminal Defense',
    description: 'Our criminal defense team provides aggressive representation to protect your rights and freedom. We handle felony defense, misdemeanor defense, DUI/DWI cases, white collar crime, and juvenile cases.'
  },
  {
    name: 'Estate Planning',
    description: 'Our estate planning services help you plan for the future and protect your legacy for generations to come. We assist with wills and trusts, probate, power of attorney, healthcare directives, and estate administration.'
  },
  {
    name: 'Personal Injury',
    description: 'Our personal injury attorneys fight for the compensation you deserve after an injury. We handle auto accidents, slip and fall cases, medical malpractice, workplace injuries, and wrongful death cases.'
  }
]

practice_areas.each do |practice_area_data|
  PracticeArea.create!(practice_area_data)
end

# Assign practice areas to attorneys
Attorney.find_by(name: 'Jane Kinsley').practice_areas << PracticeArea.find_by(name: 'Corporate Law')
Attorney.find_by(name: 'Robert Johnson').practice_areas << PracticeArea.find_by(name: 'Family Law')
Attorney.find_by(name: 'Amanda Lewis').practice_areas << PracticeArea.find_by(name: 'Real Estate')
Attorney.find_by(name: 'Michael Chen').practice_areas << PracticeArea.find_by(name: 'Criminal Defense')

puts "Seed data created successfully!"