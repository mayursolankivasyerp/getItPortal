import Swal from "sweetalert2";

export const globalSwalFunction = (text, iconHtml, options) => {
  const result = Swal.fire({
    text: text,
    iconHtml: iconHtml,
    target: "#custom-target",
    showConfirmButton: false,
    showClass: {
      popup: "animate__animated animate__slideInUp",
    },
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      container: "position-absolute",
    },
    toast: true,
    position: "bottom-right",
    ...options,
  });

  return result;
};

export const confirmationSwalFunction = async (title, text, icon, confirmButtonText, options) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,

    icon: icon,
    ...options,
  });

  return result;
};

export const swalSuccessToasterFunction = async (title, options) => {
  const result = await Swal.fire({
    text: title,
    icon: "success",
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 15000,
    timerProgressBar: true,
    background: "green",
    color: "white",
    showCloseButton: true,

    ...options,
  });

  return result;
};

export const swalErrorToasterFunction = async (title, options) => {
  const result = await Swal.fire({
    text: title,
    icon: "error",
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "white",
    color: "red",
    showCloseButton: true,
    ...options,
  });

  return result;
};
