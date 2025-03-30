"use client"
import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import "./InternshipDetailsPage.css"
import { ArrowLeft, Calendar, Clock, MapPin, Award, Briefcase, ChevronRight } from "lucide-react"
import ApplicationModal from "./ApplicationModal"

function InternshipDetailsPage() {
  const { id } = useParams()
  const internshipId = Number.parseInt(id)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  const internships =[
    {
      id: 1,
      title: "Social Media Assistant",
      organization: "Ethiopian Youth Empowerment Association (EYEA)",
      location: "Addis Ababa, Ethiopia",
      description:
        "Support EYEA’s digital presence by managing social media platforms (Facebook, Telegram, TikTok) to promote youth programs. Content will focus on Amharic/English engagement for local communities.",
      responsibilities: [
        "Create & schedule posts (events, success stories, campaigns).",
        "Monitor comments/messages and engage with followers.",
        "Track analytics and suggest improvements.",
        "Collaborate with the marketing team on campaigns.",
      ],
      idealCandidate: [
        "Aged 18-25, fluent in Amharic & basic English.",
        "Familiar with Facebook, Instagram, and TikTok trends in Ethiopia.",
        "Creative, punctual, and passionate about youth development.",
      ],
      whenWhere: "Orientation: Jan 18, 2024 @ EYEA Office, Kirkos Sub-City.",
      postedOn: "Jul 1, 2023",
      deadline: "Jul 31, 2023",
      startDate: "Aug 02, 2023",
      endDate: "Sep 02, 2023",
      categories: ["Marketing", "Community"],
      requiredSkills: ["Social Media Management", "Content Creation"],
    },
    {
      id: 2,
      title: "Community Health Volunteer",
      organization: "Ethiopian Red Cross Society",
      location: "Hawassa, Sidama Region",
      description:
        "Assist in public health campaigns (malaria prevention, hygiene) in rural communities. Training provided.",
      responsibilities: [
        "Conduct door-to-door awareness sessions.",
        "Distribute health kits and record data.",
        "Attend weekly team meetings.",
      ],
      idealCandidate: [
        "Resident of Hawassa or nearby (preferred).",
        "Compassionate, good communication skills in Sidama/Amharic.",
        "Interest in healthcare or nursing.",
      ],
      whenWhere: "Training: Jan 20, 2024 @ Red Cross Hawassa Branch.",
      postedOn: "Jul 5, 2023",
      deadline: "Aug 15, 2023",
      startDate: "Aug 20, 2023",
      endDate: "Nov 20, 2023",
      categories: ["Health", "Volunteer"],
      requiredSkills: ["Community Outreach", "Basic First Aid"],
    },
    {
      id: 3,
      title: "Agriculture Field Assistant",
      organization: "Agricultural Transformation Agency (ATA)",
      location: "Jimma, Oromia",
      description:
        "Support smallholder farmers in adopting sustainable practices (composting, crop rotation).",
      responsibilities: [
        "Demonstrate techniques to local farmers.",
        "Collect field data on crop yields.",
        "Assist in training sessions.",
      ],
      idealCandidate: [
        "Background in agriculture or environmental studies.",
        "Able to communicate in Oromiffa.",
        "Willing to travel to rural sites.",
      ],
      whenWhere: "Training: Jan 22, 2024 @ ATA Jimma Office.",
      postedOn: "Jul 10, 2023",
      deadline: "Aug 20, 2023",
      startDate: "Sep 01, 2023",
      endDate: "Dec 01, 2023",
      categories: ["Agriculture", "Sustainability"],
      requiredSkills: ["Farming Knowledge", "Data Collection"],
    },
    {
      id: 4,
      title: "Tourism Guide Trainee",
      organization: "Ethiopian Heritage Trust",
      location: "Lalibela, Amhara Region",
      description:
        "Train to become a certified guide for Lalibela’s rock-hewn churches. Learn history, customer service, and safety protocols.",
      responsibilities: [
        "Shadow experienced guides.",
        "Engage with tourists (English required).",
        "Maintain site cleanliness.",
      ],
      idealCandidate: [
        "Interest in Ethiopian history/culture.",
        "Fluent in English & Amharic.",
        "Friendly and patient demeanor.",
      ],
      whenWhere: "Orientation: Jan 25, 2024 @ Lalibela Visitor Center.",
      postedOn: "Jul 15, 2023",
      deadline: "Aug 25, 2023",
      startDate: "Sep 05, 2023",
      endDate: "Mar 05, 2024",
      categories: ["Tourism", "Hospitality"],
      requiredSkills: ["Public Speaking", "Cultural Knowledge"],
    },
    {
      id: 5,
      title: "Women’s Empowerment Intern",
      organization: "Tena Kebena Women’s Association",
      location: "Addis Ababa",
      description:
        "Support vocational training programs (weaving, entrepreneurship) for low-income women.",
      responsibilities: [
        "Coordinate workshops and record attendance.",
        "Help with fundraising campaigns.",
        "Mentor participants.",
      ],
      idealCandidate: [
        "Female, aged 20-30 (preferred).",
        "Passionate about gender equality.",
        "Basic Microsoft Office skills.",
      ],
      whenWhere: "Kickoff: Jan 28, 2024 @ TKWA HQ, Kazanchis.",
      postedOn: "Jul 20, 2023",
      deadline: "Aug 30, 2023",
      startDate: "Sep 10, 2023",
      endDate: "Dec 10, 2023",
      categories: ["Gender", "Education"],
      requiredSkills: ["Event Planning", "Mentoring"],
    },
    {
      id: 6,
      title: "IT Support Intern",
      organization: "iCog Labs Ethiopia",
      location: "Addis Ababa",
      description:
        "Assist in maintaining computer systems, troubleshooting, and training staff on software tools.",
      responsibilities: [
        "Set up hardware/software for new employees.",
        "Resolve basic tech issues.",
        "Document IT processes.",
      ],
      idealCandidate: [
        "Computer Science/IT student or graduate.",
        "Familiar with Windows/Linux.",
        "Problem-solving skills.",
      ],
      whenWhere: "Orientation: Feb 01, 2024 @ iCog Labs, Bole.",
      postedOn: "Jul 25, 2023",
      deadline: "Sep 05, 2023",
      startDate: "Sep 15, 2023",
      endDate: "Dec 15, 2023",
      categories: ["Technology", "IT"],
      requiredSkills: ["Hardware Troubleshooting", "Python"],
    },
    {
      id: 7,
      title: "Environmental Conservation Volunteer",
      organization: "Green Ethiopia Initiative",
      location: "Arba Minch, SNNPR",
      description:
        "Plant trees, educate communities on waste management, and monitor green projects near Lake Chamo.",
      responsibilities: [
        "Participate in tree-planting events.",
        "Conduct eco-awareness sessions in schools.",
        "Collect environmental data.",
      ],
      idealCandidate: [
        "Physically fit for outdoor work.",
        "Interest in ecology/sustainability.",
        "Local language skills (Gamo, Wolaytta).",
      ],
      whenWhere: "Start: Feb 05, 2024 @ Green Ethiopia Office, Arba Minch.",
      postedOn: "Aug 01, 2023",
      deadline: "Sep 10, 2023",
      startDate: "Sep 20, 2023",
      endDate: "Mar 20, 2024",
      categories: ["Environment", "Outdoor"],
      requiredSkills: ["Teamwork", "Community Mobilization"],
    },
    {
      id: 8,
      title: "Creative Writing Intern",
      organization: "Habesha Stories Collective",
      location: "Remote (Ethiopia-based)",
      description:
        "Write articles/blog posts about Ethiopian culture, history, and innovation for digital platforms.",
      responsibilities: [
        "Research and draft 2 articles/week.",
        "Edit peer submissions.",
        "Attend virtual brainstorming sessions.",
      ],
      idealCandidate: [
        "Strong writing skills in English/Amharic.",
        "Knowledge of Ethiopian traditions.",
        "Self-motivated with deadlines.",
      ],
      whenWhere: "Virtual onboarding: Feb 10, 2024 (Zoom).",
      postedOn: "Aug 05, 2023",
      deadline: "Sep 15, 2023",
      startDate: "Sep 25, 2023",
      endDate: "Dec 25, 2023",
      categories: ["Writing", "Remote"],
      requiredSkills: ["Creative Writing", "Research"],
    },
    {
      id: 9,
      title: "Microfinance Research Assistant",
      organization: "Dashen Bank Community Program",
      location: "Mekelle, Tigray",
      description:
        "Interview women entrepreneurs to assess the impact of microloans on small businesses.",
      responsibilities: [
        "Conduct surveys in local markets.",
        "Enter data into Excel.",
        "Write summary reports.",
      ],
      idealCandidate: [
        "Economics/Business student.",
        "Fluent in Tigrinya.",
        "Comfortable with fieldwork.",
      ],
      whenWhere: "Training: Feb 15, 2024 @ Dashen Bank Mekelle Branch.",
      postedOn: "Aug 10, 2023",
      deadline: "Sep 20, 2023",
      startDate: "Oct 01, 2023",
      endDate: "Jan 01, 2024",
      categories: ["Finance", "Research"],
      requiredSkills: ["Data Collection", "Excel"],
    },
    {
      id: 10,
      title: "Disability Rights Advocate",
      organization: "Ethiopian Center for Disability & Development (ECDD)",
      location: "Addis Ababa",
      description:
        "Promote inclusivity by organizing workshops and advocating for accessibility in public spaces.",
      responsibilities: [
        "Assist in event planning.",
        "Engage with policymakers.",
        "Create awareness materials.",
      ],
      idealCandidate: [
        "Passion for disability rights.",
        "Experience in advocacy (preferred).",
        "Adaptive communication skills.",
      ],
      whenWhere: "Orientation: Feb 20, 2024 @ ECDD Office, Addis.",
      postedOn: "Aug 15, 2023",
      deadline: "Sep 25, 2023",
      startDate: "Oct 05, 2023",
      endDate: "Apr 05, 2024",
      categories: ["Advocacy", "Nonprofit"],
      requiredSkills: ["Public Speaking", "Project Coordination"],
    }
  ]

  const internship = internships.find((intern) => intern.id === internshipId)

  if (!internship) {
    return <div>Internship not found.</div>
  }

  const openApplicationModal = () => {
    setIsApplicationModalOpen(true)
  }

  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false)
  }

  // Calculate days left until deadline
  const calculateDaysLeft = () => {
    const deadlineDate = new Date(internship.deadline)
    const currentDate = new Date()
    const timeDiff = deadlineDate - currentDate
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    return daysLeft > 0 ? daysLeft : 0
  }

  // Calculate internship duration in weeks
  const calculateDuration = () => {
    const startDate = new Date(internship.startDate)
    const endDate = new Date(internship.endDate)
    const timeDiff = endDate - startDate
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    return Math.ceil(days / 7)
  }

  return (
    <div className="internship-details-page">
      <div className="back-button-container">
        <Link to="/internships" className="back-button-c">
          <ArrowLeft size={18} />
          <span>Back to Internships</span>
        </Link>
      </div>

      <header className="internship-header">
        <h1>{internship.title}</h1>
        <h3>{internship.organization}</h3>
        <h4>{internship.location}</h4>
      </header>

      <div className="internship-details-container">
        {/* Main Content */}
        <div className="internship-details-description">
          <section>
            <h2>Description</h2>
            <p>{internship.description}</p>
          </section>

          <section>
            <h2>Responsibilities</h2>
            <ul className="fancy-list">
              {internship.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Ideal Candidate we want</h2>
            <ul className="bullet-list">
              {internship.idealCandidate.map((candidate, index) => (
                <li key={index}>{candidate}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>When & Where</h2>
            <div className="location-info">
              <span className="location-icon"></span>
              <p>{internship.whenWhere}</p>
            </div>
          </section>

          <button className="apply-button" onClick={openApplicationModal}>
            Apply Now
          </button>
        </div>

        {/* Sidebar */}
        <aside className="internship-details-about">
          <div className="sidebar-header">
            <div className="organization-logo">{internship.organization.charAt(0)}</div>
            <div className="organization-info">
              <h3>{internship.organization}</h3>
              <p>Nonprofit Organization</p>
            </div>
          </div>

          <div className="deadline-banner">
            <div className="deadline-info">
              <Clock size={18} />
              <div>
                <p className="deadline-label">Application Deadline</p>
                <p className="deadline-date">{internship.deadline}</p>
              </div>
            </div>
            <div className="days-left">
              <span className="days-number">{calculateDaysLeft()}</span>
              <span className="days-text">days left</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Internship Details</h3>

            <div className="detail-item">
              <div className="detail-icon">
                <Calendar size={18} />
              </div>
              <div className="detail-content">
                <p className="detail-label">Start Date</p>
                <p className="detail-value">{internship.startDate}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Calendar size={18} />
              </div>
              <div className="detail-content">
                <p className="detail-label">End Date</p>
                <p className="detail-value">{internship.endDate}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Clock size={18} />
              </div>
              <div className="detail-content">
                <p className="detail-label">Duration</p>
                <p className="detail-value">{calculateDuration()} weeks</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <MapPin size={18} />
              </div>
              <div className="detail-content">
                <p className="detail-label">Location</p>
                <p className="detail-value">{internship.location}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Briefcase size={18} />
              </div>
              <div className="detail-content">
                <p className="detail-label">Posted On</p>
                <p className="detail-value">{internship.postedOn}</p>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Categories</h3>
            <div className="categories-container">
              {internship.categories.map((category, index) => (
                <div key={index} className={`category-badge ${category.toLowerCase()}-badge`}>
                  <Award size={14} />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Required Skills</h3>
            <div className="skills-container">
              {internship.requiredSkills.map((skill, index) => (
                <div key={index} className={`skill-badge skill-${index + 1}`}>
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Similar Internships</h3>
            <div className="similar-internships">
              <div className="similar-internship">
                <h4>Digital Marketing Intern</h4>
                <p>Tech Solutions Inc.</p>
                <Link to="/internships/2" className="view-more">
                  View Details <ChevronRight size={14} />
                </Link>
              </div>
              <div className="similar-internship">
                <h4>Content Creator</h4>
                <p>Creative Studios</p>
                <Link to="/internships/3" className="view-more">
                  View Details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <button className="sidebar-apply-button" onClick={openApplicationModal}>
            Apply for this Internship
          </button>
        </aside>
      </div>

      {isApplicationModalOpen && <ApplicationModal internship={internship} onClose={closeApplicationModal} />}
    </div>
  )
}

export default InternshipDetailsPage

