import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type AlertProps = {
  type: "success" | "error";
  title: string;
  text: string;
};

const Alert = ({ type, title, text }: AlertProps) => {
  MySwal.fire({
    icon: type,
    title: title,
    text: text,
    confirmButtonColor: type === "success" ? "#4CAF50" : "#d33",
    customClass: {
      popup: "swal-custom-popup",
      title: "swal-custom-title",
      confirmButton: "swal-custom-button",
    },
    showClass: {
      popup: "swal-show-popup",
    },
    hideClass: {
      popup: "swal-hide-popup",
    },
  });
};

export default Alert;
