import Styles from '../styles/Legal.module.css'

const DOCS = {
    privacy: {
        title: 'Privacy policy',
        updated: 'Last updated September 1, 2026',
        sections: [
            {
                heading: 'What we collect',
                body: 'BizPulse stores the information you provide when you create an account — your name, email address, phone number, business name and business type — together with the operational data you record in the app, such as sales entries, stock levels and staff details.'
            },
            {
                heading: 'How your data is used',
                body: 'Your data is used only to provide the BizPulse service: rendering your dashboards, computing reports and keeping your workspace synchronized across devices. We do not sell personal or business data to third parties.'
            },
            {
                heading: 'Where your data lives',
                body: 'Account profiles are stored in Google Firebase infrastructure. Operational records are kept in your workspace database and cached in your browser for offline performance. Clearing your browser storage removes the local copy.'
            },
            {
                heading: 'Your controls',
                body: 'You can update your profile details at any time from Settings, and you can request full deletion of your account and associated data by contacting support. Deletion requests are completed within 30 days.'
            }
        ]
    },
    terms: {
        title: 'Terms of service',
        updated: 'Last updated September 1, 2026',
        sections: [
            {
                heading: 'The service',
                body: 'BizPulse provides business management tools for fuel stations, restaurants, retail stores and service centers, including sales tracking, stock management, staff records and reporting.'
            },
            {
                heading: 'Your responsibilities',
                body: 'You are responsible for the accuracy of the data you enter, for safeguarding your account credentials, and for complying with tax and regulatory obligations in your jurisdiction. BizPulse is a record-keeping tool and does not replace statutory accounting.'
            },
            {
                heading: 'Availability',
                body: 'We aim for high availability but do not guarantee uninterrupted service. Exports of your data are available from the Reports section, and we recommend keeping periodic backups of critical records.'
            },
            {
                heading: 'Changes',
                body: 'We may update these terms as the product evolves. Material changes are announced in-app at least 14 days before they take effect. Continued use of BizPulse after that date constitutes acceptance.'
            }
        ]
    }
};

const Legal = ({ doc }) => {
    const content = DOCS[doc] || DOCS.privacy;

    return (
        <article className={Styles.page}>
            <header className={Styles.header}>
                <h1 className={Styles.title}>{content.title}</h1>
                <p className={Styles.updated}>{content.updated}</p>
            </header>
            <div className={Styles.body}>
                {content.sections.map((section) => (
                    <section key={section.heading} className={Styles.section}>
                        <h2 className={Styles.heading}>{section.heading}</h2>
                        <p className={Styles.text}>{section.body}</p>
                    </section>
                ))}
            </div>
        </article>
    );
};

export default Legal;
