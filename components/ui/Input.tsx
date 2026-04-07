import styles from "./Input.module.scss";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            {...props}
            className={`${styles.input} ${className}`}
        />
    );
};