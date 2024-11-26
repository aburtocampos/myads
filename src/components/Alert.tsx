import React from "react";

interface AlertProps {
  type?: "error" | "success" | "info" | "warning"; // Tipo de alerta
  message: string; // Mensaje a mostrar
}

const Alert: React.FC<AlertProps> = ({ type = "info", message }) => {
  // Mapear el tipo de alerta al diseño de DaisyUI
  const alertClasses = {
    error: "alert-error",
    success: "alert-success",
    warning: "alert-warning",
    info: "alert-info",
  };

  const iconPaths = {
    error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    success: "M9 12l2 2l4 -4m5 2a9 9 0 11-18 0 9 9 0 0118 0z",
    warning: "M12 8v4m0 4h.01M12 2a10 10 0 100 20a10 10 0 000-20z",
    info: "M13 16h-1v-4h-1m-1-4h1.01M12 2a10 10 0 100 20a10 10 0 000-20z",
  };

  return (
    <div role="alert" className={`alert ${alertClasses[type]} my-2`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={iconPaths[type]}
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
