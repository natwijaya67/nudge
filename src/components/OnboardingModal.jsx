export default function OnboardingModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal onboarding-modal" onClick={e => e.stopPropagation()}>
        <div className="onboarding-body">
          <h2 className="onboarding-title">Welcome to Nudge</h2>
          <p className="onboarding-subtitle">Stay in touch with the people you care about.</p>

          <div className="onboarding-steps">
            <div className="onboarding-step">
              <span className="step-num">1</span>
              <div>
                <strong>Add your friends</strong>
                <p>Tap <em>+ Friend</em> to add someone and save their details.</p>
              </div>
            </div>
            <div className="onboarding-step">
              <span className="step-num">2</span>
              <div>
                <strong>Log your meetups</strong>
                <p>After hanging out, tap <em>+ Meetup</em> to record it.</p>
              </div>
            </div>
            <div className="onboarding-step">
              <span className="step-num">3</span>
              <div>
                <strong>Get nudged</strong>
                <p>Friends you haven't seen in a while rise to the top.</p>
              </div>
            </div>
          </div>

          <button className="save-btn onboarding-btn" onClick={onClose}>Get started</button>
        </div>
      </div>
    </div>
  )
}
