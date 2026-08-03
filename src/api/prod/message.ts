import axiosInstance from './constant';
import errorHandler from '../errorHandler';

interface FormData {
  name?: string;
  email: string;
  subject: string;
  message: string;
  info: string;
  privacy: boolean;
}

const validateForm = (formData: FormData): void => {
  if (!formData.email.trim() || formData.email.trim().length < 6 || formData.email.trim().length > 100)
    throw new Error('Email is required or misformed');
  if (!formData.subject.trim() || formData.subject.trim().length > 100)
    throw new Error('Subject is required or too long');
  if (!formData.message.trim() || formData.message.trim().length > 1000)
    throw new Error('Message is required or too long');
  if (!formData.privacy) throw new Error('You must accept the privacy policy');

  // Simple email format check
  if (!/^[\w._%+-]+@[\w.-]+\.\w{2,}$/.test(formData.email)) {
    throw new Error('Invalid email format');
  }
};

const message = {
  submit: async (formData: FormData) => {
    try {
      validateForm(formData);
      const { data: responseData } = await axiosInstance.post('/?page=message', formData);
      return responseData;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  },
};

export default message;
