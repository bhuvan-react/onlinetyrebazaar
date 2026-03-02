export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 md:px-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Online Tyre Bazaar – Legal Policies</h1>
        <p className="text-gray-500 text-sm mb-10">
          Nandigam 4S Private Limited · CIN: U47912TS2026PTC209580
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">1. Privacy Policy (DPDP Act 2023 Compliant)</h2>
          <p className="mb-3 text-gray-700">
            Nandigam 4S Private Limited operates OnlineTyreBazaar and acts as a Data Fiduciary under
            the Digital Personal Data Protection Act, 2023.
          </p>
          <p className="mb-3 text-gray-700">
            We collect personal data such as name, contact details, vehicle details, and transaction
            information solely for lawful purposes including order processing, delivery, customer
            support, fraud prevention, and legal compliance.
          </p>
          <p className="mb-3 text-gray-700">
            Users have the right to access, correct, erase, withdraw consent, and nominate a
            representative. Requests may be sent to the Grievance Officer.
          </p>
          <p className="text-gray-700">
            We implement reasonable security safeguards including encryption and restricted access
            controls. Personal data is retained only as long as necessary for order fulfilment and
            legal compliance. Children under 18 are not permitted to use the platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">2. Terms of Use</h2>
          <p className="mb-3 text-gray-700">
            Nandigam 4S Private Limited operates OnlineTyreBazaar as an intermediary marketplace
            connecting customers with third-party sellers and installation partners.
          </p>
          <p className="text-gray-700">
            Orders are subject to stock availability, seller confirmation, and payment authorization.
            We reserve the right to cancel orders in case of pricing errors, fraud suspicion, or
            regulatory restrictions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">3. Shipping &amp; Delivery Policy</h2>
          <p className="mb-2 text-gray-700">Delivery timelines vary by location.</p>
          <p className="mb-2 text-gray-700">Risk transfers upon delivery confirmation.</p>
          <p className="text-gray-700">Customers must inspect products at delivery.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">4. Vendor / Seller Agreement</h2>
          <p className="mb-3 text-gray-700">
            Sellers must ensure product authenticity, valid certifications, and manufacturer warranty
            compliance.
          </p>
          <p className="text-gray-700">
            Sellers indemnify Nandigam 4S Private Limited against product-related claims and
            regulatory violations. Customer data may only be used for order fulfilment.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">5. Installation Partner Agreement</h2>
          <p className="text-gray-700">
            Installation partners are responsible for fitment quality and any damage caused during
            installation. Nandigam 4S Private Limited acts only as a facilitator and is not liable
            for installation negligence.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">6. Data Processing Addendum</h2>
          <p className="text-gray-700">
            Vendors must process customer data strictly for order fulfilment and maintain adequate
            security safeguards. Any data breach must be reported immediately. Vendors indemnify the
            platform for violations caused by their negligence.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">7. Cookie Policy</h2>
          <p className="text-gray-700">
            We use cookies for authentication, analytics, and improving user experience. Users may
            disable cookies through browser settings.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">8. Website Disclaimer</h2>
          <p className="mb-2 text-gray-700">Product images are representative.</p>
          <p className="mb-2 text-gray-700">
            Vehicle compatibility is the customer&apos;s responsibility.
          </p>
          <p className="text-gray-700">Manufacturer warranties apply separately.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the maximum extent permitted by law, Nandigam 4S Private Limited shall not be liable
            for indirect or consequential damages. Total liability is limited to the order value.
          </p>
        </section>

        <section className="pb-12">
          <h2 className="text-xl font-semibold mb-3">10. Grievance Officer</h2>
          <p className="text-gray-700">Name: Prasad</p>
          <p className="text-gray-700">
            Email:{" "}
            <a
              href="mailto:hello@onlinetyrebazaar.com"
              className="text-teal-600 underline hover:text-teal-800"
            >
              hello@onlinetyrebazaar.com
            </a>
          </p>
          <p className="mt-2 text-gray-700">
            Complaints will be addressed as per applicable laws of India.
          </p>
        </section>
      </div>
    </div>
  );
}
