"use client"
import { useParams } from "react-router-dom"
import "./InternshipDetailspage.css"

function InternshipDetailsPage() {
  const { id } = useParams()
  const internshipId = Number.parseInt(id)

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

  return (
    <div className="internship-details-page">
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
        </div>

        {/* Sidebar */}
        <aside className="internship-details-about">
          <section>
            <h2>About</h2>
            <div className="about-item">
              <div className="about-icon clock-icon"></div>
              <div className="about-content">
                <p className="about-label">Posted On</p>
                <p className="about-value">{internship.postedOn}</p>
              </div>
            </div>

            <div className="about-item">
              <div className="about-icon clock-icon"></div>
              <div className="about-content">
                <p className="about-label">Deadline</p>
                <p className="about-value">{internship.deadline}</p>
              </div>
            </div>

            <div className="about-item">
              <div className="about-icon location-icon"></div>
              <div className="about-content">
                <p className="about-label">Location</p>
                <p className="about-value">Addis Ababa</p>
              </div>
            </div>

            <div className="about-item">
              <div className="about-icon calendar-icon"></div>
              <div className="about-content">
                <p className="about-label">Start Date</p>
                <p className="about-value">{internship.startDate}</p>
              </div>
            </div>

            <div className="about-item">
              <div className="about-icon calendar-icon"></div>
              <div className="about-content">
                <p className="about-label">End Date</p>
                <p className="about-value">{internship.endDate}</p>
              </div>
            </div>
          </section>

          <section>
            <h2>Categories</h2>
            <div className="tags-container">
              {internship.categories.map((category, index) => (
                <span key={index} className={`tag ${category.toLowerCase()}-tag`}>
                  {category}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2>Required Skills</h2>
            <div className="tags-container">
              {internship.requiredSkills.map((skill, index) => (
                <span key={index} className={`tag skill-tag-${index + 1}`}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default InternshipDetailsPage

