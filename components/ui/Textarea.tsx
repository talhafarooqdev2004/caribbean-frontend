import styles from "./Textarea.module.scss";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className = "", ...props }: TextareaProps) {
    return (
        <textarea
            {...props}
            className={`${styles.textarea} ${className}`}
        />
    );
}
