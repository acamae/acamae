import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
  validate?: (values: T) => Partial<T>;
}

export const useForm = <T extends object>({
  initialValues,
  onSubmit,
  validate,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const { i18n } = useTranslation();

  // Ejecutar validación SOLO cuando cambia el idioma, y solo para campos ya tocados
  useEffect(() => {
    if (validate && Object.keys(touched).length > 0) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]); // Solo depende del cambio de idioma, omitimos values y touched para evitar ciclos

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(
      prev =>
        ({
          ...prev,
          [name]: value,
        }) as T
    );

    // Marcar el campo como tocado
    setTouched(
      prev =>
        ({
          ...prev,
          [name]: true,
        }) as Record<keyof T, boolean>
    );

    // Validar si hay función de validación
    if (validate) {
      const validationErrors = validate({
        ...values,
        [name]: value,
      } as T);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouched(allTouched);

    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
  };

  return {
    values,
    errors,
    isSubmitting,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
