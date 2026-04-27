export default function ContactPage() {
  return (
    <section className="section section-light">
      <div className="container narrow">
        <h1>Contact</h1>
        <p className="lead">
          For speaking, consulting, AI learning systems, school leadership projects, professional
          learning, or education technology collaboration, contact Rob directly.
        </p>
        <div className="card top-space-sm">
          <p>
            <strong>Email:</strong>{' '}
            <a className="text-link" href="mailto:Rob@FurmanR.com">
              Rob@FurmanR.com
            </a>
          </p>
          <p>
            <strong>Location:</strong> West Palm Beach, FL
          </p>
          <p>
            <strong>LinkedIn:</strong>{' '}
            <a className="text-link" href="https://www.linkedin.com/in/drrobfurman/" target="_blank" rel="noreferrer">
              LinkedIn Profile
            </a>
          </p>
          <p>
            <strong>Books:</strong>{' '}
            <a
              className="text-link"
              href="https://www.amazon.com/stores/author/B00QKW0VYC?ingress=0&visitId=c4c3cd43-89e3-4d46-8916-5e97ee3cc12b&ccs_id=3e18df94-ea26-493c-8840-bb64b13c896b"
              target="_blank"
              rel="noreferrer"
            >
              Books on Amazon
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
