export const metadata = {
  title: 'Privacy Policy | Dr. Rob Furman',
  description: 'Privacy information for visitors to drrobfurman.com.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section section-light">
      <div className="container narrow">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: October 7, 2026</p>

        <div className="card top-space-sm">
          <h2>What this site collects</h2>
          <p>
            This site may collect information you choose to provide, such as your name or email address when you contact Dr. Rob Furman. Basic website-use information may also be collected through analytics tools to help understand which pages and resources are useful.
          </p>

          <h2>How information is used</h2>
          <p>
            Information is used to respond to inquiries, improve this website and its resources, and understand general site traffic. It is not sold to third parties.
          </p>

          <h2>Purchases and external services</h2>
          <p>
            Some resources link to third-party services, including Gumroad. Those services have their own privacy policies and handle any information you provide directly to them.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about privacy can be sent to <a className="text-link" href="mailto:Rob@FurmanR.com">Rob@FurmanR.com</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
