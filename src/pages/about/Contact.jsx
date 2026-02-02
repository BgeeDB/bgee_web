import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';

import PATHS from '../../paths/paths';
import Bulma from '../../components/Bulma';
import api from '../../api';
import config from '../../config.json';
import { getMetadata } from '~/helpers/metadata';

export function meta() {
  return getMetadata({
    title: 'Bgee contact us',
    description: 'Bgee contact us form',
    keywords: 'Contact, question, suggestion, helpdesk, feedback, message',
  });
}

// TODO improve CSS: text size, ...
// FIXME automatically send user referer info
// TODO replace feedback API call
// TODO Other ways to contact us: social media?
// TODO add required + minlength/maxlength in UserFeedback input fields

const Contact = () => {
  const email_check = /^[\w._%+-]+@[\w.-]+\.\w{2,}$/;

  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(null);
  const prevLocationRef = useRef();
  useEffect(() => {
    prevLocationRef.current = prevLocation;
    setPrevLocation(location);
  }, [location]);

  const additional_info =
    'Referred from: ' +
    (prevLocationRef.current?.pathname || location.pathname) +
    '\nUser browser: ' +
    navigator.userAgent +
    '\nWebsite version: ' +
    config.fullversion;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [info, setInfo] = useState(additional_info);
  const [privacy, setPrivacy] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

  // Update sourceUrl whenever the URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSourceUrl(window.location.href);
    }
  }, [location.pathname, location.search]);

  const handleSubmitMessage = async () => {
    if (
      !message.trim() ||
      !subject.trim() ||
      !email.trim().match(email_check) ||
      !document.getElementById('privacy').checked
    )
      return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await api.feedback.submit({
        sourceUrl,
        comment: message,
        email,
      });

      // Clear form on success
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setInfo(info);
      setPrivacy('');
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-section mt-5 p-4 box contact">
      <h1 className="title is-3 mb-3">Contact us</h1>
      <h2>Send us general questions and suggestions using the form below</h2>
      <p>Our helpdesk team will receive and review your message</p>
      <br />
      <div className="field">
        <label for="name" className="label">
          Name
        </label>
        <div className="control">
          <input
            type="text"
            id="name"
            className="input"
            maxlength="100"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label for="email" className="label">
          E-mail <strong className="red">*</strong>
        </label>
        <div className="control">
          <input
            type="email"
            id="email"
            className="input"
            required="required"
            minlength="4"
            maxlength="100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="myemail@example.com"
          />
        </div>
      </div>
      <div className="field">
        <label for="subject" className="label">
          Subject <strong className="red">*</strong>
        </label>
        <div className="control">
          <input
            type="text"
            id="subject"
            className="input"
            required="required"
            minlength="1"
            maxlength="100"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label for="message" className="label">
          Message <strong className="red">*</strong>
        </label>
        <p>
          This will be received and reviewed by our team. If you are submitting an error report, please explain what you
          have been trying, include your input, specify what happened, and include the error message if there is one.
        </p>
        <div className="control">
          <textarea
            id="message"
            className="textarea"
            required="required"
            minlength="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="My detailed message to the Bgee team"
          />
        </div>
      </div>
      <div className="field">
        <label for="info" className="label">
          Additional information
        </label>
        <p>This is sent with your message in order to help our helpdesk help you.</p>
        <div className="control">
          <textarea id="info" className="textarea" value={info} readonly="readonly" disabled="disabled" />
        </div>
      </div>
      <div className="field">
        <span className="control">
          <input
            type="checkbox"
            id="privacy"
            required="required"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
          />
          &nbsp;
        </span>
        <label for="privacy" className="label inline">
          I agree to the processing of my data for the purposes described in this&nbsp;
          <Link to={PATHS.ABOUT.PRIVACY_POLICY} className="nav_a">
            privacy notice
          </Link>
          .&nbsp;
          <strong className="red">*</strong>
        </label>
      </div>
      <Bulma.Button
        className="is-primary mt-2"
        onClick={handleSubmitMessage}
        disabled={
          !message.trim() ||
          !subject.trim() ||
          !email.trim().match(email_check) ||
          !document.getElementById('privacy').checked ||
          isSubmitting
        }
        loading={isSubmitting}
      >
        Send message
      </Bulma.Button>
      <br />
      <br />
      <p>
        <strong className="red">*</strong> Mandatory fields
      </p>
      {submitStatus === 'success' && <p className="help is-success mt-2">Thank you for your message!</p>}
      {submitStatus === 'error' && (
        <p className="help is-danger mt-2">Sorry, there was an error sending your message. Please try again later.</p>
      )}
    </div>
  );
};

export default Contact;
