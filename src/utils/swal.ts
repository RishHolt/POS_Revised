import Swal from 'sweetalert2';

const colors = {
  primary: '#776B5D',
  secondary: '#EBE3D5',
  accent: '#B0A695',
  background: '#F3EEEA',
};

export const showSuccess = (title: string, text?: string) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
  confirmButtonColor: colors.primary,
  background: colors.background,
  });
};

export const showError = (title: string, text?: string) => {
  Swal.fire({
    icon: 'error',
    title,
    text,
  confirmButtonColor: colors.primary,
  background: colors.background,
  });
};

export const showInfo = (title: string, text?: string) => {
  Swal.fire({
    icon: 'info',
    title,
    text,
  confirmButtonColor: colors.primary,
  background: colors.background,
  });
};

export const showConfirm = async (title: string, text?: string) => {
  const result = await Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
  confirmButtonColor: colors.primary,
  cancelButtonColor: colors.accent,
  background: colors.background,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });
  return result.isConfirmed;
};
