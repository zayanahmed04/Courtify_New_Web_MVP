// src/hooks/use-toast.js
export const useToast = () => {
  const toast = ({ title, description, variant }) => {
    // Simple fallback using alert
    alert(`${title}${description ? ': ' + description : ''}`);
  };

  return { toast };
};
