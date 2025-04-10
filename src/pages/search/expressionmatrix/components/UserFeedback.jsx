import { useState } from 'react';
import Bulma from '../../../../components/Bulma';
import api from '../../../../api';

const UserFeedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [sourceUrl] = useState(window.location.href);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

  const handleSubmitFeedback = async () => {
    if (!rating && !feedback.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await api.feedback.submit({
        sourceUrl,
        rating,
        comment: feedback,
        email,
      });

      // Clear form on success
      setRating(0);
      setFeedback('');
      setEmail('');
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-section mt-5 p-4 box">
      <h4 className="title is-5 mb-3">Rate this page</h4>
      
      <div className="stars mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className="button is-ghost p-1"
            onClick={() => setRating(star)}
          >
            <span className="icon">
              <ion-icon
                name={star <= rating ? 'star' : 'star-outline'}
                style={{ color: star <= rating ? '#ffd700' : '#666' }}
              />
            </span>
          </button>
        ))}
      </div>

      <div className="field">
        <label className="label">A penny for your thoughts (optional)</label>
        <div className="control">
          <textarea
            className="textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback helps us improve"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Email (optional)</label>
        <div className="control">
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email if you'd like us to follow up"
          />
        </div>
      </div>

      <Bulma.Button
        className="is-primary mt-2"
        onClick={handleSubmitFeedback}
        disabled={(!rating && !feedback.trim()) || isSubmitting}
        loading={isSubmitting}
      >
        Submit Feedback
      </Bulma.Button>

      {submitStatus === 'success' && (
        <p className="help is-success mt-2">
          Thank you for your feedback!
        </p>
      )}

      {submitStatus === 'error' && (
        <p className="help is-danger mt-2">
          Sorry, there was an error submitting your feedback. Please try again later.
        </p>
      )}
    </div>
  );
};

export default UserFeedback; 