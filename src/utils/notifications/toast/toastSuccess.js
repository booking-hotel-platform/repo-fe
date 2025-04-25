import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToastMessage = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Register Success!", {
      position: "top-right",
      autoClose: 2000
    });
  };

  