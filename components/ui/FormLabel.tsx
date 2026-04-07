import styles from "./FormLabel.module.scss";

import React from "react";

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export default function FormLabel({ children, className = "", ...props }: FormLabelProps) {
    return (
        <label {...props} className={`${styles.formLabel} ${className}`}>
            {children}
        </label>
    );
};
