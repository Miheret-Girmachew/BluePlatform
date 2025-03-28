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

  const internships = [
    {
      id: 1,
      title: "Social Media Assistant",
      organization: "Young Men Christians Association",
      location: "Addis Ababa, Ethiopia",
      description:
        "As a Social Media Assistant, you will work closely with the social media manager or marketing team to execute social media strategies and campaigns. You will be responsible for assisting in the creation and scheduling of engaging content, monitoring social media channels, and interacting with followers.\n\nYour primary goal will be to enhance brand visibility, foster positive relationships with the audience, and drive engagement and conversions",
      responsibilities: [
        "Community engagement to ensure that is supported and actively represented online",
        "Focus on social media content development and publication",
        "Marketing and strategy support",
        "Stay on top of trends on social media platforms, and suggest content ideas to the team",
        "Engage with online communities",
      ],
      idealCandidate: [
        "Young(18-24 year old) Female social media manager",
        "Passionate & Reliable: Genuine interest in our mission and a strong desire to make a positive impact, responsible, and committed to fulfilling volunteer commitments.",
        "Adaptable, Team Player & Strong Communication Skills: Able to work effectively in diverse teams; and contributes positively.Flexible and open to embracing new challenges and shifting priorities; Clear verbal and written communication, active listening, and constructive feedback.",
        "Respectful: Embraces diversity, inclusive, and treats others with respect. Abides by all our rules and regulations.",
      ],
      whenWhere: "The onboarding event for this event will take place on Jan 18th, 2023 in AAU Auditorium",
      postedOn: "Jul 1, 2023",
      deadline: "Jul 31, 2011",
      startDate: "Aug 02, 2023",
      endDate: "Sep 02, 2023",
      categories: ["Marketing", "Design"],
      requiredSkills: ["Social Media Marketing", "English", "Copywriting"],
    },
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
        <Link to="/internships" className="back-button">
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

