import React from 'react';

/* initialValue {Object}
onSubmit
validations {Object}
    [key]:
      required: {
        value: boolean,
        message: string,
      },
      pattern: {
        value: string,
        message: string,
      },
      custom: {
        isValid: (any) => boolean,
        message: string,
      },
*/
const useForm = (opts) => {
  const [data, setData] = React.useState(opts?.initialValue || {});
  const [errors, setErrors] = React.useState({});
  const [isEditable, setIsEditable] = React.useState(true);

  const reset = React.useCallback(() => setData(opts?.initialValue || {}), []);
  const resetError = React.useCallback(() => setErrors({}), []);
  const handleChange = React.useCallback(
    (key, sanitizeFn: any = undefined) =>
      (e: any = undefined) => {
        const value = sanitizeFn ? sanitizeFn(e) : e.target.value;
        setData((d) => ({ ...d, [key]: value }));
      },
    []
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validations = opts?.validations;
    if (validations) {
      let valid = true;
      const newErrors = {};

      const valArray: any = Object.entries(validations);
      for (let idx = 0; idx < valArray.length; idx += 1) {
        const key = valArray[idx][0];
        const validation = valArray[idx][1];
        const value = data[key];

        if (validation?.required?.value && (value === null || value === undefined || value === '')) {
          valid = false;
          newErrors[key] = validation?.required?.message;
        }

        const pattern = validation?.pattern;
        if (pattern?.value && !RegExp(pattern.value).test(value)) {
          valid = false;
          newErrors[key] = pattern.message;
        }

        const custom = validation?.custom;
        if (custom?.isValid && !custom.isValid(value)) {
          valid = false;
          newErrors[key] = custom.message;
        }
      }

      if (!valid) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});

    if (opts?.onSubmit) opts.onSubmit(data);
  };

  return {
    data,
    setData,
    handleChange,
    handleSubmit,
    errors,
    resetError,
    reset,
    edition: { isEditable, setIsEditable },
  };
};

export default useForm;
